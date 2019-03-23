import React from 'react';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-navigation';
import TopBanner from '../../components/TopBanner';

export default class WeatherPostScreen extends React.Component {

    // set up navigation
	static navigationOptions = {
		title: 'How Is The Weather?',
	};

	// set up state
	constructor(props) {
		super(props);
		this.state = {
			pageTitle: 'How Is The Weather?',
		};
	}

	// rendering
	render(){
		return(
			<SafeAreaView style={{ backgroundColor: 'whitesmoke', flex: 1}}>
			    <Container>
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
`;