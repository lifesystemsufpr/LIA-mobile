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

export const MovementExecutionIllustration: React.FC = () => {
  return (
    <View style={styles.container}>
      <Svg width="100%" height="100%" viewBox="0 0 320 230">
        <Defs>
          <LinearGradient id="movGlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#EBF2FF" stopOpacity="0.9" />
            <Stop offset="100%" stopColor="#F8FAFC" stopOpacity="0.2" />
          </LinearGradient>
          <LinearGradient id="timerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#2962FF" />
            <Stop offset="100%" stopColor="#0D1B3D" />
          </LinearGradient>
        </Defs>

        {/* Soft background glow */}
        <Circle cx="160" cy="115" r="95" fill="url(#movGlow)" />

        {/* Floor Line */}
        <Line x1="20" y1="200" x2="300" y2="200" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" />

        {/* Floor Shadows */}
        <Path d="M 50 200 C 50 197, 110 197, 110 200 Z" fill="#0D1B3D" opacity={0.12} />
        <Path d="M 210 200 C 210 197, 260 197, 260 200 Z" fill="#0D1B3D" opacity={0.12} />

        {/* LEFT FIGURE: Seated on Chair */}
        <G transform="translate(-10, 0)">
          {/* Chair */}
          <Line x1="56" y1="156" x2="52" y2="200" stroke="#64748B" strokeWidth="4.5" strokeLinecap="round" />
          <Line x1="84" y1="156" x2="86" y2="200" stroke="#64748B" strokeWidth="4.5" strokeLinecap="round" />
          <Path d="M 54 156 L 52 108" stroke="#475569" strokeWidth="5.5" strokeLinecap="round" />
          <Rect x="50" y="152" width="38" height="7" rx="3" fill="#334155" />

          {/* Seated Participant */}
          {/* Head */}
          <Circle cx="80" cy="84" r="13" fill="#0D1B3D" />
          {/* Neck */}
          <Path d="M 79 97 L 79 104" stroke="#0D1B3D" strokeWidth="6" strokeLinecap="round" />
          {/* Torso */}
          <Path d="M 75 104 L 75 152 L 91 152 L 92 104 Z" fill="#0D1B3D" />
          {/* Thigh */}
          <Path d="M 74 148 L 118 148 C 122 148, 124 151, 124 156 L 78 156 Z" fill="#0D1B3D" />
          {/* Lower leg */}
          <Path d="M 118 156 L 118 196" stroke="#0D1B3D" strokeWidth="12" strokeLinecap="round" />
          {/* Foot */}
          <Path d="M 114 196 L 138 196 C 141 196, 141 200, 137 200 L 114 200 Z" fill="#2962FF" />

          {/* Crossed Arms */}
          <Path
            d="M 76 110 C 88 116, 102 122, 94 132 C 90 136, 82 133, 80 128"
            fill="none"
            stroke="#1E3A8A"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <Path
            d="M 78 112 C 90 126, 86 135, 96 127 C 100 123, 94 116, 86 113"
            fill="none"
            stroke="#2962FF"
            strokeWidth="7"
            strokeLinecap="round"
          />

          {/* Smartphone on Sternum */}
          <Rect x="90" y="112" width="9" height="18" rx="2" fill="#091223" stroke="#2962FF" strokeWidth="1.5" />
          {/* Mini label below */}
          <SvgText x="82" y="214" fill="#64748B" fontSize="9" fontWeight="600" textAnchor="middle">
            1. Sentar
          </SvgText>
        </G>

        {/* RIGHT FIGURE: Standing Fully Erect */}
        <G transform="translate(15, 0)">
          {/* Head */}
          <Circle cx="230" cy="54" r="13" fill="#0D1B3D" />
          {/* Neck */}
          <Path d="M 230 67 L 230 74" stroke="#0D1B3D" strokeWidth="6" strokeLinecap="round" />
          {/* Torso */}
          <Path d="M 223 74 L 223 126 L 239 126 L 241 74 Z" fill="#0D1B3D" />
          {/* Hips & Fully Extended Legs */}
          <Path d="M 225 124 L 225 196" stroke="#0D1B3D" strokeWidth="12" strokeLinecap="round" />
          <Path d="M 237 124 L 237 196" stroke="#0D1B3D" strokeWidth="12" strokeLinecap="round" />
          {/* Feet */}
          <Path d="M 220 196 L 246 196 C 249 196, 249 200, 245 200 L 220 200 Z" fill="#2962FF" />

          {/* Crossed Arms */}
          <Path
            d="M 224 80 C 236 86, 250 92, 242 102 C 238 106, 230 103, 228 98"
            fill="none"
            stroke="#1E3A8A"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <Path
            d="M 226 82 C 238 96, 234 105, 244 97 C 248 93, 242 86, 234 83"
            fill="none"
            stroke="#2962FF"
            strokeWidth="7"
            strokeLinecap="round"
          />

          {/* Smartphone on Sternum */}
          <Rect x="238" y="82" width="9" height="18" rx="2" fill="#091223" stroke="#2962FF" strokeWidth="1.5" />
          {/* Mini label below */}
          <SvgText x="234" y="214" fill="#64748B" fontSize="9" fontWeight="600" textAnchor="middle">
            2. Levantar
          </SvgText>
        </G>

        {/* DYNAMIC CYCLE ARROWS (Connecting Sit <-> Stand) */}
        {/* Upward motion arrow (Sentar -> Levantar) */}
        <G>
          <Path
            d="M 125 118 C 145 74, 180 68, 210 76"
            fill="none"
            stroke="#2962FF"
            strokeWidth="3"
            strokeDasharray="5 4"
            strokeLinecap="round"
          />
          {/* Arrowhead */}
          <Path
            d="M 204 70 L 213 77 L 203 82"
            fill="none"
            stroke="#2962FF"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </G>

        {/* Downward motion arrow (Levantar -> Sentar) */}
        <G>
          <Path
            d="M 215 150 C 190 180, 150 178, 126 156"
            fill="none"
            stroke="#5C8DFF"
            strokeWidth="3"
            strokeDasharray="5 4"
            strokeLinecap="round"
          />
          {/* Arrowhead */}
          <Path
            d="M 134 153 L 123 154 L 130 163"
            fill="none"
            stroke="#5C8DFF"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </G>

        {/* STYLIZED 30-SECOND STOPWATCH BADGE (Center Top) */}
        <G transform="translate(160, 48)">
          {/* Stopwatch Top Crown Button */}
          <Rect x="-4" y="-31" width="8" height="5" rx="2" fill="#0D1B3D" />
          <Rect x="-6" y="-33" width="12" height="3" rx="1.5" fill="#2962FF" />

          {/* Outer Watch Bezel */}
          <Circle cx="0" cy="-6" r="24" fill="#FFFFFF" stroke="#0D1B3D" strokeWidth="3" />
          <Circle cx="0" cy="-6" r="20" fill="#F0F4FF" />

          {/* 30s Progress Arc (half circle highlighted) */}
          <Path
            d="M 0 -26 A 20 20 0 0 1 0 14"
            fill="none"
            stroke="#2962FF"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* "30s" Text */}
          <SvgText
            x="0"
            y="-1"
            fill="#0D1B3D"
            fontSize="12.5"
            fontWeight="900"
            textAnchor="middle"
          >
            30s
          </SvgText>

          {/* Subtle indicator dots */}
          <Circle cx="0" cy="-22" r="1.5" fill="#2962FF" />
          <Circle cx="16" cy="-6" r="1.5" fill="#2962FF" />
          <Circle cx="0" cy="10" r="1.5" fill="#2962FF" />
        </G>

        {/* Badge: "Repetições máximas" */}
        <G transform="translate(112, 10)">
          <Rect x="0" y="0" width="96" height="20" rx="10" fill="#FFFFFF" stroke="#E4E7EC" strokeWidth="1" />
          <Circle cx="10" cy="10" r="5" fill="#22C55E" />
          <SvgText x="52" y="13.5" fill="#172033" fontSize="8.5" fontWeight="bold" textAnchor="middle">
            Ciclo contínuo
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
