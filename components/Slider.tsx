import { fetchProducts, type Product } from "@/api/products";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.65;
const CARD_MARGIN = 12;

export default function Slider() {
  const { user } = useAuth();
  const { items, addToCart } = useCart();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchProducts();
        const topK = 8;
        const topProducts: Product[] = [];

        for (const p of data) {
          if (!p.rating) continue;

          let inserted = false;
          for (let i = 0; i < topProducts.length; i++) {
            if (p.rating!.rate > topProducts[i].rating!.rate) {
              topProducts.splice(i, 0, p);
              inserted = true;
              break;
            }
          }

          if (!inserted && topProducts.length < topK) topProducts.push(p);
          if (topProducts.length > topK) topProducts.pop();
        }

        setProducts(topProducts);
      } catch (e) {
        console.error("Error fetching products:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) stars.push(<Ionicons key={i} name="star" size={12} color="#FFD700" />);
      else if (i === fullStars + 1 && hasHalfStar)
        stars.push(<Ionicons key={i} name="star-half" size={12} color="#FFD700" />);
      else stars.push(<Ionicons key={i} name="star-outline" size={12} color="#CCCCCC" />);
    }
    return <View style={styles.starsContainer}>{stars}</View>;
  };

const handleAddToCart = (product: Product) => {
  if (!user) {
    router.push('/login');
    return;
  }

  const isInCart = items.some(ci => ci.id === product.id);

  if (isInCart) {
    ToastAndroid.show('Item already in cart!', ToastAndroid.SHORT);
  } else {
    addToCart(product);
    ToastAndroid.show('Item added to cart!', ToastAndroid.SHORT);
  }
};



  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#000000" />
        <Text style={styles.loadingText}>Loading Top Products...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Featured Products</Text>
        <Text style={styles.sectionSubtitle}>Highest Rated Items</Text>
      </View>

      <FlatList
        data={products}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        contentContainerStyle={styles.listContainer}
        snapToInterval={CARD_WIDTH + CARD_MARGIN * 2}
        decelerationRate="fast"
        onScroll={(e) => {
          const offset = e.nativeEvent.contentOffset.x;
          const index = Math.round(offset / (CARD_WIDTH + CARD_MARGIN * 2));
          setActiveIndex(index);
        }}
        scrollEventThrottle={16}
       renderItem={({ item: product, index }) => {
  const isInCart = user ? items.some((cartItem) => cartItem.id === product.id) : false;

  return (
    <View style={[styles.card, index === activeIndex && styles.activeCard]}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          resizeMode="contain"
        />
        {product.rating?.rate && product.rating.rate > 4.5 && (
          <View style={styles.badge}>
            <Ionicons name="trophy" size={14} color="#FFFFFF" />
            <Text style={styles.badgeText}>Top Rated</Text>
          </View>
        )}
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.category} numberOfLines={1}>
          {product.category.toUpperCase()}
        </Text>
        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>

        <View style={styles.ratingContainer}>
          {renderStars(product.rating?.rate || 0)}
          <Text style={styles.ratingText}>
            {product.rating?.rate?.toFixed(1)} ({product.rating?.count})
          </Text>
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.price}>₹{product.price.toFixed(2)}</Text>
          <TouchableOpacity onPress={() => handleAddToCart(product)}>
            <Ionicons
              name={isInCart ? "checkmark-circle" : "add-circle"}
              size={24}
              color={isInCart ? "#2E8B57" : "#000000"}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.footerText}>Free Shipping</Text>
        <View style={styles.footerDot} />
        <Text style={styles.footerText}>30-Day Returns</Text>
      </View>
    </View>
  );
}}
      />

      <View style={styles.pagination}>
        {products.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, index === activeIndex ? styles.activeDot : styles.inactiveDot]}
          />
        ))}
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    marginVertical: 24,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#000000",
    letterSpacing: 0.5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#666666",
    marginTop: 4,
    fontWeight: "500",
  },
  loader: {
    height: 280,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    borderRadius: 12,
    marginHorizontal: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#666666",
    fontWeight: "500",
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginHorizontal: CARD_MARGIN,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    overflow: "hidden",
  },
  activeCard: {
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 12,
    borderColor: "#E0E0E0",
  },
  imageContainer: {
    height: 160,
    backgroundColor: "#F8F8F8",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  image: {
    width: "80%",
    height: "80%",
  },
  badge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "#000000",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  cardContent: {
    padding: 16,
  },
  category: {
    fontSize: 11,
    color: "#888888",
    fontWeight: "600",
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#000000",
    lineHeight: 20,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 6,
  },
  starsContainer: {
    flexDirection: "row",
    gap: 2,
  },
  ratingText: {
    fontSize: 12,
    color: "#666666",
    fontWeight: "500",
    marginLeft: 4,
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontSize: 20,
    fontWeight: "800",
    color: "#000000",
    letterSpacing: 0.5,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#FAFAFA",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    gap: 8,
  },
  footerText: {
    fontSize: 11,
    color: "#666666",
    fontWeight: "500",
  },
  footerDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#CCCCCC",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    backgroundColor: "#000000",
    width: 24,
  },
  inactiveDot: {
    backgroundColor: "#E0E0E0",
  },
});