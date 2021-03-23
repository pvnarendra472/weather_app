import React from "react";
import axios from "axios";
import moment from "moment";
import './index.css';
import { Row, Col, Container } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    FaCloud,
    FaBolt,
    FaCloudRain,
    FaCloudShowersHeavy,
    FaSnowflake,
    FaSun,
    FaSmog,
  } from 'react-icons/fa';


  function titleCase(str) {
    return str.toLowerCase().split(' ').map(function(word) {
      return word.replace(word[0], word[0].toUpperCase());
    }).join(' ');
  }

function Card(value) {
    var item = value.value;

    var dateTime = item.dt_txt + " UTC";

    var nDate = new Date(dateTime);

    var date = moment(nDate).format('MM.DD.YY');
    var time = moment(nDate).format('LT');
    var iconcode = item.weather[0].icon;

    var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";

    var temp = Math.round(item.main.temp - 273.15);
    return (
        <div style={{ textAlign: "center" }}>
            <p style={{"display":"inline"}}>{date}</p>
            <p style={{"display":"block"}}>{time}</p>
            <div id="icon"><img id="wicon" src={iconurl} alt="Weather icon" /></div>
            <p style={{"display":"block","fontSize":"20px"}}>{temp}</p>
            
        </div>)
}

const ListItem = ({ value, onClick }) => (
    <li className="card"><Card value={value}></Card></li>
);

const List = ({ items, onItemClick }) => (
    <ul className="forecast">
        {
            items.map((item, i) => <ListItem key={i} value={item} onClick={onItemClick} />)
        }
    </ul>
);

