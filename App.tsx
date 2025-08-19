import React from 'react';
import { StatusBar, View } from 'react-native';
import { ThemeProvider } from './providers/ThemeProvider';
import { AppConfig } from './src/config/app.config';

// Import both implementations
import { AppWithAuth } from './src/AppWithAuth'; // Custom backend
import AppSupabase from './src/AppSupabase'; // Supabase backend

export default function App() {
  // Choose which app to use based on configuration
  const AppComponent = AppConfig.backend === 'supabase' ? AppSupabase : AppWithAuth;
  
  return (
    <ThemeProvider>
      <View style={{ flex:1, backgroundColor:'#000' }}>
        <StatusBar barStyle="light-content" />
        <AppComponent />
      </View>
    </ThemeProvider>
  );
}