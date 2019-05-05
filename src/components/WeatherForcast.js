import React from 'react';
import styled from 'styled-components/native';
import { withNavigation } from 'react-navigation';
import { Location, Permissions } from 'expo';
import { ICONS } from '../constant/icon';
import { Alert, Linking } from 'react-native';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/* 
weather forcast Component 
provide general weather information from Weather API call
*/

class WeatherForcast extends React.Component {


	constructor(props) {
		super(props); // parent should have cityName and cityForcast props passed from parent(WeatherScreen.js) to this component
		this.state = {
			forcastType: 'day',
			dayForcastVisible: true,
			hourForcastVisible: false,
			/*  
			make API call to Weather API to get daily forcast
			provide forcast for the next 7 days
			weatherType is restricted to 'sunny', 'rainy', 'windy', 'cloudy', 'fog', 'snow', 'storm' 
			*/
			dailyForcast: [],
			/*  
			make API call to Weather API to get hourly forcast
			provide forcast for the next 24 hours
			weatherType is restricted to 'sunny', 'rainy', 'windy', 'cloudy', 'fog', 'snow', 'storm' 
			timeType is restricted to 'Day', 'Night', depending on sunset/sunrise time
			*/
			hourlyForcast: [],
		};
	}

	typeConverter(str) {
		if (str == 'clear-day') {
			return 'sunny';
		}
		else if (str == 'rain') {
			return 'rainy';
		}
		else if (str == 'thunderstorm') {
			return 'storm';
		}
		else if (str == 'wind') {
			return 'windy';
		}
		else if (str == 'clear-night') {
			return 'sunny';
		}
		else {
			return 'cloudy';
		}
	}

	nightConverter(str) {
		let words = str.split("-");
		if (words[(words.length) - 1] == 'day') {
			return 'Day';
		} else {
			return 'Night';
		}
	}

	timeConverter = async (time) => {
		let timeInfo = fetch('https://helloacm.com/api/unix-timestamp-converter/?cached&s=' + time).then(response => response.json());
		let hourInfo = timeInfo.substr(11, 12);
		return Number(hourInfo);
	}

	hourConverter(time) {
		if (time < 12) {
			return time.toString() + 'AM';
		}
		else {
			let hour = (time - 12).toString();
			return hour + 'PM';
		}
	}

	dateConverter = async (time) => {
		let tt = new Date(time * 1000);   
		let d = tt.getDate();
		return d.toString();
	}

	dayConverter = async (date) => {
		let t = new Date(date * 1000);
		let tmp = t.getDay();
		return days[tmp];

	}

