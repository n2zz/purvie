import React, { Component } from 'react';
import Crawling from './Crawling';
import "./MovieDetailPopup.css"

class MovieDetailPopup extends Component {
  /**
   * 출력될 화면 HTML 및 로직
   */
  componentDidMount(){
      let hd = new Crawling();
      var divPlot = document.getElementById("plot");
      hd.getPlot().then(
        function(response)
        {
          if(response != null)
          {
            response.forEach(function(objPlot, i)
              {
                let divPL=document.createElement("div");
                let strPL = objPlot.line;
                divPL.innerHTML=strPL;
                divPlot.appendChild(divPL);

              })
          }
        });
      }

  render()
  {
    return (
      <div className="popup">
        <div className="popup_inner" id="div_movie_detail">
            {/* 영화 정보 및 닫기 버튼 */}
            <div>
              <div>
                영화정보
              </div>
              <div>
                <button onClick={this.props.closePopup}>close me</button>
              </div>
            </div>
            {/* 포스터 및 정보들 */}
            <div>
              {/* 포스터 */}
              <div>
                <img width="160px" height="240px" src={this.props.movie_data.poster_url}/>
              </div>
              {/* 상세정보 */}
              <div>
                <div>
                  <div>
                    {this.props.movie_data.movie_title}
                  </div>
                  <div>
                    {this.props.movie_data.open_year}
                  </div>
                </div>
                <div>
                  <div>
                    출연진
                  </div>
                  <div>
                    {this.props.movie_data.ators_text}
                  </div>
                </div>
                <div>
                  <div>
                    장르
                  </div>
                  <div>
                    {this.props.movie_data.genres_text}
                  </div>
                </div>
                <div>
                  <div>
                    국가
                  </div>
                  <div>
                    {this.props.movie_data.nations}
                  </div>
                </div>
              </div>
            </div>
            {/* 줄거리 */}
            <div>
              <div id = "plot">
                줄거리
              </div>
              <div>
                
              </div>
            </div>
        </div>
      </div>
    );
  }
}

export default MovieDetailPopup;