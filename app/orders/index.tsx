import Header from "@/components/Header";
import ProtectedRoute from "@/components/ProtectedRoute";
import OrderCardSkeleton from "@/components/Skeletons/OrderCardSkeleton";
import { useOrders } from "@/hooks/useOrders";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import React, { useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Orders = () => {

const navigation = useNavigation();
    
      useLayoutEffect(() => {
        navigation.setOptions({ headerShown: false });
      }, [navigation]);

  const router = useRouter();
  const { orders, loading, clearOrders, refreshOrders } = useOrders();
  const [refreshing, setRefreshing] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "#FFA500";
      case "processing":
        return "#2E8B57";
      case "delivered":
        return "#4CD964";
      case "cancelled":
        return "#FF3B30";
      default:
        return "#666";
    }
  };

  const handleClearOrders = () => {
    if (orders.length === 0) return;

    Alert.alert(
      "Clear All Orders",
      "Are you sure you want to delete all order history?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
            await clearOrders();
          },
        },
      ]
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshOrders();
    } finally {
      setRefreshing(false);
    }
  };

  const renderOrderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.orderCard} 
      activeOpacity={0.9}
          onPress={() => router.push(`/orders/${item.id}`)}

    >
      <View style={styles.orderHeader}>
        <View style={styles.orderHeaderLeft}>
          <Ionicons name="receipt-outline" size={20} color="#000" />
          <View>
            <Text style={styles.orderId}>Order #{item.id.slice(-8)}</Text>
            <Text style={styles.orderDate}>{formatDate(item.date)}</Text>
          </View>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) + "20" },
          ]}
        >
          <View
            style={[
              styles.statusDot,
              { backgroundColor: getStatusColor(item.status) },
            ]}
          />
          <Text
            style={[styles.statusText, { color: getStatusColor(item.status) }]}
          >
            {item.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.orderItems}>
        {item.items.slice(0, 3).map((product: any, index: number) => (
          <View key={index} style={styles.productItem}>
            <Image
              source={{ uri: product.image }}
              style={styles.productImage}
            />
            <View style={styles.productInfo}>
              <Text style={styles.productTitle} numberOfLines={1}>
                {product.title}
              </Text>
              <View style={styles.productDetails}>
                <Text style={styles.productPrice}>
                  ${product.price.toFixed(2)}
                </Text>
                {product.quantity > 1 && (
                  <Text style={styles.quantityText}>×{product.quantity}</Text>
                )}
              </View>
            </View>
          </View>
        ))}
        {item.items.length > 3 && (
          <Text style={styles.moreItems}>
            +{item.items.length - 3} more items
          </Text>
        )}
      </View>

      <View style={styles.orderFooter}>
        <Text style={styles.totalLabel}>Total</Text>
        <View style={styles.totalContainer}>
          <Text style={styles.totalPrice}>${item.totalPrice.toFixed(2)}</Text>
          <Ionicons name="chevron-forward" size={16} color="#666" />
        </View>
      </View>
    </TouchableOpacity>
  );

  const EmptyOrders = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="receipt-outline" size={80} color="#E0E0E0" />
      </View>
      <Text style={styles.emptyTitle}>No Orders Yet</Text>
      <Text style={styles.emptySubtitle}>
        Your order history will appear here after you place an order
      </Text>
      <TouchableOpacity
        style={styles.shopButton}
        onPress={() => router.push("/")}
      >
        <Ionicons name="storefront-outline" size={20} color="#FFFFFF" />
        <Text style={styles.shopButtonText}>Start Shopping</Text>
      </TouchableOpacity>
    </View>
  );

if (loading) {
    return (
      <ProtectedRoute>
        <SafeAreaView style={styles.fullContainer}>
          <Header />
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#000000" />
            <Text style={styles.loadingText}>Loading orders...</Text>
          </View>
        </SafeAreaView>
      </ProtectedRoute>
    );
  }

 return (
    <ProtectedRoute>
      <SafeAreaView style={styles.fullContainer}>
        <Header />

        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.pageTitle}>Order History</Text>
              <Text style={styles.orderCount}>
                {orders.length} {orders.length === 1 ? "order" : "orders"}
              </Text>
            </View>
            {orders.length > 0 && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={handleClearOrders}
              >
                <Ionicons name="trash-outline" size={18} color="#FF3B30" />
                <Text style={styles.clearText}>Clear All</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {orders.length === 0 && !refreshing ? (
          <EmptyOrders />
        ) : (
          <FlatList
            data={refreshing ? Array(3).fill(null) : orders}
            renderItem={({ item, index }) => 
              refreshing ? (
                <OrderCardSkeleton />
              ) : (
                renderOrderItem({ item })
              )
            }
            keyExtractor={(item, index) => 
              refreshing ? `skeleton-${index}` : item.id
            }
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl 
                refreshing={false} 
                onRefresh={onRefresh}
                tintColor="transparent"
                colors={["transparent"]}
              />
            }
          />
        )}
      </SafeAreaView>
    </ProtectedRoute>
  );
};

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  headerContainer: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerLeft: { flex: 1 },
  pageTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#000000",
    marginBottom: 4,
  },
  orderCount: { 
    fontSize: 14, 
    color: "#666", 
    fontWeight: "500" 
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF5F5",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#FFE5E5",
    gap: 8,
  },
  clearText: { 
    color: "#FF3B30", 
    fontSize: 14, 
    fontWeight: "600" 
  },
  listContainer: { 
    padding: 16,
    backgroundColor: "#FAFAFA",
    flexGrow: 1,
  },
  orderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  orderHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 4,
  },
  orderDate: { 
    fontSize: 13, 
    color: "#666", 
    fontWeight: "500" 
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  statusDot: { 
    width: 8, 
    height: 8, 
    borderRadius: 4 
  },
  statusText: { 
    fontSize: 11, 
    fontWeight: "700", 
    letterSpacing: 0.5 
  },
  orderItems: { 
    marginBottom: 16 
  },
  productItem: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginBottom: 12 
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: "#F8F8F8",
  },
  productInfo: { 
    flex: 1 
  },
  productTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 4,
  },
  productDetails: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  productPrice: { 
    fontSize: 14, 
    fontWeight: "700", 
    color: "#000000" 
  },
  quantityText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  moreItems: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
    textAlign: "center",
    marginTop: 8,
    fontStyle: "italic",
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  totalLabel: { 
    fontSize: 16, 
    fontWeight: "600", 
    color: "#000000" 
  },
  totalContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  totalPrice: { 
    fontSize: 20, 
    fontWeight: "800", 
    color: "#000000" 
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    backgroundColor: "#FAFAFA",
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 2,
    borderColor: "#F0F0F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#000000",
    marginBottom: 12,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 22,
  },
  shopButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#000000",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  shopButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});

export default Orders;