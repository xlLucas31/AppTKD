// screens/ListaAlumnosScreen.tsx
import React, { useLayoutEffect, useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Pressable, Alert, Modal, TextInput } from 'react-native';
import { useAlumnos } from '../alumnos/useAlumnos';
import { MaterialIcons } from '@expo/vector-icons';
import { addAlumno } from '../alumnos/alumno.repo';

export default function ListaAlumnosScreen() {
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

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Alumnos',
      headerRight: () => (
        <Pressable onPress={handleAdd} style={{ paddingHorizontal: 12 }}>
          <MaterialIcons name="add" size={24} />
        </Pressable>
      ),
    });
  }, [navigation, handleAdd]);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;
  if (error)   return <Text style={{ padding: 16 }}>Error: {(error as any)?.message ?? 'Ups'}</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Alumnos</Text>

      <FlatList
        data={data}
        keyExtractor={(i) => String(i.ID_Alumno)}
        onRefresh={refresh}
        refreshing={loading}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.btnAlumno}>
            <Text style={styles.btnText}>{item.Nombre}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text>No hay alumnos</Text>}
      />

      {/* Modal simple para alta */}
      <Modal visible={showModal} transparent animationType="slide" onRequestClose={() => setShowModal(false)}>
        <View style={{ flex:1, backgroundColor:'rgba(0,0,0,0.3)', justifyContent:'center', padding:16 }}>
          <View style={{ backgroundColor:'#fff', borderRadius:12, padding:16 }}>
            <Text style={{ fontSize:18, fontWeight:'600', marginBottom:8 }}>Agregar alumno</Text>
            <TextInput
              placeholder="Nombre"
              value={nombre}
              onChangeText={setNombre}
              style={{ borderWidth:1, borderColor:'#ccc', borderRadius:8, padding:10, marginBottom:12 }}
              autoFocus
            />
            <View style={{ flexDirection:'row', justifyContent:'flex-end', gap:12 }}>
              <Pressable onPress={() => setShowModal(false)} style={{ padding:10 }}>
                <Text>Cancelar</Text>
              </Pressable>
              <Pressable onPress={handleConfirmAdd} style={{ padding:10 }}>
                <Text style={{ fontWeight:'700' }}>Guardar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 12, textAlign: 'center' },
  btnAlumno: { padding: 12, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 8 },
  btnText: { fontSize: 16, textAlign: 'center' },
});
