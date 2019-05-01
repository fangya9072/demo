import React from 'react';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-navigation';
import { KeyboardAvoidingView } from 'react-native';
import TopBanner from '../../components/TopBanner';
import Feather from "react-native-vector-icons/Feather";

export default class OutfitPostViewScreen extends React.Component {

    // set up navigation
    static navigationOptions = {
        title: 'OUTFIT POST',
    };

    // set up state
    constructor(props) {
        super(props);
        this.state = {
            pageTitle: 'OUTFIT POST',
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

    // function to send comment
    sendComment = async () => { }

    // rendering
    render() {
        // get post object from navigation parameter, default is null if not available 
        const postInfo = this.props.navigation.getParam('postInfo', null);
        outfitPost = {
            username: postInfo.username,
            image: postInfo.image,
            friendType: postInfo.friendType,
            date: postInfo.date,
        };

        return (
            <SafeAreaView style={{ backgroundColor: 'whitesmoke', flex: 1 }}>
                <Container>
                    <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={20}>
                        <PostContainer>
                            <PostScollView contentContainerStyle={{ paddingBottom: 35 }}>
                                <OutfitPost>
                                    <PostInfo>
                                        <PostUserIconWrapper>
                                            <PostUserIcon source={{ uri: 'data:image/png;base64,' + outfitPost.image }}/>
                                        </PostUserIconWrapper>
                                        <TextInfo>
                                            <PostUsername>
                                                <PostUsernameText> {outfitPost.username} </PostUsernameText>
                                            </PostUsername>
                                            <Date>
                                                <DateText> {outfitPost.date} </DateText>
                                            </Date>
                                        </TextInfo>
                                    </PostInfo>
                                    <PostImageWrapper>
                                        <PostImage source={{ uri: 'data:image/png;base64,' + outfitPost.image }} />
                                    </PostImageWrapper>
                                </OutfitPost>
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
                            <SendButton onPress={() => this.sendComment()}>
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

const OutfitPost = styled.View`
    left: 5%;
    width: 90%;
    top: 15px;
`;

const PostInfo = styled.View`
    height: 40px;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
`;

const PostUserIconWrapper = styled.TouchableOpacity`
    width: 40px;
    height: 40px;
`;

const PostUserIcon = styled.Image`
    width: 40px;
    height: 40px;
	resize-mode: stretch;
	border-radius: 20px;
`;

const TextInfo = styled.View`
    padding-left: 10px;
`;

const PostUsername = styled.View`
	justify-content: center;
`;

const PostUsernameText = styled.Text`
    font-family: Optima;
    font-size: 15px;
    font-weight: 400;
`;

const Date = styled.View`
	justify-content: center;
`;

const DateText = styled.Text`
    font-size: 12.5px;
    font-family: Georgia;
    color: gray;
    padding-top: 2.5px;
`;

const PostImageWrapper = styled.View`
    margin-top: 10px;
	width: 100%;
	aspect-ratio: 1;
`;

const PostImage = styled.Image`
	flex: 1;
	aspect-ratio: 1;
	resize-mode: cover;
	border-radius: 5px;
`;

const CommentContainer = styled.View`
    top: 25px;
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
	resize-mode: stretch;
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