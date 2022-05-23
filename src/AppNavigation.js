import React, { useState, useContext, useEffect } from 'react'
import { StatusBar } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import LoginScreen from './screens/LoginScreen'
import HomeScreen from './screens/HomeScreen'
import CreateScreen from './screens/CreateScreen'
import { AuthContext } from './AuthContext'
import routes from './constants/routes'
import { Auth } from 'aws-amplify'
const Stack = createStackNavigator()

export default function AppNavigation () {
  const { isSignedIn, setIsSingedIn, setUser } = useContext(AuthContext)

  const CheckUserSession = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser()
      setUser(user)
      setIsSingedIn(true)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    CheckUserSession()
  }, [])

  return (
    <NavigationContainer>
      <StatusBar barStyle='light-content' />
      <Stack.Navigator
        screenOptions={{
          headerShown: false
        }}
      >
        {!isSignedIn ? (
          <>
            <Stack.Screen name={routes.Login} component={LoginScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name={routes.Home} component={HomeScreen} />
            <Stack.Screen name={routes.Create} component={CreateScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}
