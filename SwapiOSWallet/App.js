/**
 * Swap iOS Wallet
 * https://github.com/one-and-only/swap-ios-wallet
 *
 * @format
 * @flow strict-local
 */

import * as React from 'react';
import SwapMainHome from './Views/home';
import SwapWelcome from './Views/welcome';
import {Link, NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Image, TouchableOpacity, Linking, Alert,} from 'react-native';

class Navigator extends React.Component {

  constructor(props) {
      super(props);
  }

  options() {
    const headerRight = () => {
      return (
        <TouchableOpacity onPress={() => {Linking.openURL('https://swap.foundation')}}>
          <Image
            source={require('./Resources/Images/maskot.png')}
            style={{height: 30, width: 42, resizeMode: 'stretch', marginRight: 30, marginBottom: 7,}}
          />
        </TouchableOpacity>
      );
    }

    const headerLeft = () => {
      return (
        <TouchableOpacity onPress={() => {Alert.alert("About", "Swap iOS Wallet v3.2.1_7\n\n©2021 Swap Foundation")}}>
          <Image
            source={require('./Resources/Images/info.png')}
            style={{height: 30, width: 30, resizeMode: 'stretch', marginLeft: 30, marginBottom: 7,}}
          />
        </TouchableOpacity>
      );
    }

    const title = (
      <Image 
        source={require('./Resources/Images/header-logo.png')}
        style={{
          height: 30,
          width: 96,
          resizeMode: 'stretch',
        }}
      />
    )

    var options = {
      title: title,
      headerShown: true,
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: '#052344'
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold'
      },
      headerLeft: headerLeft, // this disables the "back" button. The user should not be able to go back at any point.
      headerRight: headerRight
    }
    return options
  }

  render() {
    const Stack = createStackNavigator();

    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" navigation={this.props.navigation} component={SwapMainHome} options={this.options} />
          <Stack.Screen name="Welcome" navigation={this.props.navigation} component={SwapWelcome} options={this.options} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

}

export default Navigator;
