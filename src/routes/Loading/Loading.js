import React, { Component } from 'react'
import { View } from 'react-native'
import Spinner from 'react-native-spinkit'
import styles from './styles'

export default class Loading extends Component {
  render() {
    return (
      <View style={styles.overlay} behavior={'padding'}>
        <Spinner type={'Bounce'} color={'#FFFFFF'} size={50}/>
      </View>
    )
  }
}
