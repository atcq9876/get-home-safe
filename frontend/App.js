import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import "react-native-gesture-handler";
import { createStackNavigator } from "@react-navigation/stack";
import registerNNPushToken from 'native-notify';

import SplashScreen from "./screens/SplashScreen";
import Auth from "./navigation/AuthStack";
import NavbarContainer from "./navigation/NavbarContainer";

const Stack = createStackNavigator();

const App = () => {
  registerNNPushToken(6193, 'rWR1WMqaI8HcWYDUZQFStS');
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen">
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Auth"
          component={Auth}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NavbarContainer"
          component={NavbarContainer}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
