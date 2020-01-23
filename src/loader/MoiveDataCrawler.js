import axios from 'axios';
import cheerio from 'cheerio';

class MoiveDataCrawler
{
    constructor()
    {
        const THIS = this;

        // API 키(The Movie DB)
        Object.defineProperty(this, "MOVIEPOSTER_API_KEY"
                                , {value : "15d2ea6d0dc1d476efbca3eba2b9bbfb"
                                , writable : false
                                , configurable: false});
        // THE MOVIDE DB API URL(포스터 URL 및 썸네일 관련)
        let strMPAPIURL = "https://api.themoviedb.org/3/search/movie";
        Object.defineProperty(this, "MOVIEPOSTER_API_URL"
                                , {value : strMPAPIURL
                                , writable : false
                                , configurable: false});
        // 영화 포스터 및 썸네일 이미지 URL Prefix
        let strPosterURLPrefix = "http://image.tmdb.org/t/p/w500/";
        Object.defineProperty(this, "MOVIEPOSTER_URL_PREFIX"
                                , {value : strPosterURLPrefix
                                , writable : false
                                , configurable: false});
        // 포스터 이미지 없는 경우 이미지 없음 URL
        let strNoImgURL = "https://www.pbs.org/black-culture/lunchbox_plugins/s/photogallery/img/no-image-available.jpg";
        Object.defineProperty(this, "NO_POSTER_IMAGE_URL"
                                , {value : strNoImgURL
                                , writable : false
                                , configurable: false});

        // CORS 우회 URL
        let strCORSAnywhereURL= "https://cors-anywhere.herokuapp.com/";
        Object.defineProperty(this, "CORS_ANYWHERE_URL"
                                , {value : strCORSAnywhereURL
                                , writable : false
                                , configurable: false});

        // 네이버 영화 목록 URL
        let strNaverURLPrefix= "https://m.search.naver.com/p/csearch/content/qapirender.nhn?_callback=window.__jindo2_callback._$3361_0&pkid=68&where=nexearch&start=1&display=10&q=";
        Object.defineProperty(this, "MOIVELIST_CRAWLING_URL_PREFIX"
                                , {value : strNaverURLPrefix
                                , writable : false
                                , configurable: false});

        let strNaverURLPostfix = "&so=s3.dsc";
        Object.defineProperty(this, "MOIVELIST_CRAWLING_URL_POSTFIX"
                                , {value : strNaverURLPostfix
                                , writable : false
                                , configurable: false});
        
        // 네이버 영화 상세 정보 URL
        let strNaverDetailURL = "https://movie.naver.com/movie/bi/mi/basic.nhn?code=";
        Object.defineProperty(this, "NAVER_DETAIL_URL"
                                , {value : strNaverDetailURL
                                , writable : false
                                , configurable: false});
        // 네이버 영화 상세 정보 URL
        let strNaverDetailMobileURL = "https://m.search.naver.com/search.naver?where=m&query=";
        Object.defineProperty(this, "NAVER_DETAIL_MOBILE_URL"
                                , {value : strNaverDetailMobileURL
                                , writable : false
                                , configurable: false});
        this.is_list = true;
        
        
        Object.defineProperty(this, "BOXOFFICE_CRAWLING_KEY"
                                , {value : "%ED%95%9C%EA%B5%AD%20%EC%98%81%ED%99%94"
                                , writable : false
                                , configurable: false});
        // 장르 검색 키
        this.GENRES = {
            COMEDY : "%ED%95%9C%EA%B5%AD%20%EC%BD%94%EB%AF%B8%EB%94%94%20%EC%98%81%ED%99%94"
            , ACTION : "%ED%95%9C%EA%B5%AD%20%EC%95%A1%EC%85%98%20%EC%98%81%ED%99%94"
            , ADVENTURE : "%ED%95%9C%EA%B5%AD%20%EB%AA%A8%ED%97%98%20%EC%98%81%ED%99%94" 
            , ANIMATION : "%ED%95%9C%EA%B5%AD%20%EC%95%A0%EB%8B%88%20%EC%98%81%ED%99%94"
            , ROMANCE : "%ED%95%9C%EA%B5%AD%20%EB%A9%9C%EB%A1%9C%EB%A1%9C%EB%A7%A8%EC%8A%A4%20%EC%98%81%ED%99%94"
            , HORROR : "%EA%B3%B5%ED%8F%AC%20%EC%98%81%ED%99%94"
        }

        // Settimeout 시 반환하는 Handler 객체를 담을 변수
        this.m_hdlPromiseTimer = null;

        // 실행 완료 후 호출될 Promise Resolve 함수(Set)
        // 모든 로드가 끝난 경우 Settimeout 종료 후 강제 실행용 변수
        let m_fnFullLoad = null;
        Object.defineProperty(this, 'onfulloadcomplete'
                            , {
                                get() { return m_fnFullLoad; },
                                set(fnFullLoad) {
                                    if(typeof(fnFullLoad) == 'function')
                                    { 
                                        m_fnFullLoad = fnFullLoad;
                                    }
                                    else
                                    {
                                        console.log("[MovieDataLoader.onfulloadcomplete]:function만 입력 가능합니다.");
                                    }
                                },
                                enumerable: true,
                                configurable: false
                            }
                        );

        // 강제 취소 시 호출될 Promise Reject함수
        let m_fnFailedLoad = null;
        Object.defineProperty(this, 'onfailedload'
                                , {
                                    get() { return m_fnFailedLoad; },
                                    set(fnFailedLoad) {
                                        if(typeof(fnFailedLoad) == 'function')
                                        { 
                                            m_fnFailedLoad = fnFailedLoad;
                                        }
                                        else
                                        {
                                            console.log("[MovieDataLoader.onfailedload]:function만 입력 가능합니다.");
                                        }
                                    },
                                    enumerable: true,
                                    configurable: false
                                }
                            );

        /////////////////////////////////////////////////////////////////////////////////////////
        //
        //                  검색조건 설정용 객체 정의
        // * search_condition
        //   => .is_list : 리스트/상세정보 구분 (true, false)
        //   => .item_per_page : 한페이지에 로드할 정보(기본값 : 10 / 최대 10)
        //   => .genre : 장르 (this.GENRES 값으로 매칭)
        //

        // 검색 조건 설정용 객체
        let m_objSearchCondition = {};
        Object.defineProperty(this, "search_condition"
                                ,{value : m_objSearchCondition
                                , writable : false
                                , configurable: false});

        let m_strGenre = this.GENRES.COMEDY;
        Object.defineProperty(this.search_condition, "genre"
                                , {
                                    get() { return m_strGenre; },
                                    set(strGenre) {
                                        if(typeof(strGenre) == 'string')
                                        {
                                            if(strGenre === "액션")
                                            {
                                                m_strGenre = THIS.GENRES.ACTION;
                                            }
                                            else if(strGenre === "코미디")
                                            {
                                                m_strGenre = THIS.GENRES.COMEDY;
                                            }
                                            else if(strGenre === "공포")
                                            {
                                                m_strGenre = THIS.GENRES.HORROR;
                                            }
                                            else if(strGenre === "모험")
                                            {
                                                m_strGenre = THIS.GENRES.ADVENTURE;
                                            }
                                            else if(strGenre === "로맨스")
                                            {
                                                m_strGenre = THIS.GENRES.ROMANCE;
                                            }
                                            else if(strGenre === "애니메이션")
                                            {
                                                m_strGenre = THIS.GENRES.ANIMATION;
                                            }
                                        }
                                        else
                                        {
                                            console.log("[MovieDataLoader.search_config.genre]:문자열만 입력 가능합니다.");
                                        }
                                    },
                                    enumerable: true,
                                    configurable: false
                                }
                            );
        
        // 한 페이지에 로드할 영화 수(기본 10, 최대 10)
        let m_nItemPerPage = 10;
        Object.defineProperty(this.search_condition, "item_per_page"
                                , {
                                    get() { return m_nItemPerPage; },
                                    set(nItemPerPage) {
                                        if(typeof(nItemPerPage) == 'number')
                                        {
                                            if(nItemPerPage > 0 && nItemPerPage <= 10)
                                            {
                                                m_nItemPerPage = nItemPerPage;
                                            }
                                            else
                                            {
                                                console.log("[MovieDataLoader.search_config.item_per_page]:숫자 1~10을 입력해주세요.");
                                            }
                                        }
                                        else
                                        {
                                            console.log("[MovieDataLoader.search_config.item_per_page]:숫자만 입력 가능합니다.");
                                        }
                                    },
                                    enumerable: true,
                                    configurable: false
                                }
                            );
    }