	getCurrentLocation = async () => {

		let { status } = await Permissions.askAsync(Permissions.LOCATION);
		if (status !== 'granted') {
			Alert.alert(
				'Please Allow Access',
				[
					'This applicaton needs access to your current location.',
					'\n',
					'Please go to Settings of your device and grant permissions to Location Service.',
				].join(''),
				[
					{ text: 'Not Now', style: 'cancel' },
					{ text: 'Settings', onPress: () => Linking.openURL('app-settings:') },
				],
			);
		}
		let location = await Location.getCurrentPositionAsync({}); // get coordinates of current location
		let lat = location.coords.latitude;
		let log = location.coords.longitude;
		let weather = await fetch('https://api.darksky.net/forecast/8c2568f00f593c6a4c4125d386af88f5/' + lat + ',' + log).then(response => response.json());
		this.setState({
			dailyForcast: [
				{
					id: 1,
					icon: '',
					weatherType: this.typeConverter(weather.daily.data[0].icon),
					minTemperature: ((weather.daily.data[0].temperatureLow - 32) / 1.8).toFixed(0),
					maxTemperature: ((weather.daily.data[0].temperatureHigh - 32) / 1.8).toFixed(0),
				},
				{
					id: 2,
					icon: '',
					weatherType: this.typeConverter(weather.daily.data[1].icon),
					minTemperature: ((weather.daily.data[1].temperatureLow - 32) / 1.8).toFixed(0),
					maxTemperature: ((weather.daily.data[1].temperatureHigh - 32) / 1.8).toFixed(0),
				},
				{
					id: 3,
					icon: '',
					weatherType: this.typeConverter(weather.daily.data[2].icon),
					minTemperature: ((weather.daily.data[2].temperatureLow - 32) / 1.8).toFixed(0),
					maxTemperature: ((weather.daily.data[2].temperatureHigh - 32) / 1.8).toFixed(0),
				},
				{
					id: 4,
					icon: '',
					weatherType: this.typeConverter(weather.daily.data[3].icon),
					minTemperature: ((weather.daily.data[3].temperatureLow - 32) / 1.8).toFixed(0),
					maxTemperature: ((weather.daily.data[3].temperatureHigh - 32) / 1.8).toFixed(0),
				},
				{
					id: 5,
					icon: '',
					weatherType: this.typeConverter(weather.daily.data[4].icon),
					minTemperature: ((weather.daily.data[4].temperatureLow - 32) / 1.8).toFixed(0),
					maxTemperature: ((weather.daily.data[4].temperatureHigh - 32) / 1.8).toFixed(0),
				},
				{
					id: 6,
					icon: '',
					weatherType: this.typeConverter(weather.daily.data[5].icon),
					minTemperature: ((weather.daily.data[5].temperatureLow - 32) / 1.8).toFixed(0),
					maxTemperature: ((weather.daily.data[5].temperatureHigh - 32) / 1.8).toFixed(0),
				},
				{
					id: 7,
					weatherType: this.typeConverter(weather.daily.data[6].icon),
					minTemperature: ((weather.daily.data[6].temperatureLow - 32) / 1.8).toFixed(0),
					maxTemperature: ((weather.daily.data[6].temperatureHigh - 32) / 1.8).toFixed(0),
				},
			],
		})
		this.setState({
			hourlyForcast: [
				{
					id: 1,
					icon: '',
					weatherType: this.typeConverter(weather.hourly.data[0].icon),
					temperature: ((weather.hourly.data[0].temperature - 32) / 1.8).toFixed(0),
					timeType: this.nightConverter(weather.hourly.data[0].icon),
					time: 'Now',
				},
				{
					id: 2,
					icon: '',
					weatherType: this.typeConverter(weather.hourly.data[1].icon),
					temperature: ((weather.hourly.data[1].temperature - 32) / 1.8).toFixed(0),
					timeType: this.nightConverter(weather.hourly.data[1].icon),
				},
				{
					id: 3,
					icon: '',
					weatherType: this.typeConverter(weather.hourly.data[2].icon),
					temperature: ((weather.hourly.data[2].temperature - 32) / 1.8).toFixed(0),
					timeType: this.nightConverter(weather.hourly.data[2].icon),
				},
				{
					id: 4,
					icon: '',
					weatherType: this.typeConverter(weather.hourly.data[3].icon),
					temperature: ((weather.hourly.data[3].temperature - 32) / 1.8).toFixed(0),
					timeType: this.nightConverter(weather.hourly.data[3].icon),
				},
				{
					id: 5,
					icon: '',
					weatherType: this.typeConverter(weather.hourly.data[4].icon),
					temperature: ((weather.hourly.data[4].temperature - 32) / 1.8).toFixed(0),
					timeType: this.nightConverter(weather.hourly.data[4].icon),
				},
				{
					id: 6,
					icon: '',
					weatherType: this.typeConverter(weather.hourly.data[5].icon),
					temperature: ((weather.hourly.data[5].temperature - 32) / 1.8).toFixed(0),
					timeType: this.nightConverter(weather.hourly.data[5].icon),
				},
				{
					id: 7,
					icon: '',
					weatherType: this.typeConverter(weather.hourly.data[6].icon),
					temperature: ((weather.hourly.data[6].temperature - 32) / 1.8).toFixed(0),
					timeType: this.nightConverter(weather.hourly.data[6].icon),
				},
				{
					id: 8,
					icon: '',
					weatherType: this.typeConverter(weather.hourly.data[7].icon),
					temperature: ((weather.hourly.data[7].temperature - 32) / 1.8).toFixed(0),
					timeType: this.nightConverter(weather.hourly.data[7].icon),
				},
				{
					id: 9,
					icon: '',
					weatherType: this.typeConverter(weather.hourly.data[8].icon),
					temperature: ((weather.hourly.data[8].temperature - 32) / 1.8).toFixed(0),
					timeType: this.nightConverter(weather.hourly.data[8].icon),
				},
				{
					id: 10,
					icon: '',
					weatherType: this.typeConverter(weather.hourly.data[9].icon),
					temperature: ((weather.hourly.data[9].temperature - 32) / 1.8).toFixed(0),
					timeType: this.nightConverter(weather.hourly.data[9].icon),
				},
				{
					id: 11,
					icon: '',
					weatherType: this.typeConverter(weather.hourly.data[10].icon),
					temperature: ((weather.hourly.data[10].temperature - 32) / 1.8).toFixed(0),
					timeType: this.nightConverter(weather.hourly.data[10].icon),
				},
				{
					id: 12,
					icon: '',
					weatherType: this.typeConverter(weather.hourly.data[11].icon),
					temperature: ((weather.hourly.data[11].temperature - 32) / 1.8).toFixed(0),
					timeType: this.nightConverter(weather.hourly.data[11].icon),
				},
				{
					id: 13,
					icon: '',
					weatherType: this.typeConverter(weather.hourly.data[12].icon),
					temperature: ((weather.hourly.data[12].temperature - 32) / 1.8).toFixed(0),
					timeType: this.nightConverter(weather.hourly.data[12].icon),
				},
				{
					id: 14,
					icon: '',
					weatherType: this.typeConverter(weather.hourly.data[13].icon),
					temperature: ((weather.hourly.data[13].temperature - 32) / 1.8).toFixed(0),
					timeType: this.nightConverter(weather.hourly.data[13].icon),
				},
				{
					id: 15,
					icon: '',
					weatherType: this.typeConverter(weather.hourly.data[14].icon),
					temperature: ((weather.hourly.data[14].temperature - 32) / 1.8).toFixed(0),
					timeType: this.nightConverter(weather.hourly.data[14].icon),
				},
				{
					id: 16,
					icon: '',
					weatherType: this.typeConverter(weather.hourly.data[15].icon),
					temperature: ((weather.hourly.data[15].temperature - 32) / 1.8).toFixed(0),
					timeType: this.nightConverter(weather.hourly.data[15].icon),
				},
				{
					id: 17,
					icon: '',
					weatherType: this.typeConverter(weather.hourly.data[16].icon),
					temperature: ((weather.hourly.data[16].temperature - 32) / 1.8).toFixed(0),
					timeType: this.nightConverter(weather.hourly.data[16].icon),
				},
				{
					id: 18,
					icon: '',
					weatherType: this.typeConverter(weather.hourly.data[17].icon),
					temperature: ((weather.hourly.data[17].temperature - 32) / 1.8).toFixed(0),
					timeType: this.nightConverter(weather.hourly.data[17].icon),
				},
				{
					id: 19,
					icon: '',
					weatherType: this.typeConverter(weather.hourly.data[18].summary),
					temperature: ((weather.hourly.data[18].temperature - 32) / 1.8).toFixed(0),
					timeType: this.nightConverter(weather.hourly.data[18].icon),
				},
				{
					id: 20,
					icon: '',
					weatherType: this.typeConverter(weather.hourly.data[19].icon),
					temperature: ((weather.hourly.data[19].temperature - 32) / 1.8).toFixed(0),
					timeType: this.nightConverter(weather.hourly.data[19].icon),
				},
				{
					id: 21,
					icon: '',
					weatherType: this.typeConverter(weather.hourly.data[20].icon),
					temperature: ((weather.hourly.data[20].temperature - 32) / 1.8).toFixed(0),
					timeType: this.nightConverter(weather.hourly.data[20].icon),
				},
				{
					id: 22,
					icon: '',
					weatherType: this.typeConverter(weather.hourly.data[21].icon),
					temperature: ((weather.hourly.data[21].temperature - 32) / 1.8).toFixed(0),
					timeType: this.nightConverter(weather.hourly.data[21].icon),
				},
				{
					id: 23,
					icon: '',
					weatherType: this.typeConverter(weather.hourly.data[22].icon),
					temperature: ((weather.hourly.data[22].temperature - 32) / 1.8).toFixed(0),
					timeType: this.nightConverter(weather.hourly.data[22].icon),
				},
				{
					id: 24,
					icon: '',
					weatherType: this.typeConverter(weather.hourly.data[23].icon),
					temperature: ((weather.hourly.data[23].temperature - 32) / 1.8).toFixed(0),
					timeType: this.nightConverter(weather.hourly.data[23].icon),
				},
			],
		})
	};
	componentWillMount() {
		this.getCurrentLocation();

	}

