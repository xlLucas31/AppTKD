import { useEffect, useState } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TextInput,
  Text,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Calendario } from '../componentes/calendario';
import { DateType } from 'react-native-ui-datepicker';

type ModalCardProps = {
  visible: boolean;
  turnoId: number;
  onClose: () => void;
  onSubmit: (turnoId: number, name: string, date: Date) => void;
};

export default function CrearClase({ visible, turnoId, onClose, onSubmit }: ModalCardProps) {
  const [name, setName] = useState('');
  const [date, setDate] = useState<DateType | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);

  // Reset cada vez que abre
  useEffect(() => {
    if (visible) {
      setName('');
      setDate(null);
      setShowCalendar(false);
    }
  }, [visible]);

  const dateLabel = date ? new Date(date as Date).toLocaleDateString() : 'Elegir fecha';
  const canSubmit = name.trim().length > 0 && !!date;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.wrapper}
        >
          <View style={styles.card}>
            <View style={styles.header}>
              <Text style={styles.title}>Nueva clase</Text>
              <Pressable onPress={onClose} hitSlop={8} style={styles.xBtn}>
                <Text style={styles.x}>×</Text>
              </Pressable>
            </View>

            <TextInput
              placeholder="Nombre"
              style={styles.input}
              value={name}
              onChangeText={setName}
              returnKeyType="done"
              maxLength={60}
            />

            <Pressable
              onPress={() => setShowCalendar((v) => !v)}
              style={[styles.chip, showCalendar && styles.chipActive]}
            >
              <Text style={styles.chipText}>{dateLabel}</Text>
            </Pressable>

            {showCalendar && (
              <View style={styles.calendarPanel}>
                <Calendario onChange={(d: DateType | null) => setDate(d)} />
                <View style={styles.calendarActions}>
                  <Pressable style={styles.secondaryBtn} onPress={() => setShowCalendar(false)}>
                    <Text style={styles.secondaryText}>Cancelar</Text>
                  </Pressable>
                  <Pressable style={styles.primaryBtn} onPress={() => setShowCalendar(false)}>
                    <Text style={styles.primaryText}>Listo</Text>
                  </Pressable>
                </View>
              </View>
            )}

            <Pressable
              disabled={!canSubmit}
              onPress={() => onSubmit(turnoId, name.trim(), date as Date)}
              style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled]}
            >
              <Text style={styles.submitText}>Crear</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.28)',
    justifyContent: 'center',
    padding: 12,
  },
  wrapper: { flex: 1, justifyContent: 'center' },
  card: {
    alignSelf: 'center',
    width: '92%',
    maxWidth: 420,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12, // compacto
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 18, fontWeight: '700' },
  xBtn: { padding: 4 },
  x: { fontSize: 22, lineHeight: 22, fontWeight: '600' },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#D6D6D6',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 10,
    fontSize: 14,
  },
  chip: {
    marginTop: 8,
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#D6D6D6',
    backgroundColor: '#F7F7F7',
  },
  chipActive: { backgroundColor: '#EFEFEF' },
  chipText: { fontSize: 13, fontWeight: '600' },

  calendarPanel: {
    marginTop: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E6E6E6',
    borderRadius: 10,
    padding: 8,
    backgroundColor: '#FAFAFA',
  },
  calendarActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 8,
  },
  secondaryBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#EFEFEF',
  },
  secondaryText: { fontWeight: '600' },
  primaryBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#34D399',
  },
  primaryText: { color: '#fff', fontWeight: '700' },

  submitBtn: {
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#10B981',
  },
  submitBtnDisabled: { opacity: 0.5 },
  submitText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
