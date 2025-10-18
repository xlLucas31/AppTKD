import React, { useCallback, useLayoutEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Pressable,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useTurnosDetalle } from '../features/hooks/turnosDetalle/useTurnosDetalle';
import { useClases } from '../features/hooks/useClases';
import { useModalCrearClase } from '../features/hooks/useModalCrearClase';

import { TurnosStackParamList } from '../navigation/types';
import { Clase } from '../features/hooks/clases/clase.repo';
import CrearClase from './crearClase';

type Props = NativeStackScreenProps<TurnosStackParamList, 'TurnoConfiguracion'>;

export default function TurnoConfiguracion({ navigation, route }: Props) {
  const { params } = route; // { id, label }
  const { eliminar } = useTurnosDetalle(params.id);
  const { visible, open, close, onSubmit } = useModalCrearClase();
  const { data, loading, error, refresh } = useClases(params.id);

  const handleDelete = useCallback(() => {
    Alert.alert(
      'Eliminar turno',
      `¿Eliminar “${params.label}”?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await eliminar();
              navigation.goBack();
            } catch {
              Alert.alert('Error', 'No se pudo eliminar el turno.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  }, [eliminar, navigation, params.label]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: params.label ?? 'Detalle del turno',
      headerRight: () => (
        <Pressable onPress={handleDelete} hitSlop={10} style={{ paddingHorizontal: 8 }}>
          <MaterialIcons name="delete-outline" size={22} />
        </Pressable>
      ),
    });
  }, [navigation, params.label, handleDelete]);

  const clases: Clase[] = (data as unknown as Clase[]) ?? [];

  const countText = useMemo(
    () => `${clases.length} ${clases.length === 1 ? 'clase' : 'clases'}`,
    [clases.length]
  );

  const formatFecha = (f?: string | Date) => {
    if (!f) return '';
    const d = new Date(f);
    return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;
  if (error) return <Text style={styles.errorText}>Error: {(error as any)?.message ?? 'Ups'}</Text>;

  return (
    <View style={styles.container}>
      <View style={styles.headerCompact}>
        <Text style={styles.headerCount}>{countText}</Text>
      </View>
      <FlatList
        data={clases}
        keyExtractor={(i) => String(i.id)}
        onRefresh={refresh}
        refreshing={loading}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
      
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.row} activeOpacity={0.7}>
            <View style={styles.leftIcon}>
              <MaterialIcons name="event" size={18} />
            </View>

            <View style={styles.rowBody}>
              <Text style={styles.rowTitle} numberOfLines={1}>
                {item.label}
              </Text>
              <Text style={styles.rowSub} numberOfLines={1}>
                {formatFecha(item.fecha)}
              </Text>
            </View>

            <MaterialIcons name="chevron-right" size={20} />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <MaterialIcons name="event-busy" size={22} />
            <Text style={styles.emptyText}>No hay clases</Text>
          </View>
        }
        contentContainerStyle={clases.length ? undefined : { flex: 1, justifyContent: 'center' }}
      />

      {/* FAB crear */}
      <Pressable onPress={open} style={styles.fabCreate} hitSlop={10} accessibilityLabel="Crear clase">
        <MaterialIcons name="add" size={24} color="#fff" />
      </Pressable>

      {/* FAB eliminar (peligro) */}
      <Pressable
        onPress={handleDelete}
        onLongPress={handleDelete}
        style={styles.fabDelete}
        hitSlop={10}
        accessibilityLabel="Eliminar turno"
        accessibilityHint="Muestra confirmación para eliminar el turno"
      >
        <MaterialIcons name="delete-outline" size={22} color="#fff" />
      </Pressable>

      {/* Modal crear */}
      <CrearClase
        visible={visible}
        turnoId={params.id}
        onClose={close}
        onSubmit={async (...args) => {
          try {
            await onSubmit(...args);
          } finally {
            await refresh();
            close();
          }
        }}
      />
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
  rowSub: { fontSize: 12, color: '#6B7280', marginTop: 2 },

  sep: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E5E7EB',
    marginLeft: 50, // alinea después del ícono
  },

  // Empty
  emptyBox: { alignItems: 'center', gap: 6 },
  emptyText: { color: '#6B7280', fontSize: 13 },

  // FABs
  fabCreate: {
    position: 'absolute',
    right: 16,
    bottom: 20,
    width: 48,
    height: 48,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981', // verde
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  fabDelete: {
    position: 'absolute',
    left: 16,
    bottom: 20,
    width: 44,
    height: 44,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444', // rojo
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },

  // Errores
  errorText: { padding: 16, color: '#b00020' },
});
