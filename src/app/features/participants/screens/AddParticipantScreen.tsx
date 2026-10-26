import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  X,
} from 'lucide-react-native';
import {
  BiologicalSex,
  BorderRadius,
  Button,
  Colors,
  createId,
  FormField,
  Participant,
  Spacing,
  Typography,
} from '../../../shared';
import { useParticipants } from '../hooks/useParticipants';

export type AddParticipantScreenProps = {
  onSuccess?: (newParticipant: Participant) => void;
  onCancel?: () => void;
};

type StepInfo = {
  id: number;
  title: string;
  shortTitle: string;
};

const STEPS: StepInfo[] = [
  { id: 1, title: 'Dados Pessoais', shortTitle: 'Pessoal' },
  { id: 2, title: 'Medidas Corporais', shortTitle: 'Medidas' },
  { id: 3, title: 'Escolaridade', shortTitle: 'Escolaridade' },
  { id: 4, title: 'Dados Socioeconômicos', shortTitle: 'Social' },
  { id: 5, title: 'Endereço Completo', shortTitle: 'Endereço' },
];

const EDUCATION_OPTIONS = [
  'Não alfabetizado',
  'Fundamental Incompleto',
  'Fundamental Completo',
  'Ensino Médio Incompleto',
  'Ensino Médio Completo',
  'Superior Incompleto',
  'Superior Completo',
  'Pós-Graduação',
];

const SOCIOECONOMIC_CLASSES = [
  'Classe A (Mais de 20 salários mínimos)',
  'Classe B (10 a 20 salários mínimos)',
  'Classe C (4 a 10 salários mínimos)',
  'Classe D (2 a 4 salários mínimos)',
  'Classe E (Até 2 salários mínimos)',
];

const SEX_OPTIONS: { key: BiologicalSex; label: string }[] = [
  { key: 'male', label: 'Masculino' },
  { key: 'female', label: 'Feminino' },
];

const applyCpfMask = (val: string): string => {
  const digits = val.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
};

const applyDateMask = (val: string): string => {
  const digits = val.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
};

const applyCepMask = (val: string): string => {
  const digits = val.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
};

const parseDateToIso = (dateStr: string): string => {
  const trimmed = dateStr.trim();
  const ddmmyyyyMatch = trimmed.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (ddmmyyyyMatch) {
    const [, day, month, year] = ddmmyyyyMatch;
    return `${year}-${month}-${day}`;
  }
  return trimmed;
};

