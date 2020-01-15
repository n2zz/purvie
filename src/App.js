import React, { Component } from 'react';
import MovieDataLoader from './loader/MovieDataLoader';

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
  }

  /**
   * 박스오피스 결과를 화면에 출력한다.
   * @param {*} arrBoxOfficeData 
   */
  drawBoxOfficeList(arrBoxOfficeData)
  {
    let nFirst = 0;
    let strHTML = "";
    let divTest = document.getElementById("test");
    
    if(arrBoxOfficeData != null)
    {
      for(nFirst = 0; nFirst < arrBoxOfficeData.length; nFirst++)
      {
        strHTML = strHTML + "<div style='float:left;padding:2.8em 0em 0em 2.8em;'><img style='width:160px;height:250px;' src='" + arrBoxOfficeData[nFirst].poster_url + "'/></div>";
      }
    }
    divTest.innerHTML = strHTML;
  }

  /**
   * 영화 상세정보를 출력한다.
   * @param {}} objMovieData 
   */
  drawMovieInfo(objMovieData)
  {
    /*
    console.log("Draw Movie Info..");
    let strHTML = "";
    let divTest = document.getElementById("test");
    let divTop = document.createElement("div");
    let divTopLeft = document.createElement("div");
    let divTopRight = document.createElement("div");
    let divInfos = document.createElement("div");
    let imgPoster = new Image();

    imgPoster.src = objMovieData.poster_url;

    // 포스터
    //divTop
    divTopLeft.appendChild(imgPoster);
    divTest.appendChild(divTopLeft);
    divTest.appendChild(divTop);*/
  }
  
  /**
   * 영화 목록을 가져온다.
   */
  getMovieList(strGenre)
  {
    let objThis = this;

    this.ldrMovieData.search_condition.item_per_page = 7;
    this.ldrMovieData.search_condition.current_page = this.current_page;
    this.ldrMovieData.search_condition.nation_section = this.ldrMovieData.ALL;
    this.ldrMovieData.search_condition.genre = strGenre;
    //this.ldrMovieData.search_condition.product_year = "2017";
    //this.ldrMovieData.search_condition.movie_title = "백두산";

    this.ldrMovieData.getMovieListWithPoster().then(
        function(arrBOData)
        {
          if(arrBOData != null)
          {
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
    let objThis = this;

    this.ldrMovieData.getMovieInfoWithPoster(strMovieID).then(
      function(objMovieData)
      {
        objThis.drawMovieInfo(objMovieData);
      }
    ).catch(function(e)
      {
        console.log("Error Massage : " + e);
      }
    );
  }

  getList()
  {
    let strGenre = this.props.match.params.genre;

    if(strGenre === 'daily' || strGenre == null)
    {
      this.getBoxofficeList(true);
    }
    else if(strGenre === 'weekly')
    {
      this.getBoxofficeList(false);
    }
    else
    {
      this.getMovieList(strGenre);
    }
  }
  /**
   * component가 완전히 마운트 된 경우 호출 함수
   * 넘겨받은 파라미터 값을 참고하여 결과를 출력한다.
   *  - section : boxoffice / movie
   *  - genre : 장르
   */
  componentDidMount() {
    this.getList();
  }

  componentDidUpdate(nextProps) 
  {
    this.getList();
  }

  /**
   * 출력될 화면 HTML 및 로직
   */
  render()
  {
    return (
      <div>
        <div id="test">
        </div>
      </div>
    );
  }
}

export default App;