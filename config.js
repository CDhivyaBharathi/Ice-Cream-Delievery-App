import firebase from 'firebase';
 require('@firebase/firestore')
 
var firebaseConfig = {
    apiKey: "AIzaSyANKIfiANWDPimp3ZFP3_08Ggup76oclQc",
    authDomain: "selfproject-1a1bc.firebaseapp.com",
    projectId: "selfproject-1a1bc",
    storageBucket: "selfproject-1a1bc.appspot.com",
    messagingSenderId: "623954778735",
    appId: "1:623954778735:web:daf8493bd9c865f64d4b9a"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase.firestore();