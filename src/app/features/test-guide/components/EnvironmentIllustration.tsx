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

export const EnvironmentIllustration: React.FC = () => {
  return (
    <View style={styles.container}>
      <Svg width="100%" height="100%" viewBox="0 0 320 230">
        <Defs>
          <LinearGradient id="bgGlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#E9F1FF" stopOpacity="0.8" />
            <Stop offset="100%" stopColor="#F5F8FF" stopOpacity="0.2" />
          </LinearGradient>
          <LinearGradient id="chairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#2962FF" />
            <Stop offset="100%" stopColor="#0D1B3D" />
          </LinearGradient>
          <LinearGradient id="badgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#2962FF" />
            <Stop offset="100%" stopColor="#1E4ED8" />
          </LinearGradient>
        </Defs>

        {/* Soft background glow */}
        <Circle cx="160" cy="115" r="95" fill="url(#bgGlow)" />

        {/* Clearance / Free Space Perimeter (Dashed Ellipse) */}
        <Path
          d="M 50 190 C 50 160, 270 160, 270 190 C 270 215, 50 215, 50 190 Z"
          fill="none"
          stroke="#5C8DFF"
          strokeWidth="2"
          strokeDasharray="6 6"
          opacity={0.7}
        />

        {/* Ground Surface Line */}
        <Line x1="30" y1="192" x2="290" y2="192" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" />

        {/* Free space clearance indicators (<-- Espaço Livre -->) */}
        <G opacity={0.85}>
          {/* Left Arrow */}
          <Path d="M 58 178 L 44 178 M 50 173 L 44 178 L 50 183" stroke="#2962FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {/* Right Arrow */}
          <Path d="M 262 178 L 276 178 M 270 173 L 276 178 L 270 183" stroke="#2962FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {/* Clearance tick dots */}
          <Circle cx="80" cy="178" r="2.5" fill="#5C8DFF" />
          <Circle cx="240" cy="178" r="2.5" fill="#5C8DFF" />
        </G>

        {/* Chair Shadow */}
        <Path
          d="M 125 192 C 125 188, 195 188, 195 192 C 195 196, 125 196, 125 192 Z"
          fill="#0D1B3D"
          opacity={0.12}
        />

        {/* Armless Sturdy Chair (Lateral / Side View) */}
        <G>
          {/* Back Chair Legs (slightly darker for depth) */}
          {/* Rear Leg (back) */}
          <Line x1="140" y1="130" x2="133" y2="192" stroke="#475569" strokeWidth="6.5" strokeLinecap="round" />
          <Rect x="129" y="189" width="8" height="4" rx="2" fill="#0D1B3D" />

          {/* Front Leg (back) */}
          <Line x1="178" y1="130" x2="182" y2="192" stroke="#475569" strokeWidth="6.5" strokeLinecap="round" />
          <Rect x="178" y="189" width="8" height="4" rx="2" fill="#0D1B3D" />

          {/* Seat Cushion (Horizontal Sturdy Base) */}
          <Rect
            x="130"
            y="124"
            width="58"
            height="12"
            rx="5"
            fill="url(#chairGrad)"
          />
          {/* Seat top highlight */}
          <Rect
            x="132"
            y="125"
            width="54"
            height="3"
            rx="1.5"
            fill="#5C8DFF"
            opacity={0.7}
          />

          {/* Chair Backrest (Vertical / Slightly Tilted, No Arms!) */}
          <Path
            d="M 136 126 L 140 54"
            stroke="#0D1B3D"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Padded backrest strip */}
          <Rect
            x="134"
            y="54"
            width="10"
            height="46"
            rx="4"
            fill="url(#chairGrad)"
          />
          <Rect
            x="135.5"
            y="56"
            width="3"
            height="42"
            rx="1.5"
            fill="#5C8DFF"
            opacity={0.8}
          />

          {/* Front Chair Legs (Foreground, Navy Blue) */}
          {/* Rear Leg (front) */}
          <Line x1="144" y1="134" x2="137" y2="192" stroke="#0D1B3D" strokeWidth="7" strokeLinecap="round" />
          <Rect x="133" y="189" width="9" height="4.5" rx="2" fill="#2962FF" />

          {/* Front Leg (front) */}
          <Line x1="182" y1="134" x2="186" y2="192" stroke="#0D1B3D" strokeWidth="7" strokeLinecap="round" />
          <Rect x="182" y="189" width="9" height="4.5" rx="2" fill="#2962FF" />

          {/* Under-seat structural bracket */}
          <Line x1="144" y1="136" x2="182" y2="136" stroke="#0D1B3D" strokeWidth="4.5" strokeLinecap="round" />
        </G>

        {/* Feature Tag: "Sem braços" callout */}
        <G transform="translate(196, 68)">
          <Rect x="0" y="0" width="86" height="24" rx="12" fill="#FFFFFF" stroke="#E4E7EC" strokeWidth="1.5" />
          {/* Check icon circle */}
          <Circle cx="12" cy="12" r="7" fill="#22C55E" />
          <Path d="M 9 12 L 11 14 L 15 10" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <SvgText x="25" y="15" fill="#172033" fontSize="9.5" fontWeight="bold">
            Sem braços
          </SvgText>
        </G>

        {/* Feature Tag: "Superfície firme" callout */}
        <G transform="translate(38, 92)">
          <Rect x="0" y="0" width="92" height="24" rx="12" fill="#FFFFFF" stroke="#E4E7EC" strokeWidth="1.5" />
          <Circle cx="12" cy="12" r="7" fill="#2962FF" />
          <Path d="M 9 12 L 11 14 L 15 10" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <SvgText x="25" y="15" fill="#172033" fontSize="9.5" fontWeight="bold">
            Base estável
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
