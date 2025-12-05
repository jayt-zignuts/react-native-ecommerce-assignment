import React from 'react';
import { StyleSheet, View } from 'react-native';
import Skeleton from './Skeleton';

const FavouriteCardSkeleton = () => {
  return (
    <View style={styles.favItem}>
      <View style={styles.imageContainer}>
        <Skeleton width="80%" height="80%" borderRadius={8} />
        <View style={styles.imageOverlay}>
          <Skeleton width={36} height={36} borderRadius={18} />
        </View>
      </View>

      <View style={styles.itemDetails}>
        <View style={styles.itemHeader}>
          <Skeleton width={70} height={20} borderRadius={10} />
          <Skeleton width={50} height={18} borderRadius={8} />
        </View>

        <Skeleton width="100%" height={18} borderRadius={4} style={{ marginBottom: 4 }} />
        <Skeleton width="90%" height={18} borderRadius={4} style={{ marginBottom: 8 }} />

        <View style={styles.ratingRow}>
          <Skeleton width={80} height={12} borderRadius={4} />
          <Skeleton width={30} height={12} borderRadius={4} style={{ marginLeft: 4 }} />
        </View>

        <View style={styles.priceRow}>
          <Skeleton width={80} height={24} borderRadius={4} />
          <Skeleton width={60} height={20} borderRadius={8} />
        </View>

        <Skeleton width="100%" height={36} borderRadius={8} style={{ marginTop: 12 }} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  favItem: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  imageContainer: {
    height: 140,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  imageOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  itemDetails: {
    padding: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
});

export default FavouriteCardSkeleton;




