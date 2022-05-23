import React from 'react'
import { Amplify } from 'aws-amplify'
import awsconfig from './src/aws-exports'
import AppNavigation from './src/AppNavigation'
import AuthProvider from './src/AuthContext'
Amplify.configure(awsconfig)
export default function App () {
  return (
    <AuthProvider>
      <AppNavigation />
    </AuthProvider>
  )
}
