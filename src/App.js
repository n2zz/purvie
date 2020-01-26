import React, { Component } from 'react';
import MoiveDataCrawler from './loader/MoiveDataCrawler';
import MovieDetailPopup from './MovieDetailPopup';
import './App.css'
import { trackPromise } from 'react-promise-tracker';

class App extends Component {
  static arrMoiveData = null;
  /**
   * 생성자
   * @param {} props 
   */
  constructor(props)
  {
    super(props);
    this.ldrMovieData = new MoiveDataCrawler();
    this.arrMoiveData = null; 
    this.current_page = 1;
    this.genre = "";
    // 팝업 화면 노출 여부와 값
    this.state = {
      showPopup:false
      , movie_data : {}
    };
  }
  togglePopup()
  {
    this.setState({
      showPopup:!this.state.showPopup
    });
  }
  /**
   * 영화 리스트를 화면에 출력한다.
   * @param {*} arrMoiveData 
   * @param {*} bAddList : 추가 리스트 여부(true: 같은 장르 추가 리스트 요청, false : 다른 장르 새리스트 요청)
   */
  drawMovieList(arrMoiveData, bAddList)
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
    
    if(arrMoiveData != null)
    {
      for(nFirst = 0; nFirst < arrMoiveData.length; nFirst++)
      {
        let divMovie = document.createElement("div");
        let imgPoster = new Image();
        let strMovieTitle = arrMoiveData[nFirst].movie_title;
        // 스타일 적용
        divMovie.className = "movie_div";
        imgPoster.className = "img_poster"
        imgPoster.src = arrMoiveData[nFirst].poster_url;
        divMovie.addEventListener("click", function(){THIS.getInfo(strMovieTitle, imgPoster.src);});
        
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
    THIS.setState(
      {
        movie_data : objMovieData
      }
    );
  }
  /**
   * 영화 상세정보를 가져온다.
   * @param {}} strMovieID 
   */
  getInfo(strMovieID, strPosterURL)
  {
    const THIS = this;
    
    THIS.togglePopup();
    
    trackPromise(
    THIS.ldrMovieData.getMovieInfoWithPoster(strMovieID, strPosterURL).then(
      function(objMovieData)
      {
        if(objMovieData != null)
          {
            THIS.drawMovieInfo(objMovieData);
          }
      }
    ).catch(function(e)
      {
        console.log("Error Massage : " + e);
      }
    ), 'detail-area');
  }

  /**
   * 영화목록을 가져온다.
   */
  getList()
  {
    const THIS = this;
    let strGenre = this.props.match.params.genre;
    
    if(strGenre != null && strGenre !== "")
    {  
      this.ldrMovieData.search_condition.genre = strGenre;
    }
    this.ldrMovieData.search_condition.item_per_page = 6;
    this.ldrMovieData.getMovieList().then(function(arrMovieData)
      {
        THIS.drawMovieList(arrMovieData);
      }
    );
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
    if(this.props.match.params.genre != null
      && this.props.match.params.genre !== "")
    {
      this.getList();
      this.props.match.params.genre = "";
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