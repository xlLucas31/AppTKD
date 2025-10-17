import React, { useState, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, StyleSheet, KeyboardAvoidingView, Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTurnos } from '../features/hooks/turnos/useTurnos';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TurnosStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<TurnosStackParamList, 'ListaTurnos'>;

export default function ListaTurnos({navigation}: Props) {
  const { turnos, loading, add } = useTurnos();
  const [input, setInput] = useState('');

  const agregar = useCallback(async () => {
    await add(input);
    setInput('');
  }, [input, add]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Cargando…</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.select({ ios: 'padding' })}>
      <Text style={styles.title}>Turnos</Text>

      <View style={styles.form}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Nombre del turno"
          style={styles.input}
          onSubmitEditing={agregar}
        />
        <TouchableOpacity style={styles.addBtn} onPress={agregar}>
          <Text style={styles.addBtnText}>Agregar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={turnos}
        keyExtractor={(t) => String(t.id)}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate('TurnoConfiguracion', { id: item.id, label: item.nombre })}
          >
            <Text style={styles.itemText}>{item.nombre}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingVertical: 8, gap: 8 }}
        ListEmptyComponent={<Text style={{ color: '#6B7280' }}>No hay turnos.</Text>}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  form: { flexDirection: 'row', gap: 8, marginBottom: 12, alignItems: 'center' },
  input: { flex: 1, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#F9FAFB' },
  addBtn: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12, backgroundColor: '#111827' },
  addBtnText: { color: 'white', fontWeight: '700' },
  item: { padding: 12, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, backgroundColor: 'white' },
  itemText: { fontSize: 16, fontWeight: '600', color: '#111827' },
});
