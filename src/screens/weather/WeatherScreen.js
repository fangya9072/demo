import React from 'react';
import styled from 'styled-components/native';
import TopBanner from '../../components/TopBanner';
import WeatherForcast from '../../components/WeatherForcast';
import { MapView, Location, Permissions } from "expo";
import { Modal }  from 'react-native';

export default class WeatherScreen extends React.Component {

    // set up navigation
	static navigationOptions = {
		title: 'Weather',
	};

	// set up state
	constructor(props) {
		super(props);
	    this.state = {
	    	weatherPostModalViewVisible: false,
			mapRegion: null,
			errorMessage: null,
			/*  
		    markers below for people nearby are only for test purpose, 
			make API call to rethinkDB to get real user data
			*/
			weatherPostMarkers: [ 
	   		    { id: 1, 
				  latitude: 35.909995043008486,
				  longitude: -79.05328273773193,
				  src: "https://s3-ap-southeast-1.amazonaws.com/so-srilanka/any/boy.png", },
				{ id: 2, 
				  latitude: 35.910551182261656,
				  longitude: -79.07154321670532,
				   src: "https://s3-ap-southeast-1.amazonaws.com/so-srilanka/any/female.png", },
			],
		};
	}
	
	// functions that open and closes weather post madal view
	openPost(id) {
		this.setState({ weatherPostModalViewVisible: true });
    }
    closePost() {
		this.setState({ weatherPostModalViewVisible: false });
    }

	/* 
	functions that runs whenever user is in weather screen, including:
	get user's current location
	*/
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

	// rendering
	render(){
		return(
			<Container>
				<TopBanner />
				<WeatherForcastContainer>
					<WeatherForcast />
				</WeatherForcastContainer>
				<MapContainer> 
				    <Map>
					    <MapView style={{ flex: 1 }} initialRegion={this.state.mapRegion}>
					        {this.state.weatherPostMarkers.map((item, key) => {
    						    return (
	    	    					<MapView.Marker
		    						    coordinate={{
			    							longitude: Number(item.longitude),
				    					    latitude: Number(item.latitude)
					    	    		}}
						    	    	title={item.title}
							    		key={key}
								    >
                                        <MarkerImage source={{ uri: item.src }}/>
			    				    </MapView.Marker>
				        		);
					    	})}
		    			</MapView>
					</Map>
				</MapContainer>
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

const WeatherForcastContainer = styled.View`
    height: 35%;
	width: 100%;
	background-color: white;
`;

const MapContainer = styled.View`
    height: 100%;
    width: 100%;
	background-color: white;
`;

const Map = styled.View`
    height: 52.5%;
    width: 95%;
    left: 2.5%;
    border-radius: 25px;
	overflow: hidden;
`

const MarkerImage = styled.Image`
	width: 30px;
	height: 30px;
`;