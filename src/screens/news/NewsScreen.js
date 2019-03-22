import React from 'react';
import styled from 'styled-components/native';
import TopBanner from '../../components/TopBanner';
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
			pageType: 'NEWS',
		};
	}

	// rendering
	render(){
		return(
			<Container>
				<News>	
				</News>
				{/* put components with absolute position at the bottom */}
				<TopBanner pageType={this.state.pageType} />
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
    top: 11%;
    height: 90%;
	width: 100%;
	background-color: white;
`;