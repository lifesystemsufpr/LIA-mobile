import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';

export type NavigationHeaderProps = {
  title: string;
  subtitle?: string;
  canGoBack?: boolean;
  onGoBack?: () => void;
  rightAction?: React.ReactNode;
};

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  title,
  subtitle,
  canGoBack,
  onGoBack,
  rightAction,
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.left}>
        {canGoBack && onGoBack ? (
          <TouchableOpacity activeOpacity={0.7} onPress={onGoBack} style={styles.backBtn}>
            <ArrowLeft size={20} color="#172033" />
          </TouchableOpacity>
        ) : null}
      </View>
      <View style={styles.center}>
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
        {subtitle ? (
          <Text numberOfLines={1} style={styles.subtitle}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <View style={styles.right}>{rightAction}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E4E7EC',
  },
  left: {
    width: 44,
    alignItems: 'flex-start',
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  right: {
    width: 44,
    alignItems: 'flex-end',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F7F9FC',
    borderWidth: 1,
    borderColor: '#E4E7EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#091223',
  },
  subtitle: {
    fontSize: 11,
    color: '#667085',
  },
});