class Search extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            cityName: "",
            weatherList: [],
            returnedCity: "",
            returnedCountry: "",
            currentDateTime: "",
            dayCurrent: "",
            dayHigh: "",
            dayLow: "",
            dayRain: "",
            daySunRise: "",
            daySunSet: "",
            dayWind: "",
            dayCurrentCity: "",
            currentWeatherData: {}
        };

        this.handleSearchClick = this.handleSearchClick.bind(this);
        this.currentWeather = this.currentWeather.bind(this);

    }
    handleSearchClick(e) {
        e.preventDefault();
        e.stopPropagation();

        
        var city_name = this.state.cityName;
        var API_key = "55cc2e6a6be0c5ebc88db63a08b53817";
        //var url = $"http://api.openweathermap.org/data/2.5/weather?q={city_name}&appid={API_key}";

        //5 day hourly weather
        var url = "http://api.openweathermap.org/data/2.5/weather";


        var list = [];

        
        axios.get(url,{params:{q:city_name,appid:API_key}}).then(function (response) {
            // handle success
            console.log("Current weather is ", response.data);

            var data = response.data;
            var dayHigh = Math.round(data.main.temp_max - 273.15);
            var dayLow = Math.round(data.main.temp_min - 273.15);
            var dayCurrent = Math.round(data.main.temp - 273.15);
            var windSpeed = data.wind.speed;
            var sunRise = moment.utc(data.sys.sunrise*1000).format('HH:mm');
            var sunSet = moment.utc(data.sys.sunset*1000).format('HH:mm');
            var dayCurrentCity = data.name;

            this.setState({
                dayHigh: dayHigh,
                dayLow: dayLow,
                daySunRise: sunRise,
                daySunSet: sunSet,
                dayWind: windSpeed,
                dayCurrent: dayCurrent,
                dayCurrentCity: dayCurrentCity,
                currentWeatherData: data

            })


        }.bind(this)).catch(function (error) {
            // handle error
            console.log(error);
        })




        //get 5 day weather
        var fivedayurl ="http://api.openweathermap.org/data/2.5/forecast";

        axios.get(fivedayurl,{params:{q:city_name,appid:API_key}}).then(function (response) {
            // handle success
            list = response.data.list;
            var dateTime = moment().format('LL');

            this.setState({
                weatherList: list,
                returnedCity: response.data.city.name,
                returnedCountry: response.data.city.country,
                currentDateTime: dateTime
            });

        }.bind(this)).catch(function (error) {
            // handle error
            console.log(error);
        })


    }

    currentWeather() {
        var iconcode = "";
        var iconurl = "";
        var main="";
        var weatherIcon="";

        if (Object.keys(this.state.currentWeatherData).length != 0) {
           
            main=this.state.currentWeatherData.weather[0].main;
            if (main === 'Thunderstorm') {
                weatherIcon = <FaBolt size="3x"/>;
              } else if (main === 'Drizzle') {
                weatherIcon = <FaCloudRain size="3x"/>;
              } else if (main === 'Rain') {
                weatherIcon = <FaCloudShowersHeavy size="3x"/>;
              } else if (main === 'Snow') {
                weatherIcon = <FaSnowflake size="3x"/>;
              } else if (main === 'Clear') {
                weatherIcon = <FaSun size="3x"/>;
              } else if (main === 'Clouds') {
                weatherIcon = <FaCloud size="3x"/>;
              } else {
                weatherIcon = <FaSmog size="3x"/>;
              }
            iconcode = this.state.currentWeatherData.weather[0].icon;

            iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
        }


        if (this.state.dayCurrentCity == null || this.state.dayCurrentCity == "") {
            return null;
        }
        else {
            return (<div>
                
                    <Row>
                        <Col lg={3}>
                            <div id="icon" style={{ "width": "45%", "float": "left", }}>
                                {weatherIcon}
                            </div>
                            <div style={{ "margin-left": "50%" }}>
                                <div ><p style={{"fontSize":"110px","display":"inline"}}>{this.state.dayCurrent}<br/><span style={{"fontSize":"20px"}}>{titleCase(this.state.currentWeatherData.weather[0].description)}</span></p></div>
                            </div>
                        </Col>
                        
                        <Col lg={9} style={{"float":"right"}}   >

                            <div style={{"textAlign":"center"}}>
                                <Row>
                                    <Col sm={4} >
                                        <p style={{"display":"inline"}}>{this.state.dayHigh}</p><p style={{"display":"block"}}>High</p>
                                    </Col>
                                    <Col sm={4}>
                                        <p style={{"display":"inline"}}>{this.state.dayWind}</p><p style={{"display":"block"}}>Wind</p>
                                    </Col>
                                    <Col sm={4}>
                                        <p style={{"display":"inline"}}>{this.state.daySunRise}</p><p style={{"display":"block"}}>Sunrise</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm={4}>
                                        <p style={{"display":"inline"}}>{this.state.dayLow}</p><p style={{"display":"block"}}>Low</p>
                                    </Col>
                                    <Col sm={4}>
                                        
                                    </Col>
                                    <Col sm={4}>
                                        <p style={{"display":"inline"}}>{this.state.daySunSet}</p><p style={{"display":"block"}}>Sunset</p>
                                    </Col>
                                </Row>

                            </div>
                        </Col>
                    </Row>

                
            </div>
            )
        }

    }



    render() {
        return (
            <div>
                <Container>
                <div style={{ marginLeft: "auto", marginRight: "auto", display: "block", width: "15em" }} >
                    <input type="text" value={this.state.cityName} id="searchCity" onChange={(e) => { this.setState({ cityName: e.target.value }) }} />
                    <button onClick={this.handleSearchClick}>Search</button>
                </div>

                <div style={{ marginLeft: "50px", height: "auto" }}>
                    <h1>{this.state.returnedCity} &nbsp;{this.state.returnedCountry}</h1>
                    <h3>{this.state.currentDateTime}</h3>
                </div>

                <br />

                <div style={{ marginLeft: "200px", height: "auto" }} id="totalWeather">
                    {this.currentWeather()}
                </div>

                <div className="Scroll">

                    <List items={this.state.weatherList} onItemClick={this.handleItemClick} />

                </div>
                </Container>

            </div>)
    }
}


export default Search;