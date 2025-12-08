import { fetchProductById, Product } from "@/api/products";
import ProtectedRoute from "@/components/ProtectedRoute";
import ProductDetailsSkeleton from "@/components/Skeletons/ProductDetailsSkeleton";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useFavorites } from "@/hooks/useFavorites";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import {
  Alert,
  Image,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ProductDetails = () => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { items, addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadProduct = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      const data = await fetchProductById(Number(id));
      setProduct(data);
    } catch (error) {
      console.error("Error loading product:", error);
      Alert.alert("Error", "Failed to load product details");
      if (!isRefresh) {
        router.back();
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id, router]);

  const onRefresh = useCallback(() => {
    loadProduct(true);
  }, [loadProduct]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  const showToast = (message: string) => {
    if (Platform.OS === "android") {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert(message);
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      Alert.alert("Login Required", "You need to login to add items to cart", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Login",
          onPress: () => router.push("/login"),
        },
      ]);
      return;
    }

    if (!product) return;

    const isInCart = items.some((item) => item.id === product.id);
    if (isInCart) {
      showToast("Item already in cart!");
      return;
    }

    const cartItem = {
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
    };

    addToCart(cartItem);
    showToast("Added to cart successfully!");
  };

  const handleBuyNow = () => {
    if (!user) {
      Alert.alert("Login Required", "You need to login to proceed", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Login",
          onPress: () => router.push("/login"),
        },
      ]);
      return;
    }

    handleAddToCart();
    setTimeout(() => {
      router.push("/cart");
    }, 500);
  };

  const handleFavorite = async () => {
    if (!user) {
      Alert.alert("Login Required", "You need to login to add to favourites", [
        { text: "Cancel", style: "cancel" },
        { text: "Login", onPress: () => router.push("/login") },
      ]);
      return;
    }

    if (product) {
      await toggleFavorite(product.id);
      // const isFav = isFavorite(product.id);
      ToastAndroid.show(
        favStatus ? "Removed from favourites" : "Added to favourites",
        ToastAndroid.SHORT
      );
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Ionicons key={i} name="star" size={16} color="#FFD700" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <Ionicons key={i} name="star-half" size={16} color="#FFD700" />
        );
      } else {
        stars.push(
          <Ionicons key={i} name="star-outline" size={16} color="#CCCCCC" />
        );
      }
    }
    return stars;
  };

  if (loading && !refreshing) {
    return (
      <ProtectedRoute>
        <SafeAreaView style={styles.safeArea}>
          <ProductDetailsSkeleton />
        </SafeAreaView>
      </ProtectedRoute>
    );
  }

  if (!product && !refreshing) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#FF3B30" />
        <Text style={styles.errorTitle}>Product Not Found</Text>
        <Text style={styles.errorText}>
          {"The product you're looking for doesn't exist."}
        </Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isInCart = product ? items.some((item) => item.id === product.id) : false;
  const favStatus = product ? isFavorite(product.id) : false;

  return (
    <ProtectedRoute>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#000000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Product Details</Text>
          </View>
        </View>
        {refreshing ? (
          <ProductDetailsSkeleton />
        ) : product ? (
          <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl 
                refreshing={false} 
                onRefresh={onRefresh}
                tintColor="transparent"
                colors={["transparent"]}
              />
            }
          >
          {/* Product Image */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: product!.image }}
              style={styles.mainImage}
              resizeMode="contain"
            />

            {/* Top Rated Badge */}
            {product!.rating?.rate && product!.rating.rate > 4.5 && (
              <View style={styles.ratingBadge}>
                <Ionicons name="trophy" size={14} color="#FFFFFF" />
                <Text style={styles.ratingBadgeText}>TOP RATED</Text>
              </View>
            )}

            {/* Favorite Heart Icon */}
            <TouchableOpacity
              style={styles.wishlistBtn}
              onPress={handleFavorite}
            >
              <Ionicons
                name={favStatus ? "heart" : "heart-outline"}
                size={28}
                color={favStatus ? "#FF3B30" : "#FFFFFF"}
              />
            </TouchableOpacity>
          </View>

          {/* Product Info */}
          <View style={styles.content}>
            {/* Category & Rating */}
            <View style={styles.infoRow}>
              <View style={styles.categoryContainer}>
                <Ionicons name="pricetag-outline" size={16} color="#666" />
                <Text style={styles.categoryText}>
                  {product!.category.toUpperCase()}
                </Text>
              </View>
              <View style={styles.ratingContainer}>
                {renderStars(product!.rating?.rate || 0)}
                <Text style={styles.ratingText}>
                  {product!.rating?.rate?.toFixed(1)} ({product!.rating?.count}{" "}
                  reviews)
                </Text>
              </View>
            </View>

            {/* Product Title */}
            <Text style={styles.title}>{product!.title}</Text>

            {/* Price Section */}
            <View style={styles.priceSection}>
              <Text style={styles.price}>${product!.price.toFixed(2)}</Text>
              {product!.price > 50 && (
                <View style={styles.freeShippingBadge}>
                  <Ionicons name="rocket-outline" size={14} color="#FFFFFF" />
                  <Text style={styles.freeShippingText}>FREE SHIPPING</Text>
                </View>
              )}
            </View>

            {/* Description */}
            <View style={styles.descriptionContainer}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{product!.description}</Text>
            </View>

            {/* Features */}
            <View style={styles.featuresContainer}>
              <Text style={styles.sectionTitle}>Features</Text>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={18} color="#4CD964" />
                <Text style={styles.featureText}>
                  30-Day Money Back Guarantee
                </Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={18} color="#4CD964" />
                <Text style={styles.featureText}>Free Shipping Worldwide</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={18} color="#4CD964" />
                <Text style={styles.featureText}>24/7 Customer Support</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.cartBtn, isInCart && styles.inCartBtn]}
                onPress={handleAddToCart}
                disabled={isInCart}
              >
                <Ionicons
                  name={isInCart ? "checkmark-circle" : "cart-outline"}
                  size={22}
                  color={isInCart ? "#FFFFFF" : "#000000"}
                />
                <Text
                  style={[styles.cartBtnText, isInCart && styles.inCartBtnText]}
                >
                  {isInCart ? "ADDED TO CART" : "ADD TO CART"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.buyBtn} onPress={handleBuyNow}>
                <Ionicons name="flash" size={22} color="#FFFFFF" />
                <Text style={styles.buyBtnText}>BUY NOW</Text>
              </TouchableOpacity>
            </View>

            {/* Additional Info */}
            <View style={styles.infoContainer}>
              <View style={styles.infoItem}>
                <Ionicons name="shield-checkmark" size={20} color="#000" />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoTitle}>Secure Payment</Text>
                  <Text style={styles.infoSubtitle}>100% Secure & Safe</Text>
                </View>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="refresh" size={20} color="#000" />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoTitle}>Easy Returns</Text>
                  <Text style={styles.infoSubtitle}>30-Day Return Policy</Text>
                </View>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="cube" size={20} color="#000" />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoTitle}>Fast Delivery</Text>
                  <Text style={styles.infoSubtitle}>2-3 Business Days</Text>
                </View>
              </View>
            </View>
          </View>
          </ScrollView>
        ) : null}
      </SafeAreaView>
    </ProtectedRoute>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFFFFF" },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  headerContainer: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },

  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    backgroundColor: "#FFFFFF",
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#000000",
    marginTop: 20,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  backButton: {
    backgroundColor: "#000000",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  backBtn: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000000",
  },
  wishlistBtn: {
    position: "absolute",
    top: 16,
    right: 16,
    padding: 8,
    borderRadius: 20,
  },
  imageContainer: {
    height: 320,
    backgroundColor: "#F8F8F8",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  mainImage: {
    width: "80%",
    height: "80%",
  },
  ratingBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "#000000",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  ratingBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  content: {
    padding: 20,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  categoryContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "600",
    marginLeft: 6,
    letterSpacing: 0.5,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
    marginLeft: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#000000",
    lineHeight: 28,
    marginBottom: 16,
  },
  priceSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  price: {
    fontSize: 32,
    fontWeight: "800",
    color: "#000000",
    letterSpacing: 0.5,
  },
  freeShippingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CD964",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  freeShippingText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: "#666",
    lineHeight: 22,
  },
  featuresContainer: {
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  featureText: {
    fontSize: 14,
    color: "#000",
    fontWeight: "500",
    marginLeft: 10,
  },
  quantityContainer: {
    marginBottom: 32,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  qtyBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  disabledBtn: {
    backgroundColor: "#F8F8F8",
    borderColor: "#F0F0F0",
  },
  qtyDisplay: {
    width: 60,
    alignItems: "center",
    marginHorizontal: 16,
  },
  qtyText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000000",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 32,
  },
  cartBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#000000",
    backgroundColor: "transparent",
    gap: 8,
  },
  inCartBtn: {
    backgroundColor: "#000000",
  },
  cartBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
  },
  inCartBtnText: {
    color: "#FFFFFF",
  },
  buyBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "#000000",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  buyBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  infoContainer: {
    backgroundColor: "#FAFAFA",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  infoTextContainer: {
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 2,
  },
  infoSubtitle: {
    fontSize: 12,
    color: "#666",
  },
});

export default ProductDetails;
