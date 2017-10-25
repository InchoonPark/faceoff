import { Platform, StyleSheet } from 'react-native'

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black'
  },
  remoteVideo: {
    flex: 1,
    backgroundColor: 'black'
  },
  localVideo: {
    flex: 1,
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 150,
    height: 250
  },
  scoresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    top: 12.5,
    left: 12.5,
    right: 12.5
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  leftTextContainer: {
    flexDirection: 'column',
    marginLeft: 6
  },
  rightTextContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginRight: 6
  },
  playerText: {
    fontFamily: (Platform.OS === 'ios' ? 'Muli' : 'Muli-Bold'),
    fontWeight: 'bold',
    fontSize: 10,
    color: 'white',
    backgroundColor: 'transparent'
  },
  scoreText: {
    fontFamily: (Platform.OS === 'ios' ? 'Muli' : 'Muli-Bold'),
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: 'transparent'
  },
  emotionLine: {
    position: 'absolute',
    height: 2,
    left: 0,
    right: 0,
    top: 125,
    backgroundColor: '#EF476F'
  }
})
