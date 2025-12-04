import LoginModal from '@/components/LoginModal';
import React, { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const [modalVisible, setModalVisible] = useState(true);
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Login to Your Account</Text>
      <LoginModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSuccess={() => console.log('Logged in successfully')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
});
