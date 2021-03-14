 import * as React from 'react';
import {View} from 'react-native'
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import SignupLoginScreen from './Screens/SignupLoginScreen';
import  {AppTabNavigator}  from './components/AppTabNavigator';
import IceCreamOrderScreen from './Screens/IceCreamOrderScreen';
import {AppDrawerNavigator} from './components/AppDrawerNavigator';




export default class App extends React.Component {
  
  render() {
    return <AppContainer/>;
  }
  


}





const switchNavigator = createSwitchNavigator({
  WelcomeScreen: { screen: SignupLoginScreen },
 Drawer : {screen: AppDrawerNavigator},
  BottomTab: { screen: AppTabNavigator },
});

const AppContainer = createAppContainer(switchNavigator);

