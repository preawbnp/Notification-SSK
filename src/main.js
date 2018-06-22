// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import { resolve } from 'url'
import { rejects } from 'assert'

Vue.config.productionTip = false
const firebase = require("firebase")

firebase.initializeApp({
  apiKey: "AIzaSyCWJOdnyasNUL7xAWi83WDHihsKj92N7R8",
  authDomain: "notification-7e499.firebaseapp.com",
  databaseURL: "https://notification-7e499.firebaseio.com",
  projectId: "notification-7e499",
  storageBucket: "notification-7e499.appspot.com",
  messagingSenderId: "400202276323"
});

// Initialize Cloud Firestore through Firebase
var db = firebase.firestore()
const firestore = firebase.firestore()
const settings = { 
  timestampsInSnapshots: true
}
db.settings(settings)

//ploy
var storeid;
var get_player_id = "UserIDgetfromFirebase";
// var OneSignal = window.OneSignal || [];
// OneSignal.push(function() {
//   OneSignal.init({
//     appId: "17056444-a80b-40d4-9388-1a9a751b0f31",
//     autoRegister:false,
//     welcomeNotification: {
//       "title": "Wellcome to Sellsuki",
//       "message": "p[flpglpdlgpkfdgkdpogkodfkpokgokdfkokgokfogkdkgkofdkpkogpfdkgkofkogkofpkgopkdogkpodfkogpopkfdokdgokfokgoppf",
//       //"url": "" /* Leave commented for the notification to not open a window on Chrome and Firefox (on Safari, it opens to your webpage) */
//     },
//     notifyButton: {
//       enable: true,
//       displayPredicate: function() { ////////////////////////////////////////////////////hide the ring when subscribed
//         return OneSignal.isPushNotificationsEnabled()
//         .then(function(isPushEnabled) {
//           /* The user is subscribed, so we want to return "false" to hide the Subscription Bell */
//           return !isPushEnabled;
//         });
//       },
//       showCredit: false,
//       size: "large"
//     },
//   });
// });
OneSignal.push(function() {
  OneSignal.getUserId(function(userId) {
    document.getElementById("demo").innerHTML=userId;///////////////////////////PLAYER_ID
    var user = db.collection('users');
    user.where('storeId', '==',"1").get()
      .then(doc =>{
        console.log("doc.size : ",doc.size);
        doc.forEach(function(element) {
          if(doc.size>0){
            get_player_id = element.data().playerId;
          }
        });
        console.log("get player_id= ",get_player_id);

        if ((doc.size==0 && userId!=null)){
          console.log('No such document!');
          var adduser = user.doc(storeid).set({playerId: userId,storeId: storeid,}); //ploy is store_id
        }else if(userId==null){
          console.log('UserID not defind yet');
        }else if(doc.size>0&&(get_player_id!=userId)){
          db.collection("users").doc(storeid).update({ ///change ploy to store_id that get from cookie
            "playerId": userId
          }).then(function() {
            console.log("Document successfully updated!");
          });
          //var adduser = user.doc("ploy").set({player_id: userId,store_id:"ploy",}); //ploy is store_id
        }else if(doc.size>0){
          console.log('have this user in data already!');
        }
      })
      .catch(err => {
        console.log('Error getting document', err);
      });
  });
});

//Action show in html
  function onManageWebPushSubscriptionButtonClicked(event) {
    getSubscriptionState().then(function(state) {
        if (state.isPushEnabled) {
            /* Subscribed, opt them out */
            console.log("1");
            OneSignal.setSubscription(false);
            //update to database
        } else {
            if (state.isOptedOut) {
                /* Opted out, opt them back in */
              OneSignal.setSubscription(true);
              console.log("2");
            } else {
                /* Unsubscribed, subscribe them */  //POPUP TO ALLOW
                OneSignal.registerForPushNotifications();
                console.log("3");
            }
        }
    });
    event.preventDefault();
  }
  function updateMangeWebPushSubscriptionButton(buttonSelector) {
    //var hideWhenSubscribed = false;
    var subscribeText = "Subscribe";
    //var unsubscribeText = "Unsubscribe from Notifications";
    getSubscriptionState().then(function(state) {
        //var buttonText = !state.isPushEnabled || state.isOptedOut ? subscribeText : unsubscribeText;
        var element = document.querySelector(buttonSelector);
        if (element === null) {
            return;
        }
        element.removeEventListener('click', onManageWebPushSubscriptionButtonClicked);
        element.addEventListener('click', onManageWebPushSubscriptionButtonClicked);
        element.textContent = subscribeText;/// set button text
        //if (state.hideWhenSubscribed && state.isPushEnabled) {
        if (state.isPushEnabled) { // if already subscript it will disapppear
            element.style.display = "none";
            //element.style.display = "";
        } else {
            element.style.display = "";
        }
    });
  }
  function getSubscriptionState() {
    return Promise.all([
      OneSignal.isPushNotificationsEnabled(),
      OneSignal.isOptedOut()
    ]).then(function(result) {
        var isPushEnabled = result[0];
        var isOptedOut = result[1];
        return {
            isPushEnabled: isPushEnabled,
            isOptedOut: isOptedOut
        };
    });
  }
  // function addNewUser() {
  var buttonSelector = "#my-notification-button";
  /* This example assumes you've already initialized OneSignal */
  OneSignal.push(function() {
      // If we're on an unsupported browser, do nothing
      if (!OneSignal.isPushNotificationsSupported()) {
          return;
      }
      updateMangeWebPushSubscriptionButton(buttonSelector);
      OneSignal.on("subscriptionChange", function(isSubscribed) {
          /* If the user's subscription state changes during the page's session, update the button text */
          updateMangeWebPushSubscriptionButton(buttonSelector);
      });
  });

