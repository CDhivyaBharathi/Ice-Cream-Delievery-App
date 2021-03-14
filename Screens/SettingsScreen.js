import React, { Component } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import MyHeader from '../components/AppHeader';
import db from '../config';
import firebase from 'firebase';
import { Avatar, Icon } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';

export default class SettingScreen extends Component {
  constructor() {
    super();
    this.state = {
      emailId: '',
      firstName: '',
      lastName: '',
      address: '',
      contact: '',
      docId: '',
      userId: firebase.auth().currentUser.email,
      image: '#',
      name: '',
    };
  }

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
    this.getUserDetails();
  }

  getUserDetails = () => {
    var email = firebase.auth().currentUser.email;
    db.collection('users')
      .where('email_id', '==', email)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var data = doc.data();
          this.setState({
            emailId: data.email_id,
            firstName: data.first_name,
            lastName: data.last_name,
            address: data.address,
            contact: data.contact,
            docId: doc.id,
          });
        });
      });
  };

  updateUserDetails = () => {
    db.collection('users').doc(this.state.docId).update({
      first_name: this.state.firstName,
      last_name: this.state.lastName,
      address: this.state.address,
      contact: this.state.contact,
    });

    alert('Profile Updated Successfully');
  };

  render() {
    return (
      <View style={styles.container}>
        <MyHeader title="Settings" navigation={this.props.navigation} />
        <View>
          <Avatar
            rounded
            source={{
              uri: this.state.image,
            }}
            size={100}
            onPress={() => this.selectPicture()}
            containerStyle={styles.imageContainer}
            showEditButton
          />

          <Text style={styles.name}>{this.state.name}</Text>
        </View>
        <View style={styles.formContainer}>
          <TextInput
            style={styles.formTextInput}
            placeholder={'First Name'}
            maxLength={8}
            onChangeText={(text) => {
              this.setState({
                firstName: text,
              });
            }}
            value={this.state.firstName}
          />
          <TextInput
            style={styles.lastNameTextInput}
            placeholder={'Last Name'}
            maxLength={8}
            onChangeText={(text) => {
              this.setState({
                lastName: text,
              });
            }}
            value={this.state.lastName}
          />
          <TextInput
            style={styles.contactTextInput}
            placeholder={'Contact'}
            maxLength={10}
            keyboardType={'numeric'}
            onChangeText={(text) => {
              this.setState({
                contact: text,
              });
            }}
            value={this.state.contact}
          />
          <TextInput
            style={styles.addressTextInput}
            placeholder={'Address'}
            multiline={true}
            onChangeText={(text) => {
              this.setState({
                address: text,
              });
            }}
            value={this.state.address}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this.updateUserDetails();
            }}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    justifyContent: 'center',
  },
  name: {
    fontWeight: 'bold',
    fontSize: RFValue(20),
    marginLeft: RFValue(120),
    marginTop: RFValue(-60),
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  formTextInput: {
    width: '90%',
    height: RFValue(50),
    alignSelf: 'center',
    borderColor: 'grey',
    borderRadius: 2,
    borderWidth: 1,
    padding: RFValue(10),
    marginBottom: RFValue(20),
    marginLeft: RFValue(20),
    marginTop: RFValue(70),
  },
  lastNameTextInput: {
    width: '90%',
    height: RFValue(50),
    alignSelf: 'center',
    borderColor: 'grey',
    borderRadius: 2,
    borderWidth: 1,
    padding: RFValue(10),
    marginBottom: RFValue(20),
    marginLeft: RFValue(20),
  },
  imageContainer: {
    width: 100,
    height: 100,
    marginTop: 20,
    borderRadius: 50,
    marginLeft: 10
  },
  contactTextInput: {
    width: '90%',
    height: RFValue(50),
    alignSelf: 'center',
    borderColor: 'grey',
    borderRadius: 2,
    borderWidth: 1,
    padding: RFValue(10),
    marginBottom: RFValue(20),
    marginLeft: RFValue(20),
  },
  addressTextInput: {
    width: '90%',
    height: RFValue(50),
    alignSelf: 'center',
    borderColor: 'grey',
    borderRadius: 2,
    borderWidth: 1,
    padding: RFValue(10),
    marginBottom: RFValue(20),
    marginLeft: RFValue(20),
  },
  button: {
    width: RFPercentage('75%'),
    height: RFValue(60),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: RFValue(50),
    backgroundColor: '#ff5722',
    shadowColor: '#000',
    shadowOffset: {
      width: RFValue(0),
      height: RFValue(8),
    },
    shadowOpacity: RFValue(0.44),
    shadowRadius: RFValue(10.32),
    elevation: RFValue(16),
    marginTop: RFValue(20),
  },
  buttonText: {
    fontSize: RFValue(23),
    fontWeight: 'bold',
    color: '#fff',
  },
});
