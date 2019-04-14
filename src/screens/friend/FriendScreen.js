import React from 'react';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-navigation';
import { AsyncStorage, ScrollView, Image } from 'react-native';
import Feather from "react-native-vector-icons/Feather";
import TopBanner from '../../components/TopBanner';


export default class FriendScreen extends React.Component {

	// set up navigation
	static navigationOptions = {
		title: 'FRIEND',
	};

	// set up state
	constructor(props) {
		super(props);
		this.state = {
			pageTitle: 'FRIEND',
			username: '',
			viewMode: {
				isRequestView: true,
				isListView: false,
				isSearchView: false,
				isInviteView: false,
			},
			friendRequestList: [],
			friendList: [],
			errorMsg: '',
		};
	}

	// functions that runs whenever HomePage is rerendered in DOM
	componentDidMount() {
		this.getFriendRequests();
	}

	// function to retrive username from persistant storage
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

	// function to get all pending friend requests
	getFriendRequests = async () => {
		await this.getUsername();
		try {
			let response = await fetch('http://3.93.183.130:3000/friendrequests/' + this.state.username, { method: 'GET' })
			let responseJson = await response.json();
			for (responseItem of responseJson) {
				request = {
					requestId: responseItem.id,
					username: responseItem.user_from_id,
					icon: require('../../../assets/icon/role-icon/pikachu.png'),
				}
				this.state.friendRequestList.push(request);
			}
			this.setState({
				friendRequestList: this.state.friendRequestList,
			});
		} catch (error) {
			console.error(error);
		}
	};

	// function to refresh friend requests
	refreshFriendRequests = async () => {
		this.setState({
			friendRequestList: [],
		});
		this.getFriendRequests();
	};

	// function to get friend list
	getFriendList = async () => {
		await this.getUsername();
		try {
			let response = await fetch('http://3.93.183.130:3000/friendlist/' + this.state.username, { method: 'GET' })
			let responseJson = await response.json();
			for (responseItem of responseJson) {
				friend = {
					// friendId: responseItem.id,
					username: responseItem,
					icon: require('../../../assets/icon/role-icon/pikachu.png'),
					metaInfo: 'Meta Information',
				}
				this.state.friendList.push(friend);
			}
			this.setState({
				friendList: this.state.friendList,
			});
		} catch (error) {
			console.error(error);
		}
	};

	// function to refresh friend lists
	refreshFriendList = async () => {
		this.setState({
			friendList: [],
		});
		this.getFriendList();
	};

		// function to delete friend request
		deleteFriendRequest = async (id) => {
			try {
				let response = await fetch('http://3.93.183.130:3000/friendrequests/' + id, { method: 'DELETE' })
				let responseJson = await response.json();
				if (responseJson.deleted == 1) {
					this.refreshFriendRequests();
				} else {
					this.setState({ errorMsg: 'Unable to delete friend request. Please try again.' });
				}
			} catch (error) {
				console.error(error);
			}
		};
	
