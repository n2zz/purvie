import axios from 'axios';

class MovieDataLoader
{
    /**
     * 생성자
     */
    constructor()
    {
        let objThis = this;

        /////////////////////////////////////////////////////////////////////////////////////////
        //
        //                  상수 정의
        //

        // API 키들
        Object.defineProperty(this, "MOVIEPOSTER_API_KEY"
                                , {value : "15d2ea6d0dc1d476efbca3eba2b9bbfb"
                                , writable : false
                                , configurable: false});
        Object.defineProperty(this, "KOBIS_API_KEY"
                                , {value : "835b781c9cbd73d0521d5e5a878da647"
                                , writable : false
                                , configurable: false});
        
        // THE MOVIDE DB API URL
        let strMPAPIURL = "https://api.themoviedb.org/3/search/movie";
        Object.defineProperty(this, "MOVIEPOSTER_API_URL"
                                , {value : strMPAPIURL
                                , writable : false
                                , configurable: false});

        // 영화 포스터 이미지 URL Prefix
        let strPosterURLPrefix = "http://image.tmdb.org/t/p/w500/";
        Object.defineProperty(this, "MOVIEPOSTER_URL_PREFIX"
                                , {value : strPosterURLPrefix
                                , writable : false
                                , configurable: false});

        // 영화진흥위원회 API URL
        let strKOBISAPIURLPrefix = "http://www.kobis.or.kr/kobisopenapi/webservice/rest/";

        // 영화진흥위원회 API 박스오피스, 영화목록, 상세정보 세부 URL
        let strBoxofficeDailyListURLPostfix = "/searchDailyBoxOfficeList.json";
        let strBoxofficeWeeklyListURLPostfix = "/searchWeeklyBoxOfficeList.json";
        let strMoveListURLPostfix = "/searchMovieList.json";
        let strMoveInfoURLPostfix = "/searchMovieInfo.json";
        
        // 리스트 요청 구분
        Object.defineProperty(this, "BOXOFFICE"
                                , {value : "boxoffice"
                                , writable : false
                                , configurable: false});
        Object.defineProperty(this, "MOVIE"
                                , {value : "movie"
                                , writable : false
                                , configurable: false});
        
        // 박스오피스 리스트 요청 URL(일별/주간)
        let strBoxofficeListURL = (strKOBISAPIURLPrefix 
                                + this.BOXOFFICE + strBoxofficeDailyListURLPostfix);
        Object.defineProperty(this, "KOBIS_API_BOXOFFICE_DAILY_LIST_URL"
                                , {value : strBoxofficeListURL
                                , writable : false
                                , configurable: false});
        strBoxofficeListURL = (strKOBISAPIURLPrefix 
                            + this.BOXOFFICE + strBoxofficeWeeklyListURLPostfix);
        Object.defineProperty(this, "KOBIS_API_BOXOFFICE_WEEKLY_LIST_URL"
                                , {value : strBoxofficeListURL
                                , writable : false
                                , configurable: false});
        // 영화 목록 요청 URL
        let strMovieListURL = (strKOBISAPIURLPrefix 
                                + this.MOVIE + strMoveListURLPostfix);
        Object.defineProperty(this, "KOBIS_API_MOVIE_LIST_URL"
                                , {value : strMovieListURL
                                , writable : false
                                , configurable: false});
            
        // 영화 목록 요청 URL
        let strMovieInfoURL = (strKOBISAPIURLPrefix 
            + this.MOVIE + strMoveInfoURLPostfix);
        Object.defineProperty(this, "KOBIS_API_MOVIE_INFO_URL"
                                , {value : strMovieInfoURL
                                , writable : false
                                , configurable: false});
        
        // 포스터 이미지 없는 경우 이미지 없음 URL
        let strNoImgURL = "data:image/png;base64,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";
        Object.defineProperty(this, "NO_POSTER_IMAGE_URL"
                                , {value : strNoImgURL
                                , writable : false
                                , configurable: false});
        
        // 국내/외 요청 구분
        Object.defineProperty(this, "ALL"
                                , {value : ""
                                , writable : false
                                , configurable: false});
        Object.defineProperty(this, "KOREA"
                                , {value : "K"
                                , writable : false
                                , configurable: false});
        Object.defineProperty(this, "FOREIGN"
                                , {value : "F"
                                , writable : false
                                , configurable: false});
        
        // 장르 객체
        let m_jsnGenre = {
            ACTION : "액션"
            , ADVENTURE : "어드벤처"
            , ROMANCE : "멜로/로맨스"
            , DRAMA : "드라마"
            , COMEDY : "코미디"
            , ANIMATION : "애니메이션"
            , ETC : "기타"
        };
        Object.defineProperty(this, "GENRES_LIST"
                                , {value : m_jsnGenre
                                , writable : false
                                , configurable: false});

        // 로더 상태
        Object.defineProperty(this, "WAITING"
                                ,{value : "waiting"
                                , writable : false
                                , configurable: false});
        Object.defineProperty(this, "LOADING"
                                ,{value : "loading"
                                , writable : false
                                , configurable: false});
        
        /////////////////////////////////////////////////////////////////////////////////////////
        //
        //                  검색조건 설정용 객체 정의
        // * search_condition
        //   => BOXOFFICE, NORMAL 색션 구분 상수
        //   => .is_list : 리스트/상세정보 구분 (true, false)
        //   => .section : 검색 구분(BOXOFFICE : 박스오피스, NORMAL : 일반 / 기본 NORMAL)
        //   => .is_daily : 일별/주간 여부(true, false / 기본 true)
        //   => .current_page : 페이지 지정(기본값 : 1)
        //   => .item_per_page : 한페이지에 로드할 정보(기본값 : 10 / 최대 10)
        //   => .nation_section : 국내/외 영화 구분 (KOREA, FOREIGN, ALL / 기본 ALL)
        //   => .movie_title : 검색할 영화명
        //   => .product_year : 제작연도 (yyyy형태)
        //   => .genre : 장르 (this.GENRES_LIST 값으로 검색)
        //

        // 검색 조건 설정용 객체
        let m_objSearchCondition = {};
        Object.defineProperty(this, "search_condition"
                                ,{value : m_objSearchCondition
                                , writable : false
                                , configurable: false});
        // 일별/주간 설정 (true : 일별, false : 주간 / 기본 true)
        let m_bList = true;
        Object.defineProperty(this.search_condition, "is_list"
                                , {
                                    get() { return m_bList; },
                                    set(bList) {
                                        if(typeof(bList) == 'boolean')
                                        {
                                            m_bList = bList;
                                        }
                                        else
                                        {
                                            console.log("[MovieDataLoader.search_config.is_list]:true, false만 입력 가능합니다.");
                                        }
                                    },
                                    enumerable: true,
                                    configurable: false
                                }
                            );
        // 검색 색션 (BOXOFFICE : 박스오피스, MOVIE : 일반 / 기본 일반 )
        let m_strSection = objThis.MOVIE;
        Object.defineProperty(this.search_condition, "section"
                                , {
                                    get() { return m_strSection; },
                                    set(strSection) {
                                        if(strSection === objThis.MOVIE
                                            || strSection === objThis.BOXOFFICE)
                                        {
                                            m_strSection = strSection;
                                        }
                                        else
                                        {
                                            console.log("[MovieDataLoader.search_config.section]:search_condition내의 설정 상수만 입력 가능합니다.");
                                        }
                                    },
                                    enumerable: true,
                                    configurable: false
                                }
                            );
        // 일별/주간 설정 (true : 일별, false : 주간 / 기본 true)
        let m_bDaily = true;
        Object.defineProperty(this.search_condition, "is_daily"
                                , {
                                    get() { return m_bDaily; },
                                    set(bDaily) {
                                        if(typeof(bDaily) == 'boolean')
                                        {
                                            m_bDaily = bDaily;
                                        }
                                        else
                                        {
                                            console.log("[MovieDataLoader.search_config.is_daily]:true, false만 입력 가능합니다.");
                                        }
                                    },
                                    enumerable: true,
                                    configurable: false
                                }
                            );
        // 현재페이지(기본 1)
        let m_nCurrentPage = 1;
        Object.defineProperty(this.search_condition, "current_page"
                                , {
                                    get() { return m_nCurrentPage; },
                                    set(nCurrentPage) {
                                        if(typeof(nCurrentPage) === 'number' 
                                            && nCurrentPage !== 0)
                                        {
                                            // 요청한 페이지가 현재 설정된 페이지보다 같거나 작은 경우
                                            // 장르용 페이지 변수값을 이전 페이지 변수값으로 변경한다.
                                            if(nCurrentPage <= m_nCurrentPage)
                                            {
                                                // 이전 페이지 간격을 정한다.
                                                let nFirst = 0;
                                                let nLast = m_nCurrentPage - nCurrentPage;
                                                let nBackPageCnt = 0;
                                                for(nFirst = 0; nFirst <= nLast;nFirst++)
                                                {
                                                    nBackPageCnt += Number(objThis.m_arrPagingHistory.pop());
                                                }
                                                objThis.m_nGenreEndPageIndex = objThis.m_nGenreEndPageIndex - nBackPageCnt;
                                            }
                                            
                                            objThis.m_nGenreStartPageIndex = objThis.m_nGenreEndPageIndex;

                                            m_nCurrentPage = nCurrentPage;
                                        }
                                        else
                                        {
                                            console.log("[MovieDataLoader.search_config.current_page]:숫자(1이상)만 입력 가능합니다.");
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
        // 국내/해외 영화 여부(기본 true)
        let m_strNationSection = this.ALL;
        Object.defineProperty(this.search_condition, "nation_section"
                                , {
                                    get() { return m_strNationSection; },
                                    set(strNationSection) {
                                        if(strNationSection === objThis.ALL
                                            || strNationSection === objThis.KOREA
                                            || strNationSection === objThis.FOREIGN)
                                        {
                                            m_strNationSection = strNationSection;
                                        }
                                        else
                                        {
                                            console.log("[MovieDataLoader.search_config.nation_section]:true, false만 입력 가능합니다.");
                                        }
                                    },
                                    enumerable: true,
                                    configurable: false
                                }
                            );
        // 영화명 검색용
        let m_strSearchTitle = "";
        Object.defineProperty(this.search_condition, "movie_title"
                                , {
                                    get() { return m_strSearchTitle; },
                                    set(strSearchTitle) {
                                        if(typeof(strSearchTitle) == 'string')
                                        {
                                            m_strSearchTitle = strSearchTitle;
                                        }
                                        else
                                        {
                                            console.log("[MovieDataLoader.search_config.movie_title]:문자만 입력 가능합니다.");
                                        }
                                    },
                                    enumerable: true,
                                    configurable: false
                                }
                            );
        // 제작연도
        let m_strProductYear = "";
        Object.defineProperty(this.search_condition, "product_year"
                                , {
                                    get() { return m_strProductYear; },
                                    set(strProductYear) {
                                        if(typeof(strProductYear) == 'string')
                                        {
                                            m_strProductYear = strProductYear;
                                        }
                                        else
                                        {
                                            console.log("[MovieDataLoader.search_config.product_year]:문자만 입력 가능합니다.");
                                        }
                                    },
                                    enumerable: true,
                                    configurable: false
                                }
                            );
        // 장르 검색
        let m_strGenre = "";
        Object.defineProperty(this.search_condition, "genre"
                                , {
                                    get() { return m_strGenre; },
                                    set(strGenre) {
                                        if(typeof(strGenre) == 'string')
                                        {
                                            if(m_strGenre !== strGenre)
                                            {
                                                objThis.m_nGenreEndPageIndex = 1;
                                                objThis.m_nGenreStartPageIndex = 1;
                                                objThis.m_arrPagingHistory = []
                                            }
                                            m_strGenre = strGenre;
                                        }
                                        else
                                        {
                                            console.log("[MovieDataLoader.search_config.genre]:문자만 입력 가능합니다.");
                                        }
                                    },
                                    enumerable: true,
                                    configurable: false
                                }
                            );

        /////////////////////////////////////////////////////////////////////////////////////////
        //
        //                      내부 변경 변수 정의
        //
        
        // MoiveDataLoader 상태(LOADING : 로딩 중, WAITING : 대기 중 / 기본 대기 중)
        Object.defineProperty(this, "status"
                                ,{value : this.WAITING
                                , writable : false
                                , configurable: true});

        // 영화 데이터 목록을 저장할 리스트 객체
        let m_arrMovieData = null;
        Object.defineProperty(this, 'movie_data_list'
                                , {
                                    get() { return m_arrMovieData; },
                                    set(arrMovieData) {
                                        if(typeof(arrMovieData) == 'object')
                                        { 
                                            m_arrMovieData = arrMovieData;
                                        } 
                                    },
                                    enumerable: true,
                                    configurable: false
                                }
                            );
        // 영화 상세정보를 저장할 객체
        let m_objMovieData = null;
        Object.defineProperty(this, 'movie_data'
                                , {
                                    get() { return m_objMovieData; },
                                    set(objMovieData) {
                                        if(typeof(objMovieData) == 'object')
                                        { 
                                            m_objMovieData = objMovieData;
                                        } 
                                    },
                                    enumerable: true,
                                    configurable: false
                                }
                            );
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
        
        // Settimeout 시 반환하는 Handler 객체를 담을 변수
        this.m_hdlPromiseTimer = null;
        // 장르 검색 시 조사한 페이지 마지막 페이지수(search_condition.genre 값 변경 시 1로 초기화)
        this.m_nGenreEndPageIndex = 1;
        // 장르 검색 시 시작 페이지수(search_condition.genre 값 변경 시 1로 초기화)
        this.m_nGenreStartPageIndex = 1;
        // 장르 검색 페이징 이력(간격,  m_nGenreEndPageIndex - m_nGenreStartPageIndex 값 저장)
        // 이전 페이지 로드용
        this.m_arrPagingHistory = [];
    }
    
    ////////////////////////////////////////////////////////////////////////////////////////////
    //
    //                          내부 사용 함수 정의
    //

    /**
     * setTimeout을 강제적으로 종료하고 Promise객체의 resolve함수를 호출한다.
     * @param {}} objReturnData 
     */
    forcedCallResolve(objReturnData)
    {
        let objThis = this;

        if(objThis.m_hdlPromiseTimer != null)
        {
            setTimeout(
                function()
                {
                    // 로더 상태를 로딩중으로 변경한다.
                    Object.defineProperty(objThis, "status"
                                                ,{value : objThis.WAITING
                                                , writable : false
                                                , configurable: true});
                    clearTimeout(objThis.m_hdlPromiseTimer);
                    objThis.onfulloadcomplete(objReturnData);
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
        let objThis = this;

        if(objThis.m_hdlPromiseTimer != null)
        {
            setTimeout(
                function()
                {
                    // 로더 상태를 로딩중으로 변경한다.
                    Object.defineProperty(objThis, "status"
                                                ,{value : objThis.WAITING
                                                , writable : false
                                                , configurable: true});
                    clearTimeout(objThis.m_hdlPromiseTimer);
                    objThis.onfailedload(srtMessage);

                    objThis.m_hdlPromiseTimer = null;
                }
                , 500
            );
        }
    }

    /**
     * JSON List에서 특정 키의 값을 배열 방식으로 변경 후 반환한다.
     * @param {*} jsnList : 대상 JSON 객체
     * @param {*} strKey : 변환할 키
     */
    convertJSONListToArray(jsnList, strKey)
    {
        let arrResult = null;
        let strResult = "";
        let nFirst = 0;
        let nLength = 0;

        if(jsnList != null && jsnList.length > 0)
        {
            nLength = jsnList.length;
            arrResult = [];

            for(nFirst = 0;nFirst < nLength;nFirst++)
            {
                if(jsnList[nFirst].hasOwnProperty(strKey))
                {
                    
                    strResult = jsnList[nFirst][strKey];
                    arrResult.push(strResult)
                }
            }
        }

        return arrResult;
        
    }

    /**
     * JSON List에서 특정 키의 값을 ','연결 방식으로 변경 후 반환한다.
     * @param {*} jsnList : 대상 JSON 객체
     * @param {*} strKey : 변환할 키
     */
    convertJSONListToString(jsnList, strKey)
    {
        let strResult = "";
        let nFirst = 0;
        let nLength = 0;

        if(jsnList != null && jsnList.length > 0)
        {
            nLength = jsnList.length;

            for(nFirst = 0;nFirst < nLength;nFirst++)
            {
                if(jsnList[nFirst].hasOwnProperty(strKey))
                {
                    if(strResult !== "")
                    {
                        strResult += ", "
                    }
                    strResult += jsnList[nFirst][strKey];
                }
            }
        }

        return strResult;
        
    }

    /**
     * 받은 객체를 객체로 변환 후 반환한다.
        objMovieData.movie_id = "";                 // 영화 호출용 고유번호
        objMovieData.movie_title = "";              // 영화명
        objMovieData.poster_url = "";               // 포스터 URL
        objMovieData.product_year = "";             // 제작연도
        objMovieData.show_time = "";                // 상영시간
        objMovieData.open_year = "";                // 개봉연도
        objMovieData.genres_list = "";              // 장르(단건 Array형태)
        objMovieData.genres_text = "";              // 장르(문자열로 전부 나열)
        objMovieData.directors_list = "";           // 감독명(단건 Array형태)
        objMovieData.directors_text = "";           // 감독명(문자열로 전부 나열)
        objMovieData.actors_list = "";              // 배우명(단건 Array형태)
        objMovieData.actors_text = "";              // 배우명(문자열로 전부 나열)
        objMovieData.is_new = false;                // 랭킹 신규 진입 여부

        objMovieData.is_last_data = false;          // 마지막 데이터 여부
     *  @param jsnData : 변환할 JSON 객체
     *  @return objMovieData
     */
    convertMovieObject(jsnData)
    {
        let objMovieData = {};
        
        // 영화코드
        Object.defineProperty(objMovieData, "movie_id", {value : jsnData.movieCd
            , writable : false
            , configurable: false});
        // 영화명
        Object.defineProperty(objMovieData, "movie_title", {value : jsnData.movieNm
            , writable : false
            , configurable: false});
        // 개봉연도
        Object.defineProperty(objMovieData, "open_year", {value : jsnData.openDt
            , writable : false
            , configurable: false});
        
        // 리스트 요청인 경우
        if(this.search_condition.is_list)
        {
            // 박스오피스는 신규랭킹 진입여부
            // 일반은 개봉연도, 장르명 추가 로드
            if(this.search_condition.section === this.BOXOFFICE)
            {
                // 신규 랭킹 진입 여부
                Object.defineProperty(objMovieData, "is_new", {value : jsnData.rankOldAndNew
                    , writable : false
                    , configurable: false});
            }
            else if(this.search_condition.section === this.MOVIE)
            {
                // 개봉연도
                Object.defineProperty(objMovieData, "product_year", {value : jsnData.prdtYear
                                                        , writable : false
                                                        , configurable: false});
                // 장르명
                Object.defineProperty(objMovieData, "genre_text", {value : jsnData.repGenreNm
                                                        , writable : false
                                                        , configurable: false});
            }
        }
        else
        {
            // 제작연도
            Object.defineProperty(objMovieData, "product_year", {value : jsnData.prdtYear
                                                            , writable : false
                                                            , configurable: false});
            // 상영시간
            Object.defineProperty(objMovieData, "show_time", {value : jsnData.showTm
                                                            , writable : false
                                                            , configurable: false});
            // 장르(단건 배열)
            let arrGenre = this.convertJSONListToArray(jsnData.genres, "genreNm");
            Object.defineProperty(objMovieData, "genres_list", {value : arrGenre
                                                        , writable : false
                                                        , configurable: false});
            // 장르(모든 장르 나열)
            let strGenre = this.convertJSONListToString(jsnData.genres, "genreNm");
            Object.defineProperty(objMovieData, "genres_text", {value : strGenre
                                                        , writable : false
                                                        , configurable: false});
            // 감독(단건 배열)
            let arrDirectors = this.convertJSONListToArray(jsnData.directors, "peopleNm");
            Object.defineProperty(objMovieData, "directors_list", {value : arrDirectors
                                                        , writable : false
                                                        , configurable: false});
            // 감독(모든 감독 나열)
            let strDirectors = this.convertJSONListToString(jsnData.directors, "peopleNm");
            Object.defineProperty(objMovieData, "directors_text", {value : strDirectors
                                                        , writable : false
                                                        , configurable: false});
            // 배우(단건 배열)
            let arrActors = this.convertJSONListToArray(jsnData.actors, "peopleNm");
            Object.defineProperty(objMovieData, "actors_list", {value : arrActors
                                                        , writable : false
                                                        , configurable: false});
            // 배우(모든 배우 나열)
            let strActors = this.convertJSONListToString(jsnData.actors, "peopleNm");
            Object.defineProperty(objMovieData, "actors_text", {value : strActors
                                                        , writable : false
                                                        , configurable: false});
            // 마지막 데이터 여부
            Object.defineProperty(objMovieData, "is_last_data", {value : true
                                                            , writable : false
                                                            , configurable: false});
        }

        return objMovieData;
    }

    /**
     * search_condition에 설정된 정보를 이용하여 params를 생성하여 반환한다.
     * @return objParams
     */
    getAPIParams()
    {
        // Params 객체
        let objParams = {params: 
                { 
                    key : this.KOBIS_API_KEY
                }
                // 5초 이후에도 응답이 없으면 에러로 간주한다.
                , timeout: 5000
            };
        
        // 일간/주간박스오피스 or 일반영화 목록에 따라
        // 다른 검색 Params를 설정한다.
        if(this.search_condition.section === this.BOXOFFICE)
        {
            // 오늘 날짜에서 하루 전 날짜를 검색 날짜로 설정한다.
            let dtCurrent = new Date();                     // 현재 날짜 계산용
            let nYear = dtCurrent.getFullYear();
            let strMonth = dtCurrent.getMonth() + 1;
            let strDay = dtCurrent.getDate();

            // 한페이지에 표시될 영화 데이터 갯수
            objParams.params.itemPerPage = this.search_condition.item_per_page;
            
            // 국내/외 영화 구분
            console.log("Nation_section : " + this.search_condition.nation_section);
            if(this.search_condition.nation_section !== null 
                && this.search_condition.nation_section !== "")
            {
                objParams.params.repNationCd = this.search_condition.nation_section;
            }
            
            // 주간/ 일별에 따라 날짜 및 추가 코드 설정
            //
            if(!this.search_condition.is_daily)
            {
                // 주간으로 설정 (0:주간, 1:주말, 2:주중)
                objParams.params.weekGb = "0";
                // 일주일 전 날짜로 설정
                strDay = strDay - 7;
            }
            else
            { 
                // 하루 전 날짜로 설정
                strDay = strDay - 7;
            }

            // 일자가 음수인 경우 날짜를 재계산한다.
            if(strDay <= 0)
            {
                strMonth--;

                if(strMonth === 0)
                {
                    nYear--;
                    strMonth = 12;
                }
                
                let lastDay = ( new Date( nYear, strMonth, 0) ).getDate();
                strDay = lastDay + strDay;
            }

            // yyyymmdd 형태로 날짜 변환
            if(Number(strMonth) < 10)
            {
                strMonth = "0" + strMonth.toString();
            }
            if(Number(strDay) < 10)
            {
                strDay = "0" + strDay.toString();
            }
            objParams.params.targetDt = nYear.toString() + strMonth + strDay;
        }
        else
        {
            // 장편영화로 강제 고정
            //objParams.params.movieTypeCd = "220101";

            // 일반 검색/장르 검색일 경우 로드할 페이지를 다르게 설정한다.
            console.log("this.search_condition.genre : " + this.search_condition.genre);

            if(this.search_condition.genre === "")
            {
                objParams.params.curPage = this.search_condition.current_page;
                // 한페이지에 표시될 영화 데이터 갯수
                objParams.params.itemPerPage = this.search_condition.item_per_page;
            }
            else
            {
                objParams.params.curPage = this.m_nGenreEndPageIndex;
                // 한페이지에 표시될 영화 데이터 갯수
                objParams.params.itemPerPage = 10;
            }

            // 검색 영화명
            if(this.search_condition.movie_title != null 
                && this.search_condition.movie_title !== "")
            {
                objParams.params.movieNm = this.search_condition.movie_title;
            }
            
            // 한국/외국 영화 여부
            if(this.search_condition.nation_section === this.KOREA)
            {
                objParams.params.repNationCd = "22041011";
            }

            // 개봉연도
            if(this.search_condition.product_year !== null 
                && this.search_condition.product_year !== "")
            {
                objParams.params.prdtStartYear = this.search_condition.product_year;
                objParams.params.prdtEndYear = this.search_condition.product_year;
            }
            objParams.params.multiMovieYn = "N";
        }

        return objParams;
    }
    
    /**
    *  해당 영화에 맞는 포스터를 가져온다.
    */ 
    getMoviePoster(objMovieData)
    {
        var objThis = this;
        
        // 넘겨 받은 객체가 Null이 아닌 경우 포스터를 가져 온다.
        if(objMovieData != null)
        {
            axios.get(objThis.MOVIEPOSTER_API_URL
                        , {params: { 
                                api_key : objThis.MOVIEPOSTER_API_KEY
                                , query : objMovieData.movie_title
                            }
                            ,timeout: 1000 // 1초 이내에 응답이 오지 않으면 에러로 간주
                        }
                    ).then((response) => 
                        {
                            console.log(response);
                            // 성공한 경우 포스터 URL 삽입
                            if(response.status === 200)
                            {
                                // 포스터 이미지가 없거나 results객체에 poster_path값이 없는 경우는 
                                // No Image URL로 설정한다.
                                let arrResult = response.data.results;
                                let strPosterURL = "";
                                if(arrResult != null && arrResult.length > 0)
                                {
                                    if(arrResult[0].poster_path != null)
                                    {
                                        strPosterURL = objThis.MOVIEPOSTER_URL_PREFIX + arrResult[0].poster_path;
                                    }
                                    else
                                    {
                                        strPosterURL = objThis.NO_POSTER_IMAGE_URL;
                                    }   
                                }
                                else
                                {
                                    strPosterURL = objThis.NO_POSTER_IMAGE_URL;
                                }

                                Object.defineProperty(objMovieData, "poster_url", {
                                                                    value : strPosterURL
                                                                    , writable : false
                                                                    , configurable: false});
                                console.log("Poster URL =>" + objMovieData.poster_url);
                            }
                            
                            return objMovieData;
                        }
                    ).then(function(objMovieData)
                        {
                            // 마지막 영화 데이터인 경우 settimeout을 강제 종료하고 결과를 반환한다.
                            if(objMovieData.is_last_data)
                            {
                                if(objThis.search_condition.is_list)
                                {    
                                    objThis.forcedCallResolve(objThis.movie_data_list);
                                }
                                else
                                {
                                    objThis.forcedCallResolve(objThis.movie_data);
                                }
                            }
                        }
                    );
        
        }        
    }
    
    
    /**
     * 영화 객체 유효성 검사를 실시한다.
     * @param {*} objMovieData 
     * @return bOk : 통과 여부
     */
    validateMovieData(objMovieData)
    {
        let bOK = true;

        // 목록 데이터가 있는 경우
        if(objMovieData == null)
        {
            bOK = false;
        }

        return bOK;
    }

    /**
     * 리스트 객체 유효성 검사를 실시한다.
     * @param {*} arrMovieData 
     * @return bOk : 통과 여부
     */
    validateMovieList(arrMovieData)
    {
        let bOK = true;

        // 목록 데이터가 있는 경우
        if(arrMovieData == null)
        {
            bOK = false;
        }
        else if (arrMovieData !== null && arrMovieData.length === 0)
        {
            bOK = false;
        }

        return bOK;
    }

    /**
     * 영화 상세정보를 가져온다.
     */
    getMovieInfo(strMovieID)
    {
        let objThis = this;
        // API 파라미터를 설정한다.
        let objParams = objThis.getAPIParams();
        objParams.params.movieCd = strMovieID;

        if(strMovieID != null && strMovieID !== "")
        {
            axios.get(objThis.KOBIS_API_MOVIE_INFO_URL
                , objParams
            ).then((response) => 
                {
                    let objMovieData = null;

                    // 성공한 경우 포스터 URL 삽입
                    if(response.status === 200)
                    {
                        objMovieData = objThis.convertMovieObject(response.data.movieInfoResult.movieInfo);
                    }
                    
                    return objMovieData;
                }
            ).then(function(objMovieData)
                {
                    if(objMovieData != null)
                    {
                        // 포스터를 가져온다.
                        console.log("상세정보 포스터 부르기");
                        objThis.movie_data = objMovieData
                        objThis.getMoviePoster(objMovieData);
                    }
                }
            );
        }
        else
        {
            console.log("[" + this.constructor.name + ".getMovieInfo] : MovieID가 없습니다.");
        }
    }

    /**
     *  영화진흥위원회에서 박스오피스/영화 목록을 가져온다.
     */
    getKOBISList()
    {  
        var arrMovieData = null;                           // 영화 데이터 목록
        var objThis = this;                                // this 객체

        let jsnMovieList = null;                           // API 후 넘겨 받은 JSON객체
        let strCurrentAPIURL = "";                         // API URL  
        let strResultKey = "";                             // API JSON 결과 키값
        let strListKey = "";                               // API JSON 목록 키값

        // 박스오피스 요청 시
        if(objThis.search_condition.section === objThis.BOXOFFICE)
        {
            if(objThis.search_condition.is_daily)
            {
                strCurrentAPIURL = objThis.KOBIS_API_BOXOFFICE_DAILY_LIST_URL;
                strResultKey = "boxOfficeResult";
                strListKey = "dailyBoxOfficeList";
            }
            else
            {
                strCurrentAPIURL = objThis.KOBIS_API_BOXOFFICE_WEEKLY_LIST_URL;
                strResultKey = "boxOfficeResult";
                strListKey = "weeklyBoxOfficeList";
            }
        }
        // 일반 영화 목록 요청 시
        else if(objThis.search_condition.section === objThis.MOVIE)
        {
            strCurrentAPIURL = objThis.KOBIS_API_MOVIE_LIST_URL;
            strResultKey = "movieListResult";
            strListKey = "movieList";
        }
        console.log("Load URL : " + strCurrentAPIURL);

        let objAPIParams = objThis.getAPIParams();

        // 설정된 영화 목록을 요청한다.
        axios.get(strCurrentAPIURL
                , objAPIParams
                ).then((response) => {
                        console.log(response);
                        console.log(response.data);

                        // 결과를 리턴 받은 경우
                        // 성공적으로 가져왔으면 포스터를 설정한다
                        if(response.status === 200)
                        {
                            jsnMovieList = response.data[strResultKey][strListKey];

                            if(jsnMovieList != null)
                            {
                                let nTotalLength = jsnMovieList.length;

                                console.log("List Length : " + jsnMovieList.length);

                                if(nTotalLength > 0)
                                {
                                    return jsnMovieList;
                                }
                            }
                        }
                        return jsnMovieList;
                    }
                ).then(function(jsnMovieList)
                    {
                        // 넘겨받은 리스트 값이 있는 경우
                        if(objThis.validateMovieList(jsnMovieList))
                        {
                            let nFirst = 0;
                            let nTotalLength = 0;

                            arrMovieData = [];
                            nTotalLength = jsnMovieList.length;

                            for(nFirst = 0; nFirst < nTotalLength; nFirst++)
                            {
                                let objBOData = objThis.convertMovieObject(jsnMovieList[nFirst]);
                                
                                if(nFirst === nTotalLength - 1)
                                {
                                    objBOData.is_last_data = true;
                                }

                                arrMovieData.push(objBOData);

                                // 포스터를 가져온다.
                                console.log("포스터 부르기");
                                objThis.getMoviePoster(objBOData);
                            }
                            
                            // 불러온 리스트를 저장한다.
                            objThis.movie_data_list = arrMovieData;
                        }
                        else
                        {
                            // 요청 성공 후 결과 값이 없는 경우 강제 완료한다.
                            objThis.movie_data_list = [];
                            objThis.forcedCallResolve(objThis.movie_data_list);
                        }
                    }
                );
    }

    /**
     *  영화진흥위원회에서 영화 목록을 가져온다. (장르 기준)
     */
    getKOBISListByGenre()
    {  
        var objThis = this;                                // this 객체

        let jsnMovieList = null;                           // API 후 넘겨 받은 JSON객체
        let strCurrentAPIURL = "";                         // API URL  
        
        strCurrentAPIURL = objThis.KOBIS_API_MOVIE_LIST_URL;

        console.log("Load URL by genre : " + strCurrentAPIURL);

        let bFinish = false;
        
        // 일반 영화 리스트를 요청 후 해당 장르 영화만 추출한다.
        // search_condition.item_per_page 설정 갯수만큼 가져오면 완료한다.
        
        // 목록 정보 초기화 및 현재 페이지 값을 저장한다.
        let arrMovieData = [];

        let fnCheckDataByGenre = function()
        {
            return axios.get(strCurrentAPIURL
                    , objThis.getAPIParams()
                ).then((response) => {
                        // 결과를 리턴 받은 경우
                        // 성공적으로 가져왔으면 포스터를 설정한다
                        if(response.status === 200)
                        {
                            jsnMovieList = response.data.movieListResult.movieList;
    
                            if(jsnMovieList != null)
                            {
                                let nTotalLength = jsnMovieList.length;
    
                                if(nTotalLength > 0)
                                {
                                    return jsnMovieList;
                                }
                            }
                        }
                        return jsnMovieList;
                    }
                ).then(function(jsnMovieList)
                    {
                        // 넘겨받은 리스트 값이 있는 경우
                        if(objThis.validateMovieList(jsnMovieList))
                        {
                            let nFirst = 0;
                            let nTotalLength = 0;
                            let nListLength = 0;
    
                            nTotalLength = jsnMovieList.length;
    
                            for(nFirst = 0; nFirst < nTotalLength; nFirst++)
                            {
                                let objBOData = null;
                                let nCheckGenre = 0;
                                let nPerPage = objThis.search_condition.item_per_page;
                                let strGenre = objThis.search_condition.genre;
                                
                                // 대표 장르에 검색에 해당하는 장르가 있는 경우만 배열에 삽입한다.
                                nCheckGenre = jsnMovieList[nFirst].genreAlt.indexOf(strGenre);
    
                                if(nCheckGenre > -1)
                                {
                                    objBOData = objThis.convertMovieObject(jsnMovieList[nFirst]);
                                    
                                    arrMovieData.push(objBOData); 
                                    nListLength = arrMovieData.length;
                                    console.log("arrMovieData.length : " + arrMovieData.length);
                                    // 포스터를 가져온다.
                                    objThis.getMoviePoster(objBOData);
                                    
                                    if(nListLength === nPerPage)
                                    {
                                        break;
                                    }
                                }
                            }
                            
                            objThis.m_nGenreEndPageIndex = objThis.m_nGenreEndPageIndex + 1;
                        }
                        else
                        {
                            // 요청 성공 후 결과 값이 없는 경우 강제 완료한다.
                            bFinish = true;   
                        }
                    }
                );
        }

        async function fnMakeDataByGenre()
        {
            while(!bFinish)
            {
                await fnCheckDataByGenre();
                if(arrMovieData.length === objThis.search_condition.item_per_page)
                {
                    break;
                }
            }

            objThis.movie_data_list = arrMovieData;
            // 검색한 페이지 간격을 기록한다.
            let nPageCount = objThis.m_nGenreEndPageIndex - objThis.m_nGenreStartPageIndex;
            console.log("nPageCount : " + nPageCount + ", GenreEndPageIndex : " + objThis.m_nGenreEndPageIndex);
            objThis.m_arrPagingHistory.push(nPageCount);
            
            // 강제 완료 통보
            objThis.forcedCallResolve(objThis.movie_data_list);
        }

        fnMakeDataByGenre();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////
    //
    //                          외부 호출 함수 정의
    //

    /**
     * search_condition 객체 초기화
     */
    initSearchCondition()
    {
        this.search_condition.is_list = true;
        this.search_condition.section = this.NORMAL;
        this.search_condition.is_daily = true;
        this.search_condition.current_page = 1;
        this.search_condition.item_per_page = 10;
        this.search_condition.nation_section = this.ALL;
        this.search_condition.movie_title = "";
        this.search_condition.product_year = "";
        this.search_condition.genre = "";
    }

    /**
     *  search_condition 설정에 맞는 영화 목록 및 영화에 맞는 포스터를 가져온다.
     *  @return
     */
    getListWithPoster()
    {
        let objThis = this;
        let strErrorMsg = "";

        // 3초 대기 후 결과가 있으면 반환하고 없으면 실패 메시지를 반환한다.
        return new Promise(function(successLoad, failedLoad)
            {
                if(objThis.search_condition.section === objThis.BOXOFFICE
                    || objThis.search_condition.section === objThis.MOVIE)
                {
                    objThis.onfulloadcomplete = successLoad;
                    objThis.onfailedload = failedLoad;

                    /* 로더 상태가 대기중인 경우 로딩중으로 변경하고
                     * 로딩 중인 경우 이전 호출로 Promise객체에 걸린 setTimeout을 해제하고 
                     * 강제 reject시킨다.
                    */
                    if(objThis.status === objThis.WAITING)
                    {
                        // 로더 상태를 로딩중으로 변경한다.
                        Object.defineProperty(objThis, "status"
                                                    ,{value : objThis.LOADING
                                                    , writable : false
                                                    , configurable: true});
                    }
                    else
                    {
                        objThis.forcedCallReject("300");
                    }
                    

                    objThis.search_condition.is_list = true;

                    // 일반 영화 목록 요청 시 장르 검색이 있는 경우
                    if(objThis.search_condition.section === objThis.MOVIE
                        && objThis.search_condition.genre != null 
                        && objThis.search_condition.genre !== "")
                    {
                        objThis.movie_data_list = [];
                        objThis.getKOBISListByGenre();
                    }
                    else
                    {
                        objThis.getKOBISList();
                    }
                }
                
                objThis.m_hdlPromiseTimer = setTimeout(function()
                    {
                        // 리스트 데이터가 있는 경우 성공
                        // 없는 경우 실패
                        if(objThis.movie_data_list != null)
                        {
                            successLoad(objThis.movie_data_list);
                        }
                        else
                        {
                            failedLoad(strErrorMsg);
                        }
                    }
                    , 15000  // 15초 후 데이터가 없으면 에러로 간주한다.
                );
            }
        );
    }

    /**
     *  search_condition 설정에 맞는 영화 목록 및 영화에 맞는 포스터를 가져온다.
     *  @return
     */
    getBoxOfficeListWithPoster()
    {
        this.search_condition.section = this.BOXOFFICE;

        return this.getListWithPoster();
    }

    /**
     *  search_condition 설정에 맞는 박스오피스 목록 및 영화에 맞는 포스터를 가져온다.
     *  @return
     */
    getMovieListWithPoster()
    {
        this.search_condition.section = this.MOVIE;
        
        return this.getListWithPoster();
    }

    /**
     * 영화 상세 정보를 가져온다.
     *  @param strMovieID : 상세정보를 요청할 Movie ID
     *  @return
     */
    getMovieInfoWithPoster(strMovieID)
    {
        let objThis = this;
        let strErrorMsg = "";

        // 1.5초 후 결과가 있으면 반환하고 없으면 실패 메시지를 반환한다.
        return new Promise(function(successLoad, failedLoad)
            {
                if(strMovieID != null && strMovieID !== "")
                {
                    objThis.onfulloadcomplete = successLoad;
                    objThis.onfailedload = failedLoad;

                    objThis.search_condition.is_list = false;
                    objThis.getMovieInfo(strMovieID);
                }
                else
                {
                    strErrorMsg = "501";
                }

                objThis.m_hdlPromiseTimer = setTimeout(function()
                    {
                        // 데이터가 있는 경우 성공
                        // 없는 경우 실패
                        if(objThis.movie_data != null)
                        {
                            successLoad(objThis.movie_data);
                        }
                        else
                        {
                            failedLoad(strErrorMsg);
                        }
                    }
                    , 3000  // 3초 후 데이터가 없으면 에러로 간주한다.
                );
            }
        );
    }
}



export default MovieDataLoader;