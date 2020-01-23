import React, { Component } from "react";
import MovieDataLoader from "./loader/MovieDataLoader";
import "./Menu.css";

class Menu2 extends Component {
  static arrBoxofficeData = null;

  constructor(props) {
    super(props);
    this.ldrMovieData = new MovieDataLoader();
  }

  drawBoxOfficeList(arrBoxOfficeData) {
    let nFirst = 0;
    let divTest = document.getElementById("test");

    if (arrBoxOfficeData != null) {
      for (nFirst = 0; nFirst < arrBoxOfficeData.length; nFirst++) {
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
        divTitle.innerHTML = "<" + objBOData.movie_title + ">";
        // movie actor
        let divActor = document.createElement("div");
        divActor.className = "actor_div";
        divActor.innerHTML = objBOData.open_year.replace(/-/gi, ".");
        // review
        let divReview = document.createElement("div");
        let reviewTitle = document.createElement("div");
        let reviewId = document.createElement("div");
        let reviewContext = document.createElement("div");
        divReview.className = "review_div";
        reviewTitle.className = "review_title";
        reviewId.className = "review_id";
        reviewContext.className = "review_context";
        reviewTitle.innerHTML = '"리뷰1 한국인의 어쩌고 저쩌고"';
        reviewId.innerHTML = 'abcd****';
        reviewContext.innerHTML = '가나다라 마바사 아자차카 타파하';

        divImage.appendChild(imgPoster);
        divMovie.appendChild(divImage);
        divReview.appendChild(reviewTitle);
        divReview.appendChild(reviewId);
        divReview.appendChild(reviewContext);

        divInfo.appendChild(divTitle);
        divInfo.appendChild(divActor);
        divInfo.appendChild(divReview);
        divMovie.appendChild(divInfo);

        divMovie.id = "rdiv";
        divImage.id = "Ldiv";
        divInfo.id = "Rdiv";

        divTest.appendChild(divMovie);
      }
    }
  }

  getBoxofficeList(bDaily) {
    let objThis = this;

    this.ldrMovieData.search_condition.item_per_page = 5;
    this.ldrMovieData.search_condition.is_daily = bDaily;
    this.ldrMovieData.search_condition.nation_section = this.ldrMovieData.ALL;
    //this.ldrMovieData.search_condition.product_year = "2017";
    //this.ldrMovieData.search_condition.movie_title = "백두산";

    this.ldrMovieData
      .getBoxOfficeListWithPoster()
      .then(function(arrBOData) {
        if (arrBOData != null) {
          console.log("리스트 목록 길이 : " + arrBOData.length);
          for (const m in arrBOData) {
            console.log(m);
          }
          objThis.drawBoxOfficeList(arrBOData);
        }
      })
      .catch(function(e) {
        console.log("Error Massage : " + e);
      });
  }

  componentDidMount() {
    this.getBoxofficeList(true);
  }

  render() {
    return <div id="test"></div>;
  }
}

export default Menu2;
