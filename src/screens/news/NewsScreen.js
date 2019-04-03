import React from 'react';
import styled from 'styled-components/native';
import TopBanner from '../../components/TopBanner';
import {SafeAreaView} from 'react-navigation';
import { AsyncStorage }  from 'react-native';
import { Location, Permissions } from "expo";
import { Alert, ScrollView, View, Text, TouchableOpacity, Image, FlatList, List } from "react-native";
import Article from '../../components/Article';


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
			username: '',
			articles: [],
			area: '',
			coordinate: {
				latitude: 0,
				longitude: 0,
			},
		};
	}

    // functions that runs whenever NewsPage is rerendered in DOM
    componentWillMount() {
		this.getUsername();
		this.getNews();
	}

	// function to retrive username from persistant storage
	getUsername = async () => {
		try {
			const username = await AsyncStorage.getItem('username');
			if (username !== null) {
				this.setState({
					username: username,
				})
			}
		} catch (error) {
			console.error(error);
		}
	};
    
    // function to reload screen
	onRefresh = () => {
		this.setState({
			articles:[],
		});
		this.getNews();
	}
    
    getNews = async () => {
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
			coordinate: { latitude: location.coords.latitude, longitude: location.coords.longitude }
		});
		let locationInfo = await Location.reverseGeocodeAsync(this.state.coordinate); // get city name of current location by coordinates
		this.setState({
			area: locationInfo[0].city,
		});
		let result = await fetch('https://newsapi.org/v2/everything?q=' + this.state.area + '&apiKey=0b54ce7d55944a0bb32c193eb264c3e4').then(response => response.json());
        this.setState({articles: result.articles, refreshing: false });
	};


  
	// rendering
	render(){
		return(
			<SafeAreaView style={{ backgroundColor: 'whitesmoke', flex: 1}}>
			    <Container>

			        <News>
				        <FlatList
                          data = {this.state.articles}
                          renderItem = {({ item }) => <Article article={item} />}
                          keyExtractor = {item => item.url}
                        /> 
                     </News>
                     {}
				    <TopBanner pageTitle={this.state.pageTitle} navigation={this.state.navigation} refreshHandler={this.onRefresh.bind(this)} />
			    </Container>
			</SafeAreaView>
		);
	}
}



const Container = styled.View`
    height: 100%;
	width: 100%;
	background-color: whitesmoke;
`;

const News = styled.ScrollView`
    top: 45px;
    height: 93.5%;
	width: 100%;
	
`;