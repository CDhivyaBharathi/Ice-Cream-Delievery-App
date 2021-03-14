import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import MyHeader from '../components/AppHeader';
import db from '../config';
import { Card, Header } from 'react-native-elements';
import firebase from 'firebase';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';

export default class IceCreamOrderScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      allCartItems: [],
      customer_Name: '',
      phoneNumber: '',
      userId: firebase.auth().currentUser.email,
      total: [],
      isCheckedOut: false,
      totalAmount: 0,
      bookStatus: '',
      checkoutId: '',
      userDocId: '',
      docId: '',
      dataSource: '',
      cartId: '',
      orderNumber: '',
    };
  }

  
   
  componentDidMount() {
    this.getCartItems();
    this.getUserDetails();
    this.displayTotal();
  }
  

  getUserDetails() {
    db.collection('users')
      .where('email_id', '==', this.state.userId)
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.setState({
            customer_Name: doc.data().first_name + '_' + doc.data().last_name,
            phoneNumber: doc.data().contact,
          });
        });
      });
  }

  getCartItems = () => {
    var allCartItems = [];
    var orderNumber = '';
    db.collection(this.state.userId + 'cart_Items')
      .where('itemStatus', '==', 'inCart')
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var items = doc.data();
          items['doc_id'] = doc.id;
          allCartItems.push(items);
        });
        this.setState({
          allCartItems: allCartItems,
        });
      });

    db.collection('customer_Checkouts')
      .where('user_Id', '==', this.state.userId)

      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var items = doc.data().cart_Id;
          items['doc_id'] = doc.id;
          orderNumber.push(items);
        });
        this.setState({
          orderNumber: orderNumber,

        });
      });
  };

  updateCartStatus = () => {
    //updating the book status after receiving the book
    db.collection(this.state.userId + 'cart_Items')
      .where('customerName', '==', this.state.customer_Name)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {

          //updating the doc
          db.collection(this.state.userId + 'cart_Items')
            .doc(doc.id)
            .update({
              itemStatus: 'outCart',
            });
            
        });
      });


    //getting the  doc id to update the users doc
    db.collection('users')
      .where('email_id', '==', this.state.userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          //updating the doc

          db.collection('users').doc(doc.id).update({
            IsOrderActive: false,
          });
        });
      });
  };
  displayTotal = () => {
    var total = [];
    var totalAmount = 0;
    db.collection(this.state.userId + 'cart_Items')
      .where('itemStatus', '==', 'inCart')
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var items = doc.data().item_Price;
          items['doc_id'] = doc.id;

          total.push(items);
        });
        for (var i = 0; i < total.length; i++) {
          totalAmount = totalAmount + total[i];
        }
        console.log(totalAmount);
        this.setState({
          totalAmount: totalAmount,
          total: total,
        });
      });
  };

  showCheckout = () => {};


 
  createUniqueId() {
    return Math.random().toString(36).substring(7);
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <View>
          <MyHeader title="Cart" navigation={this.props.navigation} />
        </View>
        <FlatList
          data={this.state.allCartItems}
          renderItem={({ item }) => (
            <View
              style={{
                marginBottom: RFValue(10),
                marginLeft: RFValue(20),
                marginTop: RFValue(20),
              }}>
              <Card>
                <Text style={{ fontWeight: 'bold' }}>{item.item_Name}</Text>
                <Text>{'Price: Rs ' + item.item_Price}</Text>
                <Text>{'Type:' + item.item_Type}</Text>
              </Card>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
          onEndReachedThreshold={0.7}
        />
        <Text
          style={{
            marginTop: RFValue(10),
            textAlign: 'center',
            fontWeight: 'bold',
          }}>
          Number of Items = {this.state.allCartItems.length}
        </Text>

        <Text
          style={{
            marginTop: RFValue(10),

            textAlign: 'center',
            fontWeight: 'bold',
          }}>
          Total = {this.state.totalAmount}
        </Text>
        <TouchableOpacity
          style={{
            borderWidth: RFValue(10),
            width: RFValue(100),
            alignSelf: 'center',
            marginTop: RFValue(50),
            
            backgroundColor: 'pink',
          }}
          onPress={() => {
            this.updateCartStatus();
            var randomCartId = this.createUniqueId();
            db.collection('customer_Checkouts').add({
              customer_Name: this.state.customer_Name,
              allCartItems: this.state.allCartItems,
              total: this.state.totalAmount,
              user_Id: this.state.userId,
              cart_Id: randomCartId,

              orderStatus: 'ordered',
              notification: ''
            });

            this.setState({
              isCheckedOut: true,
              allCartItems: [],
              totalAmount: 0,
            });
          }}>
          <Text style={{ textAlign: 'center' }}> Check Out </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({});
