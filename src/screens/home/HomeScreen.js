import React from 'react';
import styled from 'styled-components/native';
import { MapView, Location, Permissions } from "expo";
import { Modal }  from 'react-native';
import OutfitPostModalView from '../../components/OutfitPostModalView';
import TopBanner from '../../components/TopBanner';
import { COLORS } from '../../constant/color';
	

export default class HomeScreen extends React.Component {
	
		// set up navigation
		static navigationOptions = {
				title: 'Home',
		};

	  // set up state
		constructor(props) {
				super(props);
			  this.state = {
					  pageType: 'HOME',
					  outfitPostModalViewVisible: false,
						mapRegion: null,
						errorMessage: null,
						/*  
					  markers below for people nearby are only for test purpose, 
						make API call to rethinkDB to get real user data
						*/
						outfitPostMarkers: [ 
							  { userID: 1, 
				  			  latitude: 35.909995043008486,
								  longitude: -79.05328273773193,
								  src: "https://s3-ap-southeast-1.amazonaws.com/so-srilanka/any/boy.png", },
								{ userID: 2, 
									latitude: 35.910551182261656,
				  			  longitude: -79.07154321670532,
									src: "https://s3-ap-southeast-1.amazonaws.com/so-srilanka/any/female.png", },
    				],
				};
		}

  	// functions that runs whenever HomePage is rerendered in DOM
		componentDidMount() {
				this.getCurrentLocation();
		}
	
		// function to get user's realtime geolocation
		getCurrentLocation = async () => {
			  let { status } = await Permissions.askAsync(Permissions.LOCATION);
				if (status !== 'granted') {
						this.setState({ 
							 errorMessage: 'Permission to access location was denied', 
						});
		    }
				let location = await Location.getCurrentPositionAsync({});
				this.setState({
						mapRegion: { latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 },
		    });
		    this.setState({
						currentLocation: { latitude: location.coords.latitude, longitude: location.coords.longitude }
				});
		};

		// functions that open and close outfit post madal view
		openPost(id) {
			  this.setState({ outfitPostModalViewVisible: true });
		}
		closePost() {
			  this.setState({ outfitPostModalViewVisible: false });
		}

		// rendering 
		render(){
				return (
					  <Container>
								<Map>
								    <MapView style={{ flex: 1 }} initialRegion={this.state.mapRegion}>
										    {this.state.outfitPostMarkers.map((item, key) => {
					  					    	return (
								  					    <MapView.Marker	
										    				coordinate={{ longitude: Number(item.longitude), latitude: Number(item.latitude) }}
													    	title={item.title}
	    													key={key}
			    											onPress={(e) => this.openPost(item.id)}
					    									>
                     							  <MarkerImage source={{ uri: item.src }}/>
									    					</MapView.Marker>
				        						);
								  			})}
							  		</MapView>
								    <Modal transparent={true} visible={this.state.outfitPostModalViewVisible}>
								        <OutfitPostModalView close={() => { this.closePost(); }} />
							    	</Modal>
					    	</Map>
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

const Map = styled.View`
    top: 11%;
    height: 90%;
		width: 100%;
`;

const MarkerImage = styled.Image`
  	width: 30px;
  	height: 30px;
`;