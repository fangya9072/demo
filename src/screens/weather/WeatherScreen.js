import React from 'react';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-navigation';
import { Alert, Linking, Dimensions } from 'react-native';
import TopBanner from '../../components/TopBanner';
import WeatherForcast from '../../components/WeatherForcast';
import Entypo from "react-native-vector-icons/Entypo";
import { Location, Permissions } from "expo";
import MapView from 'react-native-maps';
import { ICONS } from '../../constant/icon';


export default class WeatherScreen extends React.Component {

	// set up navigation
	static navigationOptions = {
		title: 'WEATHER',
	};

	// set up state
	constructor(props) {
		super(props);
		this.state = {
			pageTitle: 'WEATHER',
			username: '',
			weatherPostModalViewVisible: false,
			initialMapRegion: null,
			currentMapRegion: null,
			coordinate: {
				latitude: 0,
				longitude: 0,
			},
			cityName: '',
			cityForcast: {
				weatherType: 'Rainy',
				minTemperature: 45,
				maxTemperature: 60,
				currentTemperature: 55,
			},

			hourInfo: [],
			errorMessage: null,
			/*  
		    markers below for people nearby are only for test purpose, 
			make API call to rethinkDB to get real user data
			*/
			weatherPostMarkers: [],
			displayMode: {
				cloud: true,
				humidity: false,
				temperature: false,
				wind: false,
			},
		};
	}

	// functions that will run whenever WeatherPage is rerendered in DOM
	componentWillMount() {
		this.getCurrentLocation();
	}

