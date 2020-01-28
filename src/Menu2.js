import React, { Component } from "react";
import MoiveDataCrawler from './loader/MoiveDataCrawler';
import Crawling from './Crawling';
import "./Menu.css"

class Menu2 extends Component {
  static arrBoxofficeData = null;

  constructor(props)
  {
    super(props);
    this.ldrMovieData = new MoiveDataCrawler();
  }

  /**
   * 영화 목록을 리뷰 화면에 맞도록 출력한다.
   * @param {}} arrBoxOfficeData 
   */
  drawBoxOfficeList(arrBoxOfficeData)
  {
    let nFirst = 0;
    let divReviewList = document.getElementById("review_list");
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

        /////////////////////////////////////////////////////////////////////////////////////////////
        //
        //                   ToDo : 리뷰 및 출연배우 가져온 후 화면에 값 넣어주기
        //                    * 429에러(많은 요청에 의한 밴)가 날 수 있으니 한 번에 가져옵시다~
        //
        // movie actor
        hd.getMovieTitle(objBOData.movie_title);//crawling.js로

        // review
        hd.getReview().then(
          function(response)
          {
            if(response != null)
            {
              //배우
              let divActor = document.createElement("div");
              divActor.className = "actor_div";
              divActor.innerHTML=response.actors_text;
              divInfo.appendChild(divActor);
              
              //리뷰
              for(let i =0 ; i < 2; i++){
                let divReview = document.createElement("div");
                divReview.className = "review_div";

                let reviewTitle = document.createElement("div");
                reviewTitle.className = "review_title";
                reviewTitle.innerHTML=response.review_text[i].title;
                divReview.appendChild(reviewTitle);

                let reviewId = document.createElement("div");
                reviewId.className = "review_id";
                reviewId.innerHTML=response.review_text[i].id;
                divReview.appendChild(reviewId);

                let reviewContext = document.createElement("div");
                reviewContext.className = "review_context";
                reviewContext.innerHTML=response.review_text[i].summary;
                divReview.appendChild(reviewContext);

                divInfo.appendChild(divReview);
              }
            }
         }
        );

        divImage.appendChild(imgPoster);
        divMovie.appendChild(divImage);
        divInfo.appendChild(divTitle);
        divMovie.appendChild(divInfo);
        

        divMovie.id = "rdiv";
        divImage.id = "Ldiv";
        divInfo.id = "Rdiv";
        
        divReviewList.appendChild(divMovie);
      }
    }
  }

  /**
   * 영화 목록을 불러온다.
   */
  getBoxofficeList()
  {
    let objThis = this;

    this.ldrMovieData.search_condition.item_per_page = 5;

    this.ldrMovieData.getBoxOfficeListWithPoster().then(
        function(arrBOData)
        {
          if(arrBOData != null)
          {
            objThis.drawBoxOfficeList(arrBOData);
          }
        }
    ).catch(function(e)
        {
          console.log("Error Massage : " + e);
        }
    );
  }

  /**
   *  Component의 render 메소드가 호출된 후 호출 함수
   */
  componentDidMount() {
    this.getBoxofficeList();
  }

  render() {
    return (
      <div id="review_list">
        
      </div>
    );
  }
}

export default Menu2;
