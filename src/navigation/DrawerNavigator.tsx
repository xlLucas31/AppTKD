import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

// Importa los componentes de las pantallas.
import TurnosStackNavigator from './turnosStackNavigator';
import AlumnosScreen from '../screens/ListaAlumnos';

const Drawer = createDrawerNavigator();

/** Menu lateral compuesto por:
 * - Turnos (Stack Navigator) -> Componente: TurnosStackNavigator
 * - Alumnos (Pantalla simple) -> Componente: AlumnosScreen
 */
export default function DrawerNavigator() {
    return (
        <Drawer.Navigator initialRouteName="TurnosMenu">
            <Drawer.Screen
                name="TurnosMenu"
                component={TurnosStackNavigator}
                options={{ title: 'Turnos' }}
            />
            <Drawer.Screen
                name="Alumnos"
                component={AlumnosScreen}
                options={{ title: 'Alumnos' }}
            />
        </Drawer.Navigator>
    );
}