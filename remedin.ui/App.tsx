import React from "react";
import SignInScreen from "./src/components/layout/SignInScreen";
import { AuthProvider } from "./src/contexts/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <SignInScreen />
    </AuthProvider>
  );
}
