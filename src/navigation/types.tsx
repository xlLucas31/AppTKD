import { NavigatorScreenParams } from '@react-navigation/native';

export type ClasesTabParamList = {
  ClaseEjercicio: undefined;
  ClaseAsistencia: undefined;
  ClaseConfiguracion: undefined;
};

export type TurnosStackParamList = {
  ListaTurnos: undefined;
  TurnoConfiguracion: { id: number; label: string };
  ClasesTabs: NavigatorScreenParams<ClasesTabParamList>;
};

export type RootDrawerParamList = {
  TurnosMenu: NavigatorScreenParams<TurnosStackParamList>;
  Alumnos: undefined;
};