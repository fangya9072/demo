import React from 'react';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-navigation';
import { Alert, Linking, AsyncStorage } from 'react-native';
import TopBanner from '../../components/TopBanner';
import WeatherForcast from '../../components/WeatherForcast';
import Entypo from "react-native-vector-icons/Entypo";
import { Location, Permissions } from "expo";
import  MapView  from 'react-native-maps'

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
			mapRegion: null,
			coordinate: {
				latitude: 0,
				longitude: 0,
			},
			cityName: '',
			cityForcast:{
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
			weatherPostMarkers: [
				{
					id: 1,
					latitude: 35.909995043008486,
					longitude: -79.05328273773193,
					src: "https://s3-ap-southeast-1.amazonaws.com/so-srilanka/any/boy.png",
				},
				{
					id: 2,
					latitude: 35.910551182261656,
					longitude: -79.07154321670532,
					src: "https://s3-ap-southeast-1.amazonaws.com/so-srilanka/any/female.png",
				},
			],
		};
	}

	// functions that will run whenever WeatherPage is rerendered in DOM
	componentWillMount() {
		this.getUsername();
		this.getCurrentLocation();
	}

	// function to retrive username from persistant storage
	getUsername = async () => {
		try {
			const username = await AsyncStorage.getItem('username');
			if (username !== null) {
				this.setState({
					username: username,
				})
			}
		} catch (error) {
			console.error(error);
		}
	};

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
			mapRegion: { latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 },
			coordinate: { latitude: location.coords.latitude, longitude: location.coords.longitude }
		});
		let locationInfo = await Location.reverseGeocodeAsync(this.state.coordinate); // get city name of current location by coordinates
		this.setState({
			cityName: locationInfo[0].city,
		});
		//let result = await fetch('https://api.openweathermap.org/data/2.5/forecast/hourly?q='+this.state.cityName+',us&units=metric&appid=ac141ae24c04ea59edfa71a5ab109b73').then(response => response.json());
        //this.setState({hourInfo: result.list});
        let day = await fetch('https://api.darksky.net/forecast/8c2568f00f593c6a4c4125d386af88f5/'+lat+','+log).then(response => response.json());
        this.setState({hourInfo: day});
        this.setState({
        	cityForcast:{
        		weatherType: day.currently.summary,
				minTemperature: ((day.daily.data[0].temperatureHigh-32)/1.8).toFixed(0),
				maxTemperature: ((day.daily.data[0].temperatureLow-32)/1.8).toFixed(0),
				currentTemperature: ((day.currently.temperature-32)/1.8).toFixed(0),
        	}
        })
	};

	// function to reload screen
	onRefresh = () => {
		this.getCurrentLocation();
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
			<SafeAreaView style={{ backgroundColor: 'whitesmoke', flex: 1}}>
				<Container>
					<MapContainer>
						<Map>
							<MapView style={{ flex: 1 }} initialRegion={this.state.mapRegion}>
							    <MapView.Marker	
								coordinate={{ longitude: this.state.coordinate.longitude, latitude: this.state.coordinate.latitude }}
						    	title={"my location"}
		    					>
                     				<Entypo name={'location-pin'} size={30} color={'black'} style={{backgroundColor: 'transparent'}}/>
								</MapView.Marker>
								{this.state.weatherPostMarkers.map((item, key) => {
									return (
										<MapView.Marker
											coordinate={{
												longitude: Number(item.longitude),
												latitude: Number(item.latitude)
											}}
											title={item.title}
											key={key}
										>
											<MarkerImage source={{ uri: item.src }} />
										</MapView.Marker>
									);
								})}
							</MapView>
						</Map>
					</MapContainer>
					<WeatherForcastContainer>
						<WeatherForcast cityName={this.state.cityName} cityForcast={this.state.cityForcast} hourInfo={this.state.hourInfo}/>
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
    height: 100%;
    width: 96%;
    left: 2%;
    border-radius: 25px;
	overflow: hidden;
`

const MarkerImage = styled.Image`
	width: 30px;
	height: 30px;
`;