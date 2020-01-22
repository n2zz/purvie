import React, { Component } from 'react';
import MovieDataLoader from './loader/MovieDataLoader';
import MovieDetailPopup from './MovieDetailPopup';
import './App.css'
import { trackPromise } from 'react-promise-tracker';
import GetNaverAPISearch from "./loader/GetNaverAPISearch";

class App extends Component {
  static arrBoxofficeData = null;
  /**
   * 생성자
   * @param {} props 
   */
  constructor(props)
  {
    super(props);
    this.ldrMovieData = new MovieDataLoader();
    this.arrBoxOfficeData = null; 
    this.current_page = 1;
    this.genre = "";
    // 팝업 화면 노출 여부와 값
    this.state = {
      showPopup:false
      , click_popup_button : false
      , movie_data : {}
    };
  }
  togglePopup()
  {
    this.setState({
      click_popup_button : true
      , showPopup:!this.state.showPopup
    });
  }
  /**
   * 박스오피스 결과를 화면에 출력한다.
   * @param {*} arrBoxOfficeData 
   * @param {*} bAddList : 추가 리스트 여부(true: 같은 장르 추가 리스트 요청, false : 다른 장르 새리스트 요청)
   */
  drawBoxOfficeList(arrBoxOfficeData, bAddList)
  {
    const THIS = this;
    let nFirst = 0;
    let divMovieList = document.getElementById("div_movie_list");
    if(!bAddList)
    {
      while ( divMovieList.hasChildNodes() ) 
      { 
        divMovieList.removeChild( divMovieList.firstChild ); 
      }
    }
    
    if(arrBoxOfficeData != null)
    {
      for(nFirst = 0; nFirst < arrBoxOfficeData.length; nFirst++)
      {
        let divMovie = document.createElement("div");
        let imgPoster = new Image();
        let strMovieID = arrBoxOfficeData[nFirst].movie_id;
        // 스타일 적용
        divMovie.className = "movie_div";
        imgPoster.className = "img_poster"
        imgPoster.src = arrBoxOfficeData[nFirst].poster_url;
        divMovie.addEventListener("click", function(){THIS.getInfo(strMovieID);});
        
        divMovie.appendChild(imgPoster);
        divMovieList.appendChild(divMovie);
      }
    }
  }
  /**
   * 영화 상세정보를 출력한다.
   * @param {}} objMovieData 
   */
  drawMovieInfo(objMovieData)
  {
    const THIS = this;
    THIS.state.movie_data = objMovieData;
    THIS.togglePopup();
  }
  
  /**
   * 영화 목록을 가져온다.
   */
  getMovieList(strGenre)
  {
    let objThis = this;
    let bAddList = false;               // 같은 장르 추가 요청 여부
    this.ldrMovieData.search_condition.item_per_page = 5;
    this.ldrMovieData.search_condition.current_page = this.current_page;
    this.ldrMovieData.search_condition.nation_section = this.ldrMovieData.ALL;
    
    
    if(this.ldrMovieData.search_condition.genre !== strGenre)
    {
      this.ldrMovieData.search_condition.genre = strGenre;
      this.genre = strGenre;
    }
    /*
    else
    {
      bAddList = true;
    }*/
    let divMovieList = document.getElementById("div_movie_list");
    if(divMovieList != null)
    {
      while ( divMovieList.hasChildNodes() ) 
      { 
        divMovieList.removeChild( divMovieList.firstChild ); 
      }
    }

    trackPromise(
      this.ldrMovieData.getMovieListWithPoster().then(
          function(arrBOData)
          {
            if(arrBOData != null)
            {
              objThis.drawBoxOfficeList(arrBOData, bAddList);
            }
          }
      ).catch(function(e)
          {
            console.log("Error Massage : " + e);
          }
      )
    );
  }
  /**
   * 박스오피스 목록을 가져온다.
   */
  getBoxofficeList(bDaily)
  {
    let objThis = this;
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
                arrBOData[m].product_year
              ).then(response => {
                if (response) arrBOData[m].naverId = response.split("=")[1];
              });
            }
            
            console.log("리스트 목록 길이 : " + arrBOData.length);
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
   * 영화 상세정보를 가져온다.
   * @param {}} strMovieID 
   */
  getInfo(strMovieID)
  {
    const THIS = this;
    
    trackPromise(
    THIS.ldrMovieData.getMovieInfoWithPoster(strMovieID).then(
      function(objMovieData)
      {
        if(objMovieData != null)
          {
            console.log(objMovieData.movie_title + ", " + objMovieData.product_year)
            //GetNaverMovie ID API
            GetNaverAPISearch(
              objMovieData.movie_title,
              objMovieData.product_year
            ).then(response => {
              if (response) objMovieData.naverId = response.split("=")[1];
        
              console.log("줄거리 아이디먼저 : " + objMovieData.naverId);
              THIS.drawMovieInfo(objMovieData);
            });
          }
      }
    ).catch(function(e)
      {
        console.log("Error Massage : " + e);
      }
    ));
  }

  /**
   * 영화목록을 가져온다.
   */
  getList()
  {
    let strGenre = this.props.match.params.genre;
    if(strGenre == null)
    {
      this.getMovieList(this.ldrMovieData.GENRES_LIST.COMEDY);
    }
    else
    {
      this.getMovieList(strGenre);
    }
  }
  /**
   * component가 완전히 마운트 된 경우 호출 함수
   * 넘겨받은 파라미터 값을 참고하여 결과를 출력한다.
   *  - genre : 장르
   */
  componentDidMount() {
    this.getList();
  }

  /**
   * 화면에 state 값이 바뀌면 호출되는 함수
   * @param {} nextProps 
   */

  componentDidUpdate(nextProps) 
  {
    let strGenre = this.props.match.params.genre;
    /*
    if(this.genre !== strGenre)
    {
      this.setState({
        click_popup_button : false
      });
    }
    */
    
    if(!this.state.click_popup_button)
    {
      console.log("request list");
      this.getList();
    }
  }
  /**
   * 출력될 화면 HTML 및 로직
   */
  render()
  {
    return (
      <div className="div_app_main">
        {
          this.state.showPopup ?
            <MovieDetailPopup
              movie_data={this.state.movie_data}
              closePopup={this.togglePopup.bind(this)}/> 
            : null
        }
        <div id="div_movie_list">
        </div>
      </div>
    );
  }
}
export default App;