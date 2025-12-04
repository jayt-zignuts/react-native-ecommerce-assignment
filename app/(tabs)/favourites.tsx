import ProtectedRoute from '@/components/ProtectedRoute'
import React, { Component } from 'react'
import { Text, View } from 'react-native'

export class Favourites extends Component {
  render() {
    return (
      <ProtectedRoute>
      <View>
        <Text>Favourites</Text>
      </View>
      </ProtectedRoute>
    )
  }
}

export default Favourites