    /**
     * setTimeout을 강제적으로 종료하고 Promise객체의 resolve함수를 호출한다.
     * @param {}} objReturnData 
     */
    forcedCallResolve(objReturnData)
    {
        const THIS = this;

        if(THIS.m_hdlPromiseTimer != null)
        {
            setTimeout(
                function()
                {
                    clearTimeout(THIS.m_hdlPromiseTimer);
                    THIS.onfulloadcomplete(objReturnData);

                    THIS.m_hdlPromiseTimer = null;
                }
                , 500
            );
        }
    }

    /**
     * setTimeout을 강제적으로 종료하고 Promise객체의 reject함수를 호출한다.
     * @param {}} objReturnData 
     */
    forcedCallReject(srtMessage)
    {
        const THIS = this;
        
        if(THIS.m_hdlPromiseTimer != null)
        {
            setTimeout(
                function()
                {
                    clearTimeout(THIS.m_hdlPromiseTimer);
                    THIS.onfailedload(srtMessage);

                    THIS.m_hdlPromiseTimer = null;
                }
                , 500
            );
        }
    }

    /**
     * 받은 객체를 객체로 변환 후 반환한다.
     * 
        objMovieData.movie_id = "";                 // 영화 호출용 고유번호
        objMovieData.movie_title = "";              // 영화명
        objMovieData.poster_url = "";               // 포스터 URL(getMoviePoster함수에서 생성)
        objMovieData.stillcut_url = "";             // 스틸컷 URL(getMoviePoster함수에서 생성)
        objMovieData.show_time = "";                // 상영시간
        objMovieData.open_year = "";                // 개봉연도
        objMovieData.nations = "";                  // 국가
        objMovieData.genres_text = "";              // 장르(문자열로 전부 나열)
        objMovieData.directors_text = "";           // 감독명(문자열로 전부 나열)
        objMovieData.actors_text = "";              // 배우명(문자열로 전부 나열)
        objMovieData.plot = "";                       // 줄거리

     *  @param jsnData : 변환할 JSON 객체
     *  @return objMovieData
     */
    convertMovieObject(jsnData)
    {
        let objMovieData = {};
        
        // 영화코드
        Object.defineProperty(objMovieData, "movie_id", {value : jsnData.mv_id
            , writable : false
            , configurable: false});
        // 영화명
        Object.defineProperty(objMovieData, "movie_title", {value : jsnData.ktitle
            , writable : false
            , configurable: false});
        // 개봉연도
        Object.defineProperty(objMovieData, "open_year", {value : jsnData.opendate
            , writable : false
            , configurable: false});
        
        // 포스터 URL
        Object.defineProperty(objMovieData, "poster_url", {value : jsnData.poster_img
            , writable : false
            , configurable: false});

        return objMovieData;
    }
    
