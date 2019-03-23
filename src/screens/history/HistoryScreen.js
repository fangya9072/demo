import React from 'react';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-navigation';
import TopBanner from '../../components/TopBanner';
import { Modal } from 'react-native';

export default class HistoryScreen extends React.Component {

	// set up navigation
	static navigationOptions = {
		title: 'HISTORY',
	};

	// set up state
	constructor(props) {
		super(props);
		this.state = {
			pageType: 'HISTORY',
			topLeftMenuVisible: false,
			topLeftSubMenuVisible: false,
			topLeftMenuVisible: false,
			/* 
			two ways to update state:

			possible efficient idea:
			1. this.state.daysHavePost = []
			2. make API call to rethinDB to retrive user's all previous posts
			   iterate through each post
			   if in this.state.daysHavePost, there exists an object { date: 'post date', Posts[ ... some post data ... ] } that date:'post date' matches your interated post's date, add this post into Posts[ ... some post data ... ] of that object
			   else create a new { date: 'post date', Posts[], } and add it into this.state.daysHavePost 
			
			problem with the above solution: 
			no idea on how how to locate a apecific { date: 'post date', Posts[ ... some post data ... ] }
			also hard to sort date object in state
			maybe you all could do some research here to find out if it is feasible

			alternative dumb idea:
			use helping local array and local dict 
			1. this.state.daysHavePost = []
			2. first create an empty local dict, call it Day Dict, we want its structure to be like {key: date, value:[ some post objects ]}
			3. still first make API call to rethinDB to retrive user's all previous posts
			   iterate through each post
			   for each post, retrive its post_date, post_id, post_type, post_image_url, weather_info(if it is weather post)
			   build an { postId: post_id, postType: post_type, postImageUrl: post_image_url, optional WeatherInfo: weather_info } object for this post, call it Post Object
			   if Day Dict.haskey(post_date): 
				   get value(post objects array) by key(post_date) in Day Dict
				   update value(post objects array) by adding the newly created Post Object
			   else add {key: post_date, value:[  Post Object ]} into Day Dict
			4. sort Day Dict by key, since we want newst days show first
			5. then for each key/value pair in Day Dict
			   create a { date: key, Posts: value } object
			   add this object into this.state.daysHavePost
			*/
			daysHavePost: [
				{
					date: 'Mar 1 2019',
					Posts: [
						{
							postId: 1,
							postType: 'outfit',
							image: require('../../../assets/icon/role-icon/pikachu.png'),
						},
						{
							postId: 2,
							postType: 'outfit',
							image: require('../../../assets/icon/role-icon/trump.jpg'),
						},
						{
							postId: 3,
							postType: 'weather',
							image: require('../../../assets/icon/role-icon/pikachu.png'),
							weatherInfo: [1, 0.4, 0.6, 0.8],
						},
						{
							postId: 4,
							postType: 'outfit',
							image: require('../../../assets/icon/role-icon/trump.jpg'),
						},
						{
							postId: 5,
							postType: 'weather',
							image: require('../../../assets/icon/role-icon/pikachu.png'),
							weatherInfo: [0.2, 1, 0.6, 0.2],
						},
						{
							postId: 6,
							postType: 'outfit',
							image: require('../../../assets/icon/role-icon/trump.jpg'),
						},
					],
				},
				{
					date: 'Feb 28 2019',
					Posts: [
						{
							postId: 1,
							postType: 'outfit',
							image: require('../../../assets/icon/role-icon/trump.jpg'),
						},
					],
				},
				{
					date: 'Feb 26 2019',
					Posts: [
						{
							postId: 1,
							postType: 'weather',
							image: require('../../../assets/icon/role-icon/pikachu.png'),
							weatherInfo: [0.5, 0.2, 1, 0.6],
						},
						{
							postId: 2,
							postType: 'outfit',
							image: require('../../../assets/icon/role-icon/trump.jpg'),
						},
					],
				},
				{
					date: 'Feb 23 2019',
					Posts: [
						{
							postId: 1,
							postType: 'weather',
							image: require('../../../assets/icon/role-icon/pikachu.png'),
							weatherInfo: [1, 0.8, 0.2, 0.2],
						},
						{
							postId: 2,
							postType: 'outfit',
							image: require('../../../assets/icon/role-icon/trump.jpg'),
						},
					],
				},
				{
					date: 'Feb 22 2019',
					Posts: [
						{
							postId: 1,
							postType: 'outfit',
							image: require('../../../assets/icon/role-icon/trump.jpg'),
						},
						{
							postId: 2,
							postType: 'weather',
							image: require('../../../assets/icon/role-icon/pikachu.png'),
							weatherInfo: [0, 0.8, 1, 0],
						},
						{
							postId: 3,
							postType: 'outfit',
							image: require('../../../assets/icon/role-icon/trump.jpg'),
						},
						{
							postId: 4,
							postType: 'outfit',
							image: require('../../../assets/icon/role-icon/pikachu.png'),
						},
						{
							postId: 5,
							postType: 'weather',
							image: require('../../../assets/icon/role-icon/trump.jpg'),
							weatherInfo: [1, 0, 0, 1],
						},
					],
				},
				{
					date: 'Feb 13 2019',
					Posts: [
						{
							postId: 1,
							postType: 'outfit',
							image: require('../../../assets/icon/role-icon/pikachu.png'),
							extraInfo: null,
						},
						{
							postId: 2,
							postType: 'weather',
							image: require('../../../assets/icon/role-icon/trump.jpg'),
							weatherInfo: [0.2, 1, 0.5, 0.8],
						},
					],
				},
				{
					date: 'Feb 8 2019',
					Posts: [
						{
							postId: 1,
							postType: 'outfit',
							image: require('../../../assets/icon/role-icon/trump.jpg'),
						},
					],
				},
			],
		};
	}

	// rendering
	render() {
		return (
			<SafeAreaView style={{ backgroundColor: 'whitesmoke', flex: 1}}>
				<Container>
					<History>
						{this.state.daysHavePost.map((dayItem, dayKey) => {
							return (
								<DailyPosts key={dayKey}>
									<Date><DateText>{dayItem.date}</DateText></Date>
									<Posts horizontal={true} showsHorizontalScrollIndicator={false}>
										{dayItem.Posts.map((postItem, postKey) => {
											return (
												<Post key={postKey}>
													<PostImage source={postItem.image} />
												</Post>
											);
										})}
									</Posts>
								</DailyPosts>
							);
						})}
					</History>
					{/* put components with absolute position at the bottom */}
					<TopBanner pageType={this.state.pageType} navigation={this.state.navigation}/>
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

const History = styled.ScrollView`
  top: 45px;
  height: 93.5%;
	width: 100%;
	background-color: white;
`;

const DailyPosts = styled.View`
	width: 100%;
	height: 135px;
	flex-direction: column;
`;

const Date = styled.View`
	flex: 1;
	margin-left: 15px;
	margin-right: 15px;
	border-bottom-width: 1;
	border-bottom-color: gainsboro;
	justify-content: flex-end;
`;

const DateText = styled.Text`
    font-size: 12.5px;
	font-family: Georgia;
	color: black;
`;

const Posts = styled.ScrollView`
	flex: 5;
	overflow: visible;
`;

const Post = styled.TouchableOpacity`
	height: 105px;
	width: 105px;
	margin-left: 15px;
	margin-top: 5px;
`;

const PostImage = styled.Image`
	height: 105px;
	width: 105px;
	resize-mode: stretch;
	border-radius: 5px;
`;