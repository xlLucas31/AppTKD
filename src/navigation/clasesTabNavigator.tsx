import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ClaseEjercicio from '../screens/claseEjercicios';
import ClaseLista from '../screens/claseAsistencia';
import ClaseConfiguracion from '../screens/claseConfiguracion';
import { ClasesTabParamList } from './types';

const Tab = createBottomTabNavigator<ClasesTabParamList>();

export default function ClaseTabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="ClaseEjercicio" component={ClaseEjercicio} />
      <Tab.Screen name="ClaseAsistencia" component={ClaseLista} />
      <Tab.Screen name="ClaseConfiguracion" component={ClaseConfiguracion} />
    </Tab.Navigator>
  );
}