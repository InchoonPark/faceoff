import React, { Component } from 'react'
import {
  Image,
  PermissionsAndroid,
  Platform,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import Permissions from 'react-native-permissions'
import { Actions } from 'react-native-router-flux'
import styles from './styles'

async function openSettingsAndroid() {
  try {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
    ])

    if(granted['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED
    && granted['android.permission.RECORD_AUDIO'] === PermissionsAndroid.RESULTS.GRANTED) {
      Actions.home()
    }
  } catch(error) {

  }
}

export default class PermissionsNeeded extends Component {
  componentDidMount() {
    Permissions.checkMultiple(['camera', 'microphone']).then(response => {
      if(response.camera === 'authorized' && response.microphone === 'authorized') {
        Actions.home()
      }
    })
  }
  handleOpenSettings = () => {
    if(Platform.OS === 'ios') {
      Permissions.openSettings()
    } else {
      openSettingsAndroid()
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <Image source={require('../../public/sad_lg.png')} style={styles.emoji}/>
        <Text style={styles.headingText}>Oh no!</Text>
        <Text style={styles.text}>
          Enable camera and microphone access to start playing FaceOff.
        </Text>
        <TouchableOpacity
          style={styles.enableButton}
          onPress={this.handleOpenSettings}>
          <Text style={styles.enableButtonText}>
            {(Platform.OS === 'ios') ? 'Open Settings' : 'Enable Access'}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}
