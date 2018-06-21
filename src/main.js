// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import { resolve } from 'url';
import { rejects } from 'assert';

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
  components: { App },
})

//Get user's unfinished stage
var storeStr = ""
var isFirst = true
var userRef = db.collection('users')
var unfinishedUser = userRef.where('status', '==', 'allow')

function getUnfinishedStage () {
  return new Promise((resolve, reject) => {
    resolve(
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
          console.log(storeStr)
          return storeStr
        })
        .catch((err) => {
          console.log('Error getting unfinished stage', err);
        })
    )
  })
}

//Get user data from sellsuki API
function getSellsukiUser (store_id) {
  return new Promise((resolve, reject) => {
    resolve(
      axios.get('http://192.168.1.254:8003/store/get-store-notification?store_ids[]=' + store_id)
      .then(function (response) {
        // console.log(response);
        console.log(response.data.results)
        return response
      })
      .catch(function (error) {
        console.log(error);
      })
    )})
}

//Update data to Firestore
async function updateFirestore() {
  var store_id = await getUnfinishedStage()
  var users = await getSellsukiUser(store_id)

  users.data.results.forEach((user) => {
    if (user.count_product > 1 && user.count_store_payment_channel > 0 && user.count_store_shipping_type > 1) {
      userRef.doc(user.store_id).update({
        status: 'finished'
      })
    }
  })
}

//Send notification
var sendNotification = function(data) {
  var headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Authorization": "Basic ZjhhZjViNjYtYmUwZS00Zjg0LTk3NmQtYzQ1ZmM4ZDVhOGI2"
  };
  
  var options = {
    host: "onesignal.com",
    port: 443,
    path: "/api/v1/notifications",
    method: "POST",
    headers: headers
  };
  
  var https = require('https');
  var req = https.request(options, function(res) {  
    res.on('data', function(data) {
      console.log("Response:");
      console.log(JSON.parse(data));
    });
  });
  
  req.on('error', function(e) {
    console.log("ERROR:");
    console.log(e);
  });
  
  req.write(JSON.stringify(data));
  req.end();
};

function createMessage(content, heading, url, player_id) {
  var message = { 
    app_id: "17056444-a80b-40d4-9388-1a9a751b0f31",
    contents: {"en": content},
    headings: {"en": heading},
    // include_player_ids: [player_id]
    included_segments: ["All"]
  };
}

// sendNotification();
// createMessage(content, heading, url, player_id)