import React from 'react';
import styled from 'styled-components/native';
import { Location, Permissions } from "expo";
import MapView from 'react-native-maps'
import { SafeAreaView } from 'react-navigation';
import { Alert, Linking, AsyncStorage, Dimensions, TouchableOpacity } from 'react-native';
import Entypo from "react-native-vector-icons/Entypo";
import Feather from "react-native-vector-icons/Feather";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import TopBanner from '../../components/TopBanner';
import moment from 'moment';

export default class HomeScreen extends React.Component {

	// set up navigation
	static navigationOptions = {
		title: 'HOME',
	};

	// set up state
	constructor(props) {
		super(props);
		this.state = {
			pageTitle: 'HOME',
			username: '',
			initialMapRegion: null,
			currentMapRegion: null,
			coordinate: {
				longitude: 0,
				latitude: 0,
			},
			/*
			an outfitPostMarker object should indlude the followings:
			outfitPostID: id of user's most recent outfit post
			userID: username
			coordinate: user's real-time geolocation
			image: most recent outfit post for a user
			date: date of user's most recent outfit post
			*/
			outfitPostMarkers: [],
			outfitPostViewVisible: false,
			/*
			friendType: restriected to 'add', 'pending', 'friend' 
			            'add' when there is no friend request between 2 users in db
			            'pending' when there exists friend request between 2 users in db, but the its status is false
									'friend' when there exists friend request between 2 users in db, and the its status is true
			*/
			outfitPostInfo: {
				username: '',
				image: '',
				friendType: '',
				date: '',
			},
		};
	}

	// functions that runs whenever HomePage is re-rendered in DOM
	componentWillMount() {
		this.getUsername();
		this.getCurrentLocation();
		navigator.geolocation.clearWatch(this.watchId);
	}

