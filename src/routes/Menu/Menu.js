import React, { Component } from 'react'
import {
  Alert,
  AppState,
  Image,
  Linking,
  Platform,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { Actions } from 'react-native-router-flux'
import socket from '../../socketClient'
import styles from './styles'

export default class Menu extends Component {
  state = {
    isFetching: false
  }
  componentDidMount() {
    socket.on('create_game_success', data => {
      const { roomNumber } = data

      this.setState({ isFetching: false })
      Actions.createGameModal({ roomNumber })
    })

    socket.on('create_game_error', data => {
      const { error } = data

      this.setState({ isFetching: false })
      Alert.alert('Error', error)
    })

    socket.on('join_game_success', data => {
      this.setState({ isFetching: false })
      Actions.game(data)
    })

    socket.on('join_game_error', data => {
      const { error } = data

      this.setState({ isFetching: false })
      Alert.alert('Error', error)
    })

    Linking.addEventListener('url', url => {
      if(url) {
        const roomNumber = Platform.OS === 'ios' ? url.replace('https://faceoff.lol/', '') : url.url.replace('https://faceoff.lol/', '')
        this.setState({ isFetching: true })
        socket.emit('join_game', { roomNumber })
      }
    })
  }
  componentWillUnmount() {
    socket.removeListener('create_game_success')
    socket.removeListener('create_game_error')
    Linking.removeEventListener('url')
  }
  handleCreateGame = () => {
    this.setState({ isFetching: true })
    socket.emit('create_game')
  }
  render() {
    const { isFetching } = this.state

    return (
      <View style={styles.container}>
        <Image source={require('../../public/logo.png')} style={styles.logoImage}/>
        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={Actions.joinGameModal}
          disabled={isFetching}>
          <Text style={styles.btnText}>
            Join Game
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={this.handleCreateGame}
          disabled={isFetching}>
          <Text style={styles.btnText}>
            Create Game
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}
