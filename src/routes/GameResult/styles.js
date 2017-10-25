import { Platform, StyleSheet } from 'react-native'

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#26547C',
    padding: 50
  },
  logoImage: {
    marginBottom: 40
  },
  headingText: {
    fontFamily: (Platform.OS === 'ios' ? 'Muli' : 'Muli-Bold'),
    color: 'white',
    fontWeight: 'bold',
    fontSize: 40,
    textAlign: 'center',
    marginBottom: 40
  },
  secondaryBtn: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: 240,
    height: 40,
    marginBottom: 10,
    backgroundColor: '#FFD166'
  },
  primaryBtn: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: 240,
    height: 40,
    backgroundColor: '#EF476F'
  },
  btnText: {
    color: 'white',
    fontFamily: (Platform.OS === 'ios' ? 'Muli' : 'Muli-Bold'),
    fontWeight: 'bold',
    fontSize: 16
  },
})
