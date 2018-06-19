// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'

Vue.config.productionTip = false
const firebase = require("firebase");

firebase.initializeApp({
  apiKey: "AIzaSyCWJOdnyasNUL7xAWi83WDHihsKj92N7R8",
  authDomain: "notification-7e499.firebaseapp.com",
  databaseURL: "https://notification-7e499.firebaseio.com",
  projectId: "notification-7e499",
  storageBucket: "notification-7e499.appspot.com",
  messagingSenderId: "400202276323"
});

// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();
const firestore = firebase.firestore();
const settings = { 
  timestampsInSnapshots: true
};
db.settings(settings);

// Add data to firestore
// var docRef = db.collection('users').doc('name');
// var setAda = docRef.set({
//   first: 'DD',
//   last: 'Lovelace',
//   born: 1815,
// });

// Read data to firestore
// db.collection('users').get()
//   .then((snapshot) => {
//     snapshot.forEach((doc) => {
//       console.log(doc.id, '=>', doc.data());
//     });
//   })
//   .catch((err) => {
//     console.log('Error getting documents', err);
//   });

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})

//Get user's unfinished stage
var storeStr = ""
var isFirst = true

var getUnfinishedStage = function () {
  var userRef = db.collection('users')
  var unfinishedUser = userRef.where('status', '==', 'allow')
  
  unfinishedUser.get()
  .then((snapshot) => {
    snapshot.forEach((collections) => {
      if(isFirst) {
        storeStr += collections.data().store_id
        isFirst = false
      } else {
        storeStr += "," + collections.data().store_id
      }
    });
    console.log(storeStr);
  })
  .catch((err) => {
    console.log('Error getting unfinished stage', err);
  });
}

//Get user data from sellsuki API
var getSellsukiUser = function (store_id) {
  axios.get('http://192.168.1.254:8003/store/get-store-notification?store_ids[]=' + store_id)
  .then(function (response) {
    console.log(response);
    console.log(response.data.results)
    return response.data.results
  })
  .catch(function (error) {
    console.log(error);
  });
}

