import React, { Component } from 'react';
import { StyleSheet, View, FlatList, Text } from 'react-native';
import { ListItem, Icon, Card } from 'react-native-elements';
import firebase from 'firebase';
import MyHeader from '../components/AppHeader';
import SwipeableFlatlist from '../components/SwipeableFlatlist';
import db from '../config';

export default class NotificationScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: firebase.auth().currentUser.email,
      allNotifications: [],
      allPromotionNotifications: []
    };

    this.notificationRef = null;
  }

  getNotifications = () => {
    this.requestRef = db
      .collection('allNotifications')
      .where('notification_status', '==', 'unread')
      .where('recieverId', '==', this.state.userId)
      .onSnapshot((snapshot) => {
        var allNotifications = [];
        snapshot.docs.map((doc) => {
          var notification = doc.data();
          notification['doc_id'] = doc.id;
          allNotifications.push(notification);
        });
        this.setState({
          allNotifications: allNotifications,
        });
      });

       this.requestRef = db
      .collection('allPromotionNotifications')
      .where('notification_status', '==', 'unread')
      .where('recieverId', '==', 'all')
      .onSnapshot((snapshot) => {
        var allPromotionNotifications = [];
        snapshot.docs.map((doc) => {
          var notification = doc.data();
          notification['doc_id'] = doc.id;
          allPromotionNotifications.push(notification);
        });
        this.setState({
          allPromotionNotifications: allPromotionNotifications,
        });
      });
  };

  componentDidMount() {
    this.getNotifications();
  }

  componentWillUnmount() {
    this.notificationRef();
  }



  render() {
    return (
      <View style={styles.container}>
        <View style={{ flex: 0.1 }}>
          <MyHeader
            title={'Notifications'}
            navigation={this.props.navigation}
          />
        </View>
        <View style={{ flex: 0.9 }}>
          {this.state.allNotifications.length === 0 ? (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{ fontSize: 25 }}>You have no notifications</Text>
            </View>
          ) : (
            <View>
            <FlatList
              style={{ marginTop: 10 }}
              data={this.state.allNotifications}
              renderItem={({ item }) => (
                <View style={{ marginLeft:5}}>
                   <Card>
                  <Text style={{ fontWeight: 'bold' }}>
                    {item.message}
                  </Text>
                   </Card>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={{ flexGrow: 1 }}
              onEndReachedThreshold={1}
            />
            
            <FlatList
              style={{ marginTop: 10 }}
              data={this.state.allPromotionNotifications}
              renderItem={({ item }) => (
                <View style={{ marginLeft:5}}>
                   <Card>
                  <Text style={{ fontWeight: 'bold' }}>
                    {item.message}
                  </Text>
                   </Card>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={{ flexGrow: 1 }}
              onEndReachedThreshold={1}
            />
            </View>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
