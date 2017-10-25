import React, { Component } from 'react'
import {
  Alert,
  Image,
  Keyboard,
  Linking,
  PermissionsAndroid,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import Permissions from 'react-native-permissions'
import { Actions } from 'react-native-router-flux'
import socket from '../../socketClient'
import styles from './styles'

async function requestPermissionsAndroid() {
  try {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
    ])

    if(granted['android.permission.CAMERA'] !== PermissionsAndroid.RESULTS.GRANTED
    || granted['android.permission.RECORD_AUDIO'] !== PermissionsAndroid.RESULTS.GRANTED) {
      Actions.permissionsNeeded()
    }
  } catch(error) {

  }
}

export default class Home extends Component {
  state = {
    isFetching: false,
    screenNameInput: null,
    roomNumber: null
  }
  componentDidMount() {
    if(Platform.OS === 'ios') {
      if(!__DEV__) {
        Permissions.request('camera').then(response => {
          if(response != 'authorized') {
            Actions.permissionsNeeded()
          }
          Permissions.request('microphone').then(response => {
            if(response != 'authorized') {
              Actions.permissionsNeeded()
            }
          })
        })
      }
    } else {
      requestPermissionsAndroid()
    }

    Linking.getInitialURL().then((url) => {
      if(url) {
        const roomNumber = url.replace('https://faceoff.lol/', '')
        this.setState({ roomNumber })
      }
    }).catch(error => console.error('An error occurred', error))

    Linking.addEventListener('url', url => {
      if(url) {
        const roomNumber = Platform.OS === 'ios' ? url.replace('https://faceoff.lol/', '') : url.url.replace('https://faceoff.lol/', '')
        this.setState({ roomNumber })
      }
    })

    socket.on('set_user_success', () => {
      Actions.menu()
    })

    socket.on('set_user_error', data => {
      const { error } = data

      Alert.alert('Error', error)
    })

    socket.on('set_user_join_game_error', data => {
      const { error } = data

      Actions.menu()
      Alert.alert('Error', error)
    })

    socket.on('join_game_success', data => { Actions.game(data) })
  }
  componentWillUnmount() {
    socket.removeListener('set_user_success')
    socket.removeListener('set_user_error')
    Linking.removeEventListener('url')
  }
  handleCreateGame = () => {
    socket.emit('create_game')
  }
  handleScreenNameSubmit = () => {
    const { screenNameInput, roomNumber } = this.state

    if(screenNameInput) {
      Keyboard.dismiss()
      this.setState({ isFetching: true })

      if(roomNumber) {
        socket.emit('set_user_join_game', {
          screenName: screenNameInput,
          roomNumber
        })
      } else {
        socket.emit('set_user', { screenName: screenNameInput })
      }
    }
  }
  render() {
    const { isFetching } = this.state

    return (
      <View style={styles.container}>
        <Image source={require('../../public/logo.png')} style={styles.logoImage}/>
        <View style={styles.screenNameInputContainer}>
          <TextInput
            style={styles.screenNameInput}
            onChangeText={text => this.setState({ screenNameInput: text })}
            maxLength={10}
            placeholder={'Screen Name'}
            underlineColorAndroid='rgba(0,0,0,0)'/>
        </View>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={this.handleScreenNameSubmit}
          disabled={isFetching}>
          <Text style={styles.btnText}>OK</Text>
        </TouchableOpacity>
      </View>
    )
  }
}
