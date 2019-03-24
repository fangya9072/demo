import React from 'react';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-navigation';
import { ImagePicker, Permissions } from 'expo';
import { Alert, Linking } from 'react-native';
import TopBanner from '../../components/TopBanner';
import { ICONS } from '../../constant/icon';

export default class WeatherPostScreen extends React.Component {
	// set up navigation
	static navigationOptions = {
		title: 'How Is The Weather?',
	};

	// set up state
	constructor(props) {
		super(props);
		this.state = {
			pageTitle: 'How Is The Weather?',
			image: null,
			location: 'Add Location',
			coordinate: '',
			errorMessage: '',
			temperature: 3,
			humidity: 3,
			cloud: 3,
			wind: 3,
		};
	}

	/* 
	function to pick picture from phone's photo library
	ask permission to grant acess to photo library
	set picked picture uri as this.state.image
	*/
	pickImage = async () => {
		const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
		if(status !== 'granted'){
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
		});
		if(!result.cancelled){
			this.setState({ image: result.uri });
		}
	}

	// function to save outfit post to database
	sendPost = async (uri) => {
		if(!this.state.coordinate){
			this.setState({
				errorMessage: 'Please Set Up Your Location',
			});
		}else{
			 // code conneting to backend starts here

			 this.props.navigation.goBack();
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
		this.setState({
			image: null,
			location: 'Add Location',
			coordinate: '',
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
				<Container>
					<TopBanner pageTitle={this.state.pageTitle} navigation={this.state.navigation} />
					<ImageWrapper onPress={() => { this.pickImage() }}>
						{this.state.image && < UploadedImage source={{ uri: this.state.image }} />}
						{!this.state.image && <DefaultImage source={require('../../../assets/icon/function-icon/upload-photo.png')} />}
					</ImageWrapper>
					<LocationSelector>
						<PinButton><PinButtonIcon source={require('../../../assets/icon/function-icon/add-location.png')} /></PinButton>
						<PinText>{this.state.location} </PinText>
					</LocationSelector>
					<ErrorMessage><ErrorMessageText> {this.state.errorMessage} </ErrorMessageText></ErrorMessage>
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
					<ButtonArea>
						<PostButton onPress={() => {this.sendPost()}}>
							<PostButtonText> POST </PostButtonText>
						</PostButton>
						<ClearButton onPress={() => {this.resetState()}}>
							<ClearButtonText> RESET </ClearButtonText>
						</ClearButton>
					</ButtonArea>
				</Container>
			</SafeAreaView>
		);
	}
}

// css
const Container = styled.View`
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

const DefaultImage = styled.Image`
	height: 45px;
	width: 45px;
	resize-mode: stretch;
`
const LocationSelector = styled.TouchableOpacity`
    height: 25px;
    width: 40%;
    top: 25%;
	left: 17.5%;
	flex-direction: row;
`
const PinButton = styled.View`
	height: 25px;
	width: 25px;
	margin-left: 0px;
	justify-content: center;
	align-items: center;
`

const PinButtonIcon = styled.Image`
	height: 25px;
	width: 25px;
	resize-mode: stretch;
`
const PinText = styled.Text`
    width: 100px;
    font-family: Optima;
	font-size: 15px;
	padding-top: 2.5px;
	padding_left: 5px;
`;

const ErrorMessage = styled.View`
    height: 5%;
	width: 100%;
    top: 17.5%;
	justify-content: center;
	align-items: center;
`

const ErrorMessageText = styled.Text`
    font-family: Bradley Hand;
	font-size: 15px;
	color: darkred;
`;

const SliderWrapper = styled.View`
	width: 80%;
	height: 35%;
	top: 17.5%;
	left:10%;
`;

const WeatherSlider = styled.Slider`
    flex: 1;
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