	// functions that runs whenever HomePage finishes re-rendering in DOM
	componentDidMount() {
		this.watchId = navigator.geolocation.watchPosition(
			(position) => {
				let current_coordinate = {
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
				}
				try {
				  fetch('http://3.93.183.130:3000/users/' + this.state.username, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							location: current_coordinate,
						}),
					});
				} catch (error) {
					console.error(error);
				}
			},
			(error) => this.setState({ error: error.message }),
			{ enableHighAccuracy: true, timeout: 30000 },
		);
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

	// function to get current user's realtime geolocation
	getCurrentLocation = async () => {
		let { status } = await Permissions.askAsync(Permissions.LOCATION);
		if (status !== 'granted') {
			Alert.alert(
				'Please Allow Access',
				[
					'This applicaton needs access to your current location.',
					'\n',
					'Please go to Settings of your device and grant permissions to Location Service.',
				].join(''),
				[
					{ text: 'Not Now', style: 'cancel' },
					{ text: 'Settings', onPress: () => Linking.openURL('app-settings:') },
				],
			);
		}
		let location_raw = await Location.getCurrentPositionAsync({});
		this.setState({
			initialMapRegion: { latitude: location_raw.coords.latitude, longitude: location_raw.coords.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 },
			coordinate: { latitude: location_raw.coords.latitude, longitude: location_raw.coords.longitude }
		});
		this.map.animateToRegion(this.state.initialMapRegion);
	};

	/* 
	function to calcute coordinate range based on mapRegion parameter
	return an object with four floats representing the max/min of longitude/latitude
	*/
	calculteCoordinateRange = async (mapRegion) => {
		let min_latitude = mapRegion.latitude - 0.5 * mapRegion.latitudeDelta;
		let max_latitude = mapRegion.latitude + 0.5 * mapRegion.latitudeDelta;
		let min_longitude = mapRegion.longitude - 0.5 * mapRegion.longitudeDelta;
		let max_longitude = mapRegion.longitude + 0.5 * mapRegion.longitudeDelta;
		let coordinate_range = {
			max_latitude: max_latitude,
			min_latitude: min_latitude,
			max_longitude: max_longitude,
			min_longitude: min_longitude,
		};
		return coordinate_range;
	}

	/* 
	function to set this.state.outfitPostMarkers to be empyty
	will run whenever the app is trying to reload nearby users' outfit posts to be shown on map
	*/
	clearOutfitPost = async () => {
		this.setState({
			outfitPostMarkers: [],
		});
	}

	/*
	function to get all users nearby within the map range, based on their realtime geolocation,
	and then use the images of their most recent outfit post as marker icon showed on map
	will run whenever user changed the mapRegion attribute of MapView by toggling, or by clicking the refresh button
	store rerived outfit posts into this.state.outfitPostMarkers
	*/
	updateOutfitPostInRange = async (mapRegion) => {
		await this.clearOutfitPost();
		let coordinate_range = await this.calculteCoordinateRange(mapRegion);
		try {
			let request = 'http://3.93.183.130:3000/rangeusers?'
				+ 'min_latitude=' + Number(coordinate_range.min_latitude)
				+ '&max_latitude=' + Number(coordinate_range.max_latitude)
				+ '&min_longitude=' + Number(coordinate_range.min_longitude)
				+ '&max_longitude=' + Number(coordinate_range.max_longitude);
			let userResponse = await fetch(request, { method: 'GET' });
			let userResponseJson = await userResponse.json();
			if (userResponseJson) {
				for (userResponseItem of userResponseJson) {
					if (userResponseItem.username != this.state.username) {
						try {
							let postResponse = await fetch('http://3.93.183.130:3000/recentpost/' + userResponseItem.username, { method: 'GET' })
							let postResponseJson = await postResponse.json();
							if (postResponseJson.length > 0) {
								for (postResponseItem of postResponseJson) {
									let fromDate = postResponseItem.date.split("-")
									let rawDate = new Date(fromDate[0], fromDate[1] - 1, fromDate[2])
									let formattedDate = moment(rawDate).format('ll')
									let outfit_post = {
										userID: userResponseItem.username,
										coordinate: userResponseItem.location,
										outfitPostID: postResponseItem.outlook_post_id,
										image: postResponseItem.photo,
										date: formattedDate,
									}
									this.state.outfitPostMarkers.push(outfit_post);
								}
							}
						} catch (error) {
							console.error(error);
						}
					}
				}
			}
			this.setState({ outfitPostMarkers: this.state.outfitPostMarkers });
		} catch (error) {
			console.error(error);
		}
	}

	// function to reload screen
	onRefresh = () => {
		this.getCurrentLocation();
		this.updateOutfitPostInRange(this.state.initialMapRegion);
	}

	/* 
	function to check the friend status of two users by their username
	will run whenever user click a user's icon shown on map to open his/her post detail
	the function will update the friendType field in component's outfitPostInfo state
	friendType is restricted to 'add', 'friend', 'pending'
  */
	checkFriend = async (username1, username2) => {
		try {
			let response = await fetch('http://3.93.183.130:3000/checkfriend/' + username1 + '?user2=' + username2, { method: 'GET' });
			let responseJson = await response.json();
			if (responseJson == true) {
				this.setState({
					outfitPostInfo: {
						username: this.state.outfitPostInfo.username,
						image: this.state.outfitPostInfo.image,
						friendType: 'friend',
						date: this.state.outfitPostInfo.date,
					}
				});
			} else if (responseJson == false) {
				this.setState({
					outfitPostInfo: {
						username: this.state.outfitPostInfo.username,
						image: this.state.outfitPostInfo.image,
						friendType: 'pending',
						date: this.state.outfitPostInfo.date,
					}
				});
			} else {
				this.setState({
					outfitPostInfo: {
						username: this.state.outfitPostInfo.username,
						image: this.state.outfitPostInfo.image,
						friendType: 'add',
						date: this.state.outfitPostInfo.date,
					}
				});
			}
		} catch (error) {
			console.error(error);
		}
	};

	/* 
	function to send friend request
	will run when user click the 'Add' button on the opened post view
	*/
	sendFriendRequest = async (username_from, username_to) => {
		try {
			let response = await fetch('http://3.93.183.130:3000/friendrequests/' + username_from, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					user_to_id: username_to,
					status: false,
				}),
			});
			let responseJson = await response.json();
			if (responseJson.inserted == 1) {
				this.setState({
					outfitPostInfo: {
						username: this.state.outfitPostInfo.username,
						image: this.state.outfitPostInfo.image,
						friendType: 'pending',
						date: this.state.outfitPostInfo.date,
					}
				});
			} else {
				this.setState({ errorMsg: 'Friend Request Already Exist!' })
			}
		} catch (error) {
			console.error(error);
		}
	};

	// rendering 
	render() {
		return (
			<SafeAreaView style={{ backgroundColor: 'whitesmoke', flex: 1 }}>
				<Container>
					<Map>
						{/* Map */}
						<MapView
							style={{ flex: 1 }}
							initialRegion={this.state.initialMapRegion}
							onRegionChangeComplete={(mapRegion) => {
								if (this.state.initialMapRegion) {
									this.setState({ currentMapRegion: mapRegion });
									this.updateOutfitPostInRange(mapRegion);
								}
							}}
							ref={(mapView) => (this.map = mapView)}
						>
							<MapView.Marker
								coordinate={{ longitude: this.state.coordinate.longitude, latitude: this.state.coordinate.latitude }}
								title={"my location"}
							>
								<Entypo name={'location-pin'} size={30} color={'black'} style={{ backgroundColor: 'transparent' }} />
							</MapView.Marker>
							{this.state.outfitPostMarkers.map((item, key) => {
								return (
									<MapView.Marker
										coordinate={{ longitude: Number(item.coordinate.longitude), latitude: Number(item.coordinate.latitude) }}
										key={key}
										onPress={() => {
											this.setState({ outfitPostViewVisible: true })
											this.checkFriend(this.state.username, item.userID);
											this.setState({
												outfitPostInfo: {
													username: item.userID,
													image: item.image,
													friendType: item.friendType,
													date: item.date,
												}
											});
										}}
									>
										<MarkerImage source={{ uri: 'data:image/png;base64,' + item.image }} />
									</MapView.Marker>
								);
							})}
						</MapView>
						{/* 
						Outfit Post View 
						display when the currrent user click on a user's icon shown on map
						dismiss when the currrent user click on the close button
						*/}
						{this.state.outfitPostViewVisible && <OutfitPostContainer style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height }}>
							<OutfitPostView>
								<CloseButtonWrapper>
									<CloseButton onPress={() => this.setState({ outfitPostViewVisible: false })} >
										<Feather name={'x-circle'} size={26.5} style={{ marginTop: -1.5, marginLeft: -1 }} />
									</CloseButton>
								</CloseButtonWrapper>
								<UserInfoWrapper>
									<UsernameText> {this.state.outfitPostInfo.username} </UsernameText>
									<ButtonArea>
										<ButtonWrapper style={{ marginRight: 2.5 }}>
											{this.state.outfitPostInfo.friendType == 'add' &&
												<TouchableOpacity
													onPress={() => this.sendFriendRequest(this.state.username, this.state.outfitPostInfo.username)}
												>
													<Button style={{ backgroundColor: 'gainsboro' }}>
														<Entypo name={'plus'} size={20} style={{ marginLeft: 6.5, marginTop: 1 }} />
														<ButtonText style={{ paddingLeft: 2.5, paddingRight: 6.5 }}> Add </ButtonText>
													</Button>
												</TouchableOpacity>}
											{this.state.outfitPostInfo.friendType == 'pending' &&
												<Button style={{ backgroundColor: 'whitesmoke' }}>
													<Feather name={'loader'} size={17.5} style={{ marginLeft: 7.5, marginTop: 1 }} />
													<ButtonText style={{ paddingLeft: 2.5, paddingRight: 5 }}> Pending </ButtonText>
												</Button>}
											{this.state.outfitPostInfo.friendType == 'friend' &&
												<Button style={{ backgroundColor: 'whitesmoke' }}>
													<Feather name={'users'} size={17.5} style={{ marginLeft: 10 }} />
													<ButtonText style={{ paddingLeft: 5, paddingRight: 3.5 }}> Friend </ButtonText>
												</Button>}
										</ButtonWrapper>
										<ButtonWrapper style={{ marginLeft: 2.5 }}>
											<TouchableOpacity>
												<Button style={{ backgroundColor: 'gainsboro' }}>
													<AntDesign name={'message1'} size={16.5} style={{ marginLeft: 7.5, marginTop: 1.5 }} />
													<ButtonText> Messaage </ButtonText>
												</Button>
											</TouchableOpacity>
										</ButtonWrapper>
									</ButtonArea>
								</UserInfoWrapper>
								<PhotoWrapper>
									<Photo source={{ uri: 'data:image/png;base64,' + this.state.outfitPostInfo.image }} />
								</PhotoWrapper>
								<MetaInfoWrapper>
									<DateTextWrapper style={{ alignItems: 'flex-start' }}>
										<DateText>{this.state.outfitPostInfo.date}</DateText>
									</DateTextWrapper>
									<MoreTextWrapper style={{ alignItems: 'flex-end' }} onPress={() => this.props.navigation.navigate('OutfitPostView', { isMainView: false, postInfo: this.state.outfitPostInfo })}>
										<MoreText> . . . </MoreText>
									</MoreTextWrapper>
								</MetaInfoWrapper>
							</OutfitPostView>
						</OutfitPostContainer>}
					</Map>
					{/* Top Bannner Component */}
					<TopBanner pageTitle={this.state.pageTitle} navigation={this.props.navigation} navigation={this.state.navigation} refreshHandler={this.onRefresh.bind(this)} />
				</Container>
			</SafeAreaView>
		);
	}
}


