import React, { Component } from 'react'
import {
  Alert,
  StatusBar,
  View
} from 'react-native'
import KeepAwake from 'react-native-keep-awake'
import { Actions } from 'react-native-router-flux'
import {
  TwilioVideoLocalView,
  TwilioVideoParticipantView,
  TwilioVideo
} from 'react-native-twilio-video-webrtc'
import Loading from './Loading'
import Play from './Play'
import styles from './styles'
import socket from '../../socketClient'

export default class Game extends Component {
  state = {
    isFetching: true,
    identity: null,
    trackId: null
  }
  componentDidMount() {
    const { game, token } = this.props
    const { roomNumber } = game

    this.refs.twilioVideo.connect({ roomName: roomNumber, accessToken: token })
    KeepAwake.activate()

    socket.on('start_game', () => {
      this.setState({ isFetching: false })
    })

    socket.on('game_error', data => {
      const { error } = data

      Actions.gameError({ error })
    })
  }
  handleRoomDidFailToConnect = error => {
    Actions.gameError({ error: 'You failed to connect.' })
  }
  handleParticipantAddedVideoTrack = ({participant, track}) => {
    const { identity } = participant
    const { trackId } = track

    this.setState({ identity, trackId })
    socket.emit('twilio_connected')
  }
  handleParticipantRemovedVideoTrack = () => {
    Actions.gameError({ error: 'Your friend unexpectedly disconnected.'})
  }
  handleEndGame = result => {
    this.refs.twilioVideo.disconnect()
    KeepAwake.deactivate()
    socket.removeListener('start_game')
    socket.removeListener('game_error')
    Actions.gameResult(result)
  }
  render() {
    const { isFetching, trackId, identity } = this.state
    const { game, screenName, opponentName } = this.props

    return (
      <View style={styles.container}>
        <TwilioVideo
          ref='twilioVideo'
          onRoomDidDisconnect={this.handleRoomDidDisconnect}
          onRoomDidFailToConnect={this.handleRoomDidFailToConnect}
          onParticipantAddedVideoTrack={this.handleParticipantAddedVideoTrack}
          onParticipantRemovedVideoTrack={this.handleParticipantRemovedVideoTrack}/>
        <StatusBar hidden={true} />
        {isFetching ?
          <Loading />
          :
          <Play
            game={game}
            screenName={screenName}
            opponentName={opponentName}
            trackId={trackId}
            identity={identity}
            handleEndGame={this.handleEndGame} />
        }
      </View>
    )
  }
}
