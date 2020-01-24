import React, { Component } from 'react';
import "./MovieDetailPopup.css"

class MovieDetailPopup extends Component {
  
  render()
  {
    return (
      <div className="popup">
        <div className="popup_inner" id="div_movie_detail">
            {/* 영화 정보 및 닫기 버튼 */}
            <div>
              <div className="movie_info">
                영화정보
              </div>
              <div className="close_button">
                <button className="button" onClick={this.props.closePopup}>X</button>
              </div>
            </div>
            {/* 포스터 및 정보들 */}
            <div className="context">
              {/* 포스터 */}
              <div>
                <img className="image" src={this.props.movie_data.poster_url} alt={this.props.movie_data.movie_title}/>
              </div>
              {/* 상세정보 */}
              <div className="info">
                <div className="title">
                  {this.props.movie_data.movie_title}
                </div>
                <div>
                  <div className="open">
                    개봉일
                  </div>
                  <div className="open_year">
                    {this.props.movie_data.open_year}
                  </div>
                </div>
                <div>
                  <div className="actor">
                    출연진
                  </div>
                  <div className="actor_text">
                    {this.props.movie_data.actors_text}
                  </div>
                </div>
                <div>
                  <div className="genres">
                    장르
                  </div>
                  <div className="genres_text">
                    {this.props.movie_data.genres_text}
                  </div>
                </div>
                <div>
                  <div className="nations">
                    국가
                  </div>
                  <div className="nations_text">
                    {this.props.movie_data.nations}
                  </div>
                </div>
              </div>
            </div>
            {/* 줄거리 */}
            <div>
              <div className="plot">
                줄거리
              </div>
              <div id = 'realplot'>
                {this.props.movie_data.plot}
              </div>
            </div>
        </div>
      </div>
    );
  }
}

export default MovieDetailPopup;