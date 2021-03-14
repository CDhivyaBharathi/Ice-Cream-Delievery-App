import React from 'react';
import { createDrawerNavigator } from 'react-navigation-drawer';
import {AppTabNavigator} from './AppTabNavigator';
import SettingScreen from '../Screens/SettingsScreen';
import NotificationScreen from '../Screens/NotificationScreen';
import MyOrderScreen from '../Screens/MyOrdersScreen';
import CustomSideBarMenu from './CustomSidebarMenu'
import { Avatar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import {AppStackNavigator} from './AppStackNavigator'


export const AppDrawerNavigator = createDrawerNavigator(
  {
    Home: {
      screen: AppTabNavigator,
      navigationOptions: {
        drawerIcon: <Icon name="home" type="font-awesome" size={RFValue(24)} />,
      },
    },
    Notification: {
      screen: NotificationScreen,
      navigationOptions: {
        drawerIcon: <Icon name="bell" type="font-awesome" size={RFValue(24)} />,
      },
    },
    Settings: {
      screen: SettingScreen,
      navigationOptions: {
        drawerIcon: <Icon name="cogs" type="font-awesome" size={RFValue(24)} />,
      },
    },
  },
  {
    contentComponent: CustomSideBarMenu,
  },
  {
    initialRouteName: 'Home',
  }
);
