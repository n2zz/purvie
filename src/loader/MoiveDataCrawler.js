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
        let strNoImgURL = "data:image/png;base64,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";
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
                let objOptions = {headers:{
                    'Access-Control-Allow-Origin' : '*'
                    , 'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With'
                }};
                
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
                            // 성공한 경우 포스터 URL 삽입
                            if(response.status === 200)
                            {
                                // 스틸컷이 없거나 results객체에 backdrop_path값이 없는 경우는 
                                // No Image URL로 설정한다.
                                let arrResult = response.data.results;
                                let strStillcutURL = "";
                                if(arrResult != null && arrResult.length > 0)
                                {
                                    let objResult = arrResult[0];
                                    
                                    if(objResult.backdrop_path != null)
                                    {
                                        strStillcutURL = THIS.MOVIEPOSTER_URL_PREFIX + objResult.backdrop_path;
                                        
                                        Object.defineProperty(objMovieData
                                                            , "stillcut_url"
                                                            , {value : strStillcutURL
                                                            , writable : false
                                                            , configurable: false}
                                        );
                                    }
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
                        }
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

                    try
                    {
                        const $ = cheerio.load(response.data);
                        const $bodyList = $("div.api_subject_bx");

                        /*
                        console.log(response.data);
                        const $ = cheerio.load(response.data);
                        const $bodyList = $("div.wide_info_area");
                        */
                        // 값이 있는 경우
                        if($bodyList != null)
                        {
                            // 타이틀 설정
                            Object.defineProperty(objMovieData, "movie_title"
                                    , {value : strMovieTitle
                                    , writable : false
                                    , configurable: false});
                            
                            // 상세정보(장르, 국가, 개봉일)
                            let datMoiveInfo = $bodyList.children("div.main_info")
                                                        .children("div.movie_summary")
                                                        .children("div.detail_info")
                                                        .children("dl");
                            let strGenres = "";
                            let strNations = "";
                            let strOpenYear = "";
                            let strPlot = "";
                            let strActors = "";

                            console.log(datMoiveInfo);

                            datMoiveInfo[0].children.forEach(
                                function(objMovieInfo, nIndex)
                                {
                                    if(objMovieInfo.type === "tag" && objMovieInfo.name === "dd")
                                    {
                                        
                                        console.log(objMovieInfo);

                                        // 장르, 국가, 개봉일
                                        if(nIndex === 3)
                                        {
                                            strGenres = objMovieInfo.children[1].children[0].data; 
                                            strNations = objMovieInfo.children[5].children[0].data;
                                        }
                                        // 개봉날짜
                                        if(nIndex === 7)
                                        {
                                            strOpenYear = objMovieInfo.children[0].children[0].data;
                                        }
                                        // 줄거리
                                        if(nIndex === 11)
                                        {
                                            strPlot = objMovieInfo.children[1].children[0].data;
                                        }
                                    }
                                }
                            );
                            

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
                        }

                    }
                    catch(e)
                    {
                        console.log("[MovieDataCrawler.getMovieInfoWithPoster]" + e);
                    }
                    
                    return objMovieData;
                }
            );
        }
    }
}

export default MoiveDataCrawler;