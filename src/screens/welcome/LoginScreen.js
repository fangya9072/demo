import React, { Component } from 'react';
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
		};
	}
	// rendering 
	render(){
		return (
			<Container>
				<Logo />
				<InputArea>
				    <Prompt> Username </Prompt>
					<Input onChangeText={(username) => this.setState({username})} />
					<Prompt> Password </Prompt>
					<Input secureTextEntry={true} onChangeText={(password) => this.setState({password})} />
				</InputArea>
				<ButtonArea>
					<LoginButton onPress={() => this.props.navigation.navigate('Home')} >
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
