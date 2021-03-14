import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { Card, Header, Image, Avatar } from 'react-native-elements';
import MyHeader from '../components/AppHeader';
import firebase from 'firebase';
import Icon from 'react-native-vector-icons/FontAwesome';
import db from '../config';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';

export default class ItemInfoScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: firebase.auth().currentUser.email,

      allItems: this.props.navigation.getParam('details'),
      image: '#',
      name: '',
      quantity: '',
      phoneNumber: '',
      itemStatus: '',
      cartId: '',
      userDocId: '',
      docId: '',
      dataSource: '',
      imageName: ''
    };
  }


  addToCart() {}

  createUniqueId() {
    return Math.random().toString(36).substring(7);
  }

  fetchImage = () => {
    var storageRef = firebase
      .storage()
      .ref()
      .child('item_profiles/' + this.state.item_Name);

    // Get the download URL
    storageRef

      .getDownloadURL()
      .then((url) => {
        this.setState({ image: url });
      })
      .catch((error) => {
        this.setState({ image: '#' });
      });
  };

  getUserDetails() {
    db.collection('users')
      .where('email_id', '==', this.state.userId)
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.setState({
            name: doc.data().first_name + '_' + doc.data().last_name,
            phoneNumber: doc.data().contact,
          });
        });
      });
  }

  componentDidMount() {
    this.fetchImage();
    console.log(this.state.item_Name);
    this.getUserDetails();
  }

  render() {
     return (
      <View style={{ flex: 1 }}>
        <View style={styles.background}>
          <Header
            leftComponent={
              <Icon
                name="arrow-left"
                type="feather"
                color="black"
                onPress={() => this.props.navigation.goBack()}
              />
            }
            centerComponent={{
              text: 'Order Details',
              style: { color: 'black', fontSize: 20, fontWeight: 'bold' },
            }}
            backgroundColor="#A9F1DF"
          />
           
          <FlatList
            data={this.state.allItems}
            renderItem={({ item }) => (
              <View style={styles.allTexts}>
                <Card style={{ alignItems: 'center' }}>
                  <Text style={styles.firstText}>{item.item_Name}</Text>
                   <Text style={styles.firstText}>'Price: '+{item.item_Price}</Text>
                    <Text style={styles.firstText}>'Quantity: '+ {item.item_Quantity}</Text>
                  <TouchableOpacity
                  
                    style={styles.button}
                     onPress={() => {
                    alert('Added to cart');
                    var randomCartId = this.createUniqueId();
                    db.collection(this.state.userId + 'cart_Items').add({
                      customerName: this.state.name,
                      customerContact: this.state.phoneNumber,
                      item_Name: item.item_Name,
                      item_Type: item.item_Type,
                      item_Price: item.item_Price,
                      cartId: randomCartId,
                      itemStatus: 'inCart',
                    });

                  }}>

                    <Text style={styles.buttonText} >add to cart</Text>
                  </TouchableOpacity>
                </Card>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
            onEndReachedThreshold={0.7}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#FFBBBB',
  },
  allTexts: {
    marginBottom: RFPercentage(5),
    marginLeft: RFValue(20),
  },
  firstText: { fontWeight: 'bold', marginTop: 5 },
  button: {
    borderWidth: RFValue(5),
    width: RFValue(100),
    height: RFValue(30),
    backgroundColor: '#A9F1DF',
    marginLeft: RFValue(150),

    marginTop: RFValue(-20),
    borderRadius: RFValue(10),
  },
  buttonText: {
    textAlign: 'center',
  },
});
