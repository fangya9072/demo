import React, { Component } from 'react';
import styled from 'styled-components/native';
import { Modal, Text, View}  from 'react-native';
import { COLORS } from '../../constant/color';

export default class LoginScreen extends React.Component {
	// set up navigation
	static navigationOptions = {
		title: 'Login',
	};
	// set up state
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: '',
			errorMsgVisible: false,
			errorMsg:''
		};
	}

  	//check login username and password function
	checkLogin(username, password){
		fetch('http://3.93.183.130:3000/login?username=' + username + '&password=' +password, {
			method: 'GET'
		}).then((response) => {
			let result = JSON.parse(response._bodyText)
			if (result == true) {
				this.props.navigation.navigate('Home')
			} else {
				if (password === '' || username === ''){
					this.setState({errorMsg: 'Please Enter your Username or Password...'})
				} else if (result == null){
					this.setState({errorMsg: 'No Such User...'})
				} else {
					this.setState({errorMsg: 'Password Incorrect!'})
				}
				this.setState({errorMsgVisible: true})
			}
		})
	}

	// rendering 
	render(){
		return (
			<Container>
				<Logo />
				<Modal animationType="fade" transparent={true} 
				visible={this.state.errorMsgVisible}>
					<ErrorMsgView>
						<ErrorMsgTouchableOpacity onPress={()=> this.setState({errorMsgVisible: false})}>
							<ErrorMsgText>{this.state.errorMsg}</ErrorMsgText>
						</ErrorMsgTouchableOpacity>
					</ErrorMsgView>
				</Modal>
				<InputArea>
				    <Prompt> Username </Prompt>
					<Input onChangeText={(username) => this.setState({username: username})} />
					<Prompt> Password </Prompt>
					<Input secureTextEntry={true} onChangeText={(password) => this.setState({password: password})} />
				</InputArea>
				<ButtonArea>
					<LoginButton onPress={() => this.checkLogin(this.state.username, this.state.password)} >
						<LoginButtonText> SIGN IN </LoginButtonText>
					</LoginButton>
					<RegisterButton onPress={() => this.props.navigation.navigate('Register')} >
						<RegisterButtonText> Register Now </RegisterButtonText>
					</RegisterButton>
				</ButtonArea>
			</Container>
		);
	}
}

// css 
const Container = styled.View`
    height: 100%;
	width: 100%;
	background-color: transparent;
`;

const Logo = styled.View`
	border: 2px dotted gray;
	border-radius: 5px;
	height: 30%;
	width: 75%;
	margin-left: 12.5%;
	margin-top: 30%;
	background-color: white;
`;

const InputArea = styled.View`
	height: 25%;
	width: 75%;
	margin-left: 12.5%;
	margin-top: 10%;
`;

const Prompt = styled.Text`
    height: 25%;
	padding-top: 3%;
	font-family: Didot;
	font-size: 18px;
`;

const Input = styled.TextInput`
	height: 25%;
	border-radius: 5px;
    background-color: #F3F3F3;
	color: gray;
	padding-left: 8px;
	font-family: Didot;
	font-size: 15px;
`;

const ButtonArea = styled.View`
	height: 10%;
	width: 75%;
	margin-left: 12.5%;
	margin-top: 2.5%;
`;

const LoginButton = styled.TouchableOpacity`
	height: 60%;
	background-color: skyblue;
	border-radius: 5px;
`;

const LoginButtonText = styled.Text`
	align-self: center;
	font-family: Gill Sans;
	font-size: 20px;
	padding-top: 2.5%;
`;

const RegisterButton = styled.TouchableOpacity`
	height: 50%;
	width: 35%;
	align-self: center;
	background-color: transparent;
`;

const RegisterButtonText = styled.Text`
	align-self: center;
	font-family: Gill Sans;
	font-size: 15px;
	padding-top: 12.5%;
`;

const ErrorMsgView = styled.View`
	margin-top: 50%
	height: 50%;
	width: 100%
`;

const ErrorMsgTouchableOpacity = styled.TouchableOpacity`
	border: 2px solid gray;
	border-radius: 5px;
	height: 40%;
	width: 75%;
	margin-top: 30%;
	margin-left: 12.5%
	background-color: white;
	z-index:2;
`;

const ErrorMsgText = styled.Text`
	align-self: center;
	padding-top: 5%;
	padding-left: 3%;
	font-family: Gill Sans;
	font-size: 18px;
	color: black;
	z-index: 1;
`;
