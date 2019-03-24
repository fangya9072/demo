import React from 'react';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-navigation';
import { Alert, Linking } from 'react-native';
import TopBanner from '../../components/TopBanner';
import WeatherForcast from '../../components/WeatherForcast';
import { MapView, Location, Permissions } from "expo";
import { Modal } from 'react-native';

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
			weatherPostModalViewVisible: false,
			mapRegion: null,
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

	// functions that open and closes weather post madal view
	openPost(id) {
		this.setState({ weatherPostModalViewVisible: true });
	}
	closePost() {
		this.setState({ weatherPostModalViewVisible: false });
	}

	// functions that will run whenever WeatherPage is rerendered in DOM
	componentDidMount() {
		this.getCurrentLocation();
	}

	// function to get user's realtime geolocation
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
		let location = await Location.getCurrentPositionAsync({});
		this.setState({
			mapRegion: { latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 },
			currentLocation: { latitude: location.coords.latitude, longitude: location.coords.longitude }
		});
	};

	// rendering
	render() {
		return (
			<SafeAreaView style={{ backgroundColor: 'whitesmoke', flex: 1}}>
				<Container>
					<MapContainer>
						<Map>
							<MapView style={{ flex: 1 }} initialRegion={this.state.mapRegion}>
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
						<WeatherForcast />
					</WeatherForcastContainer>
					{/* put components with absolute position at the bottom */}
					<TopBanner pageTitle={this.state.pageTitle} navigation={this.state.navigation} />
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