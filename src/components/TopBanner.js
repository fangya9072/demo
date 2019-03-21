import React, { Component } from 'react';
import styled from 'styled-components/native';
import { withNavigation } from 'react-navigation';
import { COLORS } from '../constant/color';

/* 
buttom menu bar Component 
enable users to switch between home, weather, news, history page
*/

class TopBanner extends React.Component {
	// set up state
	constructor(props) {
		super(props);
		this.state = {
			userIcon: '',
		};
	}
	//rendering
	render(){
		return(
			<Container>
				<MenuButton>
					<MenuButtonIcon source={require('../../assets/icon/function-icon/menu.png')} />
				</MenuButton>
				<BannerText> HOME </BannerText>
				<UserButton>
					{
					/* 
					make API call to rethinkDB to get real user icon picture, then set the user icon url as this.state.userID
					replace require('../../assets/icon/role-icon/pikachu.png') with { uri: this.state.userIcon } after setting up state
					*/
					}
				    <UserButtonIcon source={require('../../assets/icon/role-icon/pikachu.png')} />
				</UserButton>
				<RefreshButton>
				    <RefreshButtonIcon source={require('../../assets/icon/function-icon/refresh.png')} />
				</RefreshButton>
				<LocationButton>
				    <LocationButtonIcon source={require('../../assets/icon/function-icon/location-pin.png')} />
				</LocationButton>
			</Container>
		);
	}
}

export default withNavigation(TopBanner);

// css
const Container = styled.View`
    top: 5%;
    height: 10.5%;
	width: 100%;
	background-color: whitesmoke;
	flex-direction: row;
`;

const MenuButton = styled.TouchableOpacity`
	flex: 2;
	align-items: center;
	padding-top: 10px;
`;

const MenuButtonIcon = styled.Image`
	width: 30px;
	height: 25px;
	resize-mode: stretch;
`;

const BannerText = styled.Text`
	flex: 5;
	font-family: Gill Sans;
	font-size: 17.5px;
	padding-top: 12.5px;
`;

const RefreshButton = styled.TouchableOpacity`
    flex: 2;
    align-items: center;
    padding-top: 10px;
`;

const RefreshButtonIcon = styled.Image`
	width: 25px;
	height: 25px;
	resize-mode: stretch;
`;

const UserButton = styled.TouchableOpacity`
	flex: 2;
	align-items: center;
	padding-top: 7.5px;
`;

const UserButtonIcon = styled.Image`
	width: 30px;
	height: 30px;
	border-radius: 17.5px;
	resize-mode: stretch;
`;

const LocationButton = styled.TouchableOpacity`
    flex: 2;
    align-items: center;
	padding-top: 7.5px;
`;

const LocationButtonIcon = styled.Image`
	width: 35px;																																					px;
	height: 30px;
	resize-mode: stretch;
`;