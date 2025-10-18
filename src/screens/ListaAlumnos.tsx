// screens/ListaAlumnosScreen.tsx
import React, { useLayoutEffect, useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

import { useAlumnos } from '../features/hooks/alumnos/useAlumnos';
import { addAlumno } from '../features/hooks/alumnos/alumno.repo';

type Alumno = { ID_Alumno: number; Nombre: string };

export default function ListaAlumnos() {
  const { data, loading, error, refresh } = useAlumnos();
  const navigation = useNavigation();

  const [showModal, setShowModal] = useState(false);
  const [nombre, setNombre] = useState('');

  const handleAdd = useCallback(() => {
    setNombre('');
    setShowModal(true);
  }, []);

  const handleConfirmAdd = useCallback(async () => {
    const trimmed = nombre.trim();
    if (!trimmed) {
      Alert.alert('Nombre requerido', 'Ingresá un nombre.');
      return;
    }
    try {
      await addAlumno(trimmed, null);
      setShowModal(false);
      await refresh();
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'No se pudo agregar el alumno');
    }
  }, [nombre, refresh]);

  const alumnos: Alumno[] = (data as Alumno[]) ?? [];
  const isEmpty = !alumnos.length;
  const countText = useMemo(
    () => `${alumnos.length} ${alumnos.length === 1 ? 'alumno' : 'alumnos'}`,
    [alumnos.length]
  );

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;
  if (error) return <Text style={styles.errorText}>Error: {(error as any)?.message ?? 'Ups'}</Text>;

  return (
    <View style={styles.container}>
      {isEmpty ? (
        // ===== Vista vacía: header arriba + centro con mensaje =====
        <View style={{ flex: 1 }}>
          <View style={styles.headerCompact}>
            <Text style={styles.headerCount}>0 alumnos</Text>
          </View>
          <View style={styles.emptyCenter}>
            <MaterialIcons name="people-outline" size={22} />
            <Text style={styles.emptyText}>No hay alumnos</Text>
          </View>
        </View>
      ) : (
        // ===== Lista con datos =====
        <FlatList
          data={alumnos}
          keyExtractor={(i) => String(i.ID_Alumno)}
          onRefresh={refresh}
          refreshing={loading}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
          ListHeaderComponent={
            <View style={styles.headerCompact}>
              <Text style={styles.headerCount}>{countText}</Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.row} activeOpacity={0.7}>
              <View style={styles.leftIcon}>
                <MaterialIcons name="person" size={18} />
              </View>
              <View style={styles.rowBody}>
                <Text style={styles.rowTitle} numberOfLines={1}>
                  {item.Nombre}
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} />
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 8 }}
        />
      )}

      {/* FAB crear (opcional si dejás el headerRight) */}
      <Pressable onPress={handleAdd} style={styles.fab} hitSlop={10} accessibilityLabel="Agregar alumno">
        <MaterialIcons name="person-add-alt-1" size={24} color="#fff" />
      </Pressable>

      {/* Modal alta compacto */}
      <Modal visible={showModal} transparent animationType="fade" onRequestClose={() => setShowModal(false)}>
        <View style={styles.backdrop}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, justifyContent: 'center' }}>
            <View style={styles.card}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Agregar alumno</Text>
                <Pressable onPress={() => setShowModal(false)} hitSlop={8} style={styles.xBtn}>
                  <Text style={styles.x}>×</Text>
                </Pressable>
              </View>

              <TextInput
                placeholder="Nombre"
                value={nombre}
                onChangeText={setNombre}
                style={styles.input}
                autoFocus
                autoCapitalize="words"
                maxLength={60}
                returnKeyType="done"
              />

              <View style={styles.modalActions}>
                <Pressable onPress={() => setShowModal(false)} style={styles.secondaryBtn}>
                  <Text style={styles.secondaryText}>Cancelar</Text>
                </Pressable>
                <Pressable
                  onPress={handleConfirmAdd}
                  style={[styles.primaryBtn, !nombre.trim() && styles.primaryBtnDisabled]}
                  disabled={!nombre.trim()}
                >
                  <Text style={styles.primaryText}>Guardar</Text>
                </Pressable>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}

const ROW_H = 52;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  // Header compacto
  headerCompact: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 6,
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  headerCount: { fontSize: 12, color: '#6B7280', fontWeight: '600' },

  // Fila compacta
  row: {
    minHeight: ROW_H,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    backgroundColor: '#F3F4F6',
  },
  rowBody: { flex: 1 },
  rowTitle: { fontSize: 14, fontWeight: '700' },

  sep: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E5E7EB',
    marginLeft: 50, // alinea tras el icono
  },

  // Empty
  emptyCenter: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 6 },
  emptyText: { color: '#6B7280', fontSize: 13 },

  // FAB
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 20,
    width: 48,
    height: 48,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6', // azul para diferenciar de "crear clase"
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },

  // Modal
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.28)', padding: 12 },
  card: {
    alignSelf: 'center',
    width: '92%',
    maxWidth: 420,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  modalTitle: { fontSize: 18, fontWeight: '700' },
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

  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 10 },
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
    backgroundColor: '#3B82F6',
  },
  primaryBtnDisabled: { opacity: 0.5 },
  primaryText: { color: '#fff', fontWeight: '700' },

  // Errores
  errorText: { padding: 16, color: '#b00020' },
});
