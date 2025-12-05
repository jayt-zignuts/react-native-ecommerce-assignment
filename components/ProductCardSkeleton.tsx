import React from 'react';
import { StyleSheet, View } from 'react-native';
import Skeleton from './Skeleton';

const ProductCardSkeleton = () => {
  return (
    <View style={styles.card}>
      <View style={styles.cardAccent} />
      
      <View style={styles.imageContainer}>
        <Skeleton width="100%" height={100} borderRadius={8} />
        <View style={styles.categoryBadge}>
          <Skeleton width={60} height={16} borderRadius={10} />
        </View>
        <View style={styles.ratingBadge}>
          <Skeleton width={40} height={16} borderRadius={8} />
        </View>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Skeleton width="70%" height={20} borderRadius={4} />
          <Skeleton width={28} height={28} borderRadius={14} />
        </View>

        <View style={styles.ratingRow}>
          <Skeleton width={80} height={12} borderRadius={4} />
          <Skeleton width={40} height={12} borderRadius={4} style={{ marginLeft: 8 }} />
        </View>

        <Skeleton width="100%" height={32} borderRadius={4} style={{ marginBottom: 8 }} />
        <Skeleton width="90%" height={32} borderRadius={4} style={{ marginBottom: 12 }} />

        <View style={styles.footer}>
          <View>
            <Skeleton width={80} height={24} borderRadius={4} />
            <Skeleton width={70} height={14} borderRadius={4} style={{ marginTop: 4 }} />
          </View>
          <Skeleton width={44} height={44} borderRadius={22} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    overflow: 'hidden',
    position: 'relative',
  },
  cardAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 4,
    height: '100%',
    backgroundColor: '#E0E0E0',
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  imageContainer: {
    width: 120,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    position: 'relative',
  },
  categoryBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
  },
  ratingBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
    paddingLeft: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
});

export default ProductCardSkeleton;




