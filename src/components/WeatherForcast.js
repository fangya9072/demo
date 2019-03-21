import React, { Component } from 'react';
import styled from 'styled-components/native';
import { withNavigation } from 'react-navigation';
import { COLORS } from '../constant/color';

/* 
weather forcast Component 
provide general weather information from Open Weather API call
*/

class WeatherForcast extends React.Component {
	// set up state
	constructor(props) {
		super(props);
		this.state = {
			forcastType: 'hour',
			dayForcastVisible: true,
			hourForcastVisible: false,
			city: {
				name: 'Chapel Hill',
				weatherType: 'Rain',
				minTemperature: 45,
				maxTemperature: 60,
				currentTemperature: 55,
			},
			/*  
			daily forcast below are only for test purpose
			make API call to Open Weather API to get daily forcast
			provide forcast for the next 7 days
			*/
			dailyForcast: [
				{ id: 1,
				  icon: '',
				  weatherType: 'Rain',
				  minTemperature: 46,
				  maxTemperature: 61,
				  weekday: 'Fri',
				  date: '11', },
			    { id: 2,
				  icon: '',
				  weatherType: 'Sunny',
				  minTemperature: 45,
				  maxTemperature: 55,
				  weekday: 'Sat',
				  date: '12', },
				{ id: 3,
				  icon: '',
				  weatherType: 'Sunny',
				  minTemperature: 52,
				  maxTemperature: 62,
				  weekday: 'Sun',
				  date: '13', },
				{ id: 4,
				  icon: '',
				  weatherType: 'Rain',
				  minTemperature: 42,
				  maxTemperature: 61,
				  weekday: 'Mon',
				  date: '14', },
				{ id: 5,
				  icon: '',
				  weatherType: 'Rain',
				  minTemperature: 47,
				  maxTemperature: 62,
				  weekday: 'Tue',
				  date: '15', },
				{ id: 6,
				  icon: '',
				  weatherType: 'Sunny',
			   	  minTemperature: 51,
				  maxTemperature: 68,
				  weekday: 'Sat',
				  date: '16', },
				{ id: 7,
				  weatherType: 'Sunny',
				  minTemperature: 53,
				  maxTemperature: 67,
				  weekday: 'Sat',
				  date: '17', },
			],
			/*  
			hourly forcast below are only for test purpose
			make API call to Open Weather API to get hourly forcast
			provide forcast for the next 24 hours
			*/
			hourlyForcast: [
				{ id: 1,
				  icon: '',
				  weatherType: 'Rain',
				  temperature: 46,
				  time: 'Now', },
				{ id: 2,
				  icon: '',
				  weatherType: 'Rain',
				  temperature: 46,
				  time: '11AM', },
				{ id: 3,
				  icon: '',
				  weatherType: 'Rain',
				  temperature: 46,
				  time: '12PM', },
				{ id: 4,
				  icon: '',
				  weatherType: 'Rain',
				  temperature: 46,
				  time: '1PM', },
				{ id: 5,
				  icon: '',
				  weatherType: 'Rain',
				  temperature: 46,
				  time: '2PM', },
				{ id: 6,
				  icon: '',
				  weatherType: 'Rain',
				  temperature: 46,
				  time: '3PM', },
				{ id: 7,
				  icon: '',
				  weatherType: 'Rain',
				  temperature: 46,
				  time: '4PM', },
				{ id: 8,
				  icon: '',
				  weatherType: 'Rain',
				  temperature: 46,
				  time: '5PM', },
				{ id: 9,
				  icon: '',
				  weatherType: 'Rain',
				  temperature: 46,
				  time: '6PM', },
				{ id: 10,
				  icon: '',
				  weatherType: 'Rain',
				  temperature: 46,
				  time: '7PM', },
				{ id: 11,
				  icon: '',
				  weatherType: 'Rain',
				  temperature: 46,
				  time: '8PM', },
				{ id: 12,
				  icon: '',
				  weatherType: 'Rain',
				  temperature: 46,
				  time: '9PM', },
				{ id: 13,
				  icon: '',
				  weatherType: 'Rain',
				  temperature: 46,
				  time: '10PM', },
				{ id: 14,
				  icon: '',
				  weatherType: 'Rain',
				  temperature: 46,
				  time: '11PM', },
				{ id: 15,
				  icon: '',
				  weatherType: 'Rain',
				  temperature: 46,
				  time: '12AM', },
				{ id: 16,
				  icon: '',
				  weatherType: 'Rain',
				  temperature: 46,
				  time: '1AM', },
				{ id: 17,
				  icon: '',
				  weatherType: 'Rain',
				  temperature: 46,
				  time: '2AM', },
				{ id: 18,
				  icon: '',
				  weatherType: 'Rain',
				  temperature: 46,
				  time: '3AM', },
				{ id: 19,
				  icon: '',
				  weatherType: 'Rain',
				  temperature: 46,
				  time: '4AM', },
				{ id: 20,
				  icon: '',
				  weatherType: 'Rain',
				  temperature: 46,
				  time: '5AM', },
				{ id: 21,
				  icon: '',
				  weatherType: 'Rain',
				  temperature: 46,
				  time: '6AM', },
				{ id: 22,
				  icon: '',
				  weatherType: 'Rain',
				  temperature: 46,
				  time: '7AM', },
				{ id: 23,
				  icon: '',
				  weatherType: 'Rain',
				  temperature: 46,
				  time: '8AM', },
				{ id: 24,
				  icon: '',
				  weatherType: 'Rain',
				  temperature: 46,
				  time: '9AM', },
			],
		};
	}
	//rendering
	render(){
		return(
			<ForcastContainer>
				{/* 
				make API call to Open weather API to get real current city weather info
				set retrived weather info as this.state.city.[property]
				*/}
				<CityName>
					<CityNameText> {this.state.city.name} </CityNameText>
				</CityName>
				<CurrentWeather>
					<WeatherType>
						<WeatherTypeText> {this.state.city.weatherType} </WeatherTypeText>
					</WeatherType>
					<TemperetureRange>
						<TemperatureRangeText> {this.state.city.minTemperature}° | {this.state.city.maxTemperature}° </TemperatureRangeText>
					</TemperetureRange>
					<Temperature>
					    <TemperatureText> {this.state.city.currentTemperature}° </TemperatureText>
					</Temperature>
				</CurrentWeather>
				
				<ForcastArea>
					<ForcastTypePicker> 
						<ButtonArea style={{ alignItems: 'flex-end' }}> 
							<Button onPress={() => this.setState({forcastType: 'day', dayForcastVisible: true, hourForcastVisible: false})}>
								<ButtonText> Day </ButtonText>
							</Button>
						</ButtonArea> 
						<ButtonArea style={{ alignItems: 'flex-start' }}> 
							<Button onPress={() => this.setState({forcastType: 'hour', dayForcastVisible: false, hourForcastVisible: true})}>
								<ButtonText> Hour </ButtonText>
							</Button>
						</ButtonArea> 
					</ForcastTypePicker>
					<ForcastContent>
						{this.state.dayForcastVisible && <Forcast horizontal={true}> 
						    {/* 
							make API call to Open weather API to get real daily forcast 
							set retrived daily forcast into this.state.dailyForcast
							replace require('../../assets/icon/weather-icon/sun.png') with { uri: item.icon } after setting up state 
							find better weather icons!
							*/}
							{this.state.dailyForcast.map((item, key) => {
								return (
									<Day key={key}>
										<DayForcastInfo>
											<DayWeatherIconArea><DayWeatherIcon source={require('../../assets/icon/weather-icon/sun.png')} /></DayWeatherIconArea>
											<DayWeatherRange><DayWeatherRangeText> {item.minTemperature}° {item.maxTemperature}° </DayWeatherRangeText></DayWeatherRange>
										</DayForcastInfo>
										<Weekday><WeekdayText> {item.weekday} </WeekdayText></Weekday>
										<Date><DateText> {item.date} </DateText></Date>
									</Day>
				        		);
							})}
						</Forcast>}
						{this.state.hourForcastVisible && <Forcast horizontal={true}> 
						    {/* 
							make API call to Open weather API to get real hourly forcast 
							set retrived hourly forcast into this.state.hourlyForcast
							replace require('../../assets/icon/weather-icon/sun.png') with { uri: item.icon } after setting up state 
							find better weather icons!
							*/}
							{this.state.hourlyForcast.map((item, key) => {
								return (
									<Hour key={key}>
										<HourForcastInfo>
										    <HourTemperature><HourTemperatureText> {item.temperature}° </HourTemperatureText></HourTemperature>
										    <HourWeatherIconArea><HourWeatherIcon source={require('../../assets/icon/weather-icon/sun.png')} /></HourWeatherIconArea>
										</HourForcastInfo>
										<Time><TimeText> {item.time} </TimeText></Time>
									</Hour>
				        		);
							})}
						</Forcast>}
					</ForcastContent>
				</ForcastArea>
			</ForcastContainer>
		);
	}
}

