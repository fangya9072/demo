import React from 'react';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-navigation';
import { ImagePicker, Permissions } from 'expo';
import { Alert, Linking } from 'react-native';
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
	set picked picture uri as this.state.image
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
		});
		if(!result.cancelled){
			this.setState({ 
				image: result.uri, 
				errorMessage: '',
			});
		}
	}
	
	 
	// function to save outfit post to database
	sendPost = async (uri) => {
		if(!this.state.image){
			this.setState({
				errorMessage: 'Please Choose A Picture',
			});
		}else{		
		    /* code conneting to backend starts here
			t
			e
			s
			t
			
			d
			a
			t
			a
		    end of code */
		    this.props.navigation.goBack();
		}
	}

	// rendering
	render() {
		return (
			<SafeAreaView style={{ backgroundColor: 'whitesmoke', flex: 1 }}>
				<Container>
					<TopBanner pageTitle={this.state.pageTitle} navigation={this.state.navigation} />
					
					<ImageWrapper>
						{this.state.image && < UploadedImage source={{ uri: this.state.image }} />}
						{!this.state.image && <DefaultImage source={require('../../../assets/icon/function-icon/upload-photo.png')} />}
					</ImageWrapper>
					<ButtonArea>
						<Button onPress={() => {this.pickImage()}}>
							<ButtonText> Choose A Picture </ButtonText>
						</Button>
						<Button style={{top:30}} onPress={() => { this.sendPost(this.state.image); }}>
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

const DefaultImage= styled.Image`
	height: 75px;
	width: 75px;
	resize-mode: stretch;
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