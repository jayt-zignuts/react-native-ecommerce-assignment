import { useAuth } from "@/hooks/useAuth";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: (newName: string, newAddress?: string) => void;
  currentName: string;
  currentAddress?: string;
  initialTab?: "name" | "address";
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  visible,
  onClose,
  onSuccess,
  currentName,
  currentAddress = "",
  initialTab = "name",
}) => {
  const [name, setName] = useState(currentName);
  const [address, setAddress] = useState(currentAddress || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"name" | "address">(initialTab);
  const { user } = useAuth();

  // Update state when modal opens or props change
  useEffect(() => {
    if (visible) {
      setName(currentName);
      setAddress(currentAddress || "");
      setActiveTab(initialTab);
      setError(null);
    }
  }, [visible, currentName, currentAddress, initialTab]);

  const handleSave = async () => {
    if (activeTab === "name" && !name.trim()) {
      setError("Name cannot be empty");
      return;
    }

    if (activeTab === "address" && !address.trim()) {
      setError("Address cannot be empty");
      return;
    }

    if (
      (activeTab === "name" && name.trim() === currentName) ||
      (activeTab === "address" && address.trim() === (currentAddress || ""))
    ) {
      onClose();
      return;
    }

    setLoading(true);
    setError(null);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      onSuccess?.(name.trim(), address.trim());
      onClose();

      // Show toast message
      if (Platform.OS === "android") {
        ToastAndroid.show("Profile updated successfully!", ToastAndroid.SHORT);
      } else {
        Alert.alert("Success", "Profile updated successfully!");
      }
    }, 1000);
  };

  const handleClose = () => {
    setError(null);
    setName(currentName);
    setAddress(currentAddress);
    onClose();
  };

  const renderNameTab = () => (
    <>
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <Ionicons
            name="person-outline"
            size={20}
            color="#666"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            autoCorrect={false}
            editable={!loading}
            maxLength={50}
          />
        </View>
      </View>

      {/* Character Count */}
      <View style={styles.charCountContainer}>
        <Text style={styles.charCountText}>{name.length}/50 characters</Text>
      </View>
    </>
  );

  const renderAddressTab = () => (
    <>
      <View style={styles.inputContainer}>
        <View style={[styles.inputWrapper, styles.addressInputWrapper]}>
          <Ionicons
            name="home-outline"
            size={20}
            color="#666"
            style={styles.addressInputIcon}
          />
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="Enter your shipping address"
            placeholderTextColor="#999"
            value={address}
            onChangeText={setAddress}
            autoCapitalize="words"
            autoCorrect={false}
            editable={!loading}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
      </View>

      {/* Address Tips */}
      <View style={styles.tipsContainer}>
        <Text style={styles.tipsTitle}>Address Format:</Text>
        <View style={styles.tipItem}>
          <Ionicons name="checkmark-circle" size={14} color="#4CD964" />
          <Text style={styles.tipText}>Street address, City, State ZIP</Text>
        </View>
        <View style={styles.tipItem}>
          <Ionicons name="checkmark-circle" size={14} color="#4CD964" />
          <Text style={styles.tipText}>
            Include apartment/suite number if applicable
          </Text>
        </View>
      </View>
    </>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.container}>
                {/* Modal Header */}
                <View style={styles.modalHeader}>
                  <View style={styles.modalIcon}>
                    <Ionicons
                      name="person-circle-outline"
                      size={28}
                      color="#FFFFFF"
                    />
                  </View>
                  <Text style={styles.modalTitle}>Edit Profile</Text>
                  <Text style={styles.modalSubtitle}>
                    Update your personal information
                  </Text>
                </View>

                {/* User Info */}
                <View style={styles.userInfoContainer}>
                  <View style={styles.avatarContainer}>
                    <Ionicons name="person" size={40} color="#000000" />
                  </View>
                  <View style={styles.userTextInfo}>
                    <Text style={styles.userEmail}>{user?.email}</Text>
                    <Text style={styles.userCurrentName}>
                      {activeTab === "name"
                        ? `Current: ${currentName}`
                        : `Current Address`}
                    </Text>
                  </View>
                </View>

                {/* Tab Navigation */}
                <View style={styles.tabContainer}>
                  <TouchableOpacity
                    style={[
                      styles.tabButton,
                      activeTab === "name" && styles.activeTab,
                    ]}
                    onPress={() => setActiveTab("name")}
                    disabled={loading}
                  >
                    <Ionicons
                      name="person-outline"
                      size={18}
                      color={activeTab === "name" ? "#000000" : "#666"}
                    />
                    <Text
                      style={[
                        styles.tabText,
                        activeTab === "name" && styles.activeTabText,
                      ]}
                    >
                      Edit Name
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.tabButton,
                      activeTab === "address" && styles.activeTab,
                    ]}
                    onPress={() => setActiveTab("address")}
                    disabled={loading}
                  >
                    <Ionicons
                      name="location-outline"
                      size={18}
                      color={activeTab === "address" ? "#000000" : "#666"}
                    />
                    <Text
                      style={[
                        styles.tabText,
                        activeTab === "address" && styles.activeTabText,
                      ]}
                    >
                      Edit Address
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Content Area - FIXED: Removed flex: 1 and added proper constraints */}
                <ScrollView
                  style={styles.contentArea}
                  contentContainerStyle={styles.contentAreaContent}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                >
                  {activeTab === "name" ? renderNameTab() : renderAddressTab()}

                  {/* Error Message */}
                  {error && (
                    <View style={styles.errorContainer}>
                      <Ionicons name="alert-circle" size={18} color="#FF3B30" />
                      <Text style={styles.errorText}>{error}</Text>
                    </View>
                  )}
                </ScrollView>

                {/* Action Buttons */}
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[
                      styles.saveButton,
                      loading && styles.saveButtonDisabled,
                    ]}
                    onPress={handleSave}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <>
                        <Ionicons
                          name="checkmark-circle"
                          size={22}
                          color="#FFFFFF"
                        />
                        <Text style={styles.saveButtonText}>
                          {activeTab === "name" ? "Save Name" : "Save Address"}
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={handleClose}
                    disabled={loading}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>

                {/* Note */}
                <View style={styles.noteContainer}>
                  <Ionicons
                    name="information-circle-outline"
                    size={16}
                    color="#666"
                  />
                  <Text style={styles.noteText}>
                    This will only update the information locally for this
                    session
                  </Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    width: "100%",
    maxWidth: 400,
    maxHeight: "90%", // Changed from 80% to 90%
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  modalIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#000000",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    borderWidth: 2,
    borderColor: "#000000",
  },
  userTextInfo: {
    flex: 1,
  },
  userEmail: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 4,
  },
  userCurrentName: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#F8F8F8",
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  activeTab: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  tabText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
  },
  activeTabText: {
    color: "#000000",
  },
  contentArea: {
    maxHeight: 200, // FIXED: Added maxHeight constraint
  },
  contentAreaContent: {
    paddingBottom: 10, // FIXED: Added padding for better spacing
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    paddingHorizontal: 16,
    minHeight: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: "#000000",
    backgroundColor: "transparent",
  },
  multilineInput: {
    minHeight: 100,
    paddingTop: 16,
    paddingBottom: 16,
  },
  addressInputWrapper: {
    alignItems: "flex-start",
    paddingTop: 16,
  },
  addressInputIcon: {
    marginTop: 4,
    marginRight: 12,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF5F5",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FFE5E5",
    marginBottom: 12,
    gap: 10,
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
  charCountContainer: {
    alignItems: "flex-end",
    marginBottom: 16,
  },
  charCountText: {
    fontSize: 12,
    color: "#999",
    fontWeight: "500",
  },
  tipsContainer: {
    backgroundColor: "#F8F8F8",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 8,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    gap: 8,
  },
  tipText: {
    fontSize: 13,
    color: "#666",
    flex: 1,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000000",
    paddingVertical: 18,
    borderRadius: 12,
    gap: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  cancelButton: {
    paddingVertical: 16,
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#F0F0F0",
    backgroundColor: "transparent",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
  noteContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    gap: 8,
  },
  noteText: {
    fontSize: 13,
    color: "#666",
    flex: 1,
    fontStyle: "italic",
  },
});

export default EditProfileModal;
