import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

export const AppTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const itemStyle = options.tabBarItemStyle as { display?: string } | undefined;
        if (itemStyle?.display === 'none') {
          return null;
        }

        const label =
          options.tabBarLabel !== undefined
            ? (options.tabBarLabel as string)
            : options.title !== undefined
            ? options.title
            : route.name;


        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const Icon = options.tabBarIcon;

        return (
          <TouchableOpacity
            key={route.key}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            style={styles.tabButton}
          >
            <View style={[styles.indicator, isFocused && styles.indicatorActive]} />
            <View style={styles.iconWrapper}>
              {Icon ? Icon({ focused: isFocused, color: isFocused ? '#091223' : '#667085', size: 20 }) : null}
            </View>
            <Text
              style={[styles.label, isFocused && styles.labelActive]}
              numberOfLines={1}
            >
              {label}
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
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E4E7EC',
    paddingBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingHorizontal: 2,
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
    backgroundColor: '#091223',
  },
  iconWrapper: {
    marginTop: 4,
    marginBottom: 2,
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
    color: '#667085',
  },
  labelActive: {
    color: '#091223',
    fontWeight: '700',
  },
});
