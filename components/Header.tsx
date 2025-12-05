import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

const Header: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();

const username = user?.email
  ? user.email.split("@")[0].replace(/^./, (c) => c.toUpperCase())
  : "Guest";
  
  const userInitial = username.charAt(0).toUpperCase();
  
  const getInitialColor = (initial: string) => {
    const colors = [
      "#FF6B6B", // Red
      "#4ECDC4", // Teal
      "#FFD166", // Yellow
      "#06D6A0", // Green
      "#118AB2", // Blue
      "#7209B7", // Purple
      "#EF476F", // Pink
      "#073B4C", // Dark Blue
    ];
    
    const charCode = initial.charCodeAt(0);
    return colors[charCode % colors.length];
  };
  
  const initialColor = getInitialColor(userInitial);

  return (
    <View style={styles.container}>
      {/* Logo/Brand */}
      <TouchableOpacity onPress={() => router.push("/")} activeOpacity={0.7}>
        <View style={styles.brandContainer}>
          <View style={styles.brandMark}>
            <Icon name="storefront" size={18} color="#000" />
          </View>
          <View style={styles.brandTextContainer}>
            <Text style={styles.brand}>Store</Text>
            <Text style={styles.brandAccent}>X</Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.profileContainer}
        onPress={() => router.push("/profile")}
        activeOpacity={0.7}
      >
        <View style={styles.textContainer}>
          <View style={styles.greetingPill}>
            <Icon name="wb-sunny" size={14} color="#000" />
            <Text style={styles.greeting}>{getGreeting()}</Text>
          </View>
          <Text style={styles.username}>{username}</Text>
        </View>

        <View style={styles.imageContainer}>
          {user ? (
            <View style={[styles.userInitialContainer, { backgroundColor: initialColor }]}>
              <Text style={styles.userInitialText}>{userInitial}</Text>
            </View>
          ) : (
            <View style={styles.guestIcon}>
              <Icon name="person-outline" size={22} color="#000" />
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  brandContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  brandTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  brandMark: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#F3F3F3",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E6E6E6",
  },
  brand: {
    fontSize: 18,
    fontWeight: "800",
    color: "#000000",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  brandAccent: {
    fontSize: 24,
    fontWeight: "900",
    backgroundColor: "#000",
    color: "#FFF",
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 4,
    borderRadius: 4,
    overflow: "hidden",
    lineHeight: 24,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 12,
  },
  textContainer: {
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 4,
  },
  greetingPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: "#EFEFEF",
    borderRadius: 12,
  },
  greeting: {
    fontSize: 12,
    color: "#000",
    fontWeight: "600",
    textTransform: "none",
    letterSpacing: 0.2,
  },
  username: {
    fontSize: 15,
    fontWeight: "800",
    color: "#000",
    letterSpacing: 0.3,
  },
  imageContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  userInitialContainer: {
    width: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.2,
    borderColor: "#000",
  },
  userInitialText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  guestIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.2,
    borderColor: "#000",
  },
});