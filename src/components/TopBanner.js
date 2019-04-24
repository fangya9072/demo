import React from 'react';
import styled from 'styled-components/native';
import { Dimensions, AsyncStorage } from 'react-native'
import { withNavigation } from 'react-navigation';
import TopLeftMenu from '../components/TopLeftMenu';
import TopLocationMenu from '../components/TopLocationMenu';
import Entypo from "react-native-vector-icons/Entypo";
import Feather from "react-native-vector-icons/Feather";
import FontAwesome from "react-native-vector-icons/FontAwesome";

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
			username: '',
			userIcon: '',
			topLeftMenuVisible: false,
			topLocationMenuVisible: false,
		};
	}
	
    //rerender top banner expanded sub menu when switching between pages
	componentDidMount() {
		this._navListener = this.props.navigation.addListener('willFocus', () => {
			this.getUserIcon();
			this.setState({
				topLeftMenuVisible: false,
				topLocationMenuVisible: false,
			})
		});
	}

	/* 
	function to retrive username from persistant storage
	store retrieved username to this.state.username 
	*/
	getUsername = async () => {
		try {
			const username = await AsyncStorage.getItem('username');
			if (username !== null) {
				this.setState({
					username: username,
				})
			}
		} catch (error) {
			console.error(error);
		}
	};

	/* 
	function to get the image of current user's most recent outfit post
	used to show current user's icon on Top Banner
	*/
	getUserIcon = async () => {
		await this.getUsername();
		try {
			let response = await fetch('http://3.93.183.130:3000/recentpost/' + this.state.username, { method: 'GET' })
			let responseJson = await response.json();
			if(responseJson.length > 0){
				this.setState({
					userIcon: responseJson[0].photo,
				});
			} else {
				this.setState({
					userIcon: 'empty',
				});
			}
		} catch (error) {
			console.error(error);
		}
	};

	//rendering
	render() {
		/* 
		get isMainView parameter from navigation, default is true if not available 
	    used to determine what kind of banner should be rendered
		*/
		const isMainView = this.props.navigation.getParam('isMainView', true);
		let width = Dimensions.get('window').width;
		
		return (
			<Container style={{width: width}}>
				{/* 
				main banner
				*/}
				{isMainView && <MainBanner>
					<MenuButton onPress={() => { this.setState({ topLeftMenuVisible: !this.state.topLeftMenuVisible, }); }}>
					    <Entypo name={'menu'} size={45} />
					</MenuButton>
					<BannerText> {this.props.pageTitle} </BannerText>
					<UserButton>
						{this.state.userIcon != 'empty' && <UserButtonIcon source={{ uri: 'data:image/png;base64,' + this.state.userIcon }} />}
						{this.state.userIcon == 'empty' && <FontAwesome name='user-circle' size={31} color='lightgray'/>}
					</UserButton>
					<RefreshButton onPress={this.props.refreshHandler}>
						<Entypo name={'cw'} size={32.5} />
					</RefreshButton>
					<LocationButton onPress={() => { this.setState({ topLocationMenuVisible: !this.state.topLocationMenuVisible, }); }}>
					    <Entypo name={'location'} size={26.5} />
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
	padding-top: 6px;
	padding-left: 5px;
`;

const UserButton = styled.TouchableOpacity`
	flex: 2;
	align-items: center;
	padding-top: 7.5px;
`;

const UserButtonIcon = styled.Image`
	width: 31px;
	height: 31px;
	border-radius: 15.5px;
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