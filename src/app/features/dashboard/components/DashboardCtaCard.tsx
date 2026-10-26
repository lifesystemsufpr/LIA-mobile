import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import { Play, Plus } from 'lucide-react-native';

export type DashboardCtaCardProps = {
  onStartAssessment: () => void;
};

export const DashboardCtaCard: React.FC<DashboardCtaCardProps> = ({
  onStartAssessment,
}) => {
  return (
    <View style={styles.cardContainer}>
      <Svg
        style={styles.svgBackground}
        width="100%"
        height="100%"
        preserveAspectRatio="none"
      >
        <Defs>
          <LinearGradient id="ctaBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#1E4ED8" />
            <Stop offset="45%" stopColor="#183EA6" />
            <Stop offset="100%" stopColor="#0E1E47" />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" rx={20} fill="url(#ctaBg)" />
        <Path
          d="M 230 200 L 290 40 L 350 200"
          stroke="rgba(10, 24, 66, 0.45)"
          strokeWidth="18"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <Path
          d="M 252 135 L 328 135"
          stroke="rgba(10, 24, 66, 0.45)"
          strokeWidth="16"
          strokeLinecap="round"
          fill="none"
        />
      </Svg>

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.iconBadge}>
            <Plus size={18} color="#FFFFFF" strokeWidth={2.6} />
          </View>
          <Text style={styles.title}>Nova avaliação</Text>
        </View>

        <Text style={styles.description}>
          Inicie uma nova coleta de dados funcionais do participante.
        </Text>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onStartAssessment}
          style={styles.button}
        >
          <Play size={15} color="#091223" strokeWidth={2.4} />
          <Text style={styles.buttonText}>Iniciar avaliação</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#1E4ED8',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 5,
    position: 'relative',
  },
  svgBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  iconBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  description: {
    fontSize: 13.5,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 19,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#091223',
  },
});
