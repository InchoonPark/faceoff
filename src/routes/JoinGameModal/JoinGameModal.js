import React, { Component } from 'react'
import {
  Alert,
  Keyboard,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import { Actions, ActionConst } from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/SimpleLineIcons'
import socket from '../../socketClient'
import styles from './styles'

export default class JoinGameModal extends Component {
  state = {
    isFetching: false,
    roomNumberInput: null
  }
  componentDidMount() {
    socket.on('join_game_success', data => {
      this.setState({ isFetching: false })
      Actions.game(data)
    })

    socket.on('join_game_error', data => {
      const { error } = data

      this.setState({ isFetching: false })
      Alert.alert('Error', error)
    })
  }
  componentWillUnmount() {
    socket.removeListener('join_game_success')
    socket.removeListener('join_game_error')
  }
  joinGame = () => {
    const { roomNumberInput } = this.state

    if(roomNumberInput) {
      Keyboard.dismiss()
      this.setState({ isFetching: true })
      socket.emit('join_game', { roomNumber: roomNumberInput })
    }
  }
  render() {
    const { isFetching } = this.state

    return (
      <View style={styles.overlay}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.cancelButton} onPress={Actions.pop}>
            <Icon name='close' style={styles.cancelButtonIcon} />
          </TouchableOpacity>
          <Text style={styles.headingText}>Join Game</Text>
          <View style={styles.separator}/>
          <Text style={styles.text}>
            {'Enter your friend\'s room number to join their game!'}
          </Text>
          <TextInput
            style={styles.input}
            onChangeText={text => this.setState({ roomNumberInput: text })}
            autoCorrect={false}
            autoCapitalize={'none'}
            keyboardType={'phone-pad'}
            maxLength={7}
            placeholder={'Room Number'}
            underlineColorAndroid='rgba(0,0,0,0)'/>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={this.joinGame}
            disabled={isFetching}>
            <Text style={styles.primaryButtonText}>
              Join
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}
