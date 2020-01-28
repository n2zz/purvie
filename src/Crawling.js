import MoiveDataCrawler from "./loader/MoiveDataCrawler";

function Crawling() {
  //Todo : 네이버 리뷰를 크롤링해서 데이터 객체로 생성 후 넘긴다.
  var movie_id;//닥터 두리틀 예제 MovieDataLoader에서 받아온다
  var page = "https://m.search.naver.com/search.naver?where=m&query=영화 ";
  var cors = "https://cors-anywhere.herokuapp.com/";

  const axios = require("axios");
  const cheerio = require("cheerio");
//Menu2 41

  this.getMovieTitle = function(strMovieID)
  {
    movie_id = strMovieID;
  }
  
  this.getReview = function(){
    const getHtml = async () => {
      try {
        let objOptions = {
          headers:{
              'Access-Control-Allow-Origin' : '*'
              , 'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With'
          }
      };
        return await axios.get(cors+page+movie_id,objOptions); 
      } catch (error) {
       console.error(error);
      }
    };
    return getHtml().then(html => {

      let objMovieData = {};
      //배우
      let crawler = new MoiveDataCrawler();
      let strActors = crawler.getActors(html.data);
      
      Object.defineProperty(objMovieData, "actors_text"
                            , {value : strActors
                            , writable : false
                            , configurable: false});

      //리뷰
      let ulList = [];
      const $ = cheerio.load(html.data);
      const $MVList = $("div._svp_list")
                      .children("panel-list")
                      .children("div._option_panel")
                      .children("panel-list")
                      .children("div._panel")
                      .children("select-contents")
                      .children("div._select_contents_event_base")
                      .children("ul.lst_total")
                      .children("li.bx");

      for(let i =0 ; i < 2; i++)
      {
        //console.log("여기는 들어오나요")
        let elem = null;
        let datTitle = null;
        let datTotalGroup = null;
        
        // 제목, ID, 글
        let strTitle = "";
        let strID = "";
        let strSummary = "";

        // 생성 객체
        let objReview = {};

        // 가져온 객체에서 total_wrap 클래스를 갖고 있는 div를 찾는다.
        if($MVList[i].children.length > 0)
        {
          $MVList[i].children.some(
            function(objChild, nIndex)
            {
              let bFind = false;
              if(objChild.type === "tag"
                 && objChild.name === "div"
                 && objChild.attribs.class ==="total_wrap")
              {
                elem = objChild;
                bFind = true;
              }
              
              return bFind;
            }
          );
        }

        // 하단 타이틀 부분 a Tag와 total_group 클래스를 갖고 있는 div를 찾는다.
        if(elem != null)
        {
          elem.children.forEach(
            function(objChildren, nIndex)
            {
              // 타이틀 부분 찾기
              if(objChildren.type === "tag" 
                && objChildren.name === "a")
              {
                datTitle = objChildren;
              }
              // ID 및 글내용 부분 찾기
              if(objChildren.type === "tag" 
                && objChildren.name === "div"
                && objChildren.attribs.class === "total_group")
              {
                datTotalGroup = objChildren;
              }
            }
          );
          
          // 결과값이 있고 자식 노드를 갖고 있는 경우 자식 노드를 조합하여 타이틀을 얻는다.
          if(datTitle != null && datTitle.children.length > 0)
          {
            datTitle.children.forEach(
              function(objChild, nIndex)
              {
                if(objChild.type === "tag"
                  && objChild.name === "mark")
                {
                  strTitle += objChild.children[0].data;
                }
                else if(objChild.type === "text")
                {
                  strTitle += objChild.data;
                }
              }
            );
          }

          // Total_group을 찾은 경우 ID와 리뷰글을 가져온다.
          if(datTotalGroup != null && datTotalGroup.children.length > 0)
          {
            datTotalGroup.children.forEach(
              function(objChild, nIndex)
              {
                if(objChild.type === "tag"
                  && objChild.name === "div")
                {
                  if(objChild.attribs.class === "total_sub")
                  {
                    strID = objChild.childNodes[2].childNodes[1].childNodes[2].childNodes[1].childNodes[0].data;
                  }
                  else if(objChild.attribs.class === "total_dsc_wrap")
                  {
                    let datSummary = objChild.childNodes[1].childNodes[1];
                    // 결과값이 있고 자식 노드를 갖고 있는 경우 자식 노드를 조합하여 리뷰글을 얻는다.
                    if(datSummary != null && datSummary.children.length > 0)
                    {
                      datSummary.children.forEach(
                        function(objChild, nIndex)
                        {
                          if(objChild.type === "tag"
                            && objChild.name === "mark")
                          {
                            strSummary += objChild.children[0].data;
                          }
                          else if(objChild.type === "text")
                          {
                            strSummary += objChild.data;
                          }
                        }
                      );
                    }
                  }
                }
              }
            );
            
          }
        }
        
        objReview.title =  strTitle;
        objReview.id = strID;
        objReview.summary = strSummary;
        ulList.push(objReview);
      }

      const data = ulList.filter(n => n.title);

      Object.defineProperty(objMovieData, "review_text"
                            , {value : data
                            , writable : false
                            , configurable: false});

      return objMovieData;

    });
  }

}
  export default Crawling;

      
