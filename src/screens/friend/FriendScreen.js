import React from 'react';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-navigation';
import { Keyboard, AsyncStorage, ScrollView, Image, TouchableOpacity } from 'react-native';
import Feather from "react-native-vector-icons/Feather";
import Entypo from "react-native-vector-icons/Entypo";
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
			isInputCancelButtonVisible: false,
			searchInput: '',
			isSearchResultVisible: false,
			searchUserResult: [],
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
				let request = {
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

	/* 
	function to refresh friend requests
	will run whenever user goes to request view
	*/
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
				let friend = {
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

	/*
	 function to refresh friend lists
	 will run whenever user is friend list view
	 */
	refreshFriendList = async () => {
		this.setState({
			friendList: [],
		});
		this.getFriendList();
	};

	/* 
	function to delete friend request by request id
	will run when user click the DELETE button for each friend request in request view
	*/
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

	/* 
	function to comfirm friend request by request id
	will run when user click the COMFIRM button for each friend request in request view
	*/
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

	// function to delete friend by two usernames
	deleteFriend = async (username1, username2) => { };

	/*
	 function to search user by user input (username/email/address)
	 will run when user click the Search button on keyboard after finish texting in the search field in search view
	 all returned earch results will be displayed by the order of self > add > pending > friend
	 */
	searchUser = async (input) => {
		await this.clearSearchResult();
		await this.getUsername();
		if (input) { // not search if empty input
			var sortedResult = [];
			try {
				let response = await fetch('http://3.93.183.130:3000/search/?index=' + input, { method: 'GET' })
				let responseJson = await response.json();
				if (responseJson) {
					var selfResult = [];
					var addResult = [];
					var pendingResult = [];
					var friendResult = [];
					for (responseItem of responseJson) {
						// identify if the returned user is found by username/email/phone
						let searchMode;
						if (responseItem.username == this.state.searchInput) {
							searchMode = 'found by username';
						} else if (responseItem.number == this.state.searchInput) {
							searchMode = 'found by phone';
						} else if (responseItem.email == this.state.searchInput) {
							searchMode = 'found by email';
						} else {
							this.setState({ errorMsg: 'Unable to identify the matching mode of search result' });
						}
						// check the friend status of each returned user
						let friendStatus = await this.checkFriend(responseItem.username, this.state.username);
						// create user object
						let user = {
							username: responseItem.username,
							searchMode: searchMode,
							friendStatus: friendStatus,
							icon: require('../../../assets/icon/role-icon/pikachu.png'),
						}
						// push the newly created user object it into the its friend status array 
						if (friendStatus == 'self') {
							selfResult.push(user);
						} else if (friendStatus == 'add') {
							addResult.push(user);
						} else if (friendStatus == 'pending') {
							pendingResult.push(user);
						} else if (friendStatus == 'friend') {
							friendResult.push(user);
						} else {
							this.setState({ errorMsg: 'Unable to identify the friend status of search result' })
						};
					}
					// sort all search results by the order of self > add > pending > friend
					sortedResult = selfResult.concat(addResult).concat(pendingResult).concat(friendResult);
				} else {
					this.setState({ errorMsg: 'Unable to find users that match the searching requirement' });
				}
				// update state to re-render
				this.setState({
					searchUserResult: sortedResult,
					isSearchResultVisible: true,
				});
			} catch (error) {
				console.error(error);
			}
		}
	};

	/*
	functionto to clear friend search results
	will run when user do a new friend search, or click the cancel button next to the search input field
	*/
	clearSearchResult = async () => {
		this.setState({
			searchUserResult: [],
		});
	};

	/* 
	function to send friend request
	current user's username as the first argument, the username of the user who gets friend request as the second argument
	will run when user click on the Add button for friend search reqult in search view
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
				let user_to = this.state.searchUserResult.find((user) => {
					return user.username == username_to;
				});
				user_to.friendStatus = 'pending';
				this.setState({
					searchUserResult: this.state.searchUserResult,
				});
			} else {
				this.setState({ errorMsg: 'Friend Request Already Exist!' })
			}
		} catch (error) {
			console.error(error);
		}
	};

	/* 
	function to check the friend status of two users by their username
	status restricted to 'self', 'friend', 'pending', 'add' 
	*/
	checkFriend = async (username1, username2) => {
		if (username1 == username2) {
			return 'self';
		} else {
			try {
				let response = await fetch('http://3.93.183.130:3000/checkfriend/' + username1 + '?user2=' + username2, { method: 'GET' });
				let responseJson = await response.json();
				if (responseJson == true) {
					return 'friend';
				} else if (responseJson == false) {
					return 'pending';
				} else {
					return 'add';
				}
			} catch (error) {
				console.error(error);
			}
		}
	};

	// rendering
	render() {
		return (
			<SafeAreaView style={{ backgroundColor: 'whitesmoke', flex: 1 }}>
				<Container>
					<TopBanner pageTitle={this.state.pageTitle} navigation={this.state.navigation} />
					<FriendContainer>
						{/* 
						Tab Navigator that hold four buttons: 'REQUEST', 'FRIEND', 'SEARCH', 'INVITE'
						enable user to switch between four different views
						*/}
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
								onPress={() => {
									this.setState({
										viewMode: { isRequestView: false, isListView: false, isSearchView: true, isInviteView: false },
										isInputCancelButtonVisible: false,
									});
								}}
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
						{/* 
						Request View
						will show first by default when user open the Friend Page
						will re-render (i.e. refresh friend request list) when user click the REQUEST button on TabNavigator
						*/}
						{this.state.viewMode.isRequestView && <RequestView>
							{this.state.friendRequestList.length == 0 && <NoContentView>
								<NoContentText> No pending request </NoContentText>
							</NoContentView>}
							{this.state.friendRequestList.length > 0 && <HasContentView>
								<ScrollView contentContainerStyle={{ alignItems: 'center', paddingTop: 10 }}>
									{this.state.friendRequestList.map((item, key) => {
										return (
											<RequestItem key={key}>
												<UserIconWrapper style={{ flex: 1 }}>
													<Image source={item.icon} style={{ width: 60, height: 60, borderRadius: 30 }} />
												</UserIconWrapper>
												<UserInfoWrapper style={{ flex: 3.5 }}>
													<UserNameWrapper>
														<UserNameText>{item.username}</UserNameText>
													</UserNameWrapper>
													<ButtonArea>
														<ButtonWrapper onPress={() => this.confirmFriendRequest(item.requestId)}>
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
						{/* 
						Friend List View
						will re-render (i.e. refresh friend list) when user click the FRIEND button on TabNavigator
						*/}
						{this.state.viewMode.isListView && <ListView>
							{this.state.friendList.length == 0 && <NoContentView>
								<NoContentText> No friend yet </NoContentText>
							</NoContentView>}
							{this.state.friendList.length > 0 && <HasContentView>
								<ScrollView contentContainerStyle={{ alignItems: 'center', paddingTop: 10 }}>
									<ListWrapper>
										{this.state.friendList.map((item, key) => {
											return (
												<FriendItem key={key}>
													<UserIconWrapper style={{ flex: 1 }}>
														<Image source={item.icon} style={{ width: 50, height: 50, borderRadius: 25 }} />
													</UserIconWrapper>
													<UserInfoWrapper style={{ flex: 3.5 }}>
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
						{/* 
						Friend Search View
						will restore user's previous activity on Search View when user click the SEARCH button on TabNavigator
						*/}
						{this.state.viewMode.isSearchView && <SearchView>
							<SearchInputWrapper>
								<Input
									ref={input => { this.textInput = input }}
									value={this.state.searchInput}
									placeholder='username/email/phone'
									clearButtonMode="always"
									autoCorrect={false}
									returnKeyType="search"
									onFocus={() => this.setState({ isInputCancelButtonVisible: true })}
									onChangeText={(input) => this.setState({
										searchInput: input,
										isSearchResultVisible: false,
									})}
									onSubmitEditing={() => {
										this.searchUser(this.state.searchInput);
										this.setState({
											isInputCancelButtonVisible: false,
										});
									}}
								/>
								{this.state.isInputCancelButtonVisible &&
									<CancelButton onPress={() => {
										Keyboard.dismiss();
										this.setState({
											isInputCancelButtonVisible: false,
											isSearchResultVisible: false,
											searchInput: '',
										});
										this.textInput.clear();
										this.clearSearchResult();
									}}>
										<CancelButtonText> Cancel </CancelButtonText>
									</CancelButton>}
							</SearchInputWrapper>
							<SearchResultWrapper>
								{this.state.isSearchResultVisible && this.state.searchUserResult.length == 0 && this.state.searchInput != '' && <NoContentView>
									<NoContentText> No users found </NoContentText>
								</NoContentView>}
								{this.state.isSearchResultVisible && this.state.searchUserResult.length > 0 && this.state.searchInput != '' && <HasContentView>
									<ScrollView contentContainerStyle={{ alignItems: 'center', paddingTop: 10 }}>
										{this.state.searchUserResult.map((item, key) => {
											return (
												<SearchItem key={key}>
													<UserIconWrapper style={{ flex: 1 }}>
														<Image source={item.icon} style={{ width: 50, height: 50, borderRadius: 25 }} />
													</UserIconWrapper>
													<UserInfoWrapper style={{ flex: 2 }}>
														<UserNameWrapper>
															<UserNameText style={{ paddingTop: 10 }}>{item.username}</UserNameText>
														</UserNameWrapper>
														<MetaInfoWrapper>
															<MetaInfoText>{item.searchMode}</MetaInfoText>
														</MetaInfoWrapper>
													</UserInfoWrapper>
													<FriendButtonWrapper style={{ flex: 1.5 }}>
														{item.friendStatus == 'add' &&
															<TouchableOpacity
																onPress={() => this.sendFriendRequest(this.state.username, item.username)}
															>
																<FriendButton style={{ backgroundColor: 'gainsboro' }}>
																	<Entypo name={'plus'} size={20} style={{ marginLeft: 6.5, marginTop: 1.5 }} />
																	<FriendButtonText style={{ paddingLeft: 2.5, paddingRight: 6.5 }}> Add </FriendButtonText>
																</FriendButton>
															</TouchableOpacity>}
														{item.friendStatus == 'pending' &&
															<FriendButton style={{ backgroundColor: 'whitesmoke' }}>
																<Feather name={'loader'} size={17.5} style={{ marginLeft: 7.5, marginTop: 1 }} />
																<FriendButtonText style={{ paddingLeft: 2.5, paddingRight: 5 }}> Pending </FriendButtonText>
															</FriendButton>}
														{item.friendStatus == 'friend' &&
															<FriendButton style={{ backgroundColor: 'whitesmoke' }}>
																<Feather name={'users'} size={17.5} style={{ marginLeft: 10 }} />
																<FriendButtonText style={{ paddingLeft: 5, paddingRight: 2.5 }}> Friend </FriendButtonText>
															</FriendButton>}
													</FriendButtonWrapper>
												</SearchItem>
											);
										})}
									</ScrollView>
								</HasContentView>}
							</SearchResultWrapper>
						</SearchView>}
						{/* 
						Friend Invite View
						will show when user click the INIVITE button on TabNavigator
						leave for future development
						*/}
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
	align-items: center;
`;

const InviteView = styled.View`
	flex: 9;
	align-items: center;
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
	align-items: center;
	justify-content: center;
`;

const UserInfoWrapper = styled.View`
	flex-direction: column;
	justify-content: center;
`;

const UserNameWrapper = styled.View`
	flex: 1;
	justify-content: center;
`;

const UserNameText = styled.Text`
	font-size: 15px;
    font-family: Gill Sans;
	color: gray;
	padding-left: 15px;
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
	height: 65px;
	border-bottom-color: whitesmoke;
	border-bottom-width: 0.5;
	flex-direction: row;
`;

const MetaInfoWrapper = styled.View`
	flex: 1;
`;

const MetaInfoText = styled.Text`
    font-size: 15px;
    font-family: Gill Sans;
	color: lightgray;
	padding-top: 5px;
	padding-left: 15px;
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

const SearchInputWrapper = styled.View`
    width: 95%;
	flex: 1;
	border-radius: 5px;
	flex-direction: row;
	padding-top: 10px;
`;

const SearchResultWrapper = styled.View`
    width: 100%;
	flex: 14;
`;

const Input = styled.TextInput`
	flex: 4;
	border-radius: 5px;
    color: gray;
    font-family: Didot;
	font-size: 17.5px;
	padding-left: 10px;
	background-color: whitesmoke;
`;

const CancelButton = styled.TouchableOpacity`
	flex: 1;
	background-color: white;
	align-items: center;
	justify-content: center;
`;

const CancelButtonText = styled.Text`
    color: gray;
    font-family: Gill Sans;
	font-size: 17.5px;
`;

const SearchItem = styled.View`
	width: 95%;
	height: 65px;
	margin-bottom: 10px;
	border-radius: 5px;
	border: 1.5px solid whitesmoke;
	flex-direction: row;
`;

const FriendButtonWrapper = styled.View`
	justify-content: center;
`;

const FriendButton = styled.View`
	width: 80%;
	margin-left: 10%;
    height: 27.5px;
	border-radius: 5px;
	flex-direction: row;
	align-items: center;
	justify-content: center;
`;

const FriendButtonText = styled.Text`
    font-family: Gill Sans;
	font-size: 17.5px;
`;