export default withNavigation(WeatherForcast);

// css
const ForcastContainer = styled.View`
    height: 90%;
	width: 95%;
	left:  2.5%;
	top: 5%;
	padding: 7.5px 10px;
	background-color: aliceblue;
	border-radius: 25px;
	flex-direction: column;
`;

const CityName = styled.View`
	flex: 2;
	overflow: hidden;
	align-items: center;
`;

const CityNameText = styled.Text`
	font-size: 17.5px;
	font-family: Courier;
	font-weight: bold;
`;

const CurrentWeather = styled.View`
	flex: 1;
	overflow: hidden;
	flex-direction: row;
	border-bottom-width: 1;
	border-bottom-color: gray;
`;

const WeatherType = styled.View`
	flex: 1;
	align-items: flex-start;
`;

const WeatherTypeText = styled.Text`
	font-size: 15px;
	font-family: Courier;
`;

const TemperetureRange = styled.View`
	flex: 1;
	align-items: center;
`;

const TemperatureRangeText = styled.Text`
	font-size: 12.5px;
	font-family: Courier;
	color: gray;
`;

const Temperature = styled.View`
	flex: 1;
	align-items: flex-end;
`;


const TemperatureText = styled.Text`
    font-size: 12.5px;
    font-family: Courier;
`;

