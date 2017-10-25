import { Actions, ActionConst } from 'react-native-router-flux'
import io from 'socket.io-client'

const socket = io('https://faceoffgame.herokuapp.com')

socket.on('disconnect', () => {
  Actions.home({ type: ActionConst.REPLACE })
})

export default socket
