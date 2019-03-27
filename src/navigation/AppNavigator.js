import { createSwitchNavigator, createStackNavigator, createAppContainer} from 'react-navigation';

import LoginScreen from '../screens/welcome/LoginScreen';
import RegisterScreen from '../screens/welcome/RegisterScreen';
import OutfitPostScreen from '../screens/post/OutfitPostScreen';
import WeatherPostScreen from '../screens/post/WeatherPostScreen';
import BottomTabNavigator from './BottomTabNavigator';
import FriendScreen from '../screens/friend/FriendScreen';

const StackNavigator = createStackNavigator(
  { 
    OutfitPost: OutfitPostScreen,
    WeatherPost: WeatherPostScreen,
    Friend: FriendScreen,
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

