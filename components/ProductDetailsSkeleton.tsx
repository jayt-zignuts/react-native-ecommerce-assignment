import React from 'react';
import { StyleSheet, View } from 'react-native';
import Skeleton from './Skeleton';

const ProductDetailsSkeleton = () => {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <Skeleton width={40} height={40} borderRadius={20} />
          <Skeleton width={150} height={20} borderRadius={4} />
        </View>
      </View>

      <View style={styles.imageContainer}>
        <Skeleton width="80%" height="80%" borderRadius={8} />
        <View style={styles.ratingBadge}>
          <Skeleton width={100} height={24} borderRadius={12} />
        </View>
        <View style={styles.wishlistBtn}>
          <Skeleton width={28} height={28} borderRadius={14} />
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.infoRow}>
          <Skeleton width={100} height={28} borderRadius={16} />
          <Skeleton width={120} height={16} borderRadius={4} />
        </View>

        <Skeleton width="100%" height={28} borderRadius={4} style={{ marginBottom: 8 }} />
        <Skeleton width="90%" height={28} borderRadius={4} style={{ marginBottom: 16 }} />

        <View style={styles.priceSection}>
          <Skeleton width={120} height={40} borderRadius={4} />
          <Skeleton width={100} height={28} borderRadius={16} />
        </View>

        <View style={styles.descriptionContainer}>
          <Skeleton width={120} height={24} borderRadius={4} style={{ marginBottom: 12 }} />
          <Skeleton width="100%" height={16} borderRadius={4} style={{ marginBottom: 8 }} />
          <Skeleton width="100%" height={16} borderRadius={4} style={{ marginBottom: 8 }} />
          <Skeleton width="80%" height={16} borderRadius={4} />
        </View>

        <View style={styles.featuresContainer}>
          <Skeleton width={100} height={24} borderRadius={4} style={{ marginBottom: 12 }} />
          <Skeleton width="100%" height={20} borderRadius={4} style={{ marginBottom: 10 }} />
          <Skeleton width="100%" height={20} borderRadius={4} style={{ marginBottom: 10 }} />
          <Skeleton width="90%" height={20} borderRadius={4} />
        </View>

        <View style={styles.actionButtons}>
          <Skeleton width="48%" height={52} borderRadius={12} />
          <Skeleton width="48%" height={52} borderRadius={12} />
        </View>

        <View style={styles.infoContainer}>
          <Skeleton width="100%" height={60} borderRadius={12} style={{ marginBottom: 16 }} />
          <Skeleton width="100%" height={60} borderRadius={12} style={{ marginBottom: 16 }} />
          <Skeleton width="100%" height={60} borderRadius={12} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  imageContainer: {
    height: 320,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  ratingBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  wishlistBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  content: {
    padding: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  featuresContainer: {
    marginBottom: 24,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  infoContainer: {
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
});

export default ProductDetailsSkeleton;




