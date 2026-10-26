import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  G,
  Line,
  LinearGradient,
  Path,
  Rect,
  Stop,
  Text as SvgText,
} from 'react-native-svg';

export const ParticipantPositionIllustration: React.FC = () => {
  return (
    <View style={styles.container}>
      <Svg width="100%" height="100%" viewBox="0 0 320 230">
        <Defs>
          <LinearGradient id="posGlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#EBF2FF" stopOpacity="0.8" />
            <Stop offset="100%" stopColor="#F8FAFC" stopOpacity="0.2" />
          </LinearGradient>
          <LinearGradient id="phoneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#091223" />
            <Stop offset="100%" stopColor="#1E293B" />
          </LinearGradient>
          <LinearGradient id="chestGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#2962FF" stopOpacity="0.25" />
            <Stop offset="100%" stopColor="#5C8DFF" stopOpacity="0.05" />
          </LinearGradient>
        </Defs>

        {/* Backdrop circle */}
        <Circle cx="160" cy="115" r="95" fill="url(#posGlow)" />

        {/* Floor Line */}
        <Line x1="40" y1="200" x2="280" y2="200" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" />

        {/* Chair Shadow & Feet Shadow */}
        <Path d="M 85 200 C 85 197, 140 197, 140 200 Z" fill="#0D1B3D" opacity={0.12} />
        <Path d="M 185 200 C 185 197, 220 197, 220 200 Z" fill="#0D1B3D" opacity={0.12} />

        {/* Armless Chair (side view) */}
        <G opacity={0.9}>
          {/* Chair Legs */}
          <Line x1="100" y1="148" x2="94" y2="200" stroke="#64748B" strokeWidth="5.5" strokeLinecap="round" />
          <Line x1="135" y1="148" x2="138" y2="200" stroke="#64748B" strokeWidth="5.5" strokeLinecap="round" />
          {/* Chair Backrest */}
          <Path d="M 98 148 L 96 82" stroke="#475569" strokeWidth="7" strokeLinecap="round" />
          {/* Chair Seat */}
          <Rect x="92" y="144" width="48" height="9" rx="4" fill="#334155" />
        </G>

        {/* Sitting Participant Figure (Upright Posture, ~90° angles) */}
        <G>
          {/* Head */}
          <Circle cx="132" cy="52" r="16" fill="#0D1B3D" />

          {/* Neck */}
          <Path d="M 130 67 L 130 76" stroke="#0D1B3D" strokeWidth="8" strokeLinecap="round" />

          {/* Torso (Ergonomic Upright) */}
          <Path
            d="M 126 76 L 126 142 L 146 142 L 148 76 Z"
            fill="#0D1B3D"
          />

          {/* Pelvis / Thigh (horizontal sitting, knees at 90°) */}
          <Path
            d="M 122 136 L 180 136 C 186 136, 188 140, 188 146 L 188 152 L 130 152 Z"
            fill="#0D1B3D"
          />

          {/* Lower Legs (vertical, knees to floor) */}
          <Path
            d="M 180 146 L 180 196"
            stroke="#0D1B3D"
            strokeWidth="15"
            strokeLinecap="round"
          />

          {/* Feet (flat on the floor) */}
          <Path
            d="M 174 196 L 208 196 C 212 196, 212 200, 206 200 L 174 200 Z"
            fill="#2962FF"
          />

          {/* Elastic Chest Harness / Strap around thorax */}
          <Path
            d="M 124 94 L 152 94"
            stroke="#5C8DFF"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <Path
            d="M 124 116 L 152 116"
            stroke="#5C8DFF"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* Crossed Arms over Chest (Crucial detail: 'X' position, hands NOT on phone) */}
          {/* Arm 1 (from shoulder across chest) */}
          <Path
            d="M 128 82 C 144 88, 158 98, 150 112 C 146 118, 134 114, 132 108"
            fill="none"
            stroke="#1E3A8A"
            strokeWidth="11"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Arm 2 (crossing over opposite arm, hands resting on shoulders/arms) */}
          <Path
            d="M 130 84 C 146 102, 142 114, 154 104 C 160 98, 152 90, 142 86"
            fill="none"
            stroke="#2962FF"
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Sensor Glow on Sternum */}
          <Circle cx="156" cy="104" r="28" fill="url(#chestGlow)" />
          <Circle cx="156" cy="104" r="22" stroke="#2962FF" strokeWidth="1" strokeDasharray="3 3" fill="none" opacity={0.6} />

          {/* Smartphone Mounted Vertically on Sternum */}
          <G transform="translate(148, 86)">
            {/* Phone casing */}
            <Rect
              x="0"
              y="0"
              width="18"
              height="36"
              rx="4"
              fill="url(#phoneGrad)"
              stroke="#2962FF"
              strokeWidth="2"
            />
            {/* Phone screen highlight */}
            <Rect x="2.5" y="4" width="13" height="28" rx="2" fill="#1E293B" />
            {/* Speaker line */}
            <Line x1="6" y1="2" x2="12" y2="2" stroke="#94A3B8" strokeWidth="1" strokeLinecap="round" />
            {/* Vertical orientation arrow on screen */}
            <Path d="M 9 24 L 9 12 M 6.5 15 L 9 12 L 11.5 15" stroke="#5C8DFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </G>
        </G>

        {/* Callout Tag: "Esterno (Vertical)" */}
        <G transform="translate(182, 74)">
          <Path d="M 0 16 L -14 26" stroke="#2962FF" strokeWidth="1.5" strokeDasharray="3 3" />
          <Rect x="0" y="4" width="124" height="26" rx="13" fill="#FFFFFF" stroke="#2962FF" strokeWidth="1.5" />
          <Circle cx="14" cy="17" r="8" fill="#EFF6FF" />
          <Path d="M 14 21 L 14 13 M 11.5 15.5 L 14 13 L 16.5 15.5" stroke="#2962FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <SvgText x="28" y="20.5" fill="#0D1B3D" fontSize="10" fontWeight="bold">
            Esterno • Vertical
          </SvgText>
        </G>

        {/* Callout Tag: "Braços cruzados" */}
        <G transform="translate(16, 102)">
          <Rect x="0" y="0" width="102" height="24" rx="12" fill="#FFFFFF" stroke="#E4E7EC" strokeWidth="1.5" />
          <Circle cx="12" cy="12" r="7" fill="#22C55E" />
          <Path d="M 9 12 L 11 14 L 15 10" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <SvgText x="25" y="15" fill="#172033" fontSize="9" fontWeight="bold">
            Braços cruzados
          </SvgText>
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