// Add data to firestore
// var docRef = db.collection('users').doc('name')
// var setAda = docRef.set({
//   first: 'DD',
//   last: 'Lovelace',
//   born: 1815,
// })

// Read data to firestore
// db.collection('users').get()
//   .then((snapshot) => {
//     snapshot.forEach((doc) => {
//       console.log(doc.id, '=>', doc.data())
//     })
//   })
//   .catch((err) => {
//     console.log('Error getting documents', err)
//   })

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
var userRef = db.collection('users')
var unfinishedUser = userRef.where('status', '==', 'allow')

function getUnfinishedStage () {
  console.log('>> GetUnfinish')
  return new Promise((resolve, reject) => {
    resolve(
      unfinishedUser.get()
        .then((snapshot) => {
          snapshot.forEach((collections) => {
            if(isFirst) {
              storeStr += collections.data().storeId
              isFirst = false
            } else {
              storeStr += "," + collections.data().storeId
            }
          });
          console.log(storeStr)
          return storeStr
        })
        .catch((err) => {
          console.log('Error getting unfinished stage or No allow status', err)
        })
    )
  })
}

//Get user data from sellsuki API
function getSellsukiUser (storeId) {
  return new Promise((resolve, reject) => {
    resolve(
      axios.get('http://192.168.1.254:8003/store/get-store-notification?store_ids[]=' + storeId)
      .then(function (response) {
        // console.log(response)
        // console.log(response.data.result)
        return response
      })
      .catch(function (error) {
        console.log(error)
      })
    )
  })
}

//Update data to Firestore
async function updateFirestore() {
  var storeId = await getUnfinishedStage()
  var users = await getSellsukiUser(storeId)
  var stage = ''
  
  users.data.results.forEach((user) => {
    // console.log(user)
    if (user.count_product <= 1){
      // console.log('1 stage')
      stage = '1'
      createMessage(stage, user.store_id)
    } else if (user.count_product > 1 && 
      user.count_store_payment_channel == 0) {
      // console.log('2 stage')
      stage = '2'
      createMessage(stage, user.store_id)
    } else if (user.count_store_payment_channel > 0 && 
      user.count_store_shipping_type <= 1) {
      // console.log('3 stage')
      stage = '3'
      createMessage(stage, user.store_id)
    } else {
      // console.log('Finish stage')
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
  
  var https = require('https')
  var req = https.request(options, function(res) {  
    res.on('data', function(data) {
      console.log("Response:")
      console.log(JSON.parse(data))
    })
  })
  
  req.on('error', function(e) {
    console.log("ERROR:")
    console.log(e)
  })
  
  req.write(JSON.stringify(data))
  req.end()
}

function getPlayerId(storeId) {
  return new Promise((resolve, reject) => {
    resolve(
      userRef.doc(storeId).get()
      .then(doc => {
        if (!doc.exists) {
          console.log('No such document!');
        } else {
          console.log('Document data:', doc.data())
          return doc.data().playerId
        }
      })
      .catch(err => {
        console.log('Error getting document', err)
      })
    )
  })
}

function getLanguage(playerId) {
  return new Promise((resolve, reject) => {
    resolve(
      axios.get('https://onesignal.com/api/v1/players/' + playerId + '?app_id=17056444-a80b-40d4-9388-1a9a751b0f31')
      .then(function (response) {
        // console.log(response)
        // console.log(response.data.result)
        return response.data.language
      })
      .catch(function (error) {
        console.log(error)
      })
    )
  })
}

//Template message
async function createMessage(stage, storeId) {
  var heading = ''
  var content = ''
  var url = ''
  var playerId = await getPlayerId(storeId)
  var language = await getLanguage(playerId)

  // console.log('Id: ' + playerId + ' language: ' + language)

  if(language == "th") {
    if (stage == '1') {
      heading = 'อยากเริ่มขาย ต้องเพิ่มสินค้าก่อนนะ!'
      content = 'เริ่มการขายผ่าน Sellsuki โดยการเพิ่มสินค้าในสต๊อกสินค้า'
    } else if (stage == '2') {
      heading = 'เพิ่มช่องทางชำระเงินสำหรับลูกค้าหรือยัง?'
      content = 'เพิ่มบัญชีธนาคารหรือช่องทางอื่นๆ เพื่อรับชำระเงินจากลูกค้าหลังยืนยันออเดอร์'
    } else if (stage == '3') {
      heading = 'อย่าลืมเพิ่มวิธีจัดส่งและค่าส่งสินค้าด้วยนะ'
      content = 'เพิ่มวิธีจัดส่งสินค้าพร้อมค่าจัดส่งแบบต่างๆ ให้ลูกค้าเลือกรับของได้ตามสะดวก'
    } 
  } else if(language == "en") {
    if (stage == '1') {
      heading = 'Ready to sell? let’s add your products first!'
      content = 'Add products into Sellsuki inventory to run your online store.'
    } else if (stage == '2') {
      heading = 'Have you added payment methods?'
      content = 'Provide your payment methods for money receiving.'
    } else if (stage == '3') {
      heading = 'Do not forget adding delivery options.'
      content = 'More delivery options, more customer satisfaction.'
    } 
  }
 
  var message = { 
    app_id: "17056444-a80b-40d4-9388-1a9a751b0f31",
    headings: {"en": heading},
    contents: {"en": content},
    include_player_ids: [playerId]
  }
  // console.log(message)
  sendNotification(message)
}

// updateFirestore()