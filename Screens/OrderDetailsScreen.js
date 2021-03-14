import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Card, Header } from 'react-native-elements';
import MyHeader from '../components/AppHeader';
import firebase from 'firebase';
import Icon from 'react-native-vector-icons/FontAwesome';

import db from '../config.js';

export default class RecieverDetailsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: firebase.auth().currentUser.email,
      userName: '',
      recieverId: this.props.navigation.getParam('details')['user_Id'],
      carttId: this.props.navigation.getParam('details')['cart_id'],
      itemName: [],
      recieverName: '',
      recieverContact: '',
      recieverAddress: '',
      recieverRequestDocId: '',
      allItems: '',
      allOrderItems: [],
    };
  }
  addNotification = () => {
    var message =
      'Your order number' + this.state.cart_id + 'has been delievered';
    db.collection('allNotifications').add({
      notification_status: 'unread',
      recieverId: this.state.recieverId,
      message:message,
    });
  };

  getAllOrders() {
    db.collection('customer_Checkouts')
      .where('user_Id', '==', this.state.recieverId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            allOrderItems: doc.data().allCartItems,
            itemName: doc.data().allCartItems.item_Name,
          });
        });
      });
  }
   sendNotifications = () => {
    db.collection('customer_Checkouts')
      .where('orderStatus', '==', 'Delievered')
      .where('user_Id', '==', this.state.recieverId)
      .get()
      .then()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          db.collection('customer_Checkouts').doc(doc.id).update({
            notification: 'Your order has been delievered',
          });
        });
      });
  };

  getRecieverDetails() {
    db.collection('users')
      .where('email_id', '==', this.state.recieverId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            recieverName: doc.data().first_name,
            recieverContact: doc.data().contact,
            recieverAddress: doc.data().address,
          });
        });
      });

  }

  getUserDetails = (userId) => {
    db.collection('users')
      .where('email_id', '==', userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            userName: doc.data().first_name + ' ' + doc.data().last_name,
          });
        });
      });
  };

  componentDidMount() {
    this.getRecieverDetails();
    this.getUserDetails(this.state.userId);
    this.getAllOrders();
    console.log(this.state.itemName);
  }
  updateOrderStatus = () => {
    db.collection('customer_Checkouts')
      .where('user_Id', '==', this.state.recieverId)
      .get()
      .then()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          db.collection('customer_Checkouts').doc(doc.id).update({
            orderStatus: 'Delievered',
          });
        });
      });
  };
  render() {
    return (
      <View style={styles.container}>
        <View style={{ flex: 0.1 }}>
          <Header
            leftComponent={
              <Icon
                name="arrow-left"
                type="feather"
                color="#696969"
                onPress={() => this.props.navigation.goBack()}
              />
            }
            centerComponent={{
              text: 'Order Details',
              style: { color: '#90A5A9', fontSize: 20, fontWeight: 'bold' },
            }}
            backgroundColor="#eaf8fe"
          />
        </View>
        <FlatList
          style={{ marginTop: 30 }}
          data={this.state.allOrderItems}
          renderItem={({ item }) => (
            <Card>
              <Text style={{ fontWeight: 'bold' }}>{item.item_Name}</Text>
              <Text>{'Price: Rs ' + item.item_Price}</Text>
              <Text>{'Type:' + item.item_Type}</Text>
            </Card>
          )}
          keyExtractor={(item, index) => index.toString()}
          onEndReachedThreshold={0.7}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this.updateOrderStatus();
              this.sendNotifications();
              this.addNotification()

            }}>
            <Text> Order delivered </Text>
          </TouchableOpacity>
        </View>
        <View>
          <Card title={'Reciever Information'} titleStyle={{ fontSize: 15 }}>
            <Card>
              <Text style={{ fontWeight: 'bold' }}>
                Name: {this.state.recieverName}
              </Text>
            </Card>
            <Card>
              <Text style={{ fontWeight: 'bold' }}>
                Contact: {this.state.recieverContact}
              </Text>
            </Card>
            <Card>
              <Text style={{ fontWeight: 'bold' }}>
                Address: {this.state.recieverAddress}
              </Text>
            </Card>
          </Card>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: 200,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: 'orange',
    shadowColor: '#000',
    marginBottom: 10,
    elevation: 10,
  },
});
