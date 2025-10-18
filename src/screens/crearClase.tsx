import { useEffect, useState } from 'react';
import {Modal, View, StyleSheet, TextInput, Text, Pressable} from 'react-native';
import {Calendario} from '../componentes/calendario';
import { DateType } from 'react-native-ui-datepicker';

type ModalCardProps = {
  visible: boolean;
  turnoId: number;
  onClose: () => void;
  onSubmit: (turnoId: number, name: string, date: Date) => void;
};

/** Componente para crear una nueva clase */
export default function CrearClase({visible, turnoId, onClose, onSubmit}: ModalCardProps) {
    const [name, setName] = useState('');
    const [date, setDate] = useState<DateType | null>(null);

    // Reestablecer estados cada vez que se abre
    useEffect(() => {
        if (visible) {
        setName('');
        setDate(null);
        }
    }, [visible]);

    return (
        <Modal 
            visible={visible}
            transparent animationType="slide"
            onRequestClose={onClose}>
            <View style={{ flex: 1, padding: 16, backgroundColor:'rgba(0,0,0,0.3)', justifyContent: 'center' }}>
                <View style={{ backgroundColor:'#fff', borderRadius:12, padding:16 }}>
                    <Text style={{ fontSize:25, fontWeight:'600', marginBottom:8 }}>Crear clase</Text>
                    <TextInput
                        placeholder="Nombre de la clase"
                        style={{ borderWidth:1, borderColor:'#ccc', borderRadius:8, padding:10, marginBottom:12 }}
                        autoFocus
                        value={name}
                        onChangeText={setName}
                    />
                    <Calendario onChange={setDate} />
                    <Pressable onPress={() => onSubmit(turnoId, name, date as Date)} style={{ marginTop: 16, padding: 12, backgroundColor: '#34D399', borderRadius: 6, alignItems: 'center' }}>
                        <Text style={{ fontSize: 18, fontWeight: '600' }}>Crear clase</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}
