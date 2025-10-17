import React, { useCallback, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, Alert, Pressable } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import type { RootDrawerParamList } from '../../../App';
import { useTurnosDetalle } from '../turnosDetalle/useTurnosDetalle';

type R = RouteProp<RootDrawerParamList, 'MenuTurnosDetalle'>;

export default function MenuTurnosDetalleScreen() {
  const navigation = useNavigation();
  const { params } = useRoute<R>(); // { id, label }
  const { eliminar } = useTurnosDetalle(params.id);

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
      <Text>ID: {params.id}</Text>
      {/* más contenido del detalle... */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
});
