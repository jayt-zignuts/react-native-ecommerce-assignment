import Header from "@/components/Header";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useOrders } from "@/hooks/useOrders";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const OrderDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getOrderById } = useOrders();
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadOrder();
    }
  }, [id]);

  const loadOrder = () => {
    try {
      setLoading(true);
      const foundOrder = getOrderById(id);
      
      if (foundOrder) {
        setOrder(foundOrder);
      } else {
        Alert.alert("Error", "Order not found");
        router.back();
      }
    } catch (error) {
      console.error("Error loading order:", error);
      Alert.alert("Error", "Failed to load order details");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return "time-outline";
      case "processing":
        return "sync-outline";
      case "delivered":
        return "checkmark-circle-outline";
      case "cancelled":
        return "close-circle-outline";
      default:
        return "ellipse-outline";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Order Placed";
      case "processing":
        return "Processing";
      case "delivered":
        return "Delivered";
      case "cancelled":
        return "Cancelled";
      default:
        return "Unknown";
    }
  };

  const renderOrderItem = ({ item }: { item: any }) => (
    <View style={styles.orderItemCard}>
      <Image
        source={{ uri: item.image }}
        style={styles.orderItemImage}
      />
      <View style={styles.orderItemInfo}>
        <Text style={styles.orderItemTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.orderItemDetails}>
          <Text style={styles.orderItemPrice}>${item.price.toFixed(2)}</Text>
        </View>
        <Text style={styles.orderItemSubtotal}>
          Subtotal: ${(item.price).toFixed(2)}
        </Text>
      </View>
    </View>
  );

  const OrderNotFound = () => (
    <View style={styles.notFoundContainer}>
      <Ionicons name="receipt-outline" size={80} color="#E0E0E0" />
      <Text style={styles.notFoundTitle}>Order Not Found</Text>
      <Text style={styles.notFoundText}>
        {`The order you're looking for doesn't exist or has been removed.`}
      </Text>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push("/orders")}
      >
        <Text style={styles.backButtonText}>Back to Orders</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <ProtectedRoute>
        <SafeAreaView style={styles.safeArea}>
          <Header />
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#000000" />
            <Text style={styles.loadingText}>Loading order details...</Text>
          </View>
        </SafeAreaView>
      </ProtectedRoute>
    );
  }

  if (!order) {
    return (
      <ProtectedRoute>
        <SafeAreaView style={styles.safeArea}>
          <OrderNotFound />
        </SafeAreaView>
      </ProtectedRoute>
    );
  }

const subtotal = order.items.reduce((sum: number, item: any) => sum + item.price, 0);

const shipping = subtotal > 500 ? 0 : 40;
const total = subtotal + shipping;


  return (
    <ProtectedRoute>
      <SafeAreaView style={styles.safeArea}>        
        <ScrollView 
          style={styles.container}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          {/* Order Header */}
          <View style={styles.orderHeader}>
            <View style={styles.orderHeaderLeft}>
              <View style={styles.orderIconContainer}>
                <Ionicons name="receipt-outline" size={24} color="#000000" />
              </View>
              <View>
                <Text style={styles.orderId}>Order #{order.id.slice(-8)}</Text>
                <Text style={styles.orderDate}>{formatDate(order.date)}</Text>
              </View>
            </View>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(order.status) + "20" },
              ]}
            >
              <Ionicons 
                name={getStatusIcon(order.status)} 
                size={16} 
                color={getStatusColor(order.status)} 
              />
              <Text
                style={[styles.statusText, { color: getStatusColor(order.status) }]}
              >
                {getStatusText(order.status).toUpperCase()}
              </Text>
            </View>
          </View>

          {/* Order Items */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Order Items ({order.items.length})</Text>
              <Text style={styles.sectionSubtitle}>
                {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
              </Text>
            </View>
            <FlatList
              data={order.items}
              renderItem={renderOrderItem}
              keyExtractor={(item, index) => `${item.id}-${index}`}
              scrollEnabled={false}
              contentContainerStyle={styles.orderItemsList}
            />
          </View>

          {/* Order Summary */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Order Summary</Text>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping</Text>
              <Text style={styles.summaryValue}>
                {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
              </Text>
            </View>

            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
            </View>
            
            {order.totalPrice > 500 && (
              <View style={styles.freeShippingBadge}>
                <Ionicons name="checkmark-circle" size={16} color="#4CD964" />
                <Text style={styles.freeShippingText}>Free Shipping Applied</Text>
              </View>
            )}
          </View>

          {/* Order Information */}
          <View style={styles.infoCard}>
            <View>
              <Text style={styles.infoTitle}>Customer Information</Text>
              <View style={styles.infoRow}>
                <Ionicons name="person-outline" size={18} color="#666" />
                <Text style={styles.infoText}>{order.userEmail}</Text>
              </View>
            </View>
          </View>

          {/* Back Button */}
          <TouchableOpacity
            style={styles.bottomBackButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color="#666" />
            <Text style={styles.bottomBackText}>Back to Orders</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </ProtectedRoute>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
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
  notFoundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    backgroundColor: "#FAFAFA",
  },
  notFoundTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#000000",
    marginTop: 20,
    marginBottom: 12,
  },
  notFoundText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
  },
  backButton: {
    backgroundColor: "#000000",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  orderHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    flex: 1,
  },
  orderIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#F8F8F8",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#000000",
  },
  orderId: {
    fontSize: 18,
    fontWeight: "800",
    color: "#000000",
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  deliveryCard: {
    backgroundColor: "#FFFFFF",
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  deliveryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  deliveryTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000000",
  },
  deliveryText: {
    fontSize: 15,
    color: "#666",
    marginBottom: 20,
    fontWeight: "500",
  },
  progressBar: {
    height: 6,
    backgroundColor: "#F0F0F0",
    borderRadius: 3,
    marginBottom: 20,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  progressSteps: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressStep: {
    alignItems: "center",
    flex: 1,
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  stepActive: {
    backgroundColor: "#000000",
  },
  stepInactive: {
    backgroundColor: "#E0E0E0",
  },
  stepText: {
    fontSize: 11,
    color: "#666",
    fontWeight: "500",
    textAlign: "center",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#000000",
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  orderItemsList: {
    gap: 12,
  },
  orderItemCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  orderItemImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 16,
    backgroundColor: "#F8F8F8",
  },
  orderItemInfo: {
    flex: 1,
    justifyContent: "center",
  },
  orderItemTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 8,
    lineHeight: 20,
  },
  orderItemDetails: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    gap: 12,
  },
  orderItemPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
  },
  orderItemSubtotal: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#000000",
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 15,
    color: "#666",
    fontWeight: "500",
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000000",
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    paddingTop: 16,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000000",
  },
  totalValue: {
    fontSize: 22,
    fontWeight: "800",
    color: "#000000",
  },
  freeShippingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FFF4",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginTop: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: "#E0FFE9",
    alignSelf: "flex-start",
  },
  freeShippingText: {
    color: "#2E8B57",
    fontSize: 13,
    fontWeight: "600",
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 12,
  },
  infoText: {
    fontSize: 15,
    color: "#666",
    fontWeight: "500",
  },
  infoDivider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginVertical: 4,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  trackButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#000000",
    backgroundColor: "transparent",
    gap: 10,
  },
  trackButtonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "600",
  },
  supportButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "#000000",
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  supportButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  bottomBackButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    marginHorizontal: 20,
  },
  bottomBackText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
});

export default OrderDetails;