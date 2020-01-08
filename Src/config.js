import * as firebase from "firebase";

var firebaseConfig = {
    apiKey: "AIzaSyCGMIM0iBcLUD_r6eazZY9ZCmYVbOYR96U",
    authDomain: "oit-1c564.firebaseapp.com",
    databaseURL: "https://oit-1c564.firebaseio.com",
    projectId: "oit-1c564",
    storageBucket: "oit-1c564.appspot.com",
    messagingSenderId: "778489604851",
    appId: "1:778489604851:android:66520cffc9a82e4b15e586",
    measurementId: "G-2E2JWS6NC5"
};

let app = firebase.initializeApp(firebaseConfig);

export const Database = app.database()
export const Auth = app.auth()