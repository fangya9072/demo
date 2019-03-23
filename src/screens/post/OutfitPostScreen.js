import React from 'react';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-navigation';
import TopBanner from '../../components/TopBanner';

export default class OutfitPostScreen extends React.Component {

    // set up navigation
	static navigationOptions = {
		title: 'My Outfit Today',
	};

	// set up state
	constructor(props) {
		super(props);
		this.state = {
			pageTitle: 'My Outfit Today',
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