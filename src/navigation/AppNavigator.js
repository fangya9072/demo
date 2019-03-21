import { createSwitchNavigator, createAppContainer} from 'react-navigation';

import LoginScreen from '../screens/welcome/LoginScreen';
import RegisterScreen from '../screens/welcome/RegisterScreen';
import BottomTabNavigator from './BottomTabNavigator';

const AppNavigator = createSwitchNavigator(
  {
    Login: LoginScreen,
    Register: RegisterScreen,
    BottomTab: BottomTabNavigator,
  },
  {
    initialRouteName: 'Login',
  }
);

const AppContainer = createAppContainer(AppNavigator);

export default AppContainer;

