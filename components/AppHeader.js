import React, { Component} from 'react';
import { Header,Icon,Badge } from 'react-native-elements';
import { View, Text, StyeSheet ,Alert} from 'react-native';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import { DrawerActions } from "react-navigation";


const BellIconWithBadge=(props)=>{
  return(
    <View>
      <Icon name='bell' type='font-awesome' color='black' size={25}
        onPress={() =>props.navigation.navigate('Notification')}/>
       <Badge
        value="Alert"
          status="error"
       containerStyle={{ position:'bottom', top: RFValue(2), right: RFValue(-1)}}/>
    </View>



  )
}


const MyHeader = props => {
  return (
    <Header
      leftComponent={<Icon name='bars' type='font-awesome' color='black'  onPress={() => props.navigation.toggleDrawer()}/>}
      centerComponent={{ text: props.title, style: { color: 'black', fontSize: RFValue(20),fontWeight:"bold", } }}
      rightComponent={<BellIconWithBadge {...props}/>}
      backgroundColor = "#A9F1DF"
      
    />
  );
};

export default MyHeader;
