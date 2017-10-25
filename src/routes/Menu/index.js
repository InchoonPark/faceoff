import React from 'react'
import { ActionConst, Scene } from 'react-native-router-flux'
import Menu from './Menu'

module.exports = (
  <Scene
    key='menu'
    component={Menu}
    type={ActionConst.REPLACE}
  />
)
