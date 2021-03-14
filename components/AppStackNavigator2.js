import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import IceCreamOrderScreen from '../Screens/IceCreamOrderScreen'
import ItemInfoScreen from '../Screens/ItemInfo'


export const AppStackNavigator2 = createStackNavigator({
  IceCreamOrder : {
    screen : IceCreamOrderScreen,
    navigationOptions:{
      headerShown : false
    }
  },
  ItemInfo : {
    screen : ItemInfoScreen,
    navigationOptions:{
      headerShown : false
    }
  }
},
  {
    initialRouteName: 'IceCreamOrder'
  }
);