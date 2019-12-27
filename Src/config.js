import * as firebase from "firebase";

var firebaseConfig = {
    apiKey: "AIzaSyCzPgvNEdBP4Tfc1Auaaoe6fnHn4eEGmXY",
    authDomain: "oit-e41ad.firebaseapp.com",
    databaseURL: "https://oit-e41ad.firebaseio.com",
    projectId: "oit-e41ad",
    storageBucket: "oit-e41ad.appspot.com",
    messagingSenderId: "953985429840",
    appId: "1:953985429840:web:91db7904128fef27cc7c55",
    measurementId: "G-2E2JWS6NC5"
};

let app = firebase.initializeApp(firebaseConfig);

export const Database = app.database()
export const Auth = app.auth()