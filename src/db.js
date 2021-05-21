import firebase from 'firebase/app';
import 'firebase/database';

const config = {
apiKey: "AIzaSyC6MGv83IKjwohzIqAMu1WoJDiFPEitOnc",
    authDomain: "chatapp-f94c7.firebaseapp.com",
    databaseURL: "https://chatapp-f94c7-default-rtdb.firebaseio.com",
    projectId: "chatapp-f94c7",
    storageBucket: "chatapp-f94c7.appspot.com",
    messagingSenderId: "371037355309",
    appId: "1:371037355309:web:66d8d669ecf6bec38fa7a4",
    measurementId: "G-CJSEJ8EM95",
};

const db = firebase.initializeApp(config);
export default db;