		// function to comfirm friend request
		confirmFriendRequest = async (id) => {
			try {
				let response = await fetch('http://3.93.183.130:3000/friendrequests/' + id, { method: 'POST' })
				let responseJson = await response.json();
				if (responseJson.replaced == 1) {
					this.refreshFriendRequests();
				} else {
					this.setState({ errorMsg: 'Unable to comfirm friend request. Please try again.' });
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
					<TopBanner pageTitle={this.state.pageTitle} navigation={this.state.navigation} />
					<FriendContainer>
						<TabNavigator>
							<Tab
								onPress={() => {
									this.setState({
										viewMode: { isRequestView: true, isListView: false, isSearchView: false, isInviteView: false }
									});
									this.refreshFriendRequests();
								}}
								style={[this.state.viewMode.isRequestView ? { backgroundColor: 'lightblue' } : { backgroundColor: 'white' }]}
							>
								<TabIconWrapper>
									<Feather name='user-plus' size={25} />
								</TabIconWrapper>
								<TabTextWrapper><TabText> Request </TabText></TabTextWrapper>
							</Tab>
							<Tab
								onPress={() => {
									this.setState({
										viewMode: { isRequestView: false, isListView: true, isSearchView: false, isInviteView: false }
									});
									this.refreshFriendList();
								}}
								style={[this.state.viewMode.isListView ? { backgroundColor: 'lightblue' } : { backgroundColor: 'white' }]}
							>
								<TabIconWrapper>
									<Feather name='users' size={25} />
								</TabIconWrapper>
								<TabTextWrapper><TabText> Friend </TabText></TabTextWrapper>
							</Tab>
							<Tab
								onPress={() => this.setState({
									viewMode: { isRequestView: false, isListView: false, isSearchView: true, isInviteView: false }
								})}
								style={[this.state.viewMode.isSearchView ? { backgroundColor: 'lightblue' } : { backgroundColor: 'white' }]}
							>
								<TabIconWrapper>
									<Feather name='search' size={25} />
								</TabIconWrapper>
								<TabTextWrapper><TabText> Search </TabText></TabTextWrapper>
							</Tab>
							<Tab
								onPress={() => this.setState({
									viewMode: { isRequestView: false, isListView: false, isSearchView: false, isInviteView: true }
								})}
								style={[this.state.viewMode.isInviteView ? { backgroundColor: 'lightblue' } : { backgroundColor: 'white' }]}
							>
								<TabIconWrapper>
									<Feather name='mail' size={25} />
								</TabIconWrapper>
								<TabTextWrapper><TabText> Invite </TabText></TabTextWrapper>
							</Tab>
						</TabNavigator>

						{this.state.viewMode.isRequestView && <RequestView>
							{this.state.friendRequestList.length == 0 && <NoContentView>
								<NoContentText> No pending request </NoContentText>
							</NoContentView>}
							{this.state.friendRequestList.length > 0 && <HasContentView>
								<ScrollView contentContainerStyle={{ alignItems: 'center' }}>
									{this.state.friendRequestList.map((item, key) => {
										return (
											<RequestItem key={key}>
												<UserIconWrapper>
													<Image source={item.icon} style={{ width: 60, height: 60, borderRadius: 30 }} />
												</UserIconWrapper>
												<UserInfoWrapper>
													<UserNameWrapper>
														<UserNameText>{item.username}</UserNameText>
													</UserNameWrapper>
													<ButtonArea>
														<ButtonWrapper onPress={() => this.deleteFriendRequest(item.requestId)}>
															<ButtonText> COMFIRM </ButtonText>
														</ButtonWrapper>
														<ButtonWrapper onPress={() => this.deleteFriendRequest(item.requestId)}>
															<ButtonText> DELETE </ButtonText>
														</ButtonWrapper>
													</ButtonArea>
												</UserInfoWrapper>
											</RequestItem>
										);
									})}
								</ScrollView>
							</HasContentView>}
						</RequestView>}

						{this.state.viewMode.isListView && <ListView>
							{this.state.friendList.length == 0 && <NoContentView>
								<NoContentText> No friend yet </NoContentText>
							</NoContentView>}
							{this.state.friendList.length > 0 && <HasContentView>
								<ScrollView contentContainerStyle={{ alignItems: 'center' }}>
									<ListWrapper>
										{this.state.friendList.map((item, key) => {
											return (
												<FriendItem key={key}>
													<UserIconWrapper>
														<Image source={item.icon} style={{ width: 50, height: 50, borderRadius: 25 }} />
													</UserIconWrapper>
													<UserInfoWrapper>
														<UserNameWrapper>
															<UserNameText style={{ paddingTop: 10 }}>{item.username}</UserNameText>
														</UserNameWrapper>
														<MetaInfoWrapper>
															<MetaInfoText>{item.metaInfo}</MetaInfoText>
														</MetaInfoWrapper>
													</UserInfoWrapper>
												</FriendItem>
											);
										})}
									</ListWrapper>
									<CounterWrapper>
										<CounterText> {this.state.friendList.length} friend(s) </CounterText>
									</CounterWrapper>
								</ScrollView>
							</HasContentView>}
						</ListView>}
						{this.state.viewMode.isSearchView && <SearchView></SearchView>}
						{this.state.viewMode.isInviteView && <InviteView></InviteView>}
					</FriendContainer>
				</Container>
			</SafeAreaView>
		);
	}
}

// css
const Container = styled.View`
    height: 100%;
	width: 100%;
	background-color: white;
`;

const FriendContainer = styled.View`
    top: 45px;
	width: 100%;
	height: 93.5%;
`;

const TabNavigator = styled.View`
    flex: 1;
	border: 1px solid whitesmoke;
	flex-direction: row;
`;
const Tab = styled.TouchableOpacity`
    flex: 1;
	flex-direction: column;
`;

const TabIconWrapper = styled.View`
	flex: 4;
	align-items: center;
	padding-top: 10px;
`;

const TabTextWrapper = styled.View`
    flex: 3;
	align-items: center;
`;

const TabText = styled.Text`
    padding-bottom: 10px;
    font-size: 15px;
    font-family: Gill Sans;
    color: black;
`;

const RequestView = styled.View`
	flex: 9;
`;

const ListView = styled.View`
    flex: 9;
`;

const SearchView = styled.View`
    flex: 9;
`;

const InviteView = styled.View`
    flex: 9;
`;

const NoContentView = styled.View`
	flex: 1;
	align-items: center;
`;

const NoContentText = styled.Text`
	top: 50px;
	font-size: 20px;
    font-family: Gill Sans;
    color: silver;
`;

const HasContentView = styled.View`
	flex: 1;
	padding-top: 10px;
`;

const RequestItem = styled.View`
	width: 95%;
	height: 75px;
	margin-bottom: 10px;
	border-radius: 5px;
	border: 1.5px solid whitesmoke;
	flex-direction: row;
`;

const UserIconWrapper = styled.View`
	flex: 1;
	align-items: center;
	justify-content: center;
`;

const UserInfoWrapper = styled.View`
	flex: 3.5
	flex-direction: column;
`;

const UserNameWrapper = styled.View`
	flex: 1;
	justify-content: center;
	padding-left: 15px;
`;

const UserNameText = styled.Text`
	font-size: 15px;
    font-family: Gill Sans;
	color: gray;
`;

const ButtonArea = styled.View`
	flex: 1;
	align-content: center;
	flex-direction: row;
`;

const ButtonWrapper = styled.TouchableOpacity`
    height: 25px;
	width: 75px;
	border-radius: 5px;
	margin-left: 15px;
	background-color: lightgray;
	justify-content: center;
	align-items: center;
`;

const ButtonText = styled.Text`
    font-size: 12.5px;
    font-family: Gill Sans;
`;

const ListWrapper = styled.View`
	width: 95%;
	border-radius: 5px;
	border: 1px solid whitesmoke;	
`;

const FriendItem = styled.TouchableOpacity`
	width: 95%;
	height: 65px;
	border-bottom-color: whitesmoke;
	border-bottom-width: 0.5;
	flex-direction: row;
`;

const MetaInfoWrapper = styled.View`
	flex: 1;
	padding-left: 15px;
`;

const MetaInfoText = styled.Text`
    font-size: 15px;
    font-family: Gill Sans;
	color: lightgray;
	padding-top: 5px;
`;

const CounterWrapper = styled.View`
    width: 100%;
	height: 50px;
	align-items: center;
	justify-content: center;
	margin-bottom: 7.5px;
`;

const CounterText = styled.Text`
    font-size: 17.5px;
    font-family: Gill Sans;
	color: gray;
`;