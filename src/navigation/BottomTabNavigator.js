import React from 'react';
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import Feather from "react-native-vector-icons/Feather";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import HomeScreen from '../screens/home/HomeScreen';
import WeatherScreen from '../screens/weather/WeatherScreen';
import HistoryScreen from '../screens/history/HistoryScreen';
import NewsScreen from '../screens/news/NewsScreen';
import NavigationScreen from '../screens/navigation/NavigationScreen';

export default createBottomTabNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        tabBarLabel: 'Home',
        tabBarIcon: ({ tintColor }) => (
          <Feather name={'home'} size={25} style= {{marginTop: 5}} />
        )
      },
    },
    Weather: {
      screen: WeatherScreen,
      navigationOptions: {
        tabBarLabel: 'Weather',
        tabBarIcon: ({ tintColor }) => (
          <Feather name={'sun'} size={25} style= {{marginTop: 5}} />
        )
      },
    },
    News: {
      screen: NewsScreen,
      navigationOptions: {
        tabBarLabel: 'News',
        tabBarIcon: ({ tintColor }) => (
          <FontAwesome name={'newspaper-o'} size={27.5} style= {{marginTop: 5}} />
        )
      },
    },
    History: {
      screen: HistoryScreen,
      navigationOptions: {
        tabBarLabel: 'History',
        tabBarIcon: ({ tintColor }) => (
          <MaterialCommunityIcons name={'history'} size={30} style= {{marginTop: 5}} />
        )
      },
    },
    Navigation: {
      screen: NavigationScreen,
      navigationOptions: {
        tabBarLabel: 'Navigation',
        tabBarIcon: ({ tintColor }) => (
          <Feather name={'navigation'} size={25} style= {{marginTop: 5}} />
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

