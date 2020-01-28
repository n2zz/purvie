import React, { Component } from 'react';
import MoiveDataCrawler from './loader/MoiveDataCrawler';
import MovieDetailPopup from './MovieDetailPopup';
import './App.css'
import { trackPromise } from 'react-promise-tracker';
import InfiniteScroll from 'react-infinite-scroller';

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
    this.genre = "";
    this.scrollParentRef = null;
    this.current_page = 1;
    this.hdlAddListTimer = null;

    // 팝업 화면 노출 여부와 값
    this.state = {
      showPopup:false
      , hasMore : false
      , movie_data : {}
    };
  }

  /**
   * 팝업을 띄우거나/닫는다.
   */
  togglePopup()
  {
    // 팝업 시 부모 스크롤 방지
    if(!this.state.showPopup)
    {
      document.body.style.overflow = "hidden";
    }
    else
    {
      document.body.style.overflow = "auto";
    }

    // 팝업 노출 여부 상태값 변경
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
  getList(bAddList)
  {
    const THIS = this;
    let strGenre = THIS.genre;
    
    if(strGenre != null && strGenre !== "")
    {  
      this.ldrMovieData.search_condition.genre = strGenre;
    }
    this.ldrMovieData.search_condition.item_per_page = 9;
    this.ldrMovieData.search_condition.current_page = THIS.current_page;
    this.ldrMovieData.getMovieList().then(function(arrMovieData)
      {
        THIS.drawMovieList(arrMovieData, bAddList);
      }
    );
  }

  /**
   * 추가 영화 목록을 요청한다.
   */
  loadMoreMovieList()
  {
    this.current_page++;
    this.getList(true);
  }
  
  /**
   * 스크롤 위치가 가장 하단인 경우 추가 영화 목록을 요청한다.
   */
  handleOnScroll()
  {
    const THIS = this;

    var scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
    var scrollHeight = (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;
    var clientHeight = document.documentElement.clientHeight || window.innerHeight;
    var scrolledToBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight;

    if(scrollTop > 500)
    {
      THIS.showClickTopButton();
    }
    else
    {
      THIS.hiddenClickTopButton();
    }
    
    if(scrolledToBottom)
    {
      THIS.hdlAddListTimer = setTimeout(function()
        { 
          THIS.setState(
            {
              hasMore : true
            }
          );
        }
        , 500
      );
    }
  }

  /**
   * 맨위로 버튼을 노출한다.
   */
  showClickTopButton()
  {
    // 맨위로 버튼을 숨긴다.
    let divClickTop = document.getElementById("div_click_top");
    divClickTop.addEventListener("click", function(){window.scrollTo(0, 0);})
    divClickTop.style.display = "";
  }

  /**
   * 맨위로 버튼을 숨긴다.
   */
  hiddenClickTopButton()
  {
    // 맨위로 버튼을 숨긴다.
    let divClickTop = document.getElementById("div_click_top");
    divClickTop.style.display = "none";
  }
  /**
   * component가 완전히 마운트 된 경우 호출 함수
   * 넘겨받은 파라미터 값을 참고하여 결과를 출력한다.
   *  - genre : 장르
   */
  componentDidMount() {
    this.hiddenClickTopButton();
    window.addEventListener('scroll', this.handleOnScroll.bind(this));
    this.genre = this.props.match.params.genre;
    this.getList(false);
  }

  /**
   * 화면에 state 값이 바뀌면 호출되는 함수
   * @param {} nextProps 
   */
  componentDidUpdate(nextProps) 
  {
    if(this.props.match.params.genre != null
      && this.props.match.params.genre !== ""
      && this.props.match.params.genre !== this.genre)
    {
      this.hiddenClickTopButton();

      // 이전 리스트 요청을 취소한다.
      if(this.hdlAddListTimer != null)
      {
        clearTimeout(this.hdlAddListTimer);
        this.hdlAddListTimer = null;
      }
      // 화면을 최상단으로 이동한다.
      window.scrollTo(0, 0);
      this.current_page = 1;
      this.genre = this.props.match.params.genre;
      this.getList(false);
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
        <div className="movie_infinite_list">
          <InfiniteScroll
            pageStart={0}
            loadMore={this.loadMoreMovieList.bind(this)}
            hasMore={this.state.hasMore}
            useWindow={false}
          >
            <div id="div_movie_list">
            </div>
          </InfiniteScroll>
        </div>
        <div className="app_click_top" id="div_click_top">
          맨위로
        </div>
      </div>
    );
  }
}
export default App;