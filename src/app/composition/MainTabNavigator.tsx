import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { ClipboardCheck, ClipboardList, History, Home, Settings, Users } from 'lucide-react-native';
import { DashboardScreen } from '../features/dashboard';
import { HistoryListScreen } from '../features/history';
import { ParticipantDetailScreen, ParticipantsListScreen } from '../features/participants';
import { ProtocolsCatalogScreen } from '../features/protocols';
import { IVCFScreen } from '../features/questionnaire';
import { SettingsScreen } from '../features/settings';
import { AppTabBar } from '../navigation';
import { Colors, Participant } from '../shared';
import { MainTabParamList, RootStackParamList } from './AppRouteTypes';

export type ParticipantsTabStackParamList = {
  ParticipantsList: undefined;
  ParticipantDetail: { participant: Participant };
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const ParticipantsStack = createNativeStackNavigator<ParticipantsTabStackParamList>();

const ParticipantsStackNavigator: React.FC = () => {
  const rootNav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <ParticipantsStack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <ParticipantsStack.Screen name="ParticipantsList">
        {({ navigation }) => (
          <ParticipantsListScreen
            onSelectParticipant={(participant) =>
              navigation.navigate('ParticipantDetail', { participant })
            }
            onAddNewParticipant={() => rootNav.navigate('AddParticipant')}
          />
        )}
      </ParticipantsStack.Screen>

      <ParticipantsStack.Screen name="ParticipantDetail">
        {({ route, navigation }) => (
          <ParticipantDetailScreen
            participant={route.params.participant}
            onBack={() => navigation.goBack()}
          />
        )}
      </ParticipantsStack.Screen>
    </ParticipantsStack.Navigator>
  );
};

export const MainTabNavigator: React.FC = () => {
  const rootNav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <Tab.Navigator
      tabBar={(props) => <AppTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen
        name="DashboardTab"
        options={{
          tabBarLabel: 'Início',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      >
        {() => (
          <DashboardScreen
            onStartAssessment={() => rootNav.navigate('SelectProtocol', {})}
            onOpenSettings={() => rootNav.navigate('MainTabs', { screen: 'SettingsTab' })}
          />
        )}
      </Tab.Screen>

      <Tab.Screen
        name="ProtocolsTab"
        options={{
          tabBarLabel: 'Avaliações',
          tabBarIcon: ({ color, size }) => <ClipboardList size={size} color={color} />,
        }}
      >
        {() => (
          <ProtocolsCatalogScreen
            onSelectProtocol={(protocol) =>
              rootNav.navigate('SelectParticipant', { protocol, selectMode: 'select' })
            }
          />
        )}
      </Tab.Screen>

      <Tab.Screen
        name="QuestionnairesTab"
        options={{
          tabBarLabel: 'IVCF-20',
          tabBarIcon: ({ color, size }) => <ClipboardCheck size={size} color={color} />,
          tabBarStyle: { display: 'none' },
        }}
        component={IVCFScreen}
      />

      <Tab.Screen
        name="HistoryTab"
        options={{
          tabBarLabel: 'Histórico',
          tabBarIcon: ({ color, size }) => <History size={size} color={color} />,
        }}
      >
        {() => (
          <HistoryListScreen
            onSelectAssessment={(assessment) =>
              rootNav.navigate('EvaluationDetail', { assessment })
            }
            onStartNewAssessment={() =>
              rootNav.navigate('SelectProtocol', {})
            }
          />
        )}
      </Tab.Screen>

      <Tab.Screen
        name="ParticipantsTab"
        options={{
          tabBarLabel: 'Participantes',
          tabBarIcon: ({ color, size }) => <Users size={size} color={color} />,
        }}
        component={ParticipantsStackNavigator}
      />

      <Tab.Screen
        name="SettingsTab"
        options={{
          tabBarLabel: 'Configurações',
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
          tabBarItemStyle: { display: 'none' },
        }}
      >
        {() => (
          <SettingsScreen
            onLogout={() => rootNav.navigate('Login')}
            onBack={() => rootNav.navigate('MainTabs', { screen: 'DashboardTab' })}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
};
