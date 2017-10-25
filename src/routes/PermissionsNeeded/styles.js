import { Platform, StyleSheet } from 'react-native'

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 50
  },
  emoji: {
    marginBottom: 20
  },
  headingText: {
    fontFamily: 'Muli',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10
  },
  text: {
    fontFamily: 'Muli',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10
  },
  enableButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  enableButtonText: {
    backgroundColor: 'rgba(0,0,0,0)',
    color: '#EF476F',
    fontSize: 16,
    fontFamily: (Platform.OS === 'ios' ? 'Muli' : 'Muli-Bold'),
    fontWeight: 'bold'
  },
})
