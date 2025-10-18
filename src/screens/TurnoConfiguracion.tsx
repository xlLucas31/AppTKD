import React, { useCallback, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, Alert, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTurnosDetalle } from '../features/hooks/turnosDetalle/useTurnosDetalle';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TurnosStackParamList } from '../navigation/types';

import CrearClase from './crearClase';
import {useModalCrearClase} from '../features/hooks/useModalCrearClase';

type Props = NativeStackScreenProps<TurnosStackParamList, 'TurnoConfiguracion'>;

export default function TurnoConfiguracion({ navigation, route }: Props) {
  const { params } = route;
  const { eliminar } = useTurnosDetalle(params.id);
  const { visible, open, close, onSubmit } = useModalCrearClase();

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
            } catch (e) {
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
        <Pressable onPress={handleDelete} style={{ paddingHorizontal: 12 }}>
          <MaterialIcons name="delete-outline" size={24} />
        </Pressable>
      ),
    });
  }, [navigation, params.label, handleDelete]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{params.label}</Text>
      <Pressable onPress={open}>
        <Text style={{fontWeight: '600' }}>Crear clase</Text>
      </Pressable>
      <CrearClase visible={visible} turnoId={params.id} onClose={close} onSubmit={onSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
});