    /**
     * 박스오피스 목록을 가져온다.
     */
    getBoxOfficeListWithPoster()
    {
        const THIS = this;
        const MOVIELIST_URL = (THIS.MOIVELIST_CRAWLING_URL_PREFIX 
                            + THIS.BOXOFFICE_CRAWLING_KEY 
                            + THIS.MOIVELIST_CRAWLING_URL_POSTFIX);
        
        // 설정된 URL 정보로 호출 후 값을 받아온 후 JSON객체 정보만 추려서 객체화 한다.
        // window.__jindo2_callback._$3361_0([JSON 형태]); <= 형태로 값이 반환됨
        return axios.get(MOVIELIST_URL).then(
            function(response)
            {
                if(response != null && response.data != null)
                {
                    let strJSONData = response.data.replace("window.__jindo2_callback._$3361_0(", "").replace(");" , "");
                    let jsnMovieData = JSON.parse(strJSONData);

                    if(jsnMovieData.data != null && jsnMovieData.data.result != null 
                        && jsnMovieData.data.result.itemList != null)
                    {   
                        let arrMovieList = jsnMovieData.data.result.itemList;

                        if(arrMovieList != null && arrMovieList.length > 0)
                        {
                            let arrConvertMovieList = [];
                            arrMovieList.some(function(objMovieData, i)
                                {
                                    let objConvertMovieData = THIS.convertMovieObject(objMovieData);
                                    arrConvertMovieList.push(objConvertMovieData);

                                    return (arrConvertMovieList.length === THIS.search_condition.item_per_page);
                                }
                            );

                            return arrConvertMovieList;
                        }
                    }
                }   
            }
        )
    }

