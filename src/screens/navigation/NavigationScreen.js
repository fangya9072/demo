import React from 'react';
import styled from 'styled-components/native';
import TopBanner from '../../components/TopBanner';
import {SafeAreaView} from 'react-navigation';
import { Modal }  from 'react-native';

export default class NavigationScreen extends React.Component {

    // set up navigation
	static navigationOptions = {
		title: 'Navigation',
	};

	// set up state
	constructor(props) {
		super(props);
		this.state = {
			pageTitle: 'NAVIGATION',
		};
	}

	// function to reload screen
	onRefresh = () => {}

	// rendering
	render(){
		return(
			<SafeAreaView style={{ backgroundColor: 'whitesmoke', flex: 1}}>
			    <Container>
				    <Navigation>	
				    </Navigation>
				    {/* put components with absolute position at the bottom */}
				    <TopBanner pageTitle={this.state.pageTitle} navigation={this.state.navigation} refreshHandler={this.onRefresh.bind(this)} />
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

const Navigation = styled.ScrollView`
    top: 45px;
    height: 93.5%;
	width: 100%;
	background-color: white;
`;