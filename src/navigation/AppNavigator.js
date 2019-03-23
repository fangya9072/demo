import { createSwitchNavigator, createStackNavigator, createAppContainer} from 'react-navigation';

import LoginScreen from '../screens/welcome/LoginScreen';
import RegisterScreen from '../screens/welcome/RegisterScreen';
import OutfitPostScreen from '../screens/post/OutfitPostScreen';
import WeatherPostScreen from '../screens/post/WeatherPostScreen';
import BottomTabNavigator from './BottomTabNavigator';

const StackNavigator = createStackNavigator(
  { 
    OutfitPost: OutfitPostScreen,
    WeatherPost: WeatherPostScreen,
    BottomTab: BottomTabNavigator,
  },
  {
    initialRouteName: 'BottomTab',
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    },
  },
);

const AppNavigator = createSwitchNavigator(
  {
    Login: LoginScreen,
    Register: RegisterScreen,
    Stack: StackNavigator,
  },
  {
    initialRouteName: 'Login',
  }
);

const AppContainer = createAppContainer(AppNavigator);

export default AppContainer;