    /**
     *  박스오피스 영화 목록과 스틸컷을 가져온다.
     *  @return
     */
    getBoxOfficeListWithStillcut()
    {
        const THIS = this;

        return THIS.getBoxOfficeListWithPoster().then(
            function(arrReturnMovieList)
            {
                /*
                let objOptions = {headers:{
                    'Access-Control-Allow-Origin' : '*'
                    , 'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With'
                }};*/
                
                function fnGetStillcut(objMovieData)
                {   
                    return axios.get(THIS.MOVIEPOSTER_API_URL
                        , {params: { 
                                api_key : THIS.MOVIEPOSTER_API_KEY
                                , query : objMovieData.movie_title
                            }
                            ,timeout: 10000 // 10초 이내에 응답이 오지 않으면 에러로 간주
                        }
                    ).then((response) => 
                        {
                            // 성공한 경우 스틸컷 URL 삽입
                            if(response.status === 200)
                            {
                                // 스틸컷이 없거나 results객체에 backdrop_path값이 없는 경우는 
                                // No Image URL로 설정한다.
                                let arrResult = response.data.results;
                                let strStillcutURL = "";

                                console.log(arrResult);

                                if(arrResult != null && arrResult.length > 0)
                                {
                                    let objResult = arrResult[0];
                                    
                                    if(objResult.backdrop_path != null 
                                        && objResult.backdrop_path !== "")
                                    {
                                        strStillcutURL = (THIS.MOVIEPOSTER_URL_PREFIX 
                                                        + objResult.backdrop_path);
                                    }
                                    else
                                    {
                                        strStillcutURL = THIS.NO_POSTER_IMAGE_URL;
                                    }

                                    Object.defineProperty(objMovieData
                                        , "stillcut_url"
                                        , {value : strStillcutURL
                                        , writable : false
                                        , configurable: false}
                                    );
                                }
                            }
                            
                            return objMovieData;
                        }
                    );

                    /* blocked...
                    return axios.get(THIS.CORS_ANYWHERE_URL + THIS.NAVER_DETAIL_URL + objMovieData.movie_id, objOptions)
                    .then(function(response)
                        {
                            const $ = cheerio.load(response.data);
                            const $bodyList = $("div.viewer_img").children("img._Img");

                            Object.defineProperty(objMovieData, "stillcut_url", {
                                value : $bodyList.attr('src')
                                , writable : false
                                , configurable: false});*/

                            /* 429 에러..
                            if(nIndex === arrReturnMovieList.length - 1)
                            {
                                THIS.forcedCallResolve(arrReturnMovieList);
                            }
                        }
                    );*/
                }

                async function fnGetStillcutLoop()
                {
                    let nIndex = 0;
                    let objPromise = null;
                    
                    for(nIndex = 0; nIndex < arrReturnMovieList.length; nIndex++)
                    {
                        // 스틸컷 이미지를 API를 이용해서 가져온다.
                        // 사진이 없는 경우 크롤링을 통해서 가져온다. 
                        // 그래도 없는 경우 NO Image 출력
                        objPromise = await fnGetStillcut(arrReturnMovieList[nIndex]);
                        /*
                        let objMovieData = arrReturnMovieList[nIndex];
                        let strStillCut = "";

                        if(arrReturnMovieList[nIndex].stillcut_url == null)
                        {
                            objPromise = await axios.get(THIS.CORS_ANYWHERE_URL + THIS.NAVER_DETAIL_URL + objMovieData.movie_id, objOptions)
                            .then(function(response)
                                {
                                    if(response.data != null)
                                    {
                                        try
                                        {       
                                            const $ = cheerio.load(response.data);
                                            const $bodyList = $("div.viewer_img").children("img._Img");
                                            
                                            strStillCut = $bodyList.attr('src');
                                        }
                                        catch(e)
                                        {
                                            console.log(e);
                                        }
                                        
                                    }

                                    if(strStillCut === "")
                                    {
                                        strStillCut = THIS.NO_POSTER_IMAGE_URL;
                                    }

                                    Object.defineProperty(objMovieData
                                        , "stillcut_url"
                                        , {value : strStillCut
                                        , writable : false
                                        , configurable: false}
                                    );
                                    
                                }
                            );
                        }*/
                    }

                    return objPromise;

                }

                return fnGetStillcutLoop().then(
                    function()
                    {
                        return arrReturnMovieList
                    }
                );
                /*
                 * 너무 많은 리퀘스트 요청으로 인한 429에러 발생
                 *
                arrReturnMovieList.forEach(
                    function(objMovieData, nIndex)
                    {
                        axios.get(THIS.CORS_ANYWHERE_URL + THIS.NAVER_DETAIL_URL + objMovieData.movie_id, objOptions)
                        .then(function(response)
                            {
                                const $ = cheerio.load(response.data);
                                const $bodyList = $("div.viewer_img").children("img._Img");

                                Object.defineProperty(objMovieData, "stillcut_url", {
                                    value : $bodyList.attr('src')
                                    , writable : false
                                    , configurable: false});
                                
                                if(nIndex === arrReturnMovieList.length - 1)
                                {
                                    THIS.forcedCallResolve(arrReturnMovieList);
                                }
                            }
                        );
                    }
                );*/
            }
        );
        /*
        // 30초 대기 후 결과가 있으면 반환하고 없으면 실패 메시지를 반환한다.
        return new Promise(function(successLoad, failedLoad)
            {
                THIS.onfulloadcomplete = successLoad;
                THIS.onfailedload = failedLoad;

                THIS.search_condition.is_list = true;
                
                THIS.m_hdlPromiseTimer = setTimeout(function()
                    {
                        // 리스트 데이터가 있는 경우 성공
                        // 없는 경우 실패
                        if(arrMovieData != null)
                        {
                            successLoad(arrMovieData);
                        }
                        else
                        {
                            failedLoad(strErrorMsg);
                        }
                    }
                    , 300000  // 30초 후 데이터가 없으면 에러로 간주한다.
                );
            }
        );*/
    }

    

