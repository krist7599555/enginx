import firebase from 'firebase/app'
import 'firebase/database'
export const app = firebase.initializeApp({
  "apiKey": "AIzaSyBqoEe5S2wWfWK0wZ5KitfNtcoC02m6rtk",
  "authDomain": "enginx-7526b.firebaseapp.com",
  "databaseURL": "https://enginx-7526b.firebaseio.com",
  "projectId": "enginx-7526b",
  "storageBucket": "",
  "messagingSenderId": "951933404986",
  "appId": "1:951933404986:web:265e97e27397168e4ff203",
  "measurementId": "G-XCX0LE1B7M"
});
export const database = firebase.database();
