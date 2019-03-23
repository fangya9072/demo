import React from 'react';
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import { Image } from 'react-native';

import HomeScreen from '../screens/home/HomeScreen';
import WeatherScreen from '../screens/weather/WeatherScreen';
import HistoryScreen from '../screens/history/HistoryScreen';
import NewsScreen from '../screens/news/NewsScreen';
import OutfitPostScreen from '../screens/post/OutfitPostScreen';
import WeatherPostScreen from '../screens/post/WeatherPostScreen';


const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
    OutfitPost: OutfitPostScreen,
    WeatherPost: WeatherPostScreen,
  },
  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    },
  },
);

const WeatherStack = createStackNavigator(
  {
    Weather: WeatherScreen,
    OutfitPost: OutfitPostScreen,
    WeatherPost: WeatherPostScreen,
  },
  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    },
  },
);

const NewsStack = createStackNavigator(
  {
    News: NewsScreen,
    OutfitPost: OutfitPostScreen,
    WeatherPost: WeatherPostScreen,
  },
  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    },
  },
);

const HistoryStack = createStackNavigator(
  {
    History: HistoryScreen,
    OutfitPost: OutfitPostScreen,
    WeatherPost: WeatherPostScreen,
  },
  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    },
  },
);

export default createBottomTabNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        tabBarLabel: 'Home',
        tabBarIcon: ({ tintColor }) => (
          <Image source={require('../../assets/icon/function-icon/map.png')}
            style= {{width:22.5, height:22.5, marginTop: 5,tintColor:'black'}}>
          </Image>
        )
      },
    },
    Weather: {
      screen: WeatherScreen,
      navigationOptions: {
        tabBarLabel: 'Weather',
        tabBarIcon: ({ tintColor }) => (
        <Image source={require('../../assets/icon/function-icon/weather.png')}
        style= {{width:25, height:25, marginTop: 5,tintColor:'black'}}>
        </Image>
        )
      },
    },
    News: {
      screen: NewsScreen,
      navigationOptions: {
        tabBarLabel: 'News',
        tabBarIcon: ({ tintColor }) => (
        <Image source={require('../../assets/icon/function-icon/news.png')}
        style= {{width:25, height:25, marginTop: 5,tintColor:'black'}}>
        </Image>
        )
      },
    },
    History: {
      screen: HistoryScreen,
      navigationOptions: {
        tabBarLabel: 'History',
        tabBarIcon: ({ tintColor }) => (
        <Image source={require('../../assets/icon/function-icon/history.png')}
        style= {{width:25, height:25, marginTop: 5, tintColor:'black'}}>
        </Image>
        )
      },
    },
  }, 
  {
    tabBarOptions: {
      showIcon: true,
      activeTintColor: 'whitesmoke',
      activeBackgroundColor: 'lightblue',
      inactiveTintColor: 'whitesmoke',
      labelStyle: {
        paddingBottom: 2.5,
        fontSize: 12.5,
        fontFamily: "Gill Sans",
        color: 'black',
      },
      style: {        
        height: 55,              
        backgroundColor: 'fff',  
      }, 
  }
});

