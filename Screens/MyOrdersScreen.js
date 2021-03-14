import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import MyHeader from '../components/AppHeader';
import firebase from 'firebase';
import db from '../config';
import { Card, Header } from 'react-native-elements';

export default class MyOrderScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      allCheckouts: [],
      recieverId: firebase.auth().currentUser.email,
    };
  }
  getAllCheckouts = () => {
    db.collection('customer_Checkouts')
      .where('orderStatus', '==', 'Delievered')
      .get()
      .then((snapshot) => {
        var allCheckouts = [];
        snapshot.forEach((doc) => {
          var items = doc.data();
          items['doc_id'] = doc.id;
          allCheckouts.push(items);
        });
        this.setState({
          allCheckouts: allCheckouts,
        });
      });
  };

  componentDidMount() {
    this.getAllCheckouts();
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 0.1 }}>
          <MyHeader title="All Orders" navigation ={this.props.navigation} />
        </View>
       <FlatList
          style={{ marginTop: 60 }}
          data={this.state.allCheckouts}
          renderItem={({ item }) => (
            <View style={{ marginTop: 10 }}>
              <Text style={{ fontWeight: 'bold' }}>{item.customer_Name}</Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  this.props.navigation.navigate('CustomerDetails', {
                    details: item,
                  });
                  this.sendNotifications();
                }}>
                <Text style={styles.buttonText}>View</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ flexGrow: 1 }}
          onEndReachedThreshold={1}
        />
      </View>
    );
    
  }
}

const styles = StyleSheet.create({
  button: {
    width: 100,
    height: 30,
    backgroundColor: '#ff5722',
    marginLeft: 180,
    marginTop: -15,
    marginBottom: 10,
    borderRadius: 10,
  },

  buttonText: {
    alignSelf: 'center',
  },
});
