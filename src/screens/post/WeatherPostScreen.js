import React from 'react';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-navigation';
import { ImagePicker, Permissions, Location, ImageManipulator } from 'expo';
import { Alert, Linking, AsyncStorage } from 'react-native';
import Feather from "react-native-vector-icons/Feather";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import LocationView from "react-native-location-view";
import TopBanner from '../../components/TopBanner';
import { ICONS } from '../../constant/icon';

export default class WeatherPostScreen extends React.Component {
	// set up navigation
	static navigationOptions = {
		title: 'How Is The Weather?',
		mapViewVisible: false,
	};

	// set up state
	constructor(props) {
		super(props);
		this.state = {
			pageTitle: 'How Is The Weather?',
			username: '',
			image: null,
			imageData: null,
			locationText: '',
			coordinate: {
				latitude: 0,
				longitude: 0,
			},
			errorMessage: '',
			temperature: 3,
			humidity: 3,
			cloud: 3,
			wind: 3,
		};
	}


	// function to update state, used to get state passed by child component
	updateState (data) {
        this.setState(data);
	}
	
	// funtion to update locationText state after selecting a location on map view
	updateLocationName = async (coordinate) => {
		let locationInfo = await Location.reverseGeocodeAsync(coordinate); 
		this.setState({
			locationText: locationInfo[0].city+', '+locationInfo[0].region,
		});
	}

	// functions that runs whenever WeatherPostScreen is rerendered in DOM
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

	// funtion to get current location
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
		this.setState({
			coordinate:{
				latitude: location.coords.latitude,
				longitude: location.coords.longitude,
			},
		});
		let locationInfo = await Location.reverseGeocodeAsync(this.state.coordinate);  // get city name of current location by coordinates
		this.setState({
			locationText: locationInfo[0].city+', '+locationInfo[0].region,
		});
	};

	/* 
	function to pick picture from phone's photo library
	ask permission to grant acess to photo library
	set picked picture uri as this.state.image
	*/
	pickImage = async () => {
		const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
		if (status !== 'granted') {
			Alert.alert(
				'Please Allow Access',
				[
					'This applicaton needs access to your photo library to upload images.',
					'\n',
					'Please go to Settings of your device and grant permissions to Photos.',
				].join(''),
				[
					{ text: 'Not Now', style: 'cancel' },
					{ text: 'Settings', onPress: () => Linking.openURL('app-settings:') },
				],
			);
		}
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: 'Images',
			allowsEditing: true,
			base64: true
		});
		if (!result.cancelled) {
			let resultFinal = await ImageManipulator.manipulateAsync(
				result.uri, [], { base64: true, compress: 0.3 }
			)
			this.setState({
				image: resultFinal.uri,
				imageData: resultFinal.base64
			});
		}
	}

	/* 
	function that allow user to pick a location in map view
	hide <PostContainer>, show <MapContainer>
	in <LocationView>, we set coordinate of picked location as this.state.coordinate, city and region name as this.state.locationText
	*/
	pickLocation = async () => {
		this.setState({
			mapViewVisible: true,
		});
	}

	// function to save weather post to database
	sendPost = async (imageData, coordinate, locationText, temperature, humidity, cloud, wind) => {
		if (!this.state.image) {
			this.setState({
				errorMessage: 'Please Choose A Picture',
			});
		} else {
			let username = this.state.username;
			let date = new Date();
		    let dateString = date.getFullYear() + "-" + ("0"+(date.getMonth()+1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2);
		    fetch('http://3.93.183.130:3000/weatherposts/' + username, {
				method: 'PUT',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					'date': dateString,
					'coordinate': coordinate, 
					'locationText': locationText,
					'photo': imageData, 
					'temperature': temperature, 
					'humidity': humidity, 
					'cloud': cloud, 
					'wind': wind
				}),
			}).then((response) => {
				let result = JSON.parse(response._bodyText)
				if (result.inserted == 1){
					this.props.navigation.goBack();
				} else {
					this.setState({errorMessage: 'Upload Image Failed. Please Retry.'});
				}
			})
		}
	}

	// function to update state value as slider value changes
	updateTemperature(value) {
		this.setState(() => {
			return {
				temperature: parseFloat(value),
			};
		});
	}
	updateHumidity(value) {
		this.setState(() => {
			return {
				humidity: parseFloat(value),
			};
		});
	}
	updateCloud(value) {
		this.setState(() => {
			return {
				cloud: parseFloat(value),
			};
		});
	}
	updateWind(value) {
		this.setState(() => {
			return {
				wind: parseFloat(value),
			};
		});
	}

	// reset all four weather values to default: 3
	resetState = () => {
		this.getCurrentLocation();
		this.setState({
			image: null,
			errorMessage: '',
			temperature: 3,
			humidity: 3,
			cloud: 3,
			wind: 3,
		});
	}

	// rendering
	render() {
		return (
			<SafeAreaView style={{ backgroundColor: 'whitesmoke', flex: 1 }}>
				{!this.state.mapViewVisible && <PostContainer>
					<TopBanner pageTitle={this.state.pageTitle} navigation={this.state.navigation} />
					<ImageWrapper onPress={() => { this.pickImage() }}>
						{this.state.image && <UploadedImage source={{ uri: this.state.image }} />}
						{!this.state.image && <Feather name={'upload'} size={35} />}
					</ImageWrapper>
					<LocationSelector onPress={() => { this.pickLocation() }}>
						<PinButton><MaterialIcons name={'add-location'} size={22.5} /></PinButton>
						<PinText>{this.state.locationText} </PinText>
					</LocationSelector>
					<SliderWrapper>
						<WeatherSlider
							minimumTrackTintColor={'lightblue'}
							maximumTrackTintColor={'rosybrown'}
							minimumValue={1}
							maximumValue={5}
							step={1}
							value={this.state.temperature}
							thumbImage={ICONS.weatherSlider['temperature' + this.state.temperature]}
							onValueChange={this.updateTemperature.bind(this)}
						/>
						<WeatherSlider
							minimumTrackTintColor={'lightblue'}
							maximumTrackTintColor={'rosybrown'}
							minimumValue={1}
							maximumValue={5}
							step={1}
							value={this.state.humidity}
							thumbImage={ICONS.weatherSlider['humidity' + this.state.humidity]}
							onValueChange={this.updateHumidity.bind(this)}
						/>
						<WeatherSlider
							minimumTrackTintColor={'lightblue'}
							maximumTrackTintColor={'rosybrown'}
							minimumValue={1}
							maximumValue={5}
							step={1}
							value={this.state.cloud}
							thumbImage={ICONS.weatherSlider['cloud' + this.state.cloud]}
							onValueChange={this.updateCloud.bind(this)}
						/>
						<WeatherSlider
							minimumTrackTintColor={'lightblue'}
							maximumTrackTintColor={'rosybrown'}
							minimumValue={1}
							maximumValue={5}
							step={1}
							value={this.state.wind}
							thumbImage={ICONS.weatherSlider['wind' + this.state.wind]}
							onValueChange={this.updateWind.bind(this)}
						/>
					</SliderWrapper>
					<ErrorMessage><ErrorMessageText> {this.state.errorMessage} </ErrorMessageText></ErrorMessage>
					<ButtonArea>
						<PostButton onPress={() => { this.sendPost(this.state.imageData, 
							this.state.coordinate, this.state.locationText, this.state.temperature, this.state.humidity, 
							this.state.cloud, this.state.wind) }}>
							<PostButtonText> POST </PostButtonText>
						</PostButton>
						<ClearButton onPress={() => { this.resetState() }}>
							<ClearButtonText> RESET </ClearButtonText>
						</ClearButton>
					</ButtonArea>
				</PostContainer>}

				{this.state.mapViewVisible && <MapContainer>
					<LocationView
						apiKey={"https://maps.googleapis.com/maps/api/js?key=AIzaSyAn9ZMMpbWB4cZClgqctFmP8LE9W5sONXk"}
						initialLocation={{
							latitude: this.state.coordinate.latitude,
							longitude: this.state.coordinate.longitude,
						}}
						updateParentState={this.updateState.bind(this)} // get state passed by child component
						updateLocationName={this.updateLocationName.bind(this)} 
					/>
				</MapContainer>}
			</SafeAreaView>
		);
	}
}