// css 
const Container = styled.View`
    height: 100%;
  	width: 100%;
  	background-color: whitesmoke;
`;

const Map = styled.View`
    top: 45px;
    height: 93.5%;
		width: 100%;
`;

const MarkerImage = styled.Image`
  	width: 30px;
		height: 30px;
		border-radius: 15px;
`;

const OutfitPostContainer = styled.View`
		position: absolute;
		align-items: center;
		background-color: transparent;
`;

const OutfitPostView = styled.View`
    top: 10%;
		width: 80%;
		height: 60%;
	  flexDirection: column;
		background-color: rgba(255, 255, 255, 0.85);
		border-radius: 5px;
		align-items: center;
`;

const CloseButtonWrapper = styled.View`
	flex: 1;
	width: 100%;
	align-items: flex-end;
`;

const CloseButton = styled.TouchableOpacity`
	width: 25px;
	height: 25px;
	backgroundColor: lightblue;
	border-radius: 25px;
	margin-right: 5px;
	margin-top: 5px;
`;

const UserInfoWrapper = styled.View`
	width: 250px;
	align-items: center;
	padding-top: 5px;
`;

const UsernameText = styled.Text`
  font-family: Optima;
	font-size: 17.5px;
	font-weight: 400;
	color: black;
	padding-bottom: 1px;
`;