export const AddParticipantScreen: React.FC<AddParticipantScreenProps> = ({
  onSuccess,
  onCancel,
}) => {
  const { saveParticipant } = useParticipants();

  // Multi-step state (1 to 5)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Etapa 1: Dados Pessoais
  const [fullName, setFullName] = useState('');
  const [cpf, setCpf] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [biologicalSex, setBiologicalSex] = useState<BiologicalSex>('male');

  // Etapa 2: Medidas Corporais (Obrigatórias)
  const [weightKg, setWeightKg] = useState('');
  const [heightCm, setHeightCm] = useState('');

  // Etapa 3: Escolaridade (Menu suspenso)
  const [education, setEducation] = useState('');
  const [isEducationDropdownOpen, setIsEducationDropdownOpen] = useState(false);

  // Etapa 4: Dados Socioeconômicos (Menu suspenso com faixas de renda)
  const [socioeconomicLevel, setSocioeconomicLevel] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Etapa 5: Endereço Completo
  const [zipCode, setZipCode] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const validateStep1 = (): boolean => {
    const errs: Record<string, string> = {};

    if (!fullName.trim()) {
      errs.fullName = 'O nome completo é obrigatório.';
    }

    const rawCpf = cpf.replace(/\D/g, '');
    if (!rawCpf) {
      errs.cpf = 'O CPF é obrigatório.';
    } else if (rawCpf.length !== 11) {
      errs.cpf = 'CPF deve conter 11 dígitos.';
    }

    const trimmedBirthDate = birthDate.trim();
    if (!trimmedBirthDate) {
      errs.birthDate = 'A data de nascimento é obrigatória.';
    } else {
      const iso = parseDateToIso(trimmedBirthDate);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
        errs.birthDate = 'Data de nascimento inválida (use DD/MM/AAAA).';
      } else {
        const [y, m, d] = iso.split('-').map(Number);
        const dateObj = new Date(y, m - 1, d);
        if (
          dateObj.getFullYear() !== y ||
          dateObj.getMonth() !== m - 1 ||
          dateObj.getDate() !== d ||
          dateObj > new Date() ||
          y < 1900
        ) {
          errs.birthDate = 'Data de nascimento inválida.';
        }
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = (): boolean => {
    const errs: Record<string, string> = {};

    if (!weightKg.trim()) {
      errs.weightKg = 'O peso é obrigatório.';
    } else {
      const num = parseFloat(weightKg.replace(',', '.'));
      if (isNaN(num) || num <= 10 || num > 300) {
        errs.weightKg = 'Informe um peso válido em kg (ex: 68.5).';
      }
    }

    if (!heightCm.trim()) {
      errs.heightCm = 'A altura é obrigatória.';
    } else {
      const num = parseFloat(heightCm);
      if (isNaN(num) || num <= 40 || num > 250) {
        errs.heightCm = 'Informe uma altura válida em cm (ex: 165).';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!validateStep1()) return;
    } else if (currentStep === 2) {
      if (!validateStep2()) return;
    }
    setErrors({});
    setIsEducationDropdownOpen(false);
    setIsDropdownOpen(false);
    setCurrentStep((prev) => Math.min(prev + 1, 5));
  };

  const handlePrevStep = () => {
    setErrors({});
    setIsEducationDropdownOpen(false);
    setIsDropdownOpen(false);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSave = async () => {
    // Validar etapas obrigatórias
    if (!validateStep1()) {
      setCurrentStep(1);
      return;
    }
    if (!validateStep2()) {
      setCurrentStep(2);
      return;
    }

    try {
      setSubmitting(true);

      // Compor endereço formatado para compatibilidade total
      const addressParts: string[] = [];
      if (street.trim()) {
        const streetNum = number.trim() ? `${street.trim()}, ${number.trim()}` : street.trim();
        addressParts.push(streetNum);
      }
      if (complement.trim()) {
        addressParts.push(complement.trim());
      }
      if (neighborhood.trim()) {
        addressParts.push(neighborhood.trim());
      }
      if (city.trim()) {
        const cityState = state.trim() ? `${city.trim()} - ${state.trim()}` : city.trim();
        addressParts.push(cityState);
      } else if (state.trim()) {
        addressParts.push(state.trim());
      }

      const formattedAddress = addressParts.join(', ');

      const newParticipant: Participant = {
        id: createId('part'),
        fullName: fullName.trim(),
        birthDate: parseDateToIso(birthDate),
        biologicalSex,
        cpf: cpf.replace(/\D/g, ''),
        weightKg: parseFloat(weightKg.replace(',', '.')),
        heightCm: parseFloat(heightCm),
        education: education.trim() || undefined,
        socioeconomicLevel: socioeconomicLevel.trim() || undefined,
        address: formattedAddress || undefined,
        street: street.trim() || undefined,
        number: number.trim() || undefined,
        complement: complement.trim() || undefined,
        neighborhood: neighborhood.trim() || undefined,
        city: city.trim() || undefined,
        state: state.trim() || undefined,
        zipCode: zipCode.trim() || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await saveParticipant(newParticipant);
      if (onSuccess) {
        onSuccess(newParticipant);
      }
    } catch {
      // Handled in store
    } finally {
      setSubmitting(false);
    }
  };

  // Renderizar o conteúdo de cada etapa
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        // Etapa 1: Dados Pessoais
        return (
          <View style={styles.stepBody}>
            <FormField
              label="Nome Completo *"
              placeholder="Ex: Maria da Silva"
              value={fullName}
              onChangeText={setFullName}
              error={errors.fullName}
              autoFocus
            />

            <FormField
              label="CPF *"
              placeholder="000.000.000-00"
              value={cpf}
              onChangeText={(val) => setCpf(applyCpfMask(val))}
              keyboardType="numeric"
              maxLength={14}
              error={errors.cpf}
            />

            <FormField
              label="Data de Nascimento *"
              placeholder="DD/MM/AAAA"
              value={birthDate}
              onChangeText={(val) => setBirthDate(applyDateMask(val))}
              keyboardType="numeric"
              maxLength={10}
              error={errors.birthDate}
            />

            {/* Sex Selector */}
            <View style={styles.sexContainer}>
              <Text style={styles.fieldLabel}>SEXO *</Text>
              <View style={styles.sexOptionsRow}>
                {SEX_OPTIONS.map((opt) => {
                  const isSelected = biologicalSex === opt.key;
                  return (
                    <TouchableOpacity
                      key={opt.key}
                      activeOpacity={0.7}
                      onPress={() => setBiologicalSex(opt.key)}
                      style={[styles.sexOption, isSelected && styles.sexOptionSelected]}
                    >
                      <Text
                        style={[
                          styles.sexOptionText,
                          isSelected && styles.sexOptionTextSelected,
                        ]}
                      >
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
        );

      case 2:
        // Etapa 2: Medidas Corporais (Campos obrigatórios, sem card explicativo)
        return (
          <View style={styles.stepBody}>
            <View style={styles.row}>
              <View style={styles.col}>
                <FormField
                  label="Peso (kg) *"
                  placeholder="Ex: 68.5"
                  value={weightKg}
                  onChangeText={setWeightKg}
                  keyboardType="decimal-pad"
                  error={errors.weightKg}
                  autoFocus
                />
              </View>
              <View style={styles.col}>
                <FormField
                  label="Altura (cm) *"
                  placeholder="Ex: 165"
                  value={heightCm}
                  onChangeText={setHeightCm}
                  keyboardType="numeric"
                  error={errors.heightCm}
                />
              </View>
            </View>
          </View>
        );

      case 3:
        // Etapa 3: Escolaridade (Menu suspenso)
        return (
          <View style={styles.stepBody}>
            <View style={styles.dropdownContainer}>
              <Text style={styles.fieldLabel}>GRAU DE ESCOLARIDADE</Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setIsEducationDropdownOpen(!isEducationDropdownOpen)}
                style={[
                  styles.dropdownTrigger,
                  isEducationDropdownOpen && styles.dropdownTriggerActive,
                ]}
              >
                <Text
                  style={[
                    styles.dropdownValueText,
                    !education && styles.dropdownPlaceholderText,
                  ]}
                  numberOfLines={1}
                >
                  {education || 'Selecione o grau de escolaridade...'}
                </Text>
                <ChevronDown
                  size={20}
                  color={isEducationDropdownOpen ? Colors.primary : Colors.textMuted}
                  style={{
                    transform: [{ rotate: isEducationDropdownOpen ? '180deg' : '0deg' }],
                  }}
                />
              </TouchableOpacity>

              {/* Menu Suspenso de Escolaridade */}
              {isEducationDropdownOpen && (
                <View style={styles.dropdownMenu}>
                  {EDUCATION_OPTIONS.map((option, index) => {
                    const isSelected = education === option;
                    return (
                      <TouchableOpacity
                        key={option}
                        activeOpacity={0.7}
                        onPress={() => {
                          setEducation(option);
                          setIsEducationDropdownOpen(false);
                        }}
                        style={[
                          styles.dropdownOption,
                          isSelected && styles.dropdownOptionSelected,
                          index === EDUCATION_OPTIONS.length - 1 && { borderBottomWidth: 0 },
                        ]}
                      >
                        <Text
                          style={[
                            styles.dropdownOptionText,
                            isSelected && styles.dropdownOptionTextSelected,
                          ]}
                        >
                          {option}
                        </Text>
                        {isSelected && (
                          <Check size={16} color={Colors.primary} strokeWidth={2.5} />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          </View>
        );

      case 4:
        // Etapa 4: Dados Socioeconômicos (Menu suspenso com faixas de renda em parênteses)
        return (
          <View style={styles.stepBody}>
            <View style={styles.dropdownContainer}>
              <Text style={styles.fieldLabel}>NÍVEL SOCIOECONÔMICO</Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setIsDropdownOpen(!isDropdownOpen)}
                style={[
                  styles.dropdownTrigger,
                  isDropdownOpen && styles.dropdownTriggerActive,
                ]}
              >
                <Text
                  style={[
                    styles.dropdownValueText,
                    !socioeconomicLevel && styles.dropdownPlaceholderText,
                  ]}
                  numberOfLines={1}
                >
                  {socioeconomicLevel || 'Selecione a classe socioeconômica...'}
                </Text>
                <ChevronDown
                  size={20}
                  color={isDropdownOpen ? Colors.primary : Colors.textMuted}
                  style={{
                    transform: [{ rotate: isDropdownOpen ? '180deg' : '0deg' }],
                  }}
                />
              </TouchableOpacity>

              {/* Menu Suspenso */}
              {isDropdownOpen && (
                <View style={styles.dropdownMenu}>
                  {SOCIOECONOMIC_CLASSES.map((option, index) => {
                    const isSelected = socioeconomicLevel === option;
                    return (
                      <TouchableOpacity
                        key={option}
                        activeOpacity={0.7}
                        onPress={() => {
                          setSocioeconomicLevel(option);
                          setIsDropdownOpen(false);
                        }}
                        style={[
                          styles.dropdownOption,
                          isSelected && styles.dropdownOptionSelected,
                          index === SOCIOECONOMIC_CLASSES.length - 1 && { borderBottomWidth: 0 },
                        ]}
                      >
                        <Text
                          style={[
                            styles.dropdownOptionText,
                            isSelected && styles.dropdownOptionTextSelected,
                          ]}
                        >
                          {option}
                        </Text>
                        {isSelected && (
                          <Check size={16} color={Colors.primary} strokeWidth={2.5} />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          </View>
        );

      case 5:
        // Etapa 5: Endereço Completo (todos os dados de endereço em uma única etapa)
        return (
          <View style={styles.stepBody}>
            <FormField
              label="CEP"
              placeholder="00000-000"
              value={zipCode}
              onChangeText={(val) => setZipCode(applyCepMask(val))}
              keyboardType="numeric"
              maxLength={9}
              autoFocus
            />

            <FormField
              label="Logradouro / Rua"
              placeholder="Ex: Rua das Flores"
              value={street}
              onChangeText={setStreet}
            />

            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <FormField
                  label="Número"
                  placeholder="Ex: 120"
                  value={number}
                  onChangeText={setNumber}
                />
              </View>
              <View style={{ flex: 1.5 }}>
                <FormField
                  label="Complemento"
                  placeholder="Ex: Apto 201"
                  value={complement}
                  onChangeText={setComplement}
                />
              </View>
            </View>

            <FormField
              label="Bairro"
              placeholder="Ex: Centro"
              value={neighborhood}
              onChangeText={setNeighborhood}
            />

            <View style={styles.row}>
              <View style={{ flex: 2 }}>
                <FormField
                  label="Cidade"
                  placeholder="Ex: Rio de Janeiro"
                  value={city}
                  onChangeText={setCity}
                />
              </View>
              <View style={{ flex: 1 }}>
                <FormField
                  label="UF"
                  placeholder="RJ"
                  value={state}
                  onChangeText={setState}
                  maxLength={2}
                  autoCapitalize="characters"
                />
              </View>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.overlay}>
      {/* Backdrop semi-transparente que fecha no toque */}
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onCancel}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoid}
      >
        <View style={styles.bottomSheet}>
          {/* Drag Handle */}
          <View style={styles.dragHandleContainer}>
            <View style={styles.dragHandle} />
          </View>

          {/* Cabeçalho do BottomSheet */}
          <View style={styles.header}>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>Etapa {currentStep} de 5</Text>
              <Text style={styles.headerSubtitle}>
                {STEPS[currentStep - 1].title}
              </Text>
            </View>

            {onCancel && (
              <TouchableOpacity
                style={styles.closeButton}
                activeOpacity={0.7}
                onPress={onCancel}
                hitSlop={{ top: 12, right: 12, bottom: 12, left: 12 }}
                accessibilityLabel="Fechar"
              >
                <X size={20} color={Colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>

          {/* Barra de Progresso e Indicadores de Etapa */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBarTrack}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${(currentStep / 5) * 100}%` },
                ]}
              />
            </View>

            {/* Badges das 5 etapas */}
            <View style={styles.stepsBadgeRow}>
              {STEPS.map((s) => {
                const isCurrent = currentStep === s.id;
                const isPassed = currentStep > s.id;
                return (
                  <TouchableOpacity
                    key={s.id}
                    activeOpacity={0.7}
                    onPress={() => {
                      if (s.id < currentStep) {
                        setIsEducationDropdownOpen(false);
                        setIsDropdownOpen(false);
                        setCurrentStep(s.id);
                      } else if (s.id > currentStep) {
                        handleNextStep();
                      }
                    }}
                    style={styles.stepBadgeItem}
                  >
                    <View
                      style={[
                        styles.stepBadgeCircle,
                        isCurrent && styles.stepBadgeCircleActive,
                        isPassed && styles.stepBadgeCirclePassed,
                      ]}
                    >
                      {isPassed ? (
                        <Check size={11} color="#FFFFFF" strokeWidth={3} />
                      ) : (
                        <Text
                          style={[
                            styles.stepBadgeNumber,
                            isCurrent && styles.stepBadgeNumberActive,
                          ]}
                        >
                          {s.id}
                        </Text>
                      )}
                    </View>
                    <Text
                      style={[
                        styles.stepBadgeLabel,
                        isCurrent && styles.stepBadgeLabelActive,
                        isPassed && styles.stepBadgeLabelPassed,
                      ]}
                      numberOfLines={1}
                    >
                      {s.shortTitle}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Conteúdo rolável da etapa */}
          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {renderStepContent()}
          </ScrollView>

          {/* Botões de Ação no Rodapé */}
          <View style={styles.footer}>
            {currentStep === 1 ? (
              onCancel && (
                <Button
                  title="Cancelar"
                  variant="outline"
                  onPress={onCancel}
                  style={styles.footerBtn}
                />
              )
            ) : (
              <Button
                title="Voltar"
                variant="outline"
                icon={<ArrowLeft size={16} color={Colors.textMain} />}
                onPress={handlePrevStep}
                style={styles.footerBtn}
              />
            )}

            {currentStep < 5 ? (
              <Button
                title="Próximo"
                variant="primary"
                icon={<ArrowRight size={16} color="#FFFFFF" />}
                iconPosition="right"
                onPress={handleNextStep}
                style={styles.footerBtn}
              />
            ) : (
              <Button
                title="Concluir Cadastro"
                variant="primary"
                loading={submitting}
                icon={<Check size={18} color="#FFFFFF" />}
                onPress={handleSave}
                style={styles.footerBtn}
              />
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  keyboardAvoid: {
    justifyContent: 'flex-end',
    maxHeight: '92%',
  },
  bottomSheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingTop: Spacing.xs,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 34 : Spacing.md,
    maxHeight: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 10,
  },
  dragHandleContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  dragHandle: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.extrabold,
    color: Colors.textMain,
  },
  headerSubtitle: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    fontWeight: Typography.weights.medium,
    marginTop: 2,
  },
  closeButton: {
    width: 34,
    height: 34,
    borderRadius: BorderRadius.full,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.sm,
  },
  progressContainer: {
    marginBottom: Spacing.md,
  },
  progressBarTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
    width: '100%',
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  stepsBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stepBadgeItem: {
    alignItems: 'center',
    flex: 1,
  },
  stepBadgeCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#F3F4F6',
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  stepBadgeCircleActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  stepBadgeCirclePassed: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  stepBadgeNumber: {
    fontSize: 10,
    fontWeight: Typography.weights.bold,
    color: Colors.textMuted,
  },
  stepBadgeNumberActive: {
    color: '#FFFFFF',
  },
  stepBadgeLabel: {
    fontSize: 10,
    fontWeight: Typography.weights.medium,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  stepBadgeLabelActive: {
    color: Colors.primary,
    fontWeight: Typography.weights.bold,
  },
  stepBadgeLabelPassed: {
    color: Colors.textMain,
  },
  scrollArea: {
    maxHeight: 380,
  },
  scrollContent: {
    paddingVertical: Spacing.xs,
  },
  stepBody: {
    width: '100%',
  },
  chipsSectionTitle: {
    fontSize: 10,
    fontWeight: Typography.weights.bold,
    color: Colors.textMuted,
    letterSpacing: 0.5,
    marginTop: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  sexContainer: {
    marginBottom: Spacing.md,
  },
  fieldLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  sexOptionsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  sexOption: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sexOptionSelected: {
    borderColor: Colors.primary,
    backgroundColor: '#EEF4FF',
  },
  sexOptionText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    fontWeight: Typography.weights.semibold,
  },
  sexOptionTextSelected: {
    color: Colors.primary,
    fontWeight: Typography.weights.bold,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  col: {
    flex: 1,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.full,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipSelected: {
    backgroundColor: '#EEF4FF',
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    fontWeight: Typography.weights.medium,
  },
  chipTextSelected: {
    color: Colors.primary,
    fontWeight: Typography.weights.bold,
  },
  dropdownContainer: {
    marginBottom: Spacing.md,
    width: '100%',
  },
  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
  },
  dropdownTriggerActive: {
    borderColor: Colors.primary,
    backgroundColor: '#FFFFFF',
  },
  dropdownValueText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMain,
    fontWeight: Typography.weights.medium,
    flex: 1,
    marginRight: Spacing.sm,
  },
  dropdownPlaceholderText: {
    color: '#9CA3AF',
  },
  dropdownMenu: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: Spacing.xs,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownOptionSelected: {
    backgroundColor: '#EEF4FF',
  },
  dropdownOptionText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMain,
    fontWeight: Typography.weights.medium,
    flex: 1,
  },
  dropdownOptionTextSelected: {
    color: Colors.primary,
    fontWeight: Typography.weights.bold,
  },
  footer: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginTop: Spacing.xs,
  },
  footerBtn: {
    flex: 1,
  },
});
