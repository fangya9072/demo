import React from 'react';
import styled from 'styled-components/native';
import { Location, Permissions } from "expo";
import  MapView  from 'react-native-maps'
import { Modal }  from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Alert, Linking } from 'react-native';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Entypo from "react-native-vector-icons/Entypo";
import OutfitPostModalView from '../../components/OutfitPostModalView';
import TopBanner from '../../components/TopBanner';
import { COLORS } from '../../constant/color';
	

export default class HomeScreen extends React.Component {
	
		// set up navigation
		static navigationOptions = {
				title: 'HOME',
		};

	  // set up state
		constructor(props) {
				super(props);
			  this.state = {
					  pageTitle: 'HOME',
					  outfitPostModalViewVisible: false,
						mapRegion: null,
						coordinate: {
							longitude: 0,
							latitude: 0,
						},
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
					Alert.alert(
						'Please Allow Access',
						[
							'This applicaton needs access to your current location.',
							'\n',
							'Please go to Settings of your device and grant permissions to Location Service.',
						].join(''),
						[
							{ text: 'Not Now', style: 'cancel' },
							{ text: 'Settings', onPress: () => Linking.openURL('app-settings:') },
						],
					);
				}
				let location = await Location.getCurrentPositionAsync({});
				this.setState({
						mapRegion: { latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 },
						coordinate: { latitude: location.coords.latitude, longitude: location.coords.longitude }
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
					<SafeAreaView style={{ backgroundColor: 'whitesmoke', flex: 1}}>
					  <Container>
								<Map>
								    <MapView style={{ flex: 1 }} initialRegion={this.state.mapRegion}>
										    <MapView.Marker	
										    coordinate={{ longitude: this.state.coordinate.longitude, latitude: this.state.coordinate.latitude }}
									    	title={"my location"}
					    					>
                     				<Entypo name={'location-pin'} size={30} color={'black'} style={{backgroundColor: 'transparent'}}/>
									    	</MapView.Marker>
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
								<TopBanner pageTitle={this.state.pageTitle} navigation={this.props.navigation} navigation={this.state.navigation}/>
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

const Map = styled.View`
    top: 45px;
    height: 93.5%;
		width: 100%;
`;

const MarkerImage = styled.Image`
  	width: 30px;
  	height: 30px;
`;