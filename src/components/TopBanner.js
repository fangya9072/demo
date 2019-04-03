import React from 'react';
import styled from 'styled-components/native';
import { withNavigation } from 'react-navigation';
import TopLeftMenu from '../components/TopLeftMenu';
import TopLocationMenu from '../components/TopLocationMenu';
import Entypo from "react-native-vector-icons/Entypo";
import Feather from "react-native-vector-icons/Feather";
import { COLORS } from '../constant/color';

/* 
Top banner Component 
show on top of screen
include expandable sub menus
*/

class TopBanner extends React.Component {
	// set up state
	constructor(props) {
		super(props); // parent should have passed pageTitle and navigation props to this component
		this.state = {
			userIcon: '',
			topLeftMenuVisible: false,
			topLocationMenuVisible: false,
		};
	}
	
    //rerender top banner expanded sub menu when switching between pages
	componentDidMount() {
		this._navListener = this.props.navigation.addListener('willFocus', () => {
			this.setState({
				topLeftMenuVisible: false,
				topLocationMenuVisible: false,
			})
		});
	}

	//rendering
	render() {
		/* 
		get isMainView parameter from navigation, default is true if not available 
	    used to determine what kind of banner should be rendered
		*/
		const isMainView = this.props.navigation.getParam('isMainView', true);
		
		return (
			<Container>
				{/* 
				main banner
				*/}
				{isMainView && <MainBanner>
					<MenuButton onPress={() => { this.setState({ topLeftMenuVisible: !this.state.topLeftMenuVisible, }); }}>
					    <Entypo name={'menu'} size={45} />
					</MenuButton>
					<BannerText> {this.props.pageTitle} </BannerText>
					<UserButton>
						{/* 
					    make API call to rethinkDB to get real user icon picture, then set the user icon url as this.state.userID
					    replace require('../../assets/icon/role-icon/pikachu.png') with { uri: this.state.userIcon } after setting up state
					    */}
						<UserButtonIcon source={require('../../assets/icon/role-icon/pikachu.png')} />
					</UserButton>
					<RefreshButton onPress={this.props.refreshHandler}>
						<Entypo name={'cw'} size={30} />
					</RefreshButton>
					<LocationButton onPress={() => { this.setState({ topLocationMenuVisible: !this.state.topLocationMenuVisible, }); }}>
					    <Entypo name={'location'} size={25} />
					</LocationButton>
				</MainBanner>}

				{/* 
				stack banner
				*/}
				{!isMainView && <StackBanner>
					<BackButton onPress={() => { this.props.navigation.goBack(); }}>
					    <Feather name={'arrow-left'} size={30} />
					</BackButton>
					<TextArea><Text> {this.props.pageTitle} </Text></TextArea>
				</StackBanner>}

				{/* 
				expandable sub menus
				*/}
				{this.state.topLeftMenuVisible && <TopLeftMenu navigation={this.props.navigation} isMainView={this.state.isMainView} />}
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
	padding-top: 7.5px;
	padding-left: 5px;
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
	padding-top: 8.5px;
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