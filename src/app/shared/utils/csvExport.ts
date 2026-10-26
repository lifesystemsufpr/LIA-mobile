import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Alert, Share } from 'react-native';
import { SensorSample } from '../types';

/**
 * Formata as amostras inerciais no formato CSV exigido:
 * timestamp,accel_x,accel_y,accel_z,gyro_x,gyro_y,gyro_z
 */
export const formatSensorSamplesCsv = (samples: SensorSample[]): string => {
  const header = 'timestamp,accel_x,accel_y,accel_z,gyro_x,gyro_y,gyro_z';

  if (!samples || samples.length === 0) {
    return `${header}\n`;
  }

  const rows = samples.map((sample) => {
    let isoTimestamp: string;
    try {
      if (typeof sample.timestamp === 'number') {
        isoTimestamp = new Date(sample.timestamp).toISOString();
      } else {
        isoTimestamp = new Date(String(sample.timestamp)).toISOString();
      }
    } catch {
      isoTimestamp = new Date().toISOString();
    }

    const accelX = sample.accelerationX ?? 0;
    const accelY = sample.accelerationY ?? 0;
    const accelZ = sample.accelerationZ ?? 0;
    const gyroX = sample.gyroscopeX ?? 0;
    const gyroY = sample.gyroscopeY ?? 0;
    const gyroZ = sample.gyroscopeZ ?? 0;

    return `${isoTimestamp},${accelX},${accelY},${accelZ},${gyroX},${gyroY},${gyroZ}`;
  });

  return [header, ...rows].join('\n');
};

/**
 * Salva o CSV localmente e abre o compartilhamento nativo (WhatsApp, etc.)
 */
export const exportAndShareCsv = async (
  csvContent: string,
  filename: string,
  dialogTitle = 'Compartilhar dados via WhatsApp'
): Promise<boolean> => {
  try {
    const baseDir = FileSystem.cacheDirectory ?? FileSystem.documentDirectory;
    if (!baseDir) {
      throw new Error('Diretório de armazenamento não disponível no dispositivo.');
    }

    const fileUri = `${baseDir}${filename}`;
    await FileSystem.writeAsStringAsync(fileUri, csvContent, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/csv',
        dialogTitle,
        UTI: 'public.comma-separated-values-text',
      });
      return true;
    }

    // Fallback caso o módulo de compartilhamento de arquivo não esteja disponível
    await Share.share({
      title: dialogTitle,
      message: csvContent,
    });
    return true;
  } catch (error) {
    Alert.alert(
      'Erro no Compartilhamento',
      'Não foi possível salvar ou compartilhar o arquivo CSV. Tente novamente.'
    );
    return false;
  }
};
