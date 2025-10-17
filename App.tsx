import 'react-native-gesture-handler';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { HeaderBackButton } from '@react-navigation/elements';

import { init } from './src/db/db'; // 👈 importa tu init de BD

import TurnosScreen from './src/features/turnos/listaturnos_screen';
import MenuTurnosDetalle from './src/features/turnosDetalle/menuTurnosDetalle';
import AlumnosScreen from './src/features/alumnos/listaalumnos_screen';

// Tipos del Drawer (rutas + params)
export type RootDrawerParamList = {
  Turnos: undefined;
  MenuTurnosDetalle: { id: number; label: string };
  Alumnos: undefined;
};

const Drawer = createDrawerNavigator<RootDrawerParamList>();

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        await init(); // 👈 corre migraciones/creación de tablas una sola vez al inicio
      } finally {
        setReady(true);
      }
    })();
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Turnos">
        <Drawer.Screen
          name="Turnos"
          component={TurnosScreen}
          options={{ title: 'Turnos' }}
        />

        {/* Screen de detalle oculta en el menú */}
        <Drawer.Screen
          name="MenuTurnosDetalle"
          component={MenuTurnosDetalle}
          options={({ route, navigation }) => ({
            title: route.params?.label ?? 'Detalle del turno',
            drawerItemStyle: { display: 'none' },
            swipeEnabled: false,
            headerLeft: (props) => (
              <HeaderBackButton {...props} onPress={() => navigation.goBack()} />
            ),
          })}
        />

        <Drawer.Screen
          name="Alumnos"
          component={AlumnosScreen}
          options={{title: 'Alumnos'}}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
