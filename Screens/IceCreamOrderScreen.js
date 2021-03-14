import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import MyHeader from '../components/AppHeader';
import db from '../config';
import { Card, Header, Image, Avatar, Icon } from 'react-native-elements';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import firebase from 'firebase';

export default class IceCreamOrderScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      allItems: [],
      userId: firebase.auth().currentUser.email,

      name: '',
      quantity: '',
      item_Name: '',
      item_Price: 0,
      item_Quantity: '',
      item_Type: '',
      phoneNumber: '',
      image: '#',
      itemStatus: '',
      cartId: '',
      userDocId: '',
      docId: '',
      dataSource: '',
    };
  }
  fetchImage = (imageName) => {
    var storageRef = firebase
      .storage()
      .ref()
      .child('item_profiles/' + imageName);

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
  createUniqueId() {
    return Math.random().toString(36).substring(7);
  }

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

  getItems = () => {
    db.collection('added_Items').onSnapshot((snapshot) => {
      var allItems = [];
      snapshot.docs.map((doc) => {
        var items = doc.data();
        items['doc_id'] = doc.id;
        allItems.push(items);
      });
      this.setState({
        allItems: allItems,
      });
    });
  };

  componentDidMount() {
    this.getItems();
    this.getUserDetails();
    this.fetchImage(this.state.item_Name);
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.background}>
          <MyHeader
            title={'Ice Cream Order'}
            navigation={this.props.navigation}
          />
          <FlatList
            data={this.state.allItems}
            renderItem={({ item }) => (
              <View style={styles.allTexts}>
                <Card style={{ alignItems: 'center' }}>
                  <Text style={styles.firstText}>{item.item_Name}</Text>
                  <Text style={styles.firstText}>
                    Price : {item.item_Price}
                  </Text>
                  <Text style={styles.firstText}>
                    Quantity : {item.item_Quantity}
                  </Text>
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
                    <Text style={styles.buttonText}>add to cart</Text>
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
    width: RFValue(90),
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