    /**
     * 설정된 장르의 영화 목록을 가져온다.
     */
    getMovieList()
    {
        const THIS = this;
        const MOVIELIST_URL = (THIS.MOIVELIST_CRAWLING_URL_PREFIX 
                            + THIS.search_condition.genre 
                            + THIS.MOIVELIST_CRAWLING_URL_POSTFIX);
        
        return axios.get(MOVIELIST_URL).then(
            function(response)
            {
                if(response != null && response.data != null)
                {
                    let strJSONData = response.data.replace("window.__jindo2_callback._$3361_0(", "").replace(");" , "");
                    let jsnMovieData = JSON.parse(strJSONData);

                    if(jsnMovieData.data != null && jsnMovieData.data.result != null 
                        && jsnMovieData.data.result.itemList != null)
                    {   
                        let arrMovieList = jsnMovieData.data.result.itemList;

                        if(arrMovieList != null && arrMovieList.length > 0)
                        {
                            let arrConvertMovieList = [];
                            arrMovieList.some(function(objMovieData, i)
                                {
                                    let objConvertedMovieData = THIS.convertMovieObject(objMovieData);
                                    arrConvertMovieList.push(objConvertedMovieData);
                                    return (arrConvertMovieList.length === THIS.search_condition.item_per_page);
                                }
                            );

                            return arrConvertMovieList;
                        }
                    }
                }   
            }
        )
    }

