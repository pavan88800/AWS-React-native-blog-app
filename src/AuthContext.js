import React, { createContext, useState } from 'react'

export const AuthContext = createContext()

const AuthProvider = ({ children }) => {
  const [isSignedIn, setIsSingedIn] = useState(false)
  const [user, setUser] = useState('')
  return (
    <AuthContext.Provider
      value={{
        isSignedIn,
        setIsSingedIn,
        user,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
