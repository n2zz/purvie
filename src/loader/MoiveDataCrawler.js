import axios from 'axios';
import cheerio from 'cheerio';

class MoiveDataCrawler
{
    constructor()
    {
        const THIS = this;

        // 네이버 API URL
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

        // 검색 조건 객체
        this.search_condition = {};

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
    }

    /**
     * 받은 객체를 객체로 변환 후 반환한다.
     * 
        objMovieData.movie_id = "";                 // 영화 호출용 고유번호
        objMovieData.naver_code = "";               // 줄거리, 리뷰 웹크롤링용(getNaverMovieCode함수에서 생성)
        objMovieData.movie_title = "";              // 영화명
        objMovieData.poster_url = "";               // 포스터 URL(getMoviePoster함수에서 생성)
        objMovieData.stillcut_url = "";             // 스틸컷 URL(getMoviePoster함수에서 생성)
        objMovieData.thubnail_url = "";             // 썸네일 URL(getNaverCode함수에서 생성)
        objMovieData.product_year = "";             // 제작연도
        objMovieData.show_time = "";                // 상영시간
        objMovieData.open_year = "";                // 개봉연도
        objMovieData.nations = "";                  // 국가
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
        
        // 상세정보 요청인 경우
        if(!this.is_list)
        {
            
        }

        return objMovieData;
    }
    
    /**
     * 설정된 장르의 영화 목록을 가져온다.
     */
    getBoxOfficeListWithPoster()
    {
        const THIS = this;
        const MOVIELIST_URL = (THIS.MOIVELIST_CRAWLING_URL_PREFIX + THIS.BOXOFFICE_CRAWLING_KEY
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
                            let arrConvertMovieList = arrMovieList.map(function(objMovieData, i)
                                {
                                    let objConvertMovieData = THIS.convertMovieObject(objMovieData);
                                    let objOptions = {headers:{
                                                'Access-Control-Allow-Origin' : '*'
                                                , 'Access-Control-Allow-Methods':'GET'
                                                , 'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With'
                                            }, timeout:3000};
                                    
                                    axios.get("https://movie.naver.com/movie/bi/mi/basic.nhn?code=" + objConvertMovieData.movie_id, objOptions)
                                    .then(function(response)
                                        {
                                            console.log(response.data);
                                            const $ = cheerio.load(response.data);
                                            const $bodyList = $("div.viewer_img");
                                            console.log($bodyList);
                                        }
                                    );

                                    return objConvertMovieData;
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
     * 설정된 장르의 영화 목록을 가져온다.
     */
    getMovieList()
    {
        const THIS = this;
        const MOVIELIST_URL = (THIS.MOIVELIST_CRAWLING_URL_PREFIX + THIS.search_condition.genre
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
                            let arrConvertMovieList = arrMovieList.map(function(objMovieData, i)
                                {
                                    return THIS.convertMovieObject(objMovieData);
                                }
                            );

                            return arrConvertMovieList;
                        }
                    }
                }   
            }
        )
    }
}

export default MoiveDataCrawler;