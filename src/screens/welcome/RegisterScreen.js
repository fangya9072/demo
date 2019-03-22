import React from 'react';
import styled from 'styled-components/native';
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
			this.setState({errorMsg: 'Please Enter Your Username and Password'})
		} else if (password !== confirmedPass){
			this.setState({errorMsg: 'Confirmed Password Is Different...'})
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
				console.log(JSON.parse(response._bodyText))
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
				<Form>
					<Item>
						<Prompt> Username </Prompt>
						<Input onChangeText={(username) => this.setState({username: username})} />
					</Item>
					<Item>
					    <Prompt> Phone Number </Prompt>
						<Input onChangeText={(phone) => this.setState({phone: phone})} />
					</Item>
					<Item>
					    <Prompt> Email Address </Prompt>
						<Input onChangeText={(email) => this.setState({email: email})} />
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
				<ErrorMsg>{this.state.errorMsg}</ErrorMsg>
				<ConfirmButton onPress={() => this.createUser(this.state.username, 
					this.state.password, this.state.phone, this.state.email, this.state.confirmedPass)} >
						<ConfirmButtonText> CREATE  ACCOUNT </ConfirmButtonText>
				</ConfirmButton>
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
    height: 50%;
	width: 80%;
	top: 5%;
	left: 10%;
`;

const Item = styled.View`
	flex: 1;
	margin: 5px 0px 5px 0px;
`;

const Prompt = styled.Text`
	font-family: Didot;
	font-size: 15px;
	padding-top: 2px;
	padding-left: 2px;
	flex: 2;
`;

const Input = styled.TextInput`
	border-radius: 5px;
    background-color: #F3F3F3;
	color: gray;
	font-family: Didot;
	font-size: 15px;
	padding-left: 8px;
	flex: 3;
`;

const ConfirmButton = styled.TouchableOpacity`
    height: 6%;
    width: 80%;
    top: 3%;
    left: 10%;
	background-color: skyblue;
	border-radius: 5px;
`;

const ConfirmButtonText = styled.Text`
	align-self: center;
	font-family: Gill Sans;
	font-size: 17.5px;
	padding-top: 3.5%;
`;

const ErrorMsg = styled.Text`
	margin-left: 10%;
	margin-top: 12%;
	font-family: Bradley Hand;
	font-size: 15px;
`;
