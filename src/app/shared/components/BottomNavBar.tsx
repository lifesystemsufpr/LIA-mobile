import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Spacing, Typography } from '../theme';

export type TabItem = {
  key: string;
  label: string;
  icon: (focused: boolean) => React.ReactNode;
};

export type BottomNavBarProps = {
  tabs: TabItem[];
  activeKey: string;
  onTabPress: (key: string) => void;
};

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  tabs,
  activeKey,
  onTabPress,
}) => {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isFocused = tab.key === activeKey;
        return (
          <TouchableOpacity
            key={tab.key}
            activeOpacity={0.7}
            onPress={() => onTabPress(tab.key)}
            style={styles.tabButton}
          >
            <View style={[styles.indicator, isFocused && styles.indicatorActive]} />
            <View style={styles.iconWrapper}>{tab.icon(isFocused)}</View>
            <Text style={[styles.label, isFocused && styles.labelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 68,
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingBottom: 4,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  indicator: {
    position: 'absolute',
    top: 0,
    width: 32,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'transparent',
  },
  indicatorActive: {
    backgroundColor: Colors.primaryDark,
  },
  iconWrapper: {
    marginTop: 4,
    marginBottom: 2,
  },
  label: {
    fontSize: 10,
    fontWeight: Typography.weights.medium,
    color: Colors.textMuted,
  },
  labelActive: {
    color: Colors.primaryDark,
    fontWeight: Typography.weights.bold,
  },
});
