import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Skeleton from './Skeleton';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.65;
const CARD_MARGIN = 12;

const SliderCardSkeleton = () => {
  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Skeleton width="80%" height="80%" borderRadius={8} />
        <View style={styles.badge}>
          <Skeleton width={70} height={20} borderRadius={12} />
        </View>
      </View>

      <View style={styles.cardContent}>
        <Skeleton width={60} height={12} borderRadius={4} style={{ marginBottom: 4 }} />
        <Skeleton width="100%" height={20} borderRadius={4} style={{ marginBottom: 4 }} />
        <Skeleton width="90%" height={20} borderRadius={4} style={{ marginBottom: 8 }} />

        <View style={styles.ratingContainer}>
          <Skeleton width={80} height={12} borderRadius={4} />
          <Skeleton width={50} height={12} borderRadius={4} style={{ marginLeft: 6 }} />
        </View>

        <View style={styles.priceContainer}>
          <Skeleton width={80} height={24} borderRadius={4} />
          <Skeleton width={24} height={24} borderRadius={12} />
        </View>
      </View>

      <View style={styles.cardFooter}>
        <Skeleton width={80} height={12} borderRadius={4} />
        <View style={styles.footerDot} />
        <Skeleton width={90} height={12} borderRadius={4} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: CARD_MARGIN,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    overflow: 'hidden',
  },
  imageContainer: {
    height: 160,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 12,
    left: 12,
  },
  cardContent: {
    padding: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FAFAFA',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    gap: 8,
  },
  footerDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#E0E0E0',
  },
});

export default SliderCardSkeleton;




