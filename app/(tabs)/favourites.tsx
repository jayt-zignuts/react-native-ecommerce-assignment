import { fetchProducts, Product } from "@/api/products";
import FavouriteCardSkeleton from "@/components/FavouriteCardSkeleton";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useFavorites } from "@/hooks/useFavorites";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Favourites = () => {
  const router = useRouter();
  const {
    favorites,
    toggleFavorite,
    clearFavorites,
    loading: favLoading,
  } = useFavorites();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0 && favorites.length > 0) {
      const favProducts = products.filter((product) =>
        favorites.includes(product.id)
      );
      setFilteredProducts(favProducts);
    } else {
      setFilteredProducts([]);
    }
  }, [favorites, products]);

  const loadProducts = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      const { products: data } = await fetchProducts(1, 50);
      setProducts(data);
    } catch (error) {
      console.error("Error loading products:", error);
      Alert.alert("Error", "Failed to load products");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    loadProducts(true);
  };

  const showToast = (message: string) => {
    if (Platform.OS === "android") {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert(message);
    }
  };

  const handleRemoveFavorite = async (productId: number) => {
    await toggleFavorite(productId);
    showToast("Removed from favourites");
  };

  const handleClearAll = () => {
    if (favorites.length === 0) return;

    Alert.alert(
      "Clear All Favourites",
      "Are you sure you want to remove all favourites?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          style: "destructive",
          onPress: async () => {
            await clearFavorites();
            showToast("All favourites cleared");
          },
        },
      ]
    );
  };

  const handleProductPress = (product: Product) => {
    router.push(`/product/${product.id}`);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Ionicons key={i} name="star" size={12} color="#FFD700" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <Ionicons key={i} name="star-half" size={12} color="#FFD700" />
        );
      } else {
        stars.push(
          <Ionicons key={i} name="star-outline" size={12} color="#CCCCCC" />
        );
      }
    }
    return <View style={styles.starsContainer}>{stars}</View>;
  };

  const EmptyFavourites = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="heart-dislike" size={80} color="#E0E0E0" />
      </View>
      <Text style={styles.emptyTitle}>No Favourites Yet</Text>
      <Text style={styles.emptySubtitle}>
        Tap the ♡ icon on products to add them to your favourites
      </Text>
      <TouchableOpacity
        style={styles.shopButton}
        onPress={() => router.push("/")}
      >
        <Ionicons name="storefront-outline" size={20} color="#FFFFFF" />
        <Text style={styles.shopButtonText}>Browse Products</Text>
      </TouchableOpacity>
    </View>
  );

  const LoadingState = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favourites</Text>
      </View>
      <FlatList
        data={Array(6).fill(null)}
        renderItem={() => <FavouriteCardSkeleton />}
        keyExtractor={(_, index) => `skeleton-${index}`}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
      />
    </View>
  );

  const renderFavouriteItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.favItem}
      onPress={() => handleProductPress(item)}
      activeOpacity={0.9}
    >
      {/* Product Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.image }}
          style={styles.itemImage}
          resizeMode="contain"
        />
        <View style={styles.imageOverlay}>
          <TouchableOpacity
            style={styles.removeFavButton}
            onPress={(e) => {
              e.stopPropagation();
              handleRemoveFavorite(item.id);
            }}
          >
            <Ionicons name="heart" size={20} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Product Details */}
      <View style={styles.itemDetails}>
        <View style={styles.itemHeader}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>
              {item.category.toUpperCase()}
            </Text>
          </View>
          {item.rating?.rate && item.rating.rate > 4.0 && (
            <View style={styles.topRatedBadge}>
              <Ionicons name="trophy" size={12} color="#FFFFFF" />
              <Text style={styles.topRatedText}>TOP</Text>
            </View>
          )}
        </View>

        <Text style={styles.itemTitle} numberOfLines={2}>
          {item.title}
        </Text>

        <View style={styles.ratingRow}>
          {renderStars(item.rating?.rate || 0)}
          <Text style={styles.reviewCount}>({item.rating?.count || 0})</Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
          {item.price > 50 && (
            <View style={styles.shippingBadge}>
              <Ionicons name="rocket-outline" size={12} color="#FFFFFF" />
              <Text style={styles.shippingText}>FREE</Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={styles.viewDetailsButton}
          onPress={(e) => {
            e.stopPropagation();
            handleProductPress(item);
          }}
        >
          <Text style={styles.viewDetailsText}>View Details</Text>
          <Ionicons name="arrow-forward" size={16} color="#000000" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (loading || favLoading) {
    return (
      <ProtectedRoute>
        <SafeAreaView style={styles.safeArea}>
          <LoadingState />
        </SafeAreaView>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      {/* <SafeAreaView style={styles.safeArea}> */}
        {/* Correct Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Favourites</Text>
          {favorites.length > 0 && (
            <TouchableOpacity
              onPress={handleClearAll}
              style={styles.clearAllButton}
            >
              <Text style={styles.clearAllText}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.container}>
          {/* Favourites List */}
          {filteredProducts.length === 0 ? (
            <EmptyFavourites />
          ) : (
            <FlatList
              data={refreshing ? Array(6).fill(null) : filteredProducts}
              renderItem={({ item, index }) => 
                refreshing ? (
                  <FavouriteCardSkeleton />
                ) : (
                  renderFavouriteItem({ item: item as Product })
                )
              }
              keyExtractor={(item, index) => 
                refreshing ? `skeleton-${index}` : (item as Product).id.toString()
              }
              contentContainerStyle={[styles.listContainer, { flexGrow: 1 }]}
              showsVerticalScrollIndicator={false}
              numColumns={2}
              columnWrapperStyle={styles.columnWrapper}
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

        </View>
      {/* </SafeAreaView> */}
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
    backgroundColor: "#FAFAFA",
  },

  header: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#000000",
  },
  clearAllButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF3B301A", // subtle red background
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#FF3B30",
  },
  clearAllText: {
    color: "#FF3B30",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
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

  listContainer: {
    padding: 16,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  favItem: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },

  imageContainer: {
    height: 140,
    backgroundColor: "#F8F8F8",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  itemImage: {
    width: "80%",
    height: "80%",
  },
  imageOverlay: {
    position: "absolute",
    top: 8,
    right: 8,
  },
  removeFavButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  itemDetails: {
    padding: 12,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: "#000000",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  categoryText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  topRatedBadge: {
    backgroundColor: "#000000",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 2,
  },
  topRatedText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "700",
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#000000",
    lineHeight: 18,
    marginBottom: 8,
    height: 36,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 4,
  },
  starsContainer: {
    flexDirection: "row",
  },
  reviewCount: {
    fontSize: 11,
    color: "#666",
    fontWeight: "500",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: "800",
    color: "#000000",
    letterSpacing: 0.5,
  },
  shippingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CD964",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 2,
  },
  shippingText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  viewDetailsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#F0F0F0",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    gap: 6,
  },
  viewDetailsText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#000000",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#FAFAFA",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 2,
    borderColor: "#F0F0F0",
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

  bottomNav: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    padding: 20,
  },
  continueShopping: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    marginBottom: 16,
  },
  continueShoppingText: {
    color: "#666",
    fontSize: 15,
    fontWeight: "500",
    marginLeft: 8,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    borderRadius: 12,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#000000",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#E0E0E0",
  },
});


export default Favourites;
