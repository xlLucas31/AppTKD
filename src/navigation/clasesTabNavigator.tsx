import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Importa los tipos de navegación.
import { ClasesTabParamList } from './types';

// Importa los componentes de las pantallas.
import ClaseEjercicio from '../screens/claseEjercicios';
import ClaseLista from '../screens/claseAsistencia';
import ClaseConfiguracion from '../screens/claseConfiguracion';

import { MaterialCommunityIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator<ClasesTabParamList>();

export default function ClaseTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          switch (route.name) {
            case 'ClaseEjercicios':
              return (
                <MaterialCommunityIcons
                  name={focused ? 'clipboard-text' : 'clipboard-text-outline'}
                  size={size}
                  color={color}
                />
              );
            case 'ClaseAsistencia':
              return (
                <MaterialCommunityIcons
                  name={focused ? 'clipboard-check' : 'clipboard-check-outline'}
                  size={size}
                  color={color}
                />
              );
            case 'ClaseConfiguracion':
              return (
                <MaterialCommunityIcons
                  name={focused ? 'cog' : 'cog-outline'}
                  size={size}
                  color={color}
                />
              );
            default:
              return null;
          }
        },
        headerShown: false,
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#94A3B8',
      })}
    >
      <Tab.Screen name="ClaseEjercicios" component={ClaseEjercicio} options={{ title: 'Planificación' }} />
      <Tab.Screen name="ClaseAsistencia" component={ClaseLista} options={{ title: 'Asistencia' }} />
      <Tab.Screen name="ClaseConfiguracion" component={ClaseConfiguracion} options={{ title: 'Configuración' }} />
    </Tab.Navigator>
  );
}