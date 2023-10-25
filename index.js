/**
 * @format
 */
 import 'react-native-reanimated'

import OneSignal from 'react-native-onesignal';

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';


AppRegistry.registerComponent(appName, () => App);
