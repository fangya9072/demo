import React from 'react';
import styled from 'styled-components/native';
import { KeyboardAvoidingView } from 'react-native';
import { COLORS } from '../../constant/color';

export default class RegisterScreen extends React.Component {
	
	// set up navigation
	static navigationOptions = {
		title: 'Register',
	};
	
	// set up state
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			phone: '',
			email: '',
			password: '',
			confirmedPass: '',
			errorMsg: ''
		};
	}

	//function of creating a user calling api
	createUser(username, password, phone, email, confirmedPass){
		if (username === '' || password === ''){
			this.setState({errorMsg: 'Please Enter Your Username Or Password'})
		} else if (password !== confirmedPass){
			this.setState({errorMsg: 'Confirmed Password Is Different'})
		} else {
			fetch('http://3.93.183.130:3000/users', {
				method: 'PUT',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					'username': username,
					'password': password,
					'number': phone,
					'email': email
				}),
			}).then((response) => {
				let result = JSON.parse(response._bodyText)
				if (result.inserted == 1){
					this.props.navigation.navigate('Login')
				} else {
					this.setState({errorMsg: 'Username Already Existed!'})
				}
			})
		}
	}

	// rendering
	render(){
		return (
			<Container>
				<WelcomeText> WELCOME </WelcomeText>
				<WelcomeSubText> Tell us a little more about you . . .  </WelcomeSubText>
				<KeyboardAvoidingView style={{height: "50%", top: "5%"}} behavior="padding">
				<Form>
					<Item>
						<Prompt> Username </Prompt>
						<Input autoCorrect={false} onChangeText={(username) => this.setState({username: username})} />
					</Item>
					<Item>
					    <Prompt> Phone Number </Prompt>
						<Input autoCorrect={false} onChangeText={(phone) => this.setState({phone: phone})} />
					</Item>
					<Item>
					    <Prompt> Email Address </Prompt>
						<Input autoCorrect={false} onChangeText={(email) => this.setState({email: email})} />
					</Item>
					<Item>
				    	<Prompt> Password </Prompt>
						<Input secureTextEntry={true} onChangeText={(password) => this.setState({password: password})} />
					</Item>
					<Item>
				    	<Prompt> Confirm Password </Prompt>
						<Input secureTextEntry={true} onChangeText={(confirmedPass) => this.setState({confirmedPass: confirmedPass})} />
					</Item>
				</Form>
				</KeyboardAvoidingView>
				<ErrorMsg>
					<ErrorMsgText>{this.state.errorMsg}</ErrorMsgText>
				</ErrorMsg>
				<ButtonArea>
				    <ConfirmButton onPress={() => this.createUser(this.state.username, 
					    this.state.password, this.state.phone, this.state.email, this.state.confirmedPass)}>
						<ConfirmButtonText> COMFIRM </ConfirmButtonText>
				    </ConfirmButton>
					<BackButton onPress={() => this.props.navigation.navigate('Login')}>
						<BackButtonText> BACK </BackButtonText>
				    </BackButton>
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

const WelcomeText = styled.Text`
	width: 80%;
	margin-top: 25%;
	margin-left: 10%;
    font-family: Gill Sans;
	font-size: 22px;
	color: black;
`;

const WelcomeSubText = styled.Text`
	width: 80%;
	margin-top: 2.5%;
	margin-left: 10%;
    font-family: Bradley Hand;
	font-size: 15px;
	color: gray;
`;

const Form = styled.View`
    height: 100%;
	width: 80%;
	left: 10%;
`;

const Item = styled.View`
	flex: 1;
	margin: 5px 0px 5px 0px;
`;

const Prompt = styled.Text`
	font-family: Didot;
	font-size: 15px;
	padding-bottom: 10px;
	padding-left: 2px;
	flex: 3;
`;

const Input = styled.TextInput`
	border-radius: 5px;
    background-color: #F3F3F3;
	color: gray;
	font-family: Didot;
	font-size: 15px;
	padding-left: 8px;
	flex: 5;
`;

const ErrorMsg = styled.View`
	margin-left: 10%;
	width: 80%;
	height: 5%;
	top: 5%;
`;

const ErrorMsgText = styled.Text`
	font-family: Bradley Hand;
	font-size: 15px;
	padding-top: 10px;
	padding-left: 2.5px;
	color: darkred;
`;

const ButtonArea = styled.View`
    height: 6%;
    width: 80%;
    top: 12.5%;
	left: 5.5%;
	flex-direction: row;
`;

const ConfirmButton = styled.TouchableOpacity`
    flex: 1;
	background-color: lightblue;
	border-radius: 5px;
	margin-right: 1px
	justify-content: center;
`;

const ConfirmButtonText = styled.Text`
	align-self: center;
	font-family: Gill Sans;
	font-size: 15px;
`;

const BackButton = styled.TouchableOpacity`
    flex: 1;
	border-radius: 5px;
	margin-left: 1px
	justify-content: center;
	background-color: lightgray;
`;

const BackButtonText = styled.Text`
	align-self: center;
	font-family: Gill Sans;
	font-size: 15px;
	color: dimgray;
`;
