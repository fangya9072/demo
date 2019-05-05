import React from 'react';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-navigation';
import { Alert, KeyboardAvoidingView } from 'react-native';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Swiper from "react-native-web-swiper";
import CardFlip from 'react-native-card-flip';
import TopBanner from '../../components/TopBanner';
import { ICONS } from '../../constant/icon';
import Feather from "react-native-vector-icons/Feather";

export default class MyPostViewScreen extends React.Component {

	// set up navigation
	static navigationOptions = {
		title: 'MY POST',
	};

	// set up state
	constructor(props) {
		super(props);
		this.state = {
			pageTitle: 'MY POST',
			subOptionVisible: false,
			errorMessage: '',
			commentList: [
				{
					id: 1,
					username: 'Stotts',
					icon: null,
					date: '20:37, Mar 1, 2019',
					text: 'Doing what you like will always keep you happy ... Doing what you like will always keep you happy ... Doing what you like will always keep you happy ... Doing what you like will always keep you happy ...'
				},
				{
					id: 2,
					username: 'Mia',
					icon: null,
					date: '17:14, Mar 1, 2019',
					text: 'You look so adorable in this outfit! '
				},
				{
					id: 3,
					username: 'Jason',
					icon: null,
					date: '14:40, Mar 1, 2019',
					text: 'Wanna hang out with me this weekend?'
				},
				{
					id: 4,
					username: 'Kim',
					icon: null,
					date: '10:10, Mar 1, 2019',
					text: 'Have a nice day! Have a nice day! Have a nice day! Have a nice day! Have a nice day! Have a nice day! Have a nice day! Have a nice day!',
				},
			],
			commentInput: '',
		};
	}

