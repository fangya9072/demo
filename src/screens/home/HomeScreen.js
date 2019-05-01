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
import SocketIOClient from 'socket.io-client';
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
			friends: [],
			coordinate: {
				longitude: 0,
				latitude: 0,
			},
			/*
			markerDisplayMode is restricted to 'friendOnly' and 'userNearby'
			*/
			markerDisplayMode: 'friendOnly',
			/*  
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
		this.socket = SocketIOClient('http://3.93.183.130:3001');


	}

	// functions that runs whenever HomePage is re-rendered in DOM
	componentDidMount() {
		this.getUsername();
		this.getCurrentLocation();
		this.getFriends();
		this.socket.emit('position', {
			username: this.state.username,
			location: {
				latitude: this.state.coordinate.latitude,
				longitude: this.state.coordinate.longitude
			}
		});
        this.socket.on('friendPositions', (positionsData) => {
          var x;
          let markers = this.state.outfitPostMarkers;
          for(x=0; x<this.state.friends.length; x++){
          	if (this.state.friends[x].username == positionsData.username){
          		markers[x].coordinate = {
          			latitude: positionsData.location.latitude,
          			longitude: positionsData.location.longitude
          		};
          	}
          }
          this.setState({outfitPostMarkers: markers,});
          //console.log("friendPositions:", positionsData);
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

	//get friends' most recent locations
	getFriends = async () => {
		await this.getUsername();
		try {
			let response = await fetch('http://3.93.183.130:3000/friendlist/' + this.state.username, { method: 'GET' });
			let responseJson = await response.json();
			var list = [];
			var l = 1;
			for (responseItem of responseJson) {
			 let response_post = await fetch('http://3.93.183.130:3000/weatherposts/' + responseItem, { method: 'GET' });
		     let posts = await response_post.json();

	    	   if (posts.length > 0){
			      let last_post = posts[posts.length-1];
			      let fromDate = last_post.date.split("-")
				  let rawDate = new Date(fromDate[0], fromDate[1] - 1, fromDate[2])
				  let formattedDate = moment(rawDate).format('ll')
				  let friend = {
				   	username: responseItem,
					image: last_post.photo,
					metaInfo: 'Meta Information',
					date: formattedDate,
				   	coordinate: last_post.coordinate,
				  };
				 this.state.friends.push(friend);
				 list.push({
                	outfitPostID: l,
					userID: responseItem,
					coordinate: {
						latitude: friend.coordinate.latitude,
						longitude: friend.coordinate.longitude
					},
					image: last_post.photo,
					date: formattedDate,
                });
				}
				l++;
			 }
			this.setState({
				friends: this.state.friends,
			});
            
          if (list.length > 0){
			
            this.setState({
                outfitPostMarkers: list,
            });
          }else{
		    let rawDate = new Date();
		    let formattedDate = moment(rawDate).format('ll');
        	this.setState({
        		outfitPostMarkers:[{
        			outfitPostID: 0,
					userID: this.state.username,
					coordinate: {
						latitude: this.state.coordinate.latitude,
						longitude: this.state.coordinate.longitude,
					},
					image: require('../../../assets/icon/role-icon/pikachu.png'),
					date: formattedDate,
        		}]

        	});
        }
        
      

		} catch (error) {
			console.error(error);
		}
	};


	// function to get user's realtime geolocation
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
		//this.socket.emit('position', 'Hello');
        console.log(location_raw);
		this.setState({
			initialMapRegion: { latitude: location_raw.coords.latitude, longitude: location_raw.coords.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 },
			coordinate: { latitude: location_raw.coords.latitude, longitude: location_raw.coords.longitude }

		});
	};

	// function to reload screen
	onRefresh = () => {
		this.getCurrentLocation();
		this.getFriends();
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
						onRegionChangeComplete={(mapRegion) => this.setState({ currentMapRegion:mapRegion })}
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
							<CurrentLocationButton onPress={() => this.map.animateToRegion(this.state.initialMapRegion) }>
								<MaterialIcons name={'my-location'} color={'black'} size={25} />
							</CurrentLocationButton>
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

const CurrentLocationButton = styled.TouchableOpacity`
    position: absolute;
    bottom: 20px;
		right: 15px;
		padding: 5px 5px 5px 5px;
		borderRadius: 5;
		backgroundColor: lightgray;
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