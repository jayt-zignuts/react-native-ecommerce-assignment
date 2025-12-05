import { useAuth } from "@/hooks/useAuth";
import { useCart } from '@/hooks/useCart';
import { useFavorites } from "@/hooks/useFavorites";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
  Image,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { Product } from "../api/products";

type Props = {
  item: Product;
  onPress?: () => void;
  onAddToCart?: () => void;
};

const ProductCard = ({ item, onPress, onAddToCart }: Props) => {
  const { user } = useAuth();
  const router = useRouter();
  const { addToCart, items } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites(); 

  const isInCart = user ? items.some((ci) => ci.id === item.id) : false;
  const favStatus = user ? isFavorite(item.id) : false;

  const rating = item.rating ?? { rate: 0, count: 0 };

  const handleCardPress = () => {
    router.push(`/product/${item.id}`);
  };

  const handleAddToCart = () => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (isInCart) {
      ToastAndroid.show("Item already in cart!", ToastAndroid.SHORT);
    } else {
      addToCart(item);
      ToastAndroid.show("Item added to cart!", ToastAndroid.SHORT);
      onAddToCart?.();
    }
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    await toggleFavorite(item.id);
    ToastAndroid.show(
      favStatus ? "Removed from favourites" : "Added to favourites",
      ToastAndroid.SHORT
    );
  };

  const showRatingBadge = rating.rate > 4.0;
  const showFreeShipping = item.price > 50;

  const stars = useMemo(() => {
    const starsArray = [];
    const fullStars = Math.floor(rating.rate);
    const hasHalfStar = rating.rate % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        starsArray.push(
          <Ionicons key={i} name="star" size={12} color="#FFD700" />
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        starsArray.push(
          <Ionicons key={i} name="star-half" size={12} color="#FFD700" />
        );
      } else {
        starsArray.push(
          <Ionicons key={i} name="star-outline" size={12} color="#CCCCCC" />
        );
      }
    }

    return starsArray;
  }, [rating.rate]);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handleCardPress}
      activeOpacity={0.9}
    >
      <View style={styles.cardAccent} />

      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.image }}
          style={styles.image}
          resizeMode="contain"
        />

        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category.toUpperCase()}</Text>
        </View>

        {showRatingBadge && (
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={10} color="#FFFFFF" />
            <Text style={styles.ratingBadgeText}>{rating.rate.toFixed(1)}</Text>
          </View>
        )}
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>

          <TouchableOpacity
            style={styles.wishlistButton}
            onPress={handleToggleFavorite}
          >
            <Ionicons
              name={favStatus ? "heart" : "heart-outline"}
              size={20}
              color={favStatus ? "red" : "#666"}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.ratingRow}>
          <View style={styles.starsContainer}>{stars}</View>
          <Text style={styles.reviewCount}>({rating.count})</Text>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.footer}>
          <View>
            <Text style={styles.price}>${item.price.toFixed(2)}</Text>
            {showFreeShipping && (
              <Text style={styles.shippingText}>Free Shipping</Text>
            )}
          </View>

          <TouchableOpacity
            style={styles.addToCartButton}
            onPress={handleAddToCart}
          >
            <Ionicons
              name={isInCart ? "checkmark-circle" : "add-circle"}
              size={24}
              color={isInCart ? "#2E8B57" : "#000000"}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(ProductCard);


const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    overflow: "hidden",
    position: "relative",
  },
  cardAccent: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 4,
    height: "100%",
    backgroundColor: "#000000",
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  imageContainer: {
    width: 120,
    backgroundColor: "#F8F8F8",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    position: "relative",
  },
  image: {
    width: "100%",
    height: 100,
  },
  categoryBadge: {
    position: "absolute",
    top: 8,
    left: 8,
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
  ratingBadge: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "#000000",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 2,
  },
  ratingBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
  contentContainer: {
    flex: 1,
    padding: 16,
    paddingLeft: 12,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#000000",
    lineHeight: 20,
    flex: 1,
    marginRight: 8,
  },
  wishlistButton: {
    padding: 4,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: "row",
  },
  reviewCount: {
    fontSize: 12,
    color: "#666666",
    fontWeight: "500",
    marginLeft: 4,
  },
  description: {
    fontSize: 12,
    color: "#666666",
    lineHeight: 16,
    marginBottom: 12,
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  price: {
    fontSize: 20,
    fontWeight: "800",
    color: "#000000",
    letterSpacing: 0.5,
  },
  shippingText: {
    fontSize: 11,
    color: "#2E8B57",
    fontWeight: "600",
    marginTop: 2,
  },
  addToCartButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
});
