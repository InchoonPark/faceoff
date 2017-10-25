import React, { Component } from 'react'
import { KeyboardAvoidingView, Platform } from 'react-native'
import { Lightbox, Modal, Router, Scene } from 'react-native-router-flux'

const Root = (props) => (
  <KeyboardAvoidingView
    behavior= {(Platform.OS === 'ios')? "padding" : null}
    style={{flex: 1}}>
    <Router>
      <Modal hideNavBar={true}>
        <Lightbox hideNavBar={true}>
          <Scene key="root" hideNavBar={true} hideTabBar={true}>
            {require('./routes/Home')}
            {require('./routes/Menu')}
            {require('./routes/PermissionsNeeded')}
            {require('./routes/Game')}
            {require('./routes/GameError')}
            {require('./routes/GameResult')}
          </Scene>
          {require('./routes/Loading')}
          {require('./routes/CreateGameModal')}
          {require('./routes/JoinGameModal')}
        </Lightbox>
      </Modal>
    </Router>
  </KeyboardAvoidingView>
)

export default Root
