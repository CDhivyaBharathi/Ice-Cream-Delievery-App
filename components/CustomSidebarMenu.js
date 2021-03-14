import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Platform,
} from 'react-native';
import { DrawerItems } from 'react-navigation-drawer';
import { Avatar, Icon } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import firebase from 'firebase';
import db from '../config';
import axios from 'axios';

export default class CustomSideBarMenu extends Component {
  state = {
    userId: firebase.auth().currentUser.email,
    image: '#',
    name: '',
    docId: '',
  };

  selectPicture = async () => {
    const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!cancelled) {
      this.uploadImage(uri, this.state.userId);
    }
  };

  uploadImage = async (uri, imageName) => {
    var response = await fetch(uri);
    var blob = await response.blob();

    var ref = firebase
      .storage()
      .ref()
      .child('user_profiles/' + imageName);

    return ref.put(blob).then((response) => {
      this.fetchImage(imageName);
    });
  };

  fetchImage = (imageName) => {
    var storageRef = firebase
      .storage()
      .ref()
      .child('user_profiles/' + imageName);

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

  getUserProfile() {
    db.collection('users')
      .where('email_id', '==', this.state.userId)
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.setState({
            name: doc.data().first_name + ' ' + doc.data().last_name,
            docId: doc.id,
            image: doc.data().image,
          });
        });
      });
  }



  componentDidMount() {
    this.fetchImage(this.state.userId);
    this.getUserProfile();
    console.log(this.state.image)
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            flex: 0.5,

            alignItems: 'center',
            backgroundColor: 'orange',
          }}>
          <Avatar
            rounded
            source={{
              uri: this.state.image,
            }}
            size={'xlarge'}
            onPress={() => this.selectPicture()}
            containerStyle={styles.imageContainer}
            showEditButton
          />

          <Text style={{ fontWeight: '100', fontSize: RFValue(20), paddingTop: RFValue(10) }}>
            {this.state.name}
          </Text>
        </View>

        <View style={styles.drawerItemsContainer}>
          <DrawerItems {...this.props} />
        </View>
        <View style={styles.logOutContainer}>
          <TouchableOpacity
            style={styles.logOutButton}
            onPress={() => {
              this.props.navigation.navigate('WelcomeScreen');
              firebase.auth().signOut();
            }}>
            <Icon
              name="sign-out"
              type="font-awesome"
              size={RFValue(20)}
              iconStyle={{ paddingLeft: RFValue(5) , marginRight: RFValue(60) }}
            />
            <Text
              style={{
                fontSize: RFValue(15),
                fontWeight: 'bold',
                marginLeft: RFValue(31),
              }}>
              Log Out
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  drawerItemsContainer: {
    flex: 0.8,
  },
  logOutContainer: {
    flex: 0.2,
    justifyContent: 'flex-end',
    paddingBottom: RFValue(30),
  },
  logOutButton: {
    height: RFValue(30),
    width: '100%',
    justifyContent: 'center',
    padding: RFValue(10),
  },
 imageContainer: {
    width: RFValue(100),
    height: RFValue(100),
    marginTop: RFValue(20),
    borderRadius: RFValue(50),
    marginLeft: RFValue(10)
  },
});