const ButtonArea = styled.View`
	height: 25px;
	justify-content: center;
	align-items: center;
	flex-direction: row;
	margin-top: 10px;
`;

const ButtonWrapper = styled.View`
	justify-content: center;
`;

const Button = styled.View`
  height: 25px;
	border-radius: 5px;
	flex-direction: row;
	align-items: center;
	justify-content: center;
`;

const ButtonText = styled.Text`
  font-family: Gill Sans;
	font-size: 17.5px;
`;

const PhotoWrapper = styled.View`
	flex: 10;
	align-items: center;
	justify-content: center;
	margin-top: 10px;
`;

const Photo = styled.Image`
	width: 250px;
	height: 250px;
	resize-mode: cover;
	border-radius: 5px;
`;

const MetaInfoWrapper = styled.View`
	flex: 1.5;
	width: 250px;
	flex-direction: row;
	padding-top: 5px;
`;

const DateTextWrapper = styled.View`
	flex: 2;
`;

const MoreTextWrapper = styled.TouchableOpacity`
	flex: 1;
`;

const DateText = styled.Text`
	font-size: 12.5px;
	padding-top: 5px;
  font-family: Georgia;
	color: gray;
`;

const MoreText = styled.Text`
	font-size: 15px;
	font-weight: bold;
  font-family: Georgia;
	color: black;
`;