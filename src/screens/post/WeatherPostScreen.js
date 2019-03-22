import React from 'react';
import styled from 'styled-components/native';

export default class WeatherPostScreen extends React.Component {

    // set up navigation
	static navigationOptions = {
		title: 'WeatherPost',
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
			<Container>
			</Container>
		);
	}
}

// css
const Container = styled.View`
    height: 100%;
	width: 100%;
`;