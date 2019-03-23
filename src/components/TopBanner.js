import React from 'react';
import styled from 'styled-components/native';
import { withNavigation } from 'react-navigation';
import TopLeftMenu from '../components/TopLeftMenu';
import TopLocationMenu from '../components/TopLocationMenu';
import { COLORS } from '../constant/color';

/* 
Top banner Component 
show on top of screen
include expandable sub menus
*/

class TopBanner extends React.Component {
	// set up state
	constructor(props) {
		super(props);
		this.state = {
			userIcon: '',
			topLeftMenuVisible: false,
			topLocationMenuVisible: false,
		};
	}

	// nned to rerender top banner when navigating between bottom tap bar 
	//componentDidMount() {
	//	this._navListener = this.props.navigation.addListener('didFocus', () => {
	//		if (!this.state.isGoBack) { // no need to rerender when going back from stack page
	//			this.setState({
					// topLeftMenuVisible: false,
					// topLocationMenuVisible: false,
	//			});
	//		}
	//	});
	//}

	// state update fucntion, used for getting state from child component 
	updateState (data) {
        this.setState(data);
    }

	//rendering
	render() {
		/* 
		get isMainView parameter from navigation, default is true if not available 
	    used to determine what kind of banner should be rendered
		*/
		const { navigation } = this.props;
		const isMainView = navigation.getParam('isMainView', true);
		
		return (
			<Container>
				{/* 
				main banner
				*/}
				{isMainView && <MainBanner>
					<MenuButton onPress={() => { this.setState({ topLeftMenuVisible: !this.state.topLeftMenuVisible, }); }}>
						<MenuButtonIcon source={require('../../assets/icon/function-icon/menu.png')} />
					</MenuButton>
					<BannerText> {this.props.pageTitle} </BannerText>
					<UserButton>
						{/* 
					    make API call to rethinkDB to get real user icon picture, then set the user icon url as this.state.userID
					    replace require('../../assets/icon/role-icon/pikachu.png') with { uri: this.state.userIcon } after setting up state
					    */}
						<UserButtonIcon source={require('../../assets/icon/role-icon/pikachu.png')} />
					</UserButton>
					<RefreshButton>
						<RefreshButtonIcon source={require('../../assets/icon/function-icon/refresh.png')} />
					</RefreshButton>
					<LocationButton onPress={() => { this.setState({ topLocationMenuVisible: !this.state.topLocationMenuVisible, }); }}>
						<LocationButtonIcon source={require('../../assets/icon/function-icon/location-pin.png')} />
					</LocationButton>
				</MainBanner>}

				{/* 
				stack banner
				*/}
				{!isMainView && <StackBanner>
					<BackButton onPress={() => {
						this.props.navigation.goBack();
					}}>
						<BackButtonIcon source={require('../../assets/icon/function-icon/back.png')}>
						</BackButtonIcon>
					</BackButton>
					<TextArea><Text> {this.props.pageTitle} </Text></TextArea>
				</StackBanner>}

				{/* 
				expandable sub menus
				*/}
				{this.state.topLeftMenuVisible && 
				<TopLeftMenu 
				navigation={this.props.navigation} 
				updateParentState={this.updateState.bind(this)} // get state passed from chil component
				isMainView={this.state.isMainView} 
				/>}
				{this.state.topLocationMenuVisible && <TopLocationMenu />}
			</Container>
		);
	}
}

export default withNavigation(TopBanner);

// css
const Container = styled.View`
    height: 45px;
	width: 375px;
	position: absolute;
	top: 0px;
	left: 0px;
	background-color: whitesmoke;
	zIndex: 0;
`;

const MainBanner = styled.View`
	flex: 1;
	flex-direction: row;
`;

const MenuButton = styled.TouchableOpacity`
	flex: 2;
	align-items: center;
	padding-top: 10px;
`;

const MenuButtonIcon = styled.Image`
	width: 37.5px;
	height: 25px;
	resize-mode: stretch;
	margin-left: 2.5px;
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

const StackBanner = styled.View`
    flex: 1
	flex-direction: row;
`;

const BackButton = styled.TouchableOpacity`
    height: 45px;
	width: 45px;
	align-items: center;
	justify-content: center;
`;

const BackButtonIcon = styled.Image`
    height: 30px;
	width: 30px;
`;

const TextArea = styled.View`
    height: 45px;
	width: 280px;
	align-items: center;
	justify-content: center;
`;

const Text = styled.Text`
    font-family: Gill Sans;
    font-size: 17.5px;
`;