	// function to delete post by id
	deletePost = async (id) => {
		Alert.alert(
			'Comfirm deletion?',
			'',
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Delete', onPress: () => {
						fetch('http://3.93.183.130:3000/allposts/' + id, {
							method: 'DELETE',
						}).then((response) => {
							let result = JSON.parse(response._bodyText)
							if (result.deleted == 1) {
								this.props.navigation.goBack();
							} else if (result.skipped == 1) {
								this.setState({ errorMessage: 'Post Already Deleted.' });
								this.props.navigation.goBack();
							} else {
								this.setState({ errorMessage: 'Delete Post Failed. Please Retry.' });
							}
						})
					}
				},
			],
		);
	};

	// function to send comment
	sendComment = async () => { }

	// rendering
	render() {
		// get post object from navigation parameter, default is null if not available 
		const post = this.props.navigation.getParam('post', null);
		var weatherPost, outfitPost;
		if (post.postType == "outfit") {
			outfitPost = {
				id: post.postId,
				image: post.image,
				date: post.date,
			};
		} else if (post.postType == "weather") {
			weatherPost = {
				id: post.postId,
				image: post.image,
				date: post.date,
				coordinate: post.coordinate,
				locationText: post.locationText,
				temperature: post.temperature,
				humidity: post.humidity,
				cloud: post.cloud,
				wind: post.wind,
			};
		} else {
			console.error("post type error");
		};

		return (
			<SafeAreaView style={{ backgroundColor: 'whitesmoke', flex: 1 }}>
				<Container>
					<KeyboardAvoidingView behavior="position" keyboardVerticalOffset={20}>
						<PostContainer>
							<PostScollView contentContainerStyle={{paddingBottom: 35}}>
								{weatherPost && <WeatherPost>
									<LocationWrapper>
										<LocationIcon><MaterialIcons name={'location-on'} size={22.5} /></LocationIcon>
										<LocationText> {weatherPost.locationText} </LocationText>
									</LocationWrapper>
									<SwiperContainer>
										<Swiper>
											<SwiperView>
												<PostImage source={{ uri: 'data:image/png;base64,' + weatherPost.image }} />
											</SwiperView>
											<SwiperView>
												<InfoContainer>
													<Colomn>
														<Row>
															<SubInfoContainer>
																<CardFlip style={{ flex: 1 }} ref={(card1) => this.card1 = card1} >
																	<Card onPress={() => this.card1.flip()} >
																		<WeatherText> TEMPERATURE </WeatherText>
																	</Card>
																	<Card onPress={() => this.card1.flip()} >
																		<WeatherIcon source={ICONS.weatherSlider['temperature' + weatherPost.temperature]} />
																	</Card>
																</CardFlip>
															</SubInfoContainer>
														</Row>
														<Row>
															<SubInfoContainer>
																<CardFlip style={{ flex: 1 }} ref={(card2) => this.card2 = card2} >
																	<Card onPress={() => this.card2.flip()} >
																		<WeatherText> HUMIDITY </WeatherText>
																	</Card>
																	<Card onPress={() => this.card2.flip()} >
																		<WeatherIcon source={ICONS.weatherSlider['humidity' + weatherPost.humidity]} />
																	</Card>
																</CardFlip>
															</SubInfoContainer>
														</Row>
													</Colomn>
													<Colomn>
														<Row>
															<SubInfoContainer>
																<CardFlip style={{ flex: 1 }} ref={(card3) => this.card3 = card3} >
																	<Card onPress={() => this.card3.flip()} >
																		<WeatherText> CLOUD </WeatherText>
																	</Card>
																	<Card onPress={() => this.card3.flip()} >
																		<WeatherIcon source={ICONS.weatherSlider['cloud' + weatherPost.cloud]} />
																	</Card>
																</CardFlip>
															</SubInfoContainer>
														</Row>
														<Row>
															<SubInfoContainer>
																<CardFlip style={{ flex: 1 }} ref={(card4) => this.card4 = card4} >
																	<Card onPress={() => this.card4.flip()} >
																		<WeatherText> WIND </WeatherText>
																	</Card>
																	<Card onPress={() => this.card4.flip()} >
																		<WeatherIcon source={ICONS.weatherSlider['wind' + weatherPost.wind]} />
																	</Card>
																</CardFlip>
															</SubInfoContainer>
														</Row>
													</Colomn>
												</InfoContainer>
											</SwiperView>
										</Swiper>
									</SwiperContainer>
									<PostInfo>
										<Date><DateText> {weatherPost.date} </DateText></Date>
										{this.state.subOptionVisible && <SubOption>
											<SubOptionButton onPress={() => { this.deletePost(weatherPost.id) }}>
												<SubOptionButtonText>   DELETE   </SubOptionButtonText>
											</SubOptionButton>
										</SubOption>}
										<OptionButton onPress={() => this.setState({ subOptionVisible: !this.state.subOptionVisible })}>
											<OptionButtonText> • • • </OptionButtonText>
										</OptionButton>
									</PostInfo>
								</WeatherPost>}

								{outfitPost && <OutfitPost>
									<PostImage source={{ uri: 'data:image/png;base64,' + outfitPost.image }} />
									<PostInfo>
										<Date>
											<DateText> {outfitPost.date} </DateText>
										</Date>
										<OptionArea>
											{this.state.subOptionVisible && <SubOption>
												<SubOptionButton onPress={() => { this.deletePost(outfitPost.id) }}>
													<SubOptionButtonText>   DELETE   </SubOptionButtonText>
												</SubOptionButton>
											</SubOption>}
											<OptionButton onPress={() => this.setState({ subOptionVisible: !this.state.subOptionVisible })}>
												<OptionButtonText> • • • </OptionButtonText>
											</OptionButton>
										</OptionArea>
									</PostInfo>
								</OutfitPost>}
								<CommentContainer>
									{/* 
									make API call to rethinkDB to retrive real comments
									set retrived comments into this.state.commentList
									replace require('../../assets/icon/role-icon/pikachu.jpg') with { uri: item.icon } after setting up state 
									*/}
									{this.state.commentList.map((item, key) => {
										return (
											<CommentItemWrapper key={key}>
												<CommentItem>
													<UserInfoArea>
														<UserIcon source={require('../../../assets/icon/role-icon/pikachu.png')} />
														<Username> {item.username} </Username>
													</UserInfoArea>
													<CommentContent>
														<CommentText>{item.text}{"\n"}</CommentText>
														<CommentTime>{item.date}</CommentTime>
													</CommentContent>
												</CommentItem>
											</CommentItemWrapper>
										);
									})}
								</CommentContainer>
							</PostScollView>
						</PostContainer>
						<InputArea>
							<InputWrapper>
								<Input placeholder={"Comment"} autoCorrect={false} onChangeText={(commentInput) => this.setState({ commentInput: commentInput })} />
							</InputWrapper>
							<SendButton onPress={() => { this.sendComment() }}>
								<Feather name={'send'} size={25} />
							</SendButton>
						</InputArea>
					</KeyboardAvoidingView>
					<TopBanner pageTitle={this.state.pageTitle} navigation={this.state.navigation} />
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
	overflow: hidden;
`;

const PostContainer = styled.View`
    top: 45px;
	width: 100%;
	height: 100%;
	padding-bottom: 87.5px;
`;

const PostScollView = styled.ScrollView`
    flex: 1;
`;

const WeatherPost = styled.View`
    left: 5%;
    width: 90%;
    top: 15px;
`;

const OutfitPost = styled.View`
    left: 5%;
    width: 90%;
    top: 15px;
`;

const PostInfo = styled.View`
    top: 10px;
	width: 100%;
	height: 25px;
	flex-direction: row;
`;

const Date = styled.View`
    flex: 1;
	align-items: flex-start;
	justify-content: center;
`;

const DateText = styled.Text`
    font-size: 12.5px;
    font-family: Georgia;
	color: gray;
`;

const OptionArea = styled.View`
	flex: 3;
	align-items: center;
	justify-content: flex-end;
	flex-direction: row;
`;

const SubOption = styled.View`
	height: 100%;
	flex-direction: row;
	align-items: center;
`;

const SubOptionButton = styled.TouchableOpacity`
	height: 85%;
	background-color: lightblue;
	border-radius: 15px;
	align-items: flex-start;
	justify-content: center;
	margin-right: 5px;
`;

const SubOptionButtonText = styled.Text`
    font-family: Bradley Hand;
	font-size: 15px;
`;

const OptionButton = styled.TouchableOpacity`
	width: 40px;
	height: 100%;
	align-items: center;
	justify-content: center;
`;

const OptionButtonText = styled.Text`
    font-size: 12.5px;
    font-family: Georgia;
	color: black;
`;

const LocationWrapper = styled.View`
    width: 100%;
    height: 25px;
	flex-direction: row;
`;

const LocationIcon = styled.View`
    height: 20px;
    width: 20px;
    justify-content: center;
    align-items: center;
`;

const LocationText = styled.Text`
    font-family: Optima;
    font-size: 15px;
    padding-top: 2.5px;
	padding_left: 2.5px;
`;

const SwiperContainer = styled.View`
    margin-top: 2.5px;
    width: 100%;
	aspect-ratio: 1;
`;

const SwiperView = styled.View`
	flex: 1;
	border-radius: 5px;
`;

const InfoContainer = styled.View`
	width: 100%;
	height: 90%;
    align-items: center;
    justify-content: center;
`;

const Colomn = styled.View`
	flex: 1;
	flex-direction: row;
`;

const Row = styled.View`
	flex: 1;
	align-items: center;
	justify-content: center;
`;

const SubInfoContainer = styled.View`
	height: 90%;
	width: 90%;
`;

const Card = styled.TouchableOpacity`
	flex: 1;
	background-color: whitesmoke;
	border-radius: 10px;
	align-items: center;
	justify-content: center;
`;

const WeatherIcon = styled.Image`
	width: 40px;
	height: 40px;
	resize-mode: stretch;
`;

const WeatherText = styled.Text`
    font-family: Optima;
	font-size: 12.5px;
	padding-top: 10px;
`;

const PostImage = styled.Image`
	width: 100%;
	aspect-ratio: 1;
	resize-mode: contain;
	border-radius: 5px;
`;

const CommentContainer = styled.View`
    top: 35px;
    left: 5%;
    width: 90%;
`;

const CommentItemWrapper = styled.View`
	width: 100%;
`;

const CommentItem = styled.View`
	padding-top: 5px;
	padding-bottom: 5px;
	flex-direction: row;
	background-color: #FBFBFB;
	border-bottom-color: gainsboro;
	border-bottom-width: 0.5;
	border-radius: 5px;
`;

const UserInfoArea = styled.View`
	flex: 1;
	height: 100%;
	padding-left: 10px;
	padding-top: 5px;
	align-items: center;
`;

const UserIcon = styled.Image`
	width: 100%;
	height: 50px;
	resize-mode: cover;
	border-radius: 25px;
`;

const Username = styled.Text`
	font-size: 10px;
	font-weight: bold;
	padding-top: 5px;
`;

const CommentContent = styled.Text`
	flex: 5;
	padding-left: 17.5px
	padding-right: 15px;
	padding-top: 5px;
`;

const CommentText = styled.Text`
    color: black;
	font-size: 12px;
`;

const CommentTime = styled.Text`
	font-size: 10px;
	color: gray;
`;

const InputArea = styled.View`
	position: absolute;
	height: 42.5px;
	width: 375px;
	bottom: 0px;
	zIndex: 1;
	flex-direction: row;
	border: 0.5px solid gainsboro;
`;

const InputWrapper = styled.View`
	flex: 6;
	background-color: whitesmoke;
	justify-content: center;
	align-items: center;
`;

const Input = styled.TextInput`
    width: 95%;
	height: 70%;
	border-radius: 5px;
    background-color: white;
	color: gray;
	padding-left: 8px;
	font-family: Didot;
	font-size: 15px;
`;

const SendButton = styled.TouchableOpacity`
    flex: 1;
	background-color: lightblue;
	justify-content: center;
	align-items: center;
`;