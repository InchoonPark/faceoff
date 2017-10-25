import { Platform, StyleSheet } from 'react-native'

export default styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  container: {
    width: 280,
    flexDirection: 'column',
    alignItems: 'center',
    padding: 15,
    borderRadius: 15,
    backgroundColor: 'white',
  },
  headingText: {
    fontFamily: (Platform.OS === 'ios' ? 'Muli' : 'Muli-Bold'),
    fontSize: 18,
    fontWeight: 'bold',
  },
  separator: {
    height: 4,
    width: 80,
    marginVertical: 12.5,
    borderRadius: 2,
    backgroundColor: '#D9D9D9'
  },
  input: {
    height: 45,
    borderRadius: 4,
    padding: 10,
    width: 200,
    marginBottom: 15,
    backgroundColor: '#F5F5F5',
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'Muli'
  },
  primaryButton: {
    backgroundColor: '#EF476F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
    width: 180,
    borderRadius: 22.5,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: (Platform.OS === 'ios' ? 'Muli' : 'Muli-Bold'),
    fontWeight: 'bold'
  },
  text: {
    marginBottom: 15,
    fontFamily: 'Muli',
    fontSize: 18,
    textAlign: 'center',
  },
  cancelButton: {
    position: 'absolute',
    top: 15,
    right: 15
  },
  cancelButtonIcon: {
    fontSize: 20,
    color: '#EF476F'
  }
})
