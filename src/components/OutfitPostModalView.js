import React from 'react';
import styled from 'styled-components/native';
import { COLORS } from '../constant/color';

/* 
outfit post view Component
transparent by default
appears when user click the icon of a person nearby on the map 
*/

export default class OutfitPostModalView extends React.Component {
	// set up state
	constructor(props) {
		super(props);
		this.state = {
			username: 'Username',
			pic: '',
			/*  
			comments below for people nearby are only for test purpose
			make API call to rethinkDB to get real comments
			need to order comments by time posted
			*/
			comments: [ 
				{ id: 1, 
				  username: 'Stotts',
				  icon: '', 
				  date: '20:37, Mar 1, 2019',
				  text: 'Doing what you like will always keep you happy ... Doing what you like will always keep you happy ... Doing what you like will always keep you happy ... Doing what you like will always keep you happy ...' },
				{ id: 2, 
				  username: 'Mia',
				  icon: '', 
				  date: '17:14, Mar 1, 2019',
				  text: 'You look so adorable in this outfit! ' },
				{ id: 3, 
				  username: 'Jason',
				  icon: '', 
			   	  date: '14:40, Mar 1, 2019',
				  text: 'Wanna hang out with me this weekend?' },
				{ id: 4, 
				  username: 'Kim',
				  icon: '', 
				  date: '10:10, Mar 1, 2019',
				  text: 'Have a nice day! Have a nice day! Have a nice day! Have a nice day! Have a nice day! Have a nice day! Have a nice day! Have a nice day!',
				},
	        ],
		};
	}

	//rendering
	render(){
		return(
			<ModalContainer>
				<ModalView>
					<CloseButtonArea>
						<CloseButton onPress={this.props.close} >
						    <CloseButtonIcon source={require('../../assets/icon/function-icon/close.png')} />
						</CloseButton>
					</CloseButtonArea>
					{/* 
					make API call to rethinkDB to get real username for a specific outfit post
					set retrieved username as this.state.username
					*/}
					<UsernameArea>
						<UsernameText> {this.state.username} </UsernameText>
					</UsernameArea>
					<PhotoArea>
						{/* 
						make API call to rethinkDB to get real picture
						set retrieved picture url as this.state.pic
						replace require('../../assets/icon/role-icon/trump.jpg') with { uri: this.state.pic } after setting up state 
						*/}
						<Photo source={require('../../assets/icon/role-icon/trump.jpg')}  />
					</PhotoArea>
					<FriendArea>
						<FriendButton>
							<FriendButtonIcon source={require('../../assets/icon/function-icon/plus.png')} />
							<FriendButtonText> Request </FriendButtonText>
						</FriendButton>
					</FriendArea>
					<CommentArea>
						<CommentView>
						    {/* 
							make API call to rethinkDB to retrive real comments
							set retrived comments into this.state.comments
							replace require('../../assets/icon/role-icon/pikachu.jpg') with { uri: item.icon } after setting up state 
							*/}
							{this.state.comments.map((item, key) => {
								return (
									<CommentItem key={key}>
										<UserInfoArea>
											<UserIcon source={require('../../assets/icon/role-icon/pikachu.png')} />
											<Username> {item.username} </Username>
										</UserInfoArea>
										<CommentContent> 
											<CommentText>{item.text} </CommentText> 
											<CommentTime> {item.date}</CommentTime>
								        </CommentContent>
							        </CommentItem>  	
				        		);
							})}
						</CommentView>
						<CommentWrite>
							<CommentInput></CommentInput>
							<SendButton>
								<SendButtonIcon source={require('../../assets/icon/function-icon/send.png')}  />
							</SendButton>
						</CommentWrite>
					</CommentArea>
				</ModalView>
	    	</ModalContainer>
		);
	}
}


// css
const ModalContainer = styled.View`
	flex:1;
	flexDirection: column;
	justifyContent: center;
	alignItems: center;
`;
	
const ModalView = styled.View`
	width: 300;
	height: 450;
	backgroundColor: rgba(255, 255, 255, 0.85);
`;
	
const CloseButtonArea = styled.View`
	width: 100%;
	height: 6.25%;
	align-items: flex-end;
`;

const CloseButton = styled.TouchableOpacity`
	width: 25px;
	height: 25px;
	backgroundColor: lightblue;
	border-radius: 25px
	align-items: center;
	justify-content: center;
	margin-right: 5px;
	margin-top: 5px;
`;

const CloseButtonIcon = styled.Image`
	width: 30px;
	height: 30px;
`;
	
const UsernameArea = styled.View`
	width: 100%;
	height: 5%;
	align-items: center;
`;

const UsernameText = styled.Text`
	font-size: 20px;
	font-family: Courier;
	color: black;
`;
	
const PhotoArea = styled.View`
    top: 2.5%;
	width: 100%;
	height: 35%;
	align-items: center;
`;

const Photo = styled.Image`
	width: 150px;
	height: 150px;
`;
	
const FriendArea = styled.View`
    top: 5%;
	width: 100%;
	height: 6%;
	align-items: center;
`;
	
const FriendButton = styled.TouchableOpacity`
	width: 45%;
	height: 100%;
	backgroundColor: lightblue;
	border-radius: 5px;
	flex-direction: row;
	align-items: center;
	justify-content: center;
`;

const FriendButtonIcon = styled.Image`
    flex: 1;
	height: 16.5px;
	margin-left: 12.5px;
`;

const FriendButtonText = styled.Text`
    flex: 5;
	font-size: 16px;
	font-family: Courier;
	font-weight: bold;
	padding-top: 1px;
	margin_left: 10px;
`;

const CommentArea = styled.View`
	top: 10%;
	width: 100%;
	height: 38%;
	flex-direction: column;
`;

const CommentView = styled.ScrollView`
	flex: 4;
`;

const CommentItem = styled.View`
  margin-top: 15px;
	flex-direction: row;
`;

const UserInfoArea = styled.View`
	flex: 1;
	height: 100%;
	padding-left: 10px;
	padding-top: 2.5px;
	align-items: center;
`;

const UserIcon = styled.Image`
	width: 100%;
	height: 42.5px;
	resize-mode: stretch;
	border-radius: 25px;
`;

const Username = styled.Text`
	font-size: 10px;
	font-weight: bold;
	padding-top: 2.5px;
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

const CommentWrite = styled.View`
	flex: 1;
	background-color: lightblue;
	flex-direction: row;
`;

const CommentInput = styled.TextInput`
	flex: 8;
	background-color: white;
	margin: 1px 1px 2px 1px;
	padding-left: 10px;
	font-family: Bradley Hand;
`;

const SendButton = styled.TouchableOpacity`
	flex: 1;
	align-items: center;
	justify-content: center;
	padding-right: 2.5px;
`;

const SendButtonIcon = styled.Image`
	height: 22.5px;
	width: 22.5px;
`;
