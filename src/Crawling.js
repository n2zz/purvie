function Crawling() {
  //Todo : 네이버 리뷰를 크롤링해서 데이터 객체로 생성 후 넘긴다.
  var movie_id = "187940";//닥터 두리틀 예제 MovieDataLoader에서 받아온다
  //var movie_id = "144694";
  var reviewpage = "https://movie.naver.com/movie/bi/mi/review.nhn?code=";
  var plotpage = "https://movie.naver.com/movie/bi/mi/basic.nhn?code=";
  var actpage = "https://movie.naver.com/movie/bi/mi/detail.nhn?code=";

  const axios = require("axios");
  const cheerio = require("cheerio");

//reviewpage
  this.getReview = function(){
    const getHtml = async () => {
      try {
        return await axios.get(reviewpage+movie_id); //reviewpage+movie_id
      } catch (error) {
        console.error(error);
      }
    };

    return getHtml().then(html => {
      let ulList = [];
      const $ = cheerio.load(html.data);
      const $bodyList = $("div.review ul.rvw_list_area").children("li");

      for(let i =0 ; i < 2; i++)
      {
        let elem = $bodyList[i];
        let objReview = {};

        objReview.title =  elem.childNodes[1].childNodes[0].childNodes[0].data;
        objReview.id = elem.childNodes[3].childNodes[0].childNodes[0].data;
        objReview.summary = elem.childNodes[5].childNodes[0].childNodes[0].data;
        ulList.push(objReview);
      }

      const data = ulList.filter(n => n.title);
      return data;
    });
  }

  

//plotpage
  this.getPlot = function(){
    const getHtml = async () => {
      try {
        return await axios.get(plotpage+movie_id); 
      } catch (error) {
        console.error(error);
      }
    };

    return getHtml().then(html => {
      //console.log(html);
      let pList = [];
      const $ = cheerio.load(html.data);
      const $bodyList = $("div.story_area").children("p.con_tx");
      let nChildNodeCnt = $bodyList[0].childNodes.length;

      for(let i=0;i<nChildNodeCnt;i++)
      {
        let elem = $bodyList[0].childNodes[i];
        let objPlot = {};

        objPlot.line = elem.data;
        pList.push(objPlot);
      }
      const data2 = pList.filter(n => n.line);
      return data2;
   
    });
  }
 //actorpage
 this.getActor = function(){
  const getHtml = async () => {
    try {
      return await axios.get(actpage+movie_id); 
    } catch (error) {
      console.error(error);
    }
  };

  return getHtml().then(html => {
    let liList = [];
    const $ = cheerio.load(html.data);
    const $bodyList = $("div.p_info").children("a");

    for(let i =0 ; i < 5; i++)
    {
      let elem = $bodyList[i];
      let objActor = {};

      objActor.name =  elem.childNodes[0].data;
      liList.push(objActor);
    }
    
    const data3 = liList.filter(n => n.name);
    return data3;

    });
  }
}
  export default Crawling;