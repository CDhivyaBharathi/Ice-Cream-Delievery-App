import React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import CartScreen from '../Screens/CartScreen';
import IceCreamOrderScreen from '../Screens/IceCreamOrderScreen';
import Icon from 'react-native-vector-icons/FontAwesome';
import SettingsScreen from '../Screens/SettingsScreen';
import NotificationScreen from '../Screens/NotificationScreen';
import { withBadge } from 'react-native-elements';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import {AppStackNavigator2} from './AppStackNavigator2'

export const AppTabNavigator = createBottomTabNavigator({
  OrderList: {
    screen: AppStackNavigator2,
    navigationOptions: {
      tabBarIcon: (
        <Image
        
          source={require('../assets/OrderList.png')}
          style={{ width: RFValue(30), height: RFValue(30) }}
        />
      ),
    },
  },
  Cart: {
    screen: CartScreen,
    navigationOptions: {
      
      tabBarIcon: (
        <Image
          source={require('../assets/Cart.png')}
          style={{ width: RFValue(30), height: RFValue(30) }}
        />
      ),
    },
  },
});
