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
  screenNameInputContainer: {
    width: 240,
    height: 40,
    marginBottom: 10,
    backgroundColor: 'white'
  },
  screenNameInput: {
    flex: 1,
    fontFamily: (Platform.OS === 'ios' ? 'Muli' : 'Muli-Bold'),
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  primaryBtn: {
    width: 240,
    height: 40,
    backgroundColor: '#EF476F',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  btnText: {
    color: 'white',
    fontFamily: (Platform.OS === 'ios' ? 'Muli' : 'Muli-Bold'),
    fontWeight: 'bold',
    fontSize: 16,
  }
})
