const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const AccessToken = require('twilio').jwt.AccessToken
const VideoGrant = AccessToken.VideoGrant

const twilioAccountSid = 'YOUR TWILIO ACCOUNT'
const twilioApiKey = 'YOUR API KEY'
const twilioApiSecret = 'YOUR SECRET KEY'

const app = express()
const server = http.Server(app)
const io = socketio(server)
server.listen(process.env.PORT || 5000)

let games = {}
const emotions = ['anger', 'disgust', 'happiness', 'neutral', 'sadness', 'surprise']
const positions = [0, 1, 2, 3]

const genSeq = () => {
  let sequence = []

  for(var i = 0; i < 11; i++) {
    const emotion = emotions[Math.floor(Math.random() * emotions.length)]
    const position = positions[Math.floor(Math.random() * positions.length)]
    const noise = ((Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random()) - 3) / 3
    const time = ((noise + 5 * i) * 1000) + 3000
    sequence = [...sequence, { emotion, position, time, i }]
  }

  return sequence
}

const genRoomNumber = () => {
  let roomNumber = Math.floor((Math.random() * 8999999) + 1000000)

  while(games[roomNumber]) {
    roomNumber = Math.floor((Math.random() * 8999999) + 1000000)
  }

  return roomNumber.toString()
}

const gameInit = socket => {
  const { screenName } = socket
  const roomNumber = genRoomNumber()

  games[roomNumber] = {}
  games[roomNumber].roomNumber = roomNumber
  games[roomNumber].started = false
  games[roomNumber].sequence = genSeq()
  games[roomNumber].twilioClients = 0
  games[roomNumber].players = [{
    screenName,
    socketId: socket.id,
  }]

  socket.roomNumber = roomNumber
  socket.join(roomNumber)
  return roomNumber
}

const genToken = (identity, roomNumber) => {
  const videoGrant = new VideoGrant({ room: roomNumber })
  const token = new AccessToken(twilioAccountSid, twilioApiKey, twilioApiSecret)
  token.addGrant(videoGrant)
  token.identity = identity
  return token.toJwt()
}

