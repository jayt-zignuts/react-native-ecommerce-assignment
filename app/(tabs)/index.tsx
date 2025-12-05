import { fetchProducts, Product } from '@/api/products';
import ProductCard from '@/components/ProductCard';
import Slider from '@/components/Slider';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const limit = 5; // items per page

  const loadProducts = async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    try {
      const newProducts = await fetchProducts(page, limit);
      if (newProducts.length === 0) {
        setHasMore(false);
      } else {
        setProducts(prev => [...prev, ...newProducts]);
        setPage(prev => prev + 1);
      }
    } catch (e) {
      console.error('Error fetching products:', e);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  if (loading && products.length === 0) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#2f95dc" />
      </View>
    );
  }

  return (
    <FlatList
  ListHeaderComponent={<Slider />}
  data={products}
  keyExtractor={item => String(item.id)}
  renderItem={({ item }) => <ProductCard item={item} />}
  contentContainerStyle={{ paddingBottom: 16 }}
  onEndReached={loadProducts}
  onEndReachedThreshold={0.5}
  ListFooterComponent={loadingMore ? <ActivityIndicator style={{ margin: 16 }} /> : null}
/>

  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
