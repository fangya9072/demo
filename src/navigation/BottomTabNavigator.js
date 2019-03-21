import React from 'react';
import { createBottomTabNavigator } from 'react-navigation';
import { Image } from 'react-native';

import HomeScreen from '../screens/home/HomeScreen';
import WeatherScreen from '../screens/weather/WeatherScreen';
import HistoryScreen from '../screens/history/HistoryScreen';
import NewsScreen from '../screens/news/NewsScreen';


export default createBottomTabNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        tabBarLabel: 'Home',
        tabBarIcon: ({ tintColor }) => (
          <Image source={require('../../assets/icon/function-icon/map.png')}
            style= {{width:15, height:15, tintColor:'black'}}>
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
        style= {{width:15, height:15, tintColor:'black'}}>
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
        style= {{width:15, height:15, tintColor:'black'}}>
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
        style= {{width:15, height:15, tintColor:'black'}}>
        </Image>
        )
      },
    },
  }, 
  {
    tabBarOptions: {
      showIcon: true,
      activeTintColor: 'whitesmoke',
      activeBackgroundColor: 'skyblue',
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

