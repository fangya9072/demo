import React, { Component } from 'react';
import styled from 'styled-components/native';
import TopBanner from '../../components/TopBanner';
import { Modal }  from 'react-native';

export default class HistoryScreen extends React.Component {

    // set up navigation
	static navigationOptions = {
		title: 'History',
	};

	// set up state
	constructor(props) {
		super(props);
		this.state = {};
	}

	// rendering
	render(){
		return(
			<Container>
				<TopBanner />
				<History>
				</History>
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

const History = styled.ScrollView`
    height: 90%;
	width: 100%;
	background-color: white;
`;