const ForcastArea = styled.View`
	flex: 8;
	overflow: hidden;
`;

const ForcastTypePicker = styled.View`
	height: 25%;
	width: 100%;
	flex-direction: row;
`;

const ButtonArea = styled.View`
	flex: 1
`;

const Button = styled.TouchableOpacity`
	height: 70%;
	width: 50%;
	top: 15%;
	align-items: center;
	justify-content: center;
	background-color: skyblue;
	border: 2.5px aliceblue;
	border-radius: 5px;
`;

const ButtonText = styled.Text`
    font-size: 12.5px;
    font-family: Courier;
`;

const ForcastContent = styled.View `
	flex: 1;
`;

const Forcast = styled.ScrollView `
	flex: 1;
`;

const Day = styled.View `
	width: 47.5px;
	height: 100%;
	flex-direction: column;
	align-items: center;
`;

const DayForcastInfo = styled.View `
	flex: 6;
	flex-direction: column;
	align-items: center;
`;

const DayWeatherIconArea = styled.View `
	flex: 2;
	align-items: center;
	justify-content: center;
`;

const DayWeatherIcon = styled.Image `
	width: 30px;
	height: 30px;
`;

const DayWeatherRange = styled.View `
	flex: 1;
	align-items: center;
`;

const DayWeatherRangeText = styled.Text `
	font-size: 10px;
	font-family: Courier;
	color: gray;
`;

const Weekday = styled.View `
	flex: 1;
	align-items: center;
`;

const WeekdayText = styled.Text `
    font-size: 10px;
	font-family: Courier;
	color: black;
`;

const Date = styled.View `
	flex: 1;
	align-items: center;
`;

const DateText = styled.Text `
    font-size: 10px;
	font-family: Courier;
	color: gray;
`;

const Hour = styled.View `
	width: 42.5px;
	height: 100%;
	flex-direction: column;
	align-items: center;
`;

const HourForcastInfo = styled.View `
	flex: 5;
`;

const Time = styled.View `
	flex: 1;
	align-items: center;
`;

const TimeText = styled.Text `
    font-size: 10px;
	font-family: Courier;
	color: black;
`;

const HourTemperature = styled.View `
	flex: 1;
	align-items: center;
`;

const HourTemperatureText = styled.Text `
	font-size: 12.5px;
	font-family: Courier;
	padding-top: 10px;
	color: black;
`;

const HourWeatherIconArea = styled.View `
	flex: 2;
	align-items: center;
	padding-top: 10px;
`;

const HourWeatherIcon = styled.Image `
	width: 25px;
	height: 25px;
`;