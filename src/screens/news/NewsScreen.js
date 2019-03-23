import React from 'react';
import styled from 'styled-components/native';
import TopBanner from '../../components/TopBanner';
import {SafeAreaView} from 'react-navigation';
import { Modal }  from 'react-native';

export default class NewsScreen extends React.Component {

    // set up navigation
	static navigationOptions = {
		title: 'NEWS',
	};

	// set up state
	constructor(props) {
		super(props);
		this.state = {
			pageTitle: 'NEWS',
		};
	}

	// rendering
	render(){
		return(
			<SafeAreaView style={{ backgroundColor: 'whitesmoke', flex: 1}}>
			    <Container>
				    <News>	
				    </News>
				    {/* put components with absolute position at the bottom */}
				    <TopBanner pageTitle={this.state.pageTitle} navigation={this.state.navigation}/>
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

const News = styled.ScrollView`
    top: 45px;
    height: 93.5%;
	width: 100%;
	background-color: white;
`;