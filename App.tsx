import 'react-native-gesture-handler';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { init } from './src/db/db'; // 👈 importa tu init de BD

// Navegación
import { NavigationContainer } from '@react-navigation/native';
import DrawerNavigator from './src/navigation/DrawerNavigator';

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
      <DrawerNavigator />
    </NavigationContainer>
  );
}
