import React from 'react';
import { StyleSheet, View } from 'react-native';
import Skeleton from './Skeleton';

const OrderCardSkeleton = () => {
  return (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View style={styles.orderHeaderLeft}>
          <Skeleton width={20} height={20} borderRadius={10} />
          <View style={{ marginLeft: 12 }}>
            <Skeleton width={120} height={18} borderRadius={4} style={{ marginBottom: 6 }} />
            <Skeleton width={100} height={14} borderRadius={4} />
          </View>
        </View>
        <Skeleton width={80} height={28} borderRadius={16} />
      </View>

      <View style={styles.orderItems}>
        {[1, 2, 3].map((index) => (
          <View key={index} style={styles.productItem}>
            <Skeleton width={50} height={50} borderRadius={8} />
            <View style={styles.productInfo}>
              <Skeleton width="70%" height={16} borderRadius={4} style={{ marginBottom: 6 }} />
              <Skeleton width={60} height={14} borderRadius={4} />
            </View>
          </View>
        ))}
      </View>

      <View style={styles.orderFooter}>
        <Skeleton width={60} height={18} borderRadius={4} />
        <Skeleton width={100} height={24} borderRadius={4} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  orderHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  orderItems: {
    marginBottom: 16,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
});

export default OrderCardSkeleton;
