import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import React, { useLayoutEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const NotFound = () => {

   const navigation = useNavigation();
    
      useLayoutEffect(() => {
        navigation.setOptions({ headerShown: false });
      }, [navigation]);

  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.illustrationContainer}>
          <View style={styles.errorBadge}>
            <Ionicons name="alert-circle" size={60} color="#FF3B30" />
          </View>
          <View style={styles.errorNumber}>
            <Text style={styles.number4}>4</Text>
            <View style={styles.zeroContainer}>
              <Ionicons name="search" size={40} color="#000000" />
            </View>
            <Text style={styles.number4}>4</Text>
          </View>
          <Text style={styles.errorTitle}>Page Not Found</Text>
          <Text style={styles.errorSubtitle}>
            {`The page you are looking for doesn't exist or has been moved`}
          </Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push("/")}
          >
            <Ionicons name="home-outline" size={22} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Go to Home</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={22} color="#000000" />
            <Text style={styles.secondaryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>

  
        {/* Decorative Elements */}
        <View style={styles.decorativeCircles}>
          <View style={[styles.circle, styles.circle1]} />
          <View style={[styles.circle, styles.circle2]} />
          <View style={[styles.circle, styles.circle3]} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    position: "relative",
  },
  illustrationContainer: {
    alignItems: "center",
    marginBottom: 48,
  },
  errorBadge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#FFF5F5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 2,
    borderColor: "#FFE5E5",
  },
  errorNumber: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  number4: {
    fontSize: 72,
    fontWeight: "900",
    color: "#000000",
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  zeroContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F8F8F8",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 16,
    borderWidth: 3,
    borderColor: "#000000",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  errorTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#000000",
    marginBottom: 12,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  errorSubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    maxWidth: 300,
  },
  actionButtons: {
    width: "100%",
    marginBottom: 40,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000000",
    paddingVertical: 18,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    gap: 12,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    paddingVertical: 18,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#000000",
    gap: 12,
  },
  secondaryButtonText: {
    color: "#000000",
    fontSize: 18,
    fontWeight: "600",
  },
  helpContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 16,
  },
  helpLinks: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 24,
  },
  helpLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#FAFAFA",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  helpLinkText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  decorativeCircles: {
    position: "absolute",
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: -1,
  },
  circle: {
    position: "absolute",
    borderRadius: 100,
    backgroundColor: "#F8F8F8",
  },
  circle1: {
    width: 200,
    height: 200,
    top: "10%",
    left: "-20%",
  },
  circle2: {
    width: 150,
    height: 150,
    bottom: "20%",
    right: "-10%",
  },
  circle3: {
    width: 100,
    height: 100,
    top: "40%",
    right: "15%",
  },
});

export default NotFound;