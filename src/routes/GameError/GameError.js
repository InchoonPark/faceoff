import React, { Component } from 'react'
import {
  Image,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { Actions } from 'react-native-router-flux'
import styles from './styles'

export default class GameError extends Component {
  render() {
    const { error } = this.props

    return (
      <View style={styles.container}>
        <Image source={require('../../public/sad_lg.png')} style={styles.emoji}/>
        <Text style={styles.headingText}>Oh no!</Text>
        <Text style={styles.text}>{error}</Text>
        <TouchableOpacity
          style={styles.homeButton}
          onPress={Actions.menu}>
          <Text style={styles.homeButtonText}>
            Back to Home
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}
