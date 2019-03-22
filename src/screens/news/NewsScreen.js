import React from 'react';
import styled from 'styled-components/native';
import TopBanner from '../../components/TopBanner';
import TopLeftMenu from '../../components/TopLeftMenu';
import TopLocationMenu from '../../components/TopLocationMenu';
import { Modal }  from 'react-native';

export default class NewsScreen extends React.Component {

    // set up navigation
	static navigationOptions = {
		title: 'News',
	};

	// set up state
	constructor(props) {
		super(props);
		this.state = {
			topLeftMenuVisible: false,
			topLocationMenuVisible: false,
		};
	}

	// function to update state
	updateState (data) {
		this.setState(data);
	}

	// rendering
	render(){
		return(
			<Container>
				<TopBanner updateParentState={this.updateState.bind(this)} />
				<News>	
				</News>
				{this.state.topLeftMenuVisible && <TopLeftMenu />}
				{this.state.topLocationMenuVisible && <TopLocationMenu />}
			</Container>
		);
	}
}

// css
const Container = styled.View`
    height: 100%;
	width: 100%;
	background-color: whitesmoke;
`;

const News = styled.ScrollView`
    height: 90%;
	width: 100%;
	background-color: white;
`;