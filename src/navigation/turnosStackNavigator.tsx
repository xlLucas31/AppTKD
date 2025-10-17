import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importa el tipo de parámetros del stack navigator.
import { TurnosStackParamList } from './types';

// Importa los componentes de las pantallas.
import TurnosScreen from '../screens/ListaTurnos';
import TurnoConfiguracion from '../screens/TurnoConfiguracion';
import ClaseTabNavigator from './clasesTabNavigator';

const Stack = createNativeStackNavigator<TurnosStackParamList>();

export default function TurnosStackNavigator() {
    return (
        <Stack.Navigator initialRouteName="ListaTurnos" screenOptions={{ headerShown: false }}  >
            <Stack.Screen name="ListaTurnos" component={TurnosScreen} />
            <Stack.Screen name="TurnoConfiguracion" component={TurnoConfiguracion} />
            <Stack.Screen name="ClasesTabs" component={ClaseTabNavigator} />
        </Stack.Navigator>
    );
}