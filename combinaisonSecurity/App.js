import React, { Component } from 'react';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { View } from 'react-native';
import {reducer as form} from 'redux-form';

// see https://github.com/facebook/react-native/issues/14796
import { Buffer } from 'buffer';
global.Buffer = Buffer;

// see https://github.com/facebook/react-native/issues/16434
import { URL, URLSearchParams } from 'whatwg-url';
global.URL = URL;
global.URLSearchParams = URLSearchParams;

// see https://github.com/facebook/react-native/issues/12890
import RNEventSource from 'react-native-event-source';
global.EventSource = RNEventSource;

// Replace "book" with the name of resource type
import accessPass from './reducers/accesspass';
import device from './reducers/device';
import greeting from './reducers/greeting';
import Router from './router';

export default class App extends Component {
  render() {
    const store = createStore(combineReducers({
      accessPass,
      device,
      greeting
    }), {}, applyMiddleware(thunk));
    return (
      <Provider store={store}>
        <View style={{flex: 1}}>
          <Router/>
        </View>
      </Provider>
    );
  }
}
