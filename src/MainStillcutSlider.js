import React, { Component } from "react";
import Slider from "react-slick";
import MovieDataLoader from './loader/MovieDataLoader'

class MainStillcutSlider extends Component {
    constructor(props)
    {
        super(props);
        this.ldrMovieData = new MovieDataLoader();
    }
    
    /**
   * 박스오피스 목록을 가져온다.
   */
    getBoxofficeList()
    {
        const THIS = this;
        THIS.ldrMovieData.search_condition.item_per_page = 5;
        THIS.ldrMovieData.search_condition.is_daily = true;
        THIS.ldrMovieData.search_condition.nation_section = THIS.ldrMovieData.ALL;

        THIS.ldrMovieData.getBoxOfficeListWithPoster().then(
            function(arrBOData)
            {
                if(arrBOData != null)
                {
                    let objSlider = document.getElementById("bo_stillcut_slider");
                    arrBOData.forEach(
                        function(objMovieData, nIndex)
                        {
                            console.log("insert stillcut : " + nIndex);
                            let divStillcut = document.getElementById("div_stillcut_" + nIndex);
                            
                            if(divStillcut != null)
                            {
                                console.log("div_stillcut_" + nIndex + " : " + objMovieData.stillcut_url);
                                let imgStillcut = new Image();

                                imgStillcut.src = objMovieData.stillcut_url;
                                
                                /*
                                imgStillcut.style.width = '1000px';
                                imgStillcut.style.height = '500px';*/

                                divStillcut.appendChild(imgStillcut);
                            }
                        }
                    );

                    console.log(objSlider);
                }
            }
        ).catch(function(e)
            {
            console.log("Error Massage : " + e);
            }
        );
    }

    componentDidMount() {
        this.getBoxofficeList();
    }

    render() {
        var settings = {
            dots: false,
            infinite: true,
            speed: 2000,
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay:true,
            autoplaySpeed:5000      // 자동스크롤 속도( 1000 : 1초 단위)
        };

        return (
        <>
            <link rel="stylesheet" type="text/css" charset="UTF-8"
            href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"/>
            <link rel="stylesheet" type="text/css"
            href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"/>
            <Slider {...settings} id="bo_stillcut_slider">
                <div id="div_stillcut_0"></div>
                <div id="div_stillcut_1"></div>
                <div id="div_stillcut_2"></div>
                <div id="div_stillcut_3"></div>
                <div id="div_stillcut_4"></div>
            </Slider>
            </>
        );
    }
}

export default MainStillcutSlider;