// css
const MapContainer = styled.View`
	flex: 1;
`;

const PostContainer = styled.View`
    height: 100%;
    width: 100%;
    background-color: white;
`;

const ImageWrapper = styled.TouchableOpacity`
	height: 20%;
	width: 35%;
    top: 12.5%;
    left: 30%;
	justify-content: center;
	align-items: center;
	border: 2.5px dashed lightgray
	border-radius: 5px;
	overflow: hidden;
`
const UploadedImage = styled.Image`
	height: 150px;
	width: 150px;
	border-radius: 5px;
	resize-mode: contain;
`

const LocationSelector = styled.TouchableOpacity`
    height: 25px;
    width: 40%;
    top: 27.5%;
	left: 112.5px;
	flex-direction: row;
	overflow: visible;
`
const PinButton = styled.View`
	height: 25px;
	width: 25px;
	justify-content: center;
	align-items: center;
`

const PinText = styled.Text`
    font-family: Optima;
	font-size: 15px;
	padding-top: 2.5px;
	padding_left: 5px;
`;

const SliderWrapper = styled.View`
	width: 80%;
	height: 35%;
	top: 19.5%;
	left:10%;
`;

const WeatherSlider = styled.Slider`
    flex: 1;
`;

const ErrorMessage = styled.View`
    height: 5%;
	width: 100%;
    top: 20.5%;
	justify-content: center;
	align-items: center;
`

const ErrorMessageText = styled.Text`
    font-family: Bradley Hand;
	font-size: 15px;
	color: darkred;
`;

const ButtonArea = styled.View`
    height: 6%;
    width: 80%;
    top: 40%;
	left: 5.5%;
	flex-direction: row;
`;

const PostButton = styled.TouchableOpacity`
    flex: 1;
	background-color: lightblue;
	border-radius: 5px;
	margin-right: 1px
	justify-content: center;
`;

const PostButtonText = styled.Text`
	align-self: center;
	font-family: Gill Sans;
	font-size: 15px;
`;

const ClearButton = styled.TouchableOpacity`
    flex: 1;
	border-radius: 5px;
	margin-left: 1px
	justify-content: center;
	background-color: lightgray;
`;

const ClearButtonText = styled.Text`
	align-self: center;
	font-family: Gill Sans;
	font-size: 15px;
	color: dimgray;
`;
