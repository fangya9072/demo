import React from 'react';
import styled from 'styled-components/native';
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
			errorMsg:'',
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
					this.setState({errorMsg: 'Please Enter Your Username Or Password...'})
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
				<InputArea>
				    <Prompt> Username </Prompt>
					<Input onChangeText={(username) => this.setState({username: username})} />
					<Prompt> Password </Prompt>
					<Input secureTextEntry={true} onChangeText={(password) => this.setState({password: password})} />
				</InputArea>
				<ErrorMsg>
					<ErrorMsgText>{this.state.errorMsg}</ErrorMsgText>
				</ErrorMsg>
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
	height: 35%;
	width: 75%;
	margin-left: 12.5%;
	margin-top: 25%;
	background-color: white;
`;

const InputArea = styled.View`
	height: 20%;
	width: 75%;
	margin-left: 12.5%;
	top: 5%;
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

const ErrorMsg = styled.View`
	height: 5%;
	width: 75%;
	top: 6%;
	margin-left: 12.5%;
`;

const ErrorMsgText = styled.Text`
    font-family: Bradley Hand;
	font-size: 15px;
	color: darkred;
	padding-left: 2.5px;
`;

const ButtonArea = styled.View`
	height: 10%;
	width: 75%;
	margin-left: 12.5%;
	top: 6%;
`;

const LoginButton = styled.TouchableOpacity`
	height: 60%;
	background-color: lightblue;
	border-radius: 5px;
	justify-content: center;
`;

const LoginButtonText = styled.Text`
	align-self: center;
	font-family: Gill Sans;
	font-size: 20px;
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
	text-decorationLine: underline;
`;
