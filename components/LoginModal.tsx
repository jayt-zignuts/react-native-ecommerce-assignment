import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

interface LoginModalProps {
  visible: boolean;
  onClose?: () => void; 
}

const LoginModal: React.FC<LoginModalProps> = ({ visible, onClose }) => {
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    router.push('/login'); 
    setLoading(false);
  };

  const handleCancel = () => {
    router.push('/');
    if (onClose) onClose(); 
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={handleCancel}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoid}
      >
        <View style={styles.overlay}>
          <View style={styles.container}>
            <View style={styles.modalHeader}>
              <View style={styles.modalIcon}>
                <Ionicons name="lock-closed" size={28} color="#FFF" />
              </View>
              <Text style={styles.modalTitle}>Authentication Required</Text>
              <Text style={styles.modalSubtitle}>
                Please log in to access this page
              </Text>
            </View>

            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={[styles.actionButton, styles.loginButton]}
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <>
                    <Ionicons name="log-in-outline" size={20} color="#FFF" />
                    <Text style={styles.loginButtonText}>Login</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton]}
                onPress={handleCancel}
              >
                <Ionicons name="close-outline" size={20} color="#666" />
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default LoginModal;

const styles = StyleSheet.create({
  keyboardAvoid: { flex: 1 },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  container: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#FFF",
    padding: 24,
    borderRadius: 24,
  },

  modalHeader: {
    alignItems: "center",
    marginBottom: 32,
  },
  modalIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },

  buttonsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  loginButton: {
    backgroundColor: "#000",
  },
  cancelButton: {
    backgroundColor: "#EEE",
  },
  loginButtonText: {
    color: "#FFF",
    fontWeight: "700",
  },
  cancelButtonText: {
    color: "#555",
    fontWeight: "600",
  },
});
