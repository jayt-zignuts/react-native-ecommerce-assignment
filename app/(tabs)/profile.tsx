import ProtectedRoute from '@/components/ProtectedRoute'
import React, { Component } from 'react'
import { Text, View } from 'react-native'

export class Profile extends Component {
  render() {
    return (
      <ProtectedRoute>
      <View>
        <Text>Profile</Text>
      </View>
      </ProtectedRoute>
    )
  }
}

export default Profile