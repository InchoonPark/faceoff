import React, { Component } from 'react'
import {
  Animated,
  Dimensions,
  Image,
  Text,
  View
} from 'react-native'
import RNFetchBlob from 'react-native-fetch-blob'
import { Actions } from 'react-native-router-flux'
import {
  TwilioVideoLocalView,
  TwilioVideoParticipantView
} from 'react-native-twilio-video-webrtc'
import { captureRef } from 'react-native-view-shot'
import styles from './styles'
import socket from '../../../socketClient'

const IMAGES = {
  anger: require('../../../public/anger.png'),
  disgust: require('../../../public/disgust.png'),
  happiness: require('../../../public/happiness.png'),
  neutral: require('../../../public/neutral.png'),
  sadness: require('../../../public/sadness.png'),
  surprise: require('../../../public/surprise.png'),
}

const getImage = (emotion) => {
  return IMAGES[emotion]
}

const { height, width } = Dimensions.get('window')
const space = (width - (54 * 4) - 40) / 4

const getPosStyle = position => {
  switch(position) {
    case 0:
      return { left: 0.5 * space + 20 }
    case 1:
      return { left: 1.5 * space + 74 }
    case 2:
      return { right: 1.5 * space + 74 }
    case 3:
      return { right: 0.5 * space + 20 }
    default:
      return {}
  }
}

export default class Game extends Component {
  constructor() {
    super()

    let emotionState = {}
    for(let i = 0; i < 18; i++) {
      emotionState = Object.assign({}, emotionState, {
        ['eH' + i]: new Animated.Value(height),
        ['eO' + i]: new Animated.Value(1)
      })
    }
    this.state = Object.assign({}, emotionState, {
      sequence: [],
      score: 0,
      opponentScore: 0,
      color: 'white',
      opponentColor: 'white',
      scoreEmotion: 'happiness',
      oppScoreEmotion: 'happiness',
    })
  }
  componentDidMount() {
    const { game, handleEndGame } = this.props

    socket.on('send_emotion', data => {
      const { i } = data
      this.setState({ sequence: [...this.state.sequence, data] })

      Animated.sequence([
        Animated.timing(this.state['eH' + i], { toValue: 100, duration: 4000 }),
        Animated.timing(this.state['eO' + i], { toValue: 0, duration: 100 })
      ]).start()

      setTimeout(() => this.takePic(data), 3900)
    })

    socket.on('end_game', () => {
      const { opponentName } = this.props
      const { score, opponentScore } = this.state

      handleEndGame({ opponentName, score, opponentScore })
    })

    /*

    for(let i = 0; i < sequence.length; i++) {
      Animated.sequence([
        Animated.delay(sequence[i].time),
        Animated.timing(this.state['eH' + i], { toValue: 100, duration: 4000 }),
        Animated.timing(this.state['eO' + i], { toValue: 0, duration: 100 })
      ]).start()

      setTimeout(() => this.takePic(sequence[i]), sequence[i].time + 3900)
    }*/

    socket.on('send_opponent_score', data => {
      const { score } = data

      if(score > 70) {
        this.setState({
          opponentScore: this.state.opponentScore + score,
          opponentColor: '#2A9D8F',
          oppScoreEmotion: 'happiness'
        })
      } else if(score >= 30) {
        this.setState({
          opponentScore: this.state.opponentScore + score,
          opponentColor: '#FFD166',
          oppScoreEmotion: 'neutral'
        })
      } else {
        this.setState({
          opponentScore: this.state.opponentScore + score,
          opponentColor: '#EF476F',
          oppScoreEmotion: 'anger'
        })
      }
    })

    /*const timeout = setTimeout(() => {
      const { opponentName } = this.props
      const { score, opponentScore } = this.state

      handleEndGame({ opponentName, score, opponentScore })
    }, 62000)

    this.setState({ timeout })*/
  }
  componentWillUnmount() {
    socket.removeListener('send_emotion')
    socket.removeListener('send_opponent_score')
    socket.removeListener('end_game')
  }
  takePic = emoji => {
    captureRef(this.camera)
    .then(
      uri => {
        RNFetchBlob.fetch('POST', 'https://westus.api.cognitive.microsoft.com/emotion/v1.0/recognize', {
          'Content-Type' : 'application/octet-stream',
          'Ocp-Apim-Subscription-Key': '9a3e79b59a0848ea982145fb02407632'
        }, RNFetchBlob.wrap(uri))
        .then(response => {
          return response.json()
        })
        .then(result => {
          if(result.length === 0) {
            this.setState({ color: '#EF476F', scoreEmotion: 'anger' })
            return socket.emit('send_score', { score: 0 })
          }

          const { scores } = result[0]
          const { emotion } = emoji
          let score = Math.round(scores[emotion] * 10) * 10

          if(emotion ===  'anger') {
            score = Math.round((scores['anger'] + scores['contempt']) * 10) * 10
          } else if(emotion === 'disgust') {
            score = Math.round((scores['disgust'] + scores['fear']) * 10) * 10
          }

          if(score >= 70) {
            this.setState({
              score: this.state.score + score,
              color: '#2A9D8F',
              scoreEmotion: 'happiness'
            })
          } else if(score >= 30) {
            this.setState({
              score: this.state.score + score,
              color: '#FFD166',
              scoreEmotion: 'neutral'
            })
          } else {
            this.setState({
              score: this.state.score + score,
              color: '#EF476F',
              scoreEmotion: 'anger'
            })
          }
          socket.emit('send_score', { score })
        })
      },
      error => {
        socket.emit('game_disconnect')
        Actions.gameError({ error: 'An unexpected error occurred.'})
      }
    )
  }
  render() {
    const { game, screenName, opponentName, identity, trackId } = this.props
    const {
      sequence,
      score,
      opponentScore,
      color,
      opponentColor,
      scoreEmotion,
      oppScoreEmotion
    } = this.state

    return (
      <View style={styles.container}>
        <TwilioVideoParticipantView
          style={styles.remoteVideo}
          key={trackId}
          trackIdentifier={{
            participantIdentity: identity,
            videoTrackId: trackId
          }}/>
        <TwilioVideoLocalView
          style={styles.localVideo}
          ref={component => this.camera = component}
          enabled={true}/>
        <View style={styles.scoresContainer}>
          <View style={styles.scoreContainer}>
            <Image source={getImage(scoreEmotion)} />
            <View style={styles.leftTextContainer}>
              <Text style={styles.playerText}>{screenName}</Text>
              <Text style={[styles.scoreText, {
                  color
              }]}>{score}</Text>
            </View>
          </View>
          <View style={styles.scoreContainer}>
            <View style={styles.rightTextContainer}>
              <Text style={styles.playerText}>{opponentName}</Text>
              <Text style={[styles.scoreText, {
                  color: opponentColor
              }]}>{opponentScore}</Text>
            </View>
            <Image source={getImage(oppScoreEmotion)} />
          </View>
        </View>
        <View style={styles.emotionLine} />
        {sequence.map(emotionData => {
          const { emotion, position, i } = emotionData

          const posStyle = getPosStyle(position)
          const emotionStyle = Object.assign({}, posStyle, {
            position: 'absolute',
            bottom: 0,
            width: 54,
            backgroundColor: 'transparent',
            top: this.state['eH' + i],
            opacity: this.state['eO' + i]
          })

          return (
            <Animated.Image
              style={emotionStyle}
              source={getImage(emotion)}
              key={i}/>
          )
        })}
      </View>
    )
  }
}