io.on('connection', socket => {
  socket.on('disconnecting', () => {
    const { roomNumber } = socket

    if(roomNumber) {
      delete games[roomNumber]

      socket.leave(roomNumber)

      io.to(roomNumber).emit('game_error', {
        error: 'Your friend left the game!'
      })
    }
  })
  socket.on('leave_game', data => {
    const { roomNumber } = socket

    delete games[roomNumber]
    socket.leave(roomNumber)
    io.to(roomNumber).emit('opponent_left')
    if(data) {
      const { newRoomNumber } = data
      io.to(newRoomNumber).emit('opponent_left')
    }
  })
  socket.on('set_user', data => {
    const screenName = data.screenName.trim()

    if(!screenName) {
      return socket.emit('set_user_error', {
        error: 'You must set a screen name.'
      })
    }

    if(screenName.length > 10) {
      return socket.emit('set_user_error', {
        error: 'Your screen name must be 10 characters or shorter.'
      })
    }

    socket.screenName = screenName
    socket.emit('set_user_success', {
      screenName
    })
  })
  socket.on('set_user_join_game', data => {
    const screenName = data.screenName.trim()
    const { roomNumber } = data

    if(!screenName) {
      return socket.emit('set_user_error', {
        error: 'You must set a screen name.'
      })
    }

    if(screenName.length > 10) {
      return socket.emit('set_user_error', {
        error: 'Your screen name must be 10 characters or shorter.'
      })
    }

    socket.screenName = screenName

    if(!games[roomNumber]) {
      return socket.emit('set_user_join_game_error', {
        error: 'A game with that room number does not exist.'
      })
    }

    if(games[roomNumber].started) {
      return socket.emit('set_user_join_game_error', {
        error: 'That game has already started.'
      })
    }

    if(games[roomNumber].players.length > 2) {
      return socket.emit('set_user_join_game_error', {
        error: 'There are too many players in this game.'
      })
    }

    socket.roomNumber = roomNumber
    games[roomNumber].started = true
    games[roomNumber].players = [...games[roomNumber].players, {
      screenName,
      socketId: socket.id
    }]

    const host = games[roomNumber].players[0]

    const token = genToken(socket.id, roomNumber)

    socket.join(roomNumber)
    socket.emit('join_game_success', {
      screenName,
      opponentName: host.screenName,
      game: games[roomNumber],
      token
    })

    const hostToken = genToken(host.socketId, roomNumber)
    io.to(host.socketId).emit('join_game_success', {
      screenName: host.screenName,
      opponentName: screenName,
      game: games[roomNumber],
      token: hostToken
    })

    setTimeout(() => {
      delete games[roomNumber]
    }, 62000)
  })
  socket.on('create_game', () => {
    const { screenName } = socket

    if(!screenName) {
      return socket.emit('create_game_error', {
        error: 'An unexpected error occurred.'
      })
    }

    const roomNumber = gameInit(socket)
    socket.emit('create_game_success', {
      roomNumber
    })
  })

  socket.on('delete_game', data => {
    const { oldRoomNumber } = socket
    const { roomNumber } = data

    delete games[roomNumber]
    socket.leave(roomNumber)
    io.to(oldRoomNumber).emit('opponent_left')
  })

  socket.on('twilio_connected', () => {
    const { roomNumber } = socket

    games[roomNumber].twilioClients++

    if(games[roomNumber].twilioClients == 2) {
      io.to(roomNumber).emit('start_game')

      const { sequence } = games[roomNumber]

      for(const emotion of sequence) {
        setTimeout(() => io.to(roomNumber).emit('send_emotion', emotion), emotion.time)
      }

      setTimeout(() => io.to(roomNumber).emit('end_game'), 62000)
    }
  })

  socket.on('join_game', data => {
    const { screenName } = socket
    const { roomNumber } = data

    if(!games[roomNumber]) {
      return socket.emit('join_game_error', {
        error: 'A game with that room number does not exist.'
      })
    }

    if(games[roomNumber].started) {
      return socket.emit('join_game_error', {
        error: 'That game has already started.'
      })
    }

    if(games[roomNumber].players.length > 2) {
      return socket.emit('join_game_error', {
        error: 'There are too many players in this game.'
      })
    }

    socket.roomNumber = roomNumber
    games[roomNumber].started = true
    games[roomNumber].players = [...games[roomNumber].players, {
      screenName,
      socketId: socket.id
    }]

    const host = games[roomNumber].players[0]

    const token = genToken(socket.id, roomNumber)

    socket.join(roomNumber)
    socket.emit('join_game_success', {
      screenName,
      opponentName: host.screenName,
      game: games[roomNumber],
      token
    })

    const hostToken = genToken(host.socketId, roomNumber)
    io.to(host.socketId).emit('join_game_success', {
      screenName: host.screenName,
      opponentName: screenName,
      game: games[roomNumber],
      token: hostToken
    })

    setTimeout(() => {
      delete games[roomNumber]
    }, 62000)
  })
  socket.on('send_score', data => {
    const { roomNumber } = socket

    socket.broadcast.to(roomNumber).emit('send_opponent_score', data)
  })
  socket.on('create_rematch', () => {
    const { screenName, roomNumber } = socket

    if(!screenName) {
      return socket.emit('create_rematch_error', {
        error: 'An unexpected error occurred.'
      })
    }

    const newRoomNumber = gameInit(socket)
    socket.emit('create_rematch_success', { roomNumber: newRoomNumber })
    socket.leave(roomNumber)
    socket.oldRoomNumber = roomNumber
    socket.broadcast.to(roomNumber).emit('rematch', { roomNumber: newRoomNumber })
  })
})
