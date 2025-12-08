import { fetchProducts, Product } from '@/api/products';
import { LoadingState } from '@/components/Loading/LoadingState';
import ProductCard from '@/components/ProductCard';
import ProductCardSkeleton from '@/components/Skeletons/ProductCardSkeleton';
import Slider from '@/components/Slider';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ITEMS_PER_PAGE = 5;

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [customPageInput, setCustomPageInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async (page: number, isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    setError(null);

    try {
      const response = await fetchProducts(page, ITEMS_PER_PAGE);
      setProducts(response.products);
      setCurrentPage(response.currentPage);
      setTotalPages(response.totalPages);
      setTotalItems(response.totalItems);
    } catch (e: any) {
      console.error('Error fetching products:', e);
      setError(e.message || 'Failed to load products');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const onRefresh = useCallback(() => {
    loadProducts(1, true);
  }, [loadProducts]);

  const handlePageClick = useCallback((page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    loadProducts(page);
  }, [currentPage, totalPages, loadProducts]);

  const handleCustomPageSubmit = useCallback(() => {
    const pageNum = parseInt(customPageInput, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages && pageNum !== currentPage) {
      loadProducts(pageNum);
      setCustomPageInput('');
    }
  }, [customPageInput, totalPages, currentPage, loadProducts]);

  const handlePageInputChange = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, '');
    setCustomPageInput(numericText);
  };

  const renderPaginationButtons = () => {
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <View style={styles.paginationContainer}>
        <TouchableOpacity
          style={[styles.pageButton, currentPage === 1 && styles.disabledButton]}
          onPress={() => handlePageClick(1)}
          disabled={currentPage === 1}
        >
          <Icon name="first-page" size={20} color={currentPage === 1 ? '#999' : '#333'} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.pageButton, currentPage === 1 && styles.disabledButton]}
          onPress={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <Icon name="chevron-left" size={20} color={currentPage === 1 ? '#999' : '#333'} />
        </TouchableOpacity>

        {startPage > 1 && (
          <Text style={styles.ellipsis}>...</Text>
        )}
        
        {pageNumbers.map((pageNum) => (
          <TouchableOpacity
            key={pageNum}
            style={[
              styles.pageButton,
              currentPage === pageNum && styles.activePageButton
            ]}
            onPress={() => handlePageClick(pageNum)}
          >
            <Text style={[
              styles.pageButtonText,
              currentPage === pageNum && styles.activePageText
            ]}>
              {pageNum}
            </Text>
          </TouchableOpacity>
        ))}
        
        {endPage < totalPages && (
          <Text style={styles.ellipsis}>...</Text>
        )}

        <TouchableOpacity
          style={[styles.pageButton, currentPage === totalPages && styles.disabledButton]}
          onPress={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <Icon name="chevron-right" size={20} color={currentPage === totalPages ? '#999' : '#333'} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.pageButton, currentPage === totalPages && styles.disabledButton]}
          onPress={() => handlePageClick(totalPages)}
          disabled={currentPage === totalPages}
        >
          <Icon name="last-page" size={20} color={currentPage === totalPages ? '#999' : '#333'} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderPageInfo = () => (
    <View style={styles.pageInfoContainer}>
      <View style={styles.pageInfoRow}>
        <Text style={styles.pageInfoText}>
          Page <Text style={styles.pageInfoHighlight}>{currentPage}</Text> of {totalPages}
        </Text>
        <Text style={styles.pageInfoText}>
          Showing <Text style={styles.pageInfoHighlight}>{products.length}</Text> items
        </Text>
      </View>
      
      <View style={styles.customPageContainer}>
        <TextInput
          style={styles.pageInput}
          value={customPageInput}
          onChangeText={handlePageInputChange}
          keyboardType="numeric"
          placeholder="Go to page"
          placeholderTextColor="#999"
          maxLength={4}
          onSubmitEditing={handleCustomPageSubmit}
        />
        <TouchableOpacity
          style={[styles.goButton, !customPageInput && styles.goButtonDisabled]}
          onPress={handleCustomPageSubmit}
          disabled={!customPageInput}
        >
          <Text style={styles.goButtonText}>Go</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  useEffect(() => {
    loadProducts(1);
  }, [loadProducts]);

  if (loading && products.length === 0) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="error-outline" size={64} color="#FF6B6B" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => loadProducts(1)}>
          <Icon name="refresh" size={18} color="#fff" />
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      ListHeaderComponent={<Slider />}
      data={refreshing ? Array(ITEMS_PER_PAGE).fill(null) : products}
      keyExtractor={(item, index) => 
        refreshing ? `skeleton-${index}` : (item as Product).id.toString()
      }
      renderItem={({ item }) => 
        refreshing ? <ProductCardSkeleton /> : <ProductCard item={item as Product} />
      }
      contentContainerStyle={{ paddingBottom: 16 }}
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={onRefresh}
          tintColor="#000"
        />
      }
      ListFooterComponent={
        <View>
          {loading && products.length > 0 && (
            <ActivityIndicator style={{ marginVertical: 24 }} color="#000" />
          )}
          {!refreshing && totalPages > 1 && renderPageInfo()}
          {!refreshing && totalPages > 1 && renderPaginationButtons()}
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#fff',
  },
  errorText: {
    color: '#333',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
    fontWeight: '500',
  },
  retryButton: {
    backgroundColor: '#000',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
    paddingHorizontal: 20,
    gap: 4,
  },
  pageInfoContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    marginTop: 8,
  },
  pageInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  pageInfoText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  pageInfoHighlight: {
    color: '#000',
    fontWeight: '700',
  },
  customPageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
  },
  pageInput: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#f8f8f8',
  },
  goButton: {
    backgroundColor: '#000',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  goButtonDisabled: {
    backgroundColor: '#999',
    opacity: 0.7,
  },
  goButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  pageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#e8e8e8',
  },
  activePageButton: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  disabledButton: {
    opacity: 0.5,
  },
  pageButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  activePageText: {
    color: '#fff',
  },
  ellipsis: {
    fontSize: 16,
    color: '#666',
    marginHorizontal: 4,
  },
});