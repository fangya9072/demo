import React from 'react';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-navigation';
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
			isRequestView: true,
			isListView: false,
			isScearchView: false,
			isInviteView: false,
		};
	}

	// rendering
	render() {
		return (
			<SafeAreaView style={{ backgroundColor: 'whitesmoke', flex: 1 }}>
				<Container>
					<TopBanner pageTitle={this.state.pageTitle} navigation={this.state.navigation} />
					<TabNavigator>
						<Tab
						onPress={() => this.setState({isRequestView: true, isListView: false, isScearchView: false, isInviteView : false})}
						style={[this.state.isRequestView ? {backgroundColor: 'lightblue'} : {backgroundColor: 'white'}]}
						>
							<TabIconWrapper>
								<Feather name='user-plus' size={25} />
							</TabIconWrapper>
							<TabTextWrapper><TabText> Request </TabText></TabTextWrapper>
						</Tab>
						<Tab
						onPress={() => this.setState({isRequestView: false, isListView: true, isScearchView: false, isInviteView : false})}
						style={[this.state.isListView ? {backgroundColor: 'lightblue'} : {backgroundColor: 'white'}]}
						>
							<TabIconWrapper>
							    <Feather name='users' size={25} />
							</TabIconWrapper>
							<TabTextWrapper><TabText> Friend </TabText></TabTextWrapper>
						</Tab>
						<Tab
						onPress={() => this.setState({isRequestView: false, isListView: false, isScearchView: true, isInviteView : false})}
						style={[this.state.isScearchView ? {backgroundColor: 'lightblue'} : {backgroundColor: 'white'}]}
						>
							<TabIconWrapper>
							    <Feather name='search' size={25} />
							</TabIconWrapper>
							<TabTextWrapper><TabText> Search </TabText></TabTextWrapper>
						</Tab>
						<Tab
						onPress={() => this.setState({isRequestView: false, isListView: false, isScearchView: false, isInviteView : true})}
						style={[this.state.isInviteView ? {backgroundColor: 'lightblue'} : {backgroundColor: 'white'}]}
						>
							<TabIconWrapper>
							    <Feather name='mail' size={25} />
							</TabIconWrapper>
							<TabTextWrapper><TabText> Invite </TabText></TabTextWrapper>
						</Tab>
					</TabNavigator>
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

const TabNavigator = styled.View`
    top: 45px;
	height: 62.5px;
	width: 100%;
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