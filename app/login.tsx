import { useAuth } from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('test@zignuts.com');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [secureText, setSecureText] = useState(true);

  const handleClose = () => router.push('/');

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      router.replace('/');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <SafeAreaView style={styles.safeArea}>
            <ScrollView
              contentContainerStyle={styles.scrollContainer}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleClose}
                disabled={loading}
              >
                <Ionicons name="arrow-back" size={24} color="#000" />
              </TouchableOpacity>

              {/* Brand */}
              <View style={styles.brandContainer}>
                <View style={styles.logoContainer}>
                  <Ionicons name="lock-closed" size={40} color="#000" />
                </View>
                <View style={styles.brandTextContainer}>
                  <Text style={styles.brandText}>STORE</Text>
                  <Text style={styles.brandAccent}>X</Text>
                </View>
              </View>

              <View style={styles.welcomeContainer}>
                <Text style={styles.welcomeTitle}>Welcome Back</Text>
                <Text style={styles.welcomeSubtitle}>
                  Log in to access your account and continue shopping
                </Text>
              </View>

              {/* Form */}
              <View style={styles.formContainer}>
                {/* Email */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Email Address</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="mail-outline" size={20} color="#666" />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your email"
                      placeholderTextColor="#999"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      editable={!loading}
                    />
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Password</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="key-outline" size={20} color="#666" />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your password"
                      placeholderTextColor="#999"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={secureText}
                      autoCapitalize="none"
                      editable={!loading}
                    />
                    <TouchableOpacity onPress={() => setSecureText(!secureText)}>
                      <Ionicons
                        name={secureText ? 'eye-outline' : 'eye-off-outline'}
                        size={20}
                        color="#666"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Error */}
                {error && (
                  <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle" size={18} color="#FF3B30" />
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                )}

                {/* Login Button */}
                <TouchableOpacity
                  style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                  onPress={handleLogin}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="#FFF" />
                  ) : (
                    <>
                      <Ionicons name="log-in-outline" size={22} color="#FFF" />
                      <Text style={styles.loginButtonText}>Login</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  safeArea: { flex: 1 },
  scrollContainer: { 
    paddingHorizontal: 24, 
    paddingVertical: 20,
    flexGrow: 1,
  },

  backgroundCircles: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },

  brandContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
    alignItems: 'center',
  },
  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
    marginRight: 12,
  },
  brandTextContainer: { flexDirection: 'row', alignItems: 'center' },
  brandText: { fontSize: 32, fontWeight: '900', color: '#000' },
  brandAccent: {
    fontSize: 32,
    fontWeight: '900',
    backgroundColor: '#000',
    color: '#FFF',
    paddingHorizontal: 10,
    borderRadius: 6,
  },

  welcomeContainer: { alignItems: 'center', marginBottom: 40 },
  welcomeTitle: { fontSize: 28, fontWeight: '800', color: '#000' },
  welcomeSubtitle: { fontSize: 16, color: '#666', textAlign: 'center', maxWidth: 300 },

  formContainer: { marginBottom: 30 },
  inputContainer: { marginBottom: 18 },
  inputLabel: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E9E9E9',
    borderRadius: 12,
    gap: 12,
  },
  input: { flex: 1, paddingVertical: 16, fontSize: 16 },

  errorContainer: {
    backgroundColor: '#FFF5F5',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFD5D5',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  errorText: { color: '#FF3B30', flex: 1 },

  loginButton: {
    backgroundColor: '#000',
    borderRadius: 12,
    paddingVertical: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loginButtonDisabled: { opacity: 0.7 },
  loginButtonText: { color: '#FFF', fontSize: 18, fontWeight: '700' },

  quickLoginContainer: {
    backgroundColor: '#FAFAFA',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EEE',
    marginBottom: 20,
  },
  quickLoginTitle: { textAlign: 'center', fontSize: 16, fontWeight: '700', marginBottom: 16 },

  demoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
  },
  demoButtonTextContainer: { flex: 1 },
  demoButtonEmail: { fontSize: 14, fontWeight: '600' },
  demoButtonPassword: { fontSize: 12, color: '#666' },

  footerContainer: { padding: 16 },
  footerText: { textAlign: 'center', color: '#999', fontSize: 12 },
});