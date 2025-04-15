import React from 'react';
import {BottomNavigation, Icon} from 'react-native-paper';
import Home from '../screens/Home';
import Profile from '../screens/Profile';
import Report from '../screens/Report';
import {CommonActions} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={({navigation, state, descriptors, insets}) => (
        <BottomNavigation.Bar
          navigationState={state}
          safeAreaInsets={insets}
          onTabPress={({route, preventDefault}) => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (event.defaultPrevented) {
              preventDefault();
            } else {
              navigation.dispatch({
                ...CommonActions.navigate(route.name, route.params),
                target: state.key,
              });
            }
          }}
          renderIcon={({route, focused, color}) => {
            const {options} = descriptors[route.key];
            if (options.tabBarIcon) {
              return options.tabBarIcon({focused, color, size: 24});
            }

            return null;
          }}
          getLabelText={({route}) => {
            const {options} = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                ? options.title
                : route.title;

            return label;
          }}
        />
      )}>
      <Tab.Screen
        name={'Home'}
        component={Home}
        options={{
          tabBarIcon: ({color, size}) => {
            return <Icon source="home" size={size} color={color} />;
          },
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name={'Report'}
        component={Report}
        options={{
          tabBarIcon: ({color, size}) => {
            return (
              <Icon source="format-list-bulleted" size={size} color={color} />
            );
          },
          tabBarLabel: 'Report',
        }}
      />
      <Tab.Screen
        name={'Profile'}
        component={Profile}
        options={{
          tabBarIcon: ({color, size}) => {
            return <Icon source="account" size={size} color={color} />;
          },
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
}
