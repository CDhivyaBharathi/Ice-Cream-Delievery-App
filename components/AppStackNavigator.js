import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import MyOrderScreen from '../Screens/MyOrdersScreen';
import OrderDetailsScreen from '../Screens/OrderDetailsScreen';


export const AppStackNavigator = createStackNavigator({
  AllOrders : {
    screen : MyOrderScreen,
    navigationOptions:{
      headerShown : false
    }
  },
  CustomerDetails : {
    screen : OrderDetailsScreen,
    navigationOptions:{
      headerShown : false
    }
  }
},
  {
    initialRouteName: 'AllOrders'
  }
);