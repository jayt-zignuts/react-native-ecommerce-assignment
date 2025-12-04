import LoginModal from '@/components/LoginModal';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const [modalVisible, setModalVisible] = useState(true);
  const router = useRouter();

  const handleClose = () => {
    setModalVisible(false);
    router.push('/');
  };

  const handleLoginSuccess = () => {
    console.log('Logged in successfully');
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Background Decorative Elements */}
      <View style={styles.backgroundCircles}>
        <View style={[styles.circle, styles.circle1]} />
        <View style={[styles.circle, styles.circle2]} />
        <View style={[styles.circle, styles.circle3]} />
      </View>

      {/* Header with Back Button */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={handleClose}
      >
        <Ionicons name="arrow-back" size={24} color="#000000" />
      </TouchableOpacity>

      {/* Brand Logo */}
      <View style={styles.brandContainer}>
        <View style={styles.logoContainer}>
          <Ionicons name="lock-closed" size={40} color="#000000" />
        </View>
        <Text style={styles.brandText}>SHOP</Text>
        <Text style={styles.brandAccent}>BLACK.</Text>
      </View>

      {/* Welcome Message */}
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeTitle}>Welcome Back</Text>
        <Text style={styles.welcomeSubtitle}>
          Sign in to access your account and continue shopping
        </Text>
      </View>

      {/* Login Illustration */}
      <View style={styles.illustrationContainer}>
        <Ionicons name="person-circle-outline" size={120} color="#F0F0F0" />
      </View>

      {/* Test Credentials */}
      <View style={styles.credentialsContainer}>
        <Text style={styles.credentialsTitle}>Test Credentials</Text>
        <View style={styles.credentialItem}>
          <Ionicons name="mail-outline" size={16} color="#666" />
          <Text style={styles.credentialText}>test@zignuts.com</Text>
        </View>
        <View style={styles.credentialItem}>
          <Ionicons name="key-outline" size={16} color="#666" />
          <Text style={styles.credentialText}>123456</Text>
        </View>
        <View style={styles.credentialItem}>
          <Ionicons name="mail-outline" size={16} color="#666" />
          <Text style={styles.credentialText}>practical@zignuts.com</Text>
        </View>
        <View style={styles.credentialItem}>
          <Ionicons name="key-outline" size={16} color="#666" />
          <Text style={styles.credentialText}>123456</Text>
        </View>
      </View>

      {/* Login Modal */}
      <LoginModal
        visible={modalVisible}
        onClose={handleClose}
        onSuccess={handleLoginSuccess}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
  },
  backgroundCircles: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
  },
  circle: {
    position: 'absolute',
    borderRadius: 100,
    backgroundColor: '#FAFAFA',
  },
  circle1: {
    width: 200,
    height: 200,
    top: '5%',
    right: '-10%',
  },
  circle2: {
    width: 150,
    height: 150,
    bottom: '15%',
    left: '-5%',
  },
  circle3: {
    width: 100,
    height: 100,
    top: '40%',
    right: '20%',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 24,
  },
  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#000000',
  },
  brandText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#000000',
    letterSpacing: 1.5,
  },
  brandAccent: {
    fontSize: 32,
    fontWeight: '900',
    backgroundColor: '#000000',
    color: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginLeft: 6,
    borderRadius: 6,
    overflow: 'hidden',
    letterSpacing: 1,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#000000',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  credentialsContainer: {
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    marginBottom: 40,
  },
  credentialsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 16,
    textAlign: 'center',
  },
  credentialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 12,
  },
  credentialText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
    fontWeight: '500',
  },
});