    /**
     * 영화 상세 정보를 가져온다.
     *  @param strMovieTitle : 상세정보를 요청할 Movie ID
     *  @return
     */
    getMovieInfoWithPoster(strMovieTitle, strPosterURL)
    {
        const THIS = this;

        if(strMovieTitle != null && strMovieTitle !== "")
        {
            let objOptions = {
                headers:{
                    'Access-Control-Allow-Origin' : '*'
                    , 'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With'
                }
            };

            return axios.get(THIS.CORS_ANYWHERE_URL 
                + THIS.NAVER_DETAIL_MOBILE_URL 
                + strMovieTitle, objOptions)
            .then(function(response)
                {
                    let objMovieData = {};
                    let strGenres = "";
                    let strNations = "";
                    let strOpenYear = "";
                    let strPlot = "";
                    let strActors = "";

                    try
                    {
                        const $ = cheerio.load(response.data);
                        const $htmlDetailInfo = $("div.api_subject_bx");

                        /*
                        console.log(response.data);
                        const $ = cheerio.load(response.data);
                        const $bodyList = $("div.wide_info_area");
                        */
                        // 값이 있는 경우
                        if($htmlDetailInfo != null)
                        {
                            // 타이틀 설정
                            Object.defineProperty(objMovieData, "movie_title"
                                    , {value : strMovieTitle
                                    , writable : false
                                    , configurable: false});
                            
                            // 상세정보(장르, 국가, 개봉일)
                            let datMoiveInfo = $htmlDetailInfo.children("div.main_info")
                                                        .children("div.movie_summary")
                                                        .children("div.detail_info")
                                                        .children("dl");
                            
                            let nPlotIndex = 0;
                            
                            datMoiveInfo[0].children.forEach(
                                function(objMovieInfo, nIndex)
                                {
                                    // 줄거리 인덱스를 설정한다.
                                    if(objMovieInfo.type === "tag" 
                                        && objMovieInfo.name === "dt"
                                        && objMovieInfo.children[0].data === "줄거리")
                                    {
                                        nPlotIndex = nIndex + 2;
                                    }
                                    if(objMovieInfo.type === "tag" && objMovieInfo.name === "dd")
                                    {
                                        // 장르, 국가
                                        if(nIndex === 3)
                                        {
                                            strGenres = objMovieInfo.children[1].children[0].data; 
                                            strNations = objMovieInfo.children[5].children[0].data;
                                        }
                                        // 개봉날짜
                                        if(nIndex === 7)
                                        {
                                            if(objMovieInfo.children[0].data !== null)
                                            { 
                                                strOpenYear = objMovieInfo.children[0].data;
                                            }
                                        }
                                        // 줄거리
                                        if(nIndex === nPlotIndex)
                                        {
                                            strPlot = objMovieInfo.children[1].children[0].data;
                                        }
                                    }
                                }
                            );
                            
                            // 출연배우
                            const $htmlActors = $("div.movie_sub_info");
                            let datActors = $htmlActors.children("div.list_wrap")
                                                    .children("div.list_scroll")
                                                    .children("div.api_list_scroll_wrap")
                                                    .children("div")
                                                    .children("ul.api_list_scroll");
                            
                            strActors = "";
                            let nActorsCnt = 0;

                            // 배우 관련 태그를 발견한 경우
                            if(datActors.length > 0)
                            {
                                datActors[0].children.some(
                                    function(htmlLI , nIndex)
                                    {
                                        
                                        if(htmlLI.type === 'tag' 
                                            && htmlLI.name === 'li'
                                            && nIndex > 2)
                                        {
                                            if(strActors !== "")
                                            {
                                                strActors += ", "
                                            }
                                            strActors += htmlLI.children[1].children[3].children[0].data;
                                            nActorsCnt++;
                                        }
    
                                        return (nActorsCnt === 3);
                                    }
                                );
                            }
                            else
                            {
                                strActors = "정보 없음";
                            }
                            
                            /*
                            // 네이버 ID 값
                            Object.defineProperty(objMovieData, "movie_id"
                                    , {value : strMovieID
                                    , writable : false
                                    , configurable: false});

                            let datMovieInfo = $bodyList.children("div.mv_info");
                            /*
                            // 타이틀을 가져온다.
                            let strMovieTitle = datMovieInfo.children("h3.h_movie").children("a").text();
                            console.log($bodyList.children("h3.h_movie").children("a").text());
                            Object.defineProperty(objMovieData, "movie_title"
                                    , {value : strMovieTitle
                                    , writable : false
                                    , configurable: false});*/
                            /*  
                            // 포스터 URL
                            Object.defineProperty(objMovieData, "poster_url"
                                    , {value : strPosterURL
                                    , writable : false
                                    , configurable: false});
                            
                            let datSpec = datMovieInfo.children("p.info_spec").children("span");
                            
                            let strGenres = "";
                            let strOpenYear = "";
                            let strNations = "";

                            if(datSpec.length >= 5)
                            {
                                // 장르
                                if(datSpec[0].children.length > 0)
                                {
                                    datSpec[0].children.forEach(
                                        function(objHTML, nIndex)
                                        {
                                            if(objHTML.type === "tag" && objHTML.name === "a")
                                            {
                                                if(strGenres !== "")
                                                {
                                                    strGenres += ", "
                                                }

                                                strGenres += objHTML.children[0].data;
                                            }
                                        }

                                    )
                                }
                                // 국가
                                if(datSpec[1].children.length > 0)
                                {
                                    datSpec[1].children.forEach(
                                        function(objHTML, nIndex)
                                        {
                                            if(objHTML.type === "tag" && objHTML.name === "a")
                                            {
                                                if(strNations !== "")
                                                {
                                                    strNations += ", "
                                                }

                                                strNations += objHTML.children[0].data;
                                            }
                                        }

                                    )
                                }
                                // 개봉연도
                                if(datSpec[3].children.length > 0)
                                {
                                    datSpec[3].children.forEach(
                                        function(objHTML, nIndex)
                                        {
                                            if(objHTML.type === "tag" && objHTML.name === "a")
                                            {
                                                strOpenYear += objHTML.children[0].data;
                                            }
                                        }

                                    )
                                }
                            }
                            // 출연배우
                            let datActors = datMovieInfo.children("div.info_spec2").children("dl.step2").children("dd");
                            let strActors = "";
                            if(datActors[0].children.length > 0)
                            {
                                datActors[0].children.forEach(
                                    function(objHTML, nIndex)
                                    {
                                        if(objHTML.type === "tag" && objHTML.name === "a")
                                        {
                                            if(strActors !== "")
                                            {
                                                strActors += ", "
                                            }
                                            strActors += objHTML.children[0].data;
                                        }
                                    }

                                )
                            }
                            
                            // 줄거리
                            let datPlot = $("div.story_area").children("p.con_tx");
                            let strPlot = ""
                            
                            if(datPlot.length > 0)
                            {
                                datPlot[0].children.forEach(
                                    function(datChildren, nIndex)
                                    {
                                        if(datChildren.type === "text")
                                        {
                                            strPlot += datChildren.data;
                                        }
                                        else if(datChildren.type === "tag" && datChildren.name === "br")
                                        {
                                            strPlot += "\n";
                                        }
                                    }
                                );
                            }*/
                        }

                    }
                    catch(e)
                    {
                        console.log("[MovieDataCrawler.getMovieInfoWithPoster]" + e);
                    }

                    // 포스터 URL
                    Object.defineProperty(objMovieData, "poster_url"
                            , {value : strPosterURL
                            , writable : false
                            , configurable: false});
                    
                    // 개봉연도
                    Object.defineProperty(objMovieData, "open_year"
                            , {value : strOpenYear
                            , writable : false
                            , configurable: false});
                    // 국가
                    Object.defineProperty(objMovieData, "nations"
                            , {value : strNations
                            , writable : false
                            , configurable: false});
                    // 장르
                    Object.defineProperty(objMovieData, "genres_text"
                            , {value : strGenres
                            , writable : false
                            , configurable: false});
                    // 출연배우
                    Object.defineProperty(objMovieData, "actors_text"
                            , {value : strActors
                            , writable : false
                            , configurable: false});
                    // 줄거리
                    Object.defineProperty(objMovieData, "plot"
                            , {value : strPlot
                            , writable : false
                            , configurable: false});
                    
                    return objMovieData;
                }
            );
        }
    }
}

export default MoiveDataCrawler;