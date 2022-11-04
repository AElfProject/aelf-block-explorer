// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent } from 'firebase/analytics';
import { initializePerformance, getPerformance, trace } from 'firebase/performance';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCQVKqZoxl5EPnayYlnyR66-8DCLV7q-Og',
  authDomain: 'aelf-block-explorer.firebaseapp.com',
  projectId: 'aelf-block-explorer',
  storageBucket: 'aelf-block-explorer.appspot.com',
  messagingSenderId: '110395960830',
  appId: '1:110395960830:web:1682efb6be7f74e27264af',
  measurementId: 'G-8QZD8D0F1F',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// app.automaticDataCollectionEnabled = true;
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}
export const setEvent = (eventName: string, params?: object) => {
  logEvent(analytics, eventName, params);
};
export const uploadPerformance = () => {
  const perf = getPerformance(app);
  // const perf = initializePerformance(app, {
  //   dataCollectionEnabled: true,
  //   instrumentationEnabled: true,
  // });
  console.log(perf);
};
