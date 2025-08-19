import React from 'react';
import { StatusBar, View } from 'react-native';
import { ThemeProvider } from './providers/ThemeProvider';
import { AppWithAuth } from './src/AppWithAuth';

export default function App() {
  return (
    <ThemeProvider>
      <View style={{ flex:1, backgroundColor:'#000' }}>
        <StatusBar barStyle="light-content" />
        <AppWithAuth />
      </View>
    </ThemeProvider>
  );
}