import React from 'react';
import styled from 'styled-components/native';

export default class OutfitPostScreen extends React.Component {

    // set up navigation
	static navigationOptions = {
		title: 'OutfitPost',
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