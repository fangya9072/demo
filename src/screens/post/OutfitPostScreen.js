import React from 'react';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-navigation';
import { ImagePicker, Permissions } from 'expo';
import { Alert, Linking } from 'react-native';
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import TopBanner from '../../components/TopBanner';


export default class OutfitPostScreen extends React.Component {

    // set up navigation
	static navigationOptions = {
		title: 'My Outfit Today',
	};

	// set up state
	constructor(props) {
		super(props);
		this.state = {
			pageTitle: 'My Outfit Today',
			image: null,
			errorMessage: '',
		};
	}

	/* 
	function to pick picture from phone's photo library
	ask permission to grant acess to photo library
	set uri of picked picture as this.state.image
	*/
	pickImage = async () =>  {
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
			mediaTypes:'Images',
			allowsEditing: true,
			base64: true
		});
		if(!result.cancelled){
			this.setState({ 
				image: result.uri, 
				errorMessage: '',
				data: result.base64
			});
		}
	}
	
	 
	// function to save outfit post to database
	sendPost = async (data) => {
		if(!this.state.image){
			this.setState({
				errorMessage: 'Please Choose A Picture',
			});
		}else{		
		    //now use username 'hcx' and date '2019-03-23' as an example of outfit post
			//replace username and date with the current user and date
			let username = 'hcx';
			let date = '2019-03-23'
		    fetch('http://3.93.183.130:3000/outlookposts/' + username, {
				method: 'PUT',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					'date': date,
					'photo': data
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

	// rendering
	render() {
		return (
			<SafeAreaView style={{ backgroundColor: 'whitesmoke', flex: 1 }}>
				<Container>
					<TopBanner pageTitle={this.state.pageTitle} navigation={this.state.navigation} />
					<ImageWrapper>
						{this.state.image && <UploadedImage source={{ uri: this.state.image }} />}
						{!this.state.image && <SimpleLineIcons name={'picture'} size={50} />}
					</ImageWrapper>
					<ButtonArea>
						<Button onPress={() => {this.pickImage()}}>
							<ButtonText> Choose A Picture </ButtonText>
						</Button>
						<Button style={{top:30}} onPress={() => { this.sendPost(this.state.data); }}>
						    <ButtonText> Update Your Outfit </ButtonText>
						</Button>
					</ButtonArea>
					<ErrorMessage><ErrorMessageText> {this.state.errorMessage} </ErrorMessageText></ErrorMessage>
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

const ImageWrapper= styled.View`
	height: 45%;
	width: 80%;
    top: 17.5%;
    left: 10%;
	justify-content: center;
	align-items: center;
	border: 2.5px dashed lightgray
	border-radius: 5px;
	overflow: hidden;
`
const UploadedImage= styled.Image`
	height: 300px;
	width: 300px;
	border-radius: 5px;
	resize-mode: contain;
`

const ButtonArea = styled.View`
	height: 20%;
	width: 80%;
	top: 25%;
	left: 10%;
`;

const Button = styled.TouchableOpacity`
    height: 40px;
	background-color: lightblue;
	border-radius: 5px;
	justify-content: center;
	align-items: center;
`;

const ButtonText = styled.Text`
    font-family: Optima;
    font-size: 18.5px;
`;

const ErrorMessage = styled.View`
    height: 5%;
	width: 80%;
    top: 25%;
	left: 10%;
	justify-content: center;
	align-items: center;
`

const ErrorMessageText = styled.Text`
    font-family: Bradley Hand;
	font-size: 15px;
	color: darkred;
`;