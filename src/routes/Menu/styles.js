import { Platform, StyleSheet } from 'react-native'

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#26547C'
  },
  logoImage: {
    marginBottom: 30
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
    fontSize: 16,
  }
})
