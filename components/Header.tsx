import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
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

  const username = user?.email ? user.email.split("@")[0] : "Guest";
  const profileImage = "https://i.pravatar.cc/150?img=3";

  return (
      <View style={styles.container}>
        {/* Logo/Brand */}
        <TouchableOpacity onPress={() => router.push("/")} activeOpacity={0.7}>
          <View style={styles.brandContainer}>
            <Text style={styles.brand}>STORE</Text>
            <Text style={styles.brandAccent}>X</Text>
          </View>
        </TouchableOpacity>

        {/* User Profile Section */}
        <TouchableOpacity
          style={styles.profileContainer}
          onPress={() => router.push("/profile")}
          activeOpacity={0.7}
        >
          <View style={styles.textContainer}>
            <Text style={styles.username}>{username}</Text>
            <Text style={styles.greeting}>{getGreeting()}</Text>
          </View>

          <View style={styles.imageContainer}>
            {user ? (
              <Image source={{ uri: profileImage }} style={styles.image} />
            ) : (
              <View style={styles.guestIcon}>
                <Icon name="person-outline" size={24} color="#000" />
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  safe: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
  },
  brandContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  brand: {
    fontSize: 24,
    fontWeight: "900",
    color: "#000000",
    letterSpacing: 1,
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
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  textContainer: {
    flexDirection: "column",
    alignItems: "flex-end",
    marginRight: 10,
  },
  greeting: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  username: {
    fontSize: 14,
    fontWeight: "700",
    color: "#000",
    marginTop: 2,
    letterSpacing: 0.3,
  },
  imageContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#000",
  },
  guestIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#000",
  },
  chevron: {
    marginLeft: 8,
  },
});
