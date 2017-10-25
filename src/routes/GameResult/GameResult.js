import React, { Component } from 'react'
import {
  Alert,
  Image,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import Confetti from 'react-native-confetti'
import { Actions } from 'react-native-router-flux'
import socket from '../../socketClient'
import styles from './styles'

export default class GameResult extends Component {
  state = {
    mode: 'result',
    roomNumber: null,
    isFetching: false
  }
  componentDidMount() {
    if(this.confetti) {
       this.confetti.startConfetti()
    }

    socket.on('opponent_left', () => this.setState({ mode: 'opponent_left' }))

    socket.on('create_rematch_error', data => {
      const { error } = data

      this.setState({ isFetching: false })
      Alert.alert('Error', error)
    })

    socket.on('create_rematch_success', data => {
      const { roomNumber } = data

      this.setState({ isFetching: false, mode: 'waiting' })
    })

    socket.on('rematch', data => {
      const { roomNumber } = data

      this.setState({ mode: 'rematch', roomNumber })
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
  }
  componentWillUnmount() {
    const { roomNumber } = this.state

    if(this.confetti) {
      this.confetti.stopConfetti()
    }
    socket.emit('leave_game', { newRoomNumber: roomNumber })
    socket.removeListener('opponent_left')
    socket.removeListener('create_rematch_success')
    socket.removeListener('create_rematch_error')
    socket.removeListener('rematch')
    socket.removeListener('join_game_success')
    socket.removeListener('join_game_error')
  }
  handleRematch = () => {
    this.setState({ isFetching: true })
    socket.emit('create_rematch')
  }
  handleJoinRematch = () => {
    const { roomNumber } = this.state

    this.setState({ isFetching: true })
    socket.emit('join_game', { roomNumber })
  }
  handleCancelRematch = () => {
    const { roomNumber } = this.state

    socket.emit('delete_game', { roomNumber })
    Actions.menu()
  }
  render() {
    const { mode, isFetching } = this.state
    const { score, opponentScore, opponentName } = this.props

    if(mode === 'waiting') {
      return (
        <View style={styles.container}>
          <Text style={styles.headingText}>
            {`Waiting for ${opponentName}...`}
          </Text>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={this.handleCancelRematch}>
            <Text style={styles.btnText}>
              Cancel Rematch
            </Text>
          </TouchableOpacity>
        </View>
      )
    } else if(mode === 'rematch') {
      return (
        <View style={styles.container}>
          <Text style={styles.headingText}>
            {`${opponentName} has challenged you to a rematch!`}
          </Text>
          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={Actions.menu}>
            <Text style={styles.btnText}>
              Back to Home
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={this.handleJoinRematch}
            disabled={isFetching}>
            <Text style={styles.btnText}>
              Accept Rematch
            </Text>
          </TouchableOpacity>
        </View>
      )
    } else if(mode === 'opponent_left') {
      return (
        <View style={styles.container}>
          <Text style={styles.headingText}>
            {`${opponentName} has left the game`}
          </Text>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={Actions.menu}>
            <Text style={styles.btnText}>
              Back to Home
            </Text>
          </TouchableOpacity>
        </View>
      )
    } else {
      let text = ''
      if(score < opponentScore) {
        text = `You lost to ${opponentName}!`
      } else if(score == opponentScore) {
        text = `You tied with ${opponentName}!`
      } else {
        text = `You beat ${opponentName}!`
      }

      return (
        <View style={styles.container}>
          <Text style={styles.headingText}>
            {text}
          </Text>
          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={Actions.menu}>
            <Text style={styles.btnText}>
              Back to Home
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={this.handleRematch}
            disabled={isFetching}>
            <Text style={styles.btnText}>
              Rematch
            </Text>
          </TouchableOpacity>
          <Confetti ref={component => this.confetti = component}/>
        </View>
      )
    }
  }
}