	//rendering
	render() {
		return (
			<ForcastContainer>
				{/* 
				make API call to weather API to get real current city weather info
				set retrived weather info as this.state.city.[property]
				*/}
				<CityName>
					<CityNameText> {this.props.cityName} </CityNameText>
				</CityName>
				<CurrentWeather>
					<WeatherType>
						<WeatherTypeText> {this.props.cityForcast.weatherType} </WeatherTypeText>
					</WeatherType>
					<TemperetureRange>
						<TemperatureRangeText> {this.props.cityForcast.minTemperature}° | {this.props.cityForcast.maxTemperature}° </TemperatureRangeText>
					</TemperetureRange>
					<Temperature>
						<TemperatureText> {this.props.cityForcast.currentTemperature}° </TemperatureText>
					</Temperature>
				</CurrentWeather>

				<ForcastArea>
					<ForcastTypePicker>
						<ButtonArea style={{ alignItems: 'flex-end' }}>
							<Button 
							onPress={() => this.setState({ forcastType: 'day', dayForcastVisible: true, hourForcastVisible: false })}
							style={[this.state.forcastType== 'day' ? { backgroundColor: 'lightblue' } : { backgroundColor: 'gainsboro' }]}
							>
								<ButtonText> Day </ButtonText>
							</Button>
						</ButtonArea>
						<ButtonArea style={{ alignItems: 'flex-start' }}>
							<Button onPress={() => this.setState({ forcastType: 'hour', dayForcastVisible: false, hourForcastVisible: true })}
							style={[this.state.forcastType== 'hour' ? { backgroundColor: 'lightblue' } : { backgroundColor: 'gainsboro' }]}
							>
								<ButtonText> Hour </ButtonText>
							</Button>
						</ButtonArea>
					</ForcastTypePicker>
					<ForcastContent>
						{this.state.dayForcastVisible && <Forcast horizontal={true} showsHorizontalScrollIndicator={false}>
							{/* 
							make API call to weather API to get real daily forcast 
							set retrived daily forcast into this.state.dailyForcast
							*/}
							{this.state.dailyForcast.map((item, key) => {
								return (
									<Day key={key}>
										<DayForcastInfo>
											<DayWeatherIconArea><DayWeatherIcon source={ICONS.weather[item.weatherType + 'Day']} /></DayWeatherIconArea>
											<DayWeatherRange><DayWeatherRangeText> {item.minTemperature}° {item.maxTemperature}° </DayWeatherRangeText></DayWeatherRange>
										</DayForcastInfo>
										<Weekday><WeekdayText> {item.weekday} </WeekdayText></Weekday>
										<Date><DateText> {item.date} </DateText></Date>
									</Day>
								);
							})}
						</Forcast>}
						{this.state.hourForcastVisible && <Forcast horizontal={true} showsHorizontalScrollIndicator={false}>
							{/* 
							make API call to weather API to get real hourly forcast 
							set retrived hourly forcast into this.state.hourlyForcast
							*/}
							{this.state.hourlyForcast.map((item, key) => {
								return (
									<Hour key={key}>
										<HourForcastInfo>
											<HourTemperature><HourTemperatureText> {item.temperature}° </HourTemperatureText></HourTemperature>
											<HourWeatherIconArea><HourWeatherIcon source={ICONS.weather[item.weatherType + item.timeType]} /></HourWeatherIconArea>
										</HourForcastInfo>
										<TimeSec><TimeText> {item.time} </TimeText></TimeSec>
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
  height: 91%;
	width: 96%;
	left:  2%;
	top: 3%;
	padding: 7.5px 10px;
	background-color: whitesmoke;
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
	padding-top: 2.5px;
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
	border: 2.5px aliceblue;
	border-radius: 5px;
`;

const ButtonText = styled.Text`
    font-size: 12.5px;
    font-family: Courier;
`;

const ForcastContent = styled.View`
	flex: 1;
`;

const Forcast = styled.ScrollView`
	flex: 1;
`;

const Day = styled.View`
	width: 47.5px;
	height: 100%;
	flex-direction: column;
	align-items: center;
`;

const DayForcastInfo = styled.View`
	flex: 6;
	flex-direction: column;
	align-items: center;
`;

const DayWeatherIconArea = styled.View`
	flex: 2;
	align-items: center;
	justify-content: center;
`;

const DayWeatherIcon = styled.Image`
	width: 30px;
	height: 30px;
`;

const DayWeatherRange = styled.View`
	flex: 1;
	align-items: center;
`;

const DayWeatherRangeText = styled.Text`
	font-size: 10px;
	font-family: Courier;
	color: gray;
	padding-top: 2.5px;
`;

const Weekday = styled.View`
	flex: 1;
	align-items: center;
`;

const WeekdayText = styled.Text`
  font-size: 12.5px;
	font-family: Courier;
	color: black;
`;

const Date = styled.View`
	flex: 1;
	align-items: center;
`;

const DateText = styled.Text`
  font-size: 12.5px;
	font-family: Courier;
	color: gray;
	padding-top: 2.5px;
`;

const Hour = styled.View`
	width: 42.5px;
	height: 100%;
	flex-direction: column;
	align-items: center;
`;

const HourForcastInfo = styled.View`
	flex: 5;
`;

const TimeSec = styled.View`
	flex: 1;
	align-items: center;
`;

const TimeText = styled.Text`
  font-size: 12.5px;
	font-family: Courier;
	color: black;
`;

const HourTemperature = styled.View`
	flex: 1;
	align-items: center;
`;

const HourTemperatureText = styled.Text`
	font-size: 15px;
	font-family: Courier;
	padding-top: 10px;
	color: gray;
`;

const HourWeatherIconArea = styled.View`
	flex: 2;
	align-items: center;
	padding-top: 12.5px;
`;

const HourWeatherIcon = styled.Image`
	width: 27.5px;
	height: 27.5px;
`;
