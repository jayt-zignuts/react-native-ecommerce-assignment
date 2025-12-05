import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { FavProvider } from "@/context/FavContext";
import { OrdersProvider } from "@/context/OrdersContext";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" translucent={false} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0} // adjust if you have headers
      >
        <AuthProvider>
          <CartProvider>
            <FavProvider>
              <OrdersProvider>
                <Stack>
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                </Stack>
              </OrdersProvider>
            </FavProvider>
          </CartProvider>
        </AuthProvider>
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  );
}
