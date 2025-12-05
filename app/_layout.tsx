import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { FavProvider } from "@/context/FavContext";
import { OrdersProvider } from "@/context/OrdersContext";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" translucent={false} />

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
    </SafeAreaProvider>
  );
}
