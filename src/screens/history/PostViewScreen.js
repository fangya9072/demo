import React from 'react';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-navigation';
import { Alert, KeyboardAvoidingView } from 'react-native';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Swiper from "react-native-web-swiper";
import CardFlip from 'react-native-card-flip';
import TopBanner from '../../components/TopBanner';
import { ICONS } from '../../constant/icon';

export default class PostViewScreen extends React.Component {

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
						<PostScollView>
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
							</CommentContainer>
						</PostScollView>
					</PostContainer>
					<InputArea>
					    <Input autoCorrect={false} onChangeText={(comment) => this.setState({comment: comment})} />
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
	padding-bottom: 40px;
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
    top: 5px;
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
	resize-mode: stretch;
	border-radius: 5px;
`;

const CommentContainer = styled.View`
    top: 35px;
    left: 5%;
    width: 90%;
`;

const InputArea = styled.View`
	position: absolute;
	height: 40px;
	width: 375px;
	bottom: 0px;
	background-color: whitesmoke;
	justify-content: center;
	zIndex: 1;
`;

const Input = styled.TextInput`
	height: 80%;
	border-radius: 5px;
    background-color: white;
	color: gray;
	padding-left: 8px;
	font-family: Didot;
	font-size: 15px;
`;