import React, { Component } from "react";
import MovieDataLoader from './loader/MovieDataLoader';
import GetNaverAPISearch from "./loader/GetNaverAPISearch";
import Crawling from './Crawling';
import "./Menu.css"

class Menu2 extends Component {
  static arrBoxofficeData = null;

  constructor(props)
  {
    super(props);
    this.ldrMovieData = new MovieDataLoader();
  }

  drawBoxOfficeList(arrBoxOfficeData)
  {
    let nFirst = 0;
    let divTest = document.getElementById("test");
    let hd = new Crawling();
    
    if(arrBoxOfficeData != null)
    {
      for(nFirst = 0; nFirst < arrBoxOfficeData.length; nFirst++)
      {
        let divMovie = document.createElement("div");
        let objBOData = arrBoxOfficeData[nFirst];

        // image
        let divImage = document.createElement("div");
        let imgPoster = new Image();
        imgPoster.className = "movie_image";
        imgPoster.src = objBOData.poster_url;

        let divInfo = document.createElement("div");
        // movie title
        let divTitle = document.createElement("div");
        divTitle.className = "title_div";
        divTitle.innerHTML = '<' + objBOData.movie_title + '>';
        // movie actor
        hd.getNaverID(objBOData.naverId);//crawling.js로
        console.log("objBOData.naverId : " + objBOData.naverId);
        hd.getActor().then(
          function(response)
          {
            if(response != null)
            {
              response.forEach(function(objActor, i)
                {
                  let divActor = document.createElement("div");
                  divActor.className = "actor_div";
                  let strAC = objActor.name;
                  divActor.innerHTML=strAC;
                  divInfo.appendChild(divActor);
                  console.log("1");
      
                }) 
            }
          }).then(
        // review
        hd.getReview().then(
          function(response)
          {
            if(response != null)
            {
              response.forEach(function(objReview, i){
                let divReview = document.createElement("div");
                divReview.className = "review_div";

                let reviewTitle = document.createElement("div");
                reviewTitle.className = "review_title";
                let strRV = objReview.title;
                reviewTitle.innerHTML=strRV;
                divReview.appendChild(reviewTitle);

                let reviewId = document.createElement("div");
                reviewId.className = "review_id";
                let strRV2 = objReview.id;
                reviewId.innerHTML=strRV2;
                divReview.appendChild(reviewId);

                let reviewContext = document.createElement("div");
                reviewContext.className = "review_context";
                let strRV3 = objReview.summary;
                reviewContext.innerHTML=strRV3;
                divReview.appendChild(reviewContext);

                divInfo.appendChild(divReview);
                console.log("2");
              })
            }
         }
        ));
        
        divImage.appendChild(imgPoster);
        divMovie.appendChild(divImage);
        divInfo.appendChild(divTitle);
        divMovie.appendChild(divInfo);
        

        divMovie.id = "rdiv";
        divImage.id = "Ldiv";
        divInfo.id = "Rdiv";
        
        divTest.appendChild(divMovie);
      }

    }
  }

  getBoxofficeList(bDaily)
  {
    let objThis = this;
    let nReceiveCnt = 0;

    this.ldrMovieData.search_condition.item_per_page = 5;
    this.ldrMovieData.search_condition.is_daily = bDaily;
    this.ldrMovieData.search_condition.nation_section = this.ldrMovieData.ALL;
    //this.ldrMovieData.search_condition.product_year = "2017";
    //this.ldrMovieData.search_condition.movie_title = "백두산";

    this.ldrMovieData.getBoxOfficeListWithPoster().then(
        function(arrBOData)
        {
          if(arrBOData != null)
          {
            for (const m in arrBOData) {
              //GetNaverMovie ID API
              GetNaverAPISearch(
                arrBOData[m].movie_title,
                ""
              ).then(response => {
                if (response) 
                {
                  arrBOData[m].naverId = response.split("=")[1];
                  nReceiveCnt++;
                }

                
                console.log(" naverId : " +arrBOData[m].naverId);


              }).then(
                function()
                {
                  // Todo :  arrBOData 마지막 배열 인덱스일 때, objThis.drawBoxOfficeList(arrBOData); 호출
                  if(nReceiveCnt === arrBOData.length)
                  {
                    objThis.drawBoxOfficeList(arrBOData);
                  }
               
                }
              );
            }
          }
        }
    ).catch(function(e)
        {
          console.log("Error Massage : " + e);
        }
    );
  }

  componentDidMount() {
    this.getBoxofficeList(true);
  }

  render() {
    return (
      <div id="test">
      </div>
    );
  }
}

export default Menu2;
