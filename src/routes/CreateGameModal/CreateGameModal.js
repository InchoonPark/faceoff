import React, { Component } from 'react'
import {
  Alert,
  Clipboard,
  Share,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { Actions } from 'react-native-router-flux'
import SendSMS from 'react-native-sms'
import Icon from 'react-native-vector-icons/SimpleLineIcons'
import socket from '../../socketClient'
import styles from './styles'

export default class CreateGameModal extends Component {
  componentDidMount() {
    socket.on('join_game_success', data => {
      Actions.game(data)
    })
  }
  componentWillUnmount() {
    socket.removeListener('join_game_success')
  }
  handleCopy = () => {
    const { roomNumber } = this.props

    Clipboard.setString(roomNumber)
    Alert.alert('Copied', 'The room number has been copied to the clipboard!')
  }
  handleSMS = () => {
    const { roomNumber } = this.props

    SendSMS.send({
  		body: `Join my game at https://faceoff.lol/${roomNumber}!`,
      recipients: [],
      successTypes: ['sent', 'queued']
  	})
  }
  handleShare = () => {
    const { roomNumber } = this.props

    Share.share({
      title: 'FaceOff',
      message: `Join my game at https://faceoff.lol/${roomNumber}!`
    })
  }
  handleCancel = () => {
    const { roomNumber } = this.props

    socket.emit('delete_game', { roomNumber })
    Actions.pop()
  }
  render() {
    const { roomNumber } = this.props

    return (
      <View style={styles.overlay}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.cancelButton} onPress={this.handleCancel}>
            <Icon name='close' style={styles.cancelButtonIcon} />
          </TouchableOpacity>
          <Text style={styles.headingText}>Invite</Text>
          <View style={styles.separator}/>
          <Text style={styles.roomNumberText}>{roomNumber}</Text>
          <Text style={styles.text}>
            {'Invite a friend to a game using this room number!'}
          </Text>
          <View style={styles.optionSeparator} />
          <View style={styles.optionsContainer}>
            <TouchableOpacity onPress={this.handleCopy} style={styles.option}>
              <Icon name='paper-clip' style={styles.optionIcon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={this.handleSMS} style={styles.option}>
              <Icon name='bubble' style={styles.optionIcon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={this.handleShare} style={styles.option}>
              <Icon name='share-alt' style={styles.optionIcon} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
}
