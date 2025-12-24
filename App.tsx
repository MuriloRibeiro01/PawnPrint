import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Activity, Home, MapPin, User } from 'lucide-react-native';

// Importar suas Telas (Certifique-se que esses arquivos existem em src/screens)
// Nota: Talvez você precise renomear PetDashboard para HomeScreen ou vice-versa
import { PetDashboard } from './src/dashboard/PetDashboard'; 
import { LocationMap } from './src/map/LocationMap';
import { HealthMonitor } from './src/health/HealthMonitor';
import { ProfileScreen } from './src/screens/ProfileScreen';

// Cria o objeto de navegação
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    // 1. Provedor de Área Segura (Evita o notch do iPhone)
    <SafeAreaProvider>
      
      {/* 2. Barra de Status do celular (Bateria, Hora) */}
      <StatusBar style="dark" />

      {/* 3. Container Principal de Navegação */}
      <NavigationContainer>
        
        {/* 4. Configurador das Abas */}
        <Tab.Navigator
          screenOptions={{
            headerShown: false, // Esconde o cabeçalho padrão feio "Início"
            tabBarActiveTintColor: '#f97316', // Laranja (Cor da sua marca)
            tabBarInactiveTintColor: '#6b7280', // Cinza
            tabBarStyle: {
              paddingBottom: 5,
              paddingTop: 5,
              height: 60,
            }
          }}
        >
          <Tab.Screen 
            name="Início" 
            component={PetDashboard} 
            options={{
              tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
              tabBarLabel: 'Início'
            }}
          />

          <Tab.Screen 
            name="Mapa" 
            component={LocationMap} 
            options={{
              tabBarIcon: ({ color, size }) => <MapPin size={size} color={color} />,
              tabBarLabel: 'Mapa'
            }}
          />

          <Tab.Screen 
            name="Saúde" 
            component={HealthMonitor} 
            options={{
              tabBarIcon: ({ color, size }) => <Activity size={size} color={color} />,
              tabBarLabel: 'Saúde'
            }}
          />

          <Tab.Screen 
            name="Perfil" 
            component={ProfileScreen} 
            options={{
              tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
              tabBarLabel: 'Perfil'
            }}
          />

        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}