	// function to get user's realtime geolocation and weather information
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
		this.setState({
			initialMapRegion: { latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 },
			coordinate: { latitude: location.coords.latitude, longitude: location.coords.longitude }
		});
		let locationInfo = await Location.reverseGeocodeAsync(this.state.coordinate); // get city name of current location by coordinates
		this.setState({
			cityName: locationInfo[0].city,
		});
		//let result = await fetch('https://api.openweathermap.org/data/2.5/forecast/hourly?q='+this.state.cityName+',us&units=metric&appid=ac141ae24c04ea59edfa71a5ab109b73').then(response => response.json());
		//this.setState({hourInfo: result.list});
		let day = await fetch('https://api.darksky.net/forecast/8c2568f00f593c6a4c4125d386af88f5/' + lat + ',' + log).then(response => response.json());
		let summary = day.currently.summary;
		let keyword
		summary = summary.split(' ')
		if (summary.length > 1){
			keyword = summary[summary.length-1];
		}else{
			keyword = summary[0];
		}
		this.setState({ hourInfo: day });
		this.setState({
			cityForcast: {
				weatherType: keyword,
				minTemperature: ((day.daily.data[0].temperatureHigh - 32) / 1.8).toFixed(0),
				maxTemperature: ((day.daily.data[0].temperatureLow - 32) / 1.8).toFixed(0),
				currentTemperature: ((day.currently.temperature - 32) / 1.8).toFixed(0),
			}
		})
	};

	/* 
	function to calcute coordinate range based on mapRegion parameter
	return an object with four floats representing the max/min of longitude/latitude
	*/
	calculteCoordinateRange = async (mapRegion) => {
		let min_latitude = mapRegion.latitude - 0.5 * mapRegion.latitudeDelta;
		let max_latitude = mapRegion.latitude + 0.5 * mapRegion.latitudeDelta;
		let min_longitude = mapRegion.longitude - 0.5 * mapRegion.longitudeDelta;
		let max_longitude = mapRegion.longitude + 0.5 * mapRegion.longitudeDelta;
		let coordinate_range = {
			max_latitude: max_latitude,
			min_latitude: min_latitude,
			max_longitude: max_longitude,
			min_longitude: min_longitude,
		};
		return coordinate_range;
	}

	clearWeatherPost = async() => {
		this.setState({
			weatherPostMarkers: [],
		});
	}

	/*
	function to get all weather posts within current map region
	will run whenever user changed mapRegion of MapView by toggling
	store rerived weather posts into this.state.weatherPostMarkers
	*/
	updateWeatherPostInRange = async (mapRegion) => {
		await this.clearWeatherPost();
		let coordinate_range = await this.calculteCoordinateRange(mapRegion);
		let date = new Date();
		let dateString = date.getFullYear() + "-" + ("0"+(date.getMonth()+1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2) + "-" + ("0"+date.getHours()).slice(-2) + "-" + ("0" + date.getMinutes()).slice(-2);
		try {
			let request = 'http://3.93.183.130:3000/rangeposts?date=' + dateString
			+ '&min_latitude=' + Number(coordinate_range.min_latitude)
			+ '&max_latitude=' + Number(coordinate_range.max_latitude)
			+ '&min_longitude=' + Number(coordinate_range.min_longitude)
			+ '&max_longitude=' + Number(coordinate_range.max_longitude);
			let response = await fetch(request, { method: 'GET'});
			let responseJson = await response.json();
			if( responseJson.length > 0 ){
				for (responseItem of responseJson) {
					weather_post = {
						weatherPostID: responseItem.weather_post_id,
						coordinate: {
							latitude: responseItem.coordinate.latitude,
							longitude: responseItem.coordinate.longitude,
						},
						weatherInfo: {
							cloud: responseItem.cloud,
							humidity: responseItem.humidity,
							temperature: responseItem.temperature,
							wind: responseItem.wind,
						},
					}
					this.state.weatherPostMarkers.push(weather_post);
				}
				this.setState({weatherPostMarkers: this.state.weatherPostMarkers});
			}
		} catch (error) {
			console.error(error);
		}
	}



	// function to reload screen
	onRefresh = () => {
		this.updateWeatherPostInRange(this.state.currentMapRegion);
	}

	// functions that open and closes weather post madal view
	openPost(id) {
		this.setState({ weatherPostModalViewVisible: true });
	}
	closePost() {
		this.setState({ weatherPostModalViewVisible: false });
	}

	// rendering
	render() {
		return (
			<SafeAreaView style={{ backgroundColor: 'whitesmoke', flex: 1 }}>
				<Container>
					<MapContainer>
						<Map>
							<MapView
								style={{ flex: 1 }}
								initialRegion={this.state.initialMapRegion}
								onRegionChangeComplete={(mapRegion) => {
									this.setState({ currentMapRegion: mapRegion });
									this.updateWeatherPostInRange(mapRegion);
								}}
								ref={(mapView) => (this.map = mapView)}
							>
								<MapView.Marker
									coordinate={{ longitude: this.state.coordinate.longitude, latitude: this.state.coordinate.latitude }}
									title={"my location"}
								>
									<Entypo name={'location-pin'} size={30} color={'black'} style={{ backgroundColor: 'transparent' }} />
								</MapView.Marker>
								{this.state.weatherPostMarkers.map((item, key) => {
									return (
										<MapView.Marker
										coordinate={{ longitude: Number(item.coordinate.longitude), latitude: Number(item.coordinate.latitude) }}
										key={key}
										>
										<MarkerImageWrapper>

									
											{this.state.displayMode.cloud && <MarkerImage source={ICONS.weatherSlider['cloud' + item.weatherInfo.cloud]} />}
											{this.state.displayMode.humidity && <MarkerImage source={ICONS.weatherSlider['humidity' + item.weatherInfo.humidity]} />}
											{this.state.displayMode.temperature && <MarkerImage source={ICONS.weatherSlider['temperature' + item.weatherInfo.temperature]} />}
											{this.state.displayMode.wind && <MarkerImage source={ICONS.weatherSlider['wind' + item.weatherInfo.wind]} />}
											</MarkerImageWrapper>
										</MapView.Marker>
									);
								})}
							</MapView>
							<DisplayModeWrapper>
								<DisplayModeButton
									onPress={() => {
										this.setState({
											displayMode: { cloud: true, humidity: false, temperature: false, wind: false }
										});
									}}
									style={[this.state.displayMode.cloud ? { backgroundColor: 'lightgray' } : { backgroundColor: 'whitesmoke' }]}
								>
									<DisplayModeText>Cloud</DisplayModeText>
								</DisplayModeButton>
								<DisplayModeButton
									onPress={() => {
										this.setState({
											displayMode: { cloud: false, humidity: true, temperature: false, wind: false }
										});
									}}
									style={[this.state.displayMode.humidity ? { backgroundColor: 'lightgray' } : { backgroundColor: 'whitesmoke' }]}
								>
									<DisplayModeText>Humidity</DisplayModeText>
								</DisplayModeButton>
								<DisplayModeButton
									onPress={() => {
										this.setState({
											displayMode: { cloud: false, humidity: false, temperature: true, wind: false }
										});
									}}
									style={[this.state.displayMode.temperature ? { backgroundColor: 'lightgray' } : { backgroundColor: 'whitesmoke' }]}
								>
									<DisplayModeText>Temperature</DisplayModeText>
								</DisplayModeButton>
								<DisplayModeButton
									onPress={() => {
										this.setState({
											displayMode: { cloud: false, humidity: false, temperature: false, wind: true }
										});
									}}
									style={[this.state.displayMode.wind ? { backgroundColor: 'lightgray' } : { backgroundColor: 'whitesmoke' }]}
								>
									<DisplayModeText>Wind</DisplayModeText>
								</DisplayModeButton>
							</DisplayModeWrapper>
						</Map>
					</MapContainer>
					<WeatherForcastContainer>
						<WeatherForcast cityName={this.state.cityName} cityForcast={this.state.cityForcast} hourInfo={this.state.hourInfo} />
					</WeatherForcastContainer>
					{/* put components with absolute position at the bottom */}
					<TopBanner pageTitle={this.state.pageTitle} navigation={this.state.navigation} refreshHandler={this.onRefresh.bind(this)} />
				</Container>
			</SafeAreaView>
		);
	}
}

// css
const Container = styled.View`
    height: 100%;
	width: 100%;
	background-color: whitesmoke;
`;

const MapContainer = styled.View`
    top: 45px;
    height: 65%;
    width: 100%;
	background-color: white;
`;

const WeatherForcastContainer = styled.View`
    height: 36%;
	width: 100%;
	background-color: white;
`;

const Map = styled.View`
    top: 1.5%;
    height: 87.5%;
    width: 96%;
    left: 2%;
    border-radius: 25px;
	overflow: hidden;
`

const MarkerImageWrapper = styled.View`
	width: 40px;
	height: 40px;
	border-radius: 20px;
	background-color: rgba(255, 255, 255, 0.75);
	align-items: center;
	justify-content: center;
`;

const MarkerImage = styled.Image`
	width: 30px;
	height: 30px;
	resize-mode: contain;
`;


const DisplayModeWrapper = styled.View`
	width: 100%;
	height: 27.5px;
	flex-direction: row;
	borderTopWidth: 0.25px;
	borderTopColor: gainsboro;
`;

const DisplayModeButton = styled.TouchableOpacity`
	flex: 1;
	align-items: center;
	justify-content: center;
`;

const DisplayModeText = styled.Text`
	font-size: 13.5px;
	font-family: Gill Sans;
`;