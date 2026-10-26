import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

export type DonutSegment = {
  value: number;
  color: string;
};

export type DonutChartProps = {
  size?: number;
  strokeWidth?: number;
  segments: DonutSegment[];
  centerIcon?: React.ReactNode;
};

export const DonutChart: React.FC<DonutChartProps> = ({
  size = 88,
  strokeWidth = 16,
  segments,
  centerIcon,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  const total = segments.reduce((acc, curr) => acc + curr.value, 0) || 1;

  let currentOffset = 0;
  const renderedSegments = segments.map((segment) => {
    const percentage = segment.value / total;
    const strokeDasharray = `${percentage * circumference} ${circumference}`;
    const strokeDashoffset = -currentOffset;
    currentOffset += percentage * circumference;

    return {
      color: segment.color,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  const innerCircleSize = size - strokeWidth * 2 - 2;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <G rotation="-90" origin={`${center}, ${center}`}>
          {renderedSegments.map((seg, idx) => (
            <Circle
              key={idx}
              cx={center}
              cy={center}
              r={radius}
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeDasharray={seg.strokeDasharray}
              strokeDashoffset={seg.strokeDashoffset}
              fill="none"
              strokeLinecap="butt"
            />
          ))}
        </G>
      </Svg>
      {centerIcon && (
        <View
          style={[
            styles.centerCircle,
            {
              width: innerCircleSize,
              height: innerCircleSize,
              borderRadius: innerCircleSize / 2,
            },
          ]}
        >
          {centerIcon}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  centerCircle: {
    position: 'absolute',
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
