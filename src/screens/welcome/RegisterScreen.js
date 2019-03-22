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
		};
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
						<Input onChangeText={(username) => this.setState({username})} />
					</Item>
					<Item>
					    <Prompt> Phone Number </Prompt>
						<Input onChangeText={(phone) => this.setState({phone})} />
					</Item>
					<Item>
					    <Prompt> Email Address </Prompt>
						<Input onChangeText={(email) => this.setState({email})} />
					</Item>
					<Item>
				    	<Prompt> Password </Prompt>
						<Input secureTextEntry={true} onChangeText={(password) => this.setState({password})} />
					</Item>
					<Item>
				    	<Prompt> Confirm Password </Prompt>
						<Input secureTextEntry={true} />
					</Item>
				</Form>
				<ConfirmButton onPress={() => this.props.navigation.navigate('Login')} >
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
	font-size: 20px;
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
    top: 10%;
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