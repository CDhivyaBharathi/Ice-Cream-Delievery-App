import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
} from 'react-native';

import db from '../config';
import firebase from 'firebase';
import Icon from 'react-native-vector-icons/FontAwesome';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';

export default class WelcomeScreen extends Component {
  constructor() {
    super();
    this.state = {
      emailId: '',
      password: '',
      firstName: '',
      lastName: '',
      address: '',
      contact: '',
      confirmPassword: '',
      isModalVisible: 'false',
    };
  }

  userSignUp = (emailId, password, confirmPassword) => {
    if (password !== confirmPassword) {
      return alert("password doesn't match\nCheck your password.");
    } else {
      firebase
        .auth()
        .createUserWithEmailAndPassword(emailId, password)
        .then(() => {
          db.collection('users').add({
            first_name: this.state.firstName,
            last_name: this.state.lastName,
            contact: this.state.contact,
            email_id: this.state.emailId,
            address: this.state.address,
            IsOrderActive: false,
          });

          return alert('User Added Successfully', '', [
            {
              text: 'OK',
              onPress: () => this.setState({ isModalVisible: false }),
            },
          ]);
        })
        .catch((error) => {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          return alert(errorMessage);
        });
    }
  };

  userLogin = (emailId, password) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(emailId, password)
      .then(() => {
        this.props.navigation.navigate('BottomTab');
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        return alert(errorMessage);
      });
  };

  showModal = () => {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.state.isModalVisible}>
        <View style={styles.modalContainer}>
          <ScrollView style={{ width: '100%' }}>
            <KeyboardAvoidingView style={styles.KeyboardAvoidingView}>
              <Text style={styles.modalTitle}>Registration</Text>
              <TextInput
                style={styles.formTextInput}
                placeholder={'First Name'}
                maxLength={8}
                onChangeText={(text) => {
                  this.setState({
                    firstName: text,
                  });
                }}
              />
              <TextInput
                style={styles.formTextInput}
                placeholder={'Last Name'}
                maxLength={8}
                onChangeText={(text) => {
                  this.setState({
                    lastName: text,
                  });
                }}
              />
              <TextInput
                style={styles.formTextInput}
                placeholder={'Contact'}
                maxLength={10}
                keyboardType={'numeric'}
                onChangeText={(text) => {
                  this.setState({
                    contact: text,
                  });
                }}
              />
              <TextInput
                style={styles.formTextInput}
                placeholder={'Address'}
                multiline={true}
                onChangeText={(text) => {
                  this.setState({
                    address: text,
                  });
                }}
              />
              <TextInput
                style={styles.formTextInput}
                placeholder={'Email'}
                keyboardType={'email-address'}
                onChangeText={(text) => {
                  this.setState({
                    emailId: text,
                  });
                }}
              />
              <TextInput
                style={styles.formTextInput}
                placeholder={'Password'}
                secureTextEntry={true}
                onChangeText={(text) => {
                  this.setState({
                    password: text,
                  });
                }}
              />
              <TextInput
                style={styles.formTextInput}
                placeholder={'Confrim Password'}
                secureTextEntry={true}
                onChangeText={(text) => {
                  this.setState({
                    confirmPassword: text,
                  });
                }}
              />
              <View style={styles.modalBackButton}>
                <TouchableOpacity
                  style={styles.registerButton}
                  onPress={() =>
                    this.userSignUp(
                      this.state.emailId,
                      this.state.password,
                      this.state.confirmPassword
                    )
                  }>
                  <Text style={styles.registerButtonText}>Register</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.modalBackButton}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => this.setState({ isModalVisible: false })}>
                  <Text style={{ color: '#FFBBBB' }}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </ScrollView>
        </View>
      </Modal>
    );
  };
  render() {
    return (
      <View style={styles.container}>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Text style={styles.title}>Icecream App</Text>
        </View>
        <View>
          <Icon
            name="envelope"
            type="font-awesome"
            size={24}
            style={{
              marginBottom: RFValue(-43),
              marginLeft: RFValue(7),
              color: '#FFBBBB',
            }}
          />
          <TextInput
            style={styles.loginBox}
            placeholder="   abc@example.com"
            keyboardType="email-address"
            onChangeText={(text) => {
              this.setState({
                emailId: text,
              });
            }}
          />
          <Icon
            name="key"
            type="font-awesome"
            size={24}
            style={{
              marginBottom: RFValue(-43),
              marginLeft: RFValue(7),
              color: '#FFBBBB',
            }}
          />
          <TextInput
            style={styles.loginBox}
            secureTextEntry={true}
            placeholder="   enter Password"
            onChangeText={(text) => {
              this.setState({
                password: text,
              });
            }}
          />

          <TouchableOpacity
            style={[
              styles.button,
              { marginBottom: RFValue(20), marginTop: RFValue(20) },
            ]}
            onPress={() => {
              this.userLogin(this.state.emailId, this.state.password);
            }}>
            <Icon
              name="sign-in"
              type="font-awesome"
              size={24}
              style={{
                marginLeft: RFValue(-80),
                marginBottom: RFValue(-25),
                marginRight: RFValue(10),
                color: '#A9F1DF',
              }}
            />
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => this.setState({ isModalVisible: true })}>
            <Icon
              name="user-plus"
              type="font-awesome"
              size={24}
              style={{
                marginLeft: RFValue(-80),
                marginBottom: RFValue(-25),
                marginRight: RFValue(15),
                color: '#A9F1DF',
              }}
            />
            <Text style={styles.buttonText}>SignUp</Text>
          </TouchableOpacity>
        </View>
        {this.showModal()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A9F1DF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: RFValue(45),
    fontWeight: 'bold',
    paddingBottom: RFValue(30),
    color: '#FFBBBB',
  },
  loginBox: {
    width: RFValue(300),
    height: RFValue(40),
    borderBottomWidth: RFValue(1.5),
    borderColor: '#FFBBBB',
    fontSize: RFValue(20),
    margin: RFValue(10),
    paddingLeft: RFValue(30),
    marginRight: RFValue(5),
  },
  KeyboardAvoidingView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    justifyContent: 'center',
    alignSelf: 'center',
    fontSize: RFValue(30),
    color: '#FFBBBB',
    margin: RFValue(50),
  },
  modalContainer: {
    flex: 1,
    borderRadius: RFValue(20),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffff',
    marginRight: RFValue(30),
    marginLeft: RFValue(30),
    marginTop: RFValue(80),
    marginBottom: RFValue(80),
  },
  formTextInput: {
    width: RFValue('75%'),
    height: RFValue(35),
    alignSelf: 'center',
    borderColor: '#FFBBBB',
    borderRadius: RFValue(10),
    borderWidth: RFValue(1),
    marginTop: RFValue(20),
    padding: RFValue(10),
  },
  registerButton: {
    width: RFValue(200),
    height: RFValue(40),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: RFValue(1),
    borderRadius: RFValue(10),
    marginTop: RFValue(30),
    borderColor: '#FFBBBB',
  },
  registerButtonText: {
    color: '#FFBBBB',
    fontSize: RFValue(15),
    fontWeight: 'bold',
  },
  cancelButton: {
    width: RFValue(300),
    height: RFValue(30),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: RFValue(5),
    color: '#FFBBBB',
  },

  button: {
    width: RFValue(300),
    height: RFValue(50),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: RFValue(25),
    backgroundColor: '#FFBBBB',
    shadowColor: '#000',
    shadowOffset: {
      width: RFValue(0),
      height: RFValue(8),
    },
    marginLeft: RFValue(10),
    shadowOpacity: RFValue(0.3),
    shadowRadius: RFValue(10.32),
    elevation: RFValue(16),
    padding: RFValue(10),
  },
  buttonText: {
    color: '#ffff',
    fontWeight: '200',
    fontSize: RFValue(20),
  },
});
