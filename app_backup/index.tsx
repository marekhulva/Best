import React from 'react';
import { StatusBar, View, Platform, StyleSheet, Text } from 'react-native';
import { ThemeProvider } from '../providers/ThemeProvider';
import { RootNav } from '../navigation';

export default function Index() {
  // Debug: Show platform
  console.log('Platform.OS:', Platform.OS);
  
  if (Platform.OS === 'web') {
    return (
      <ThemeProvider>
        <View style={styles.webContainer}>
          <Text style={{ color: 'white', position: 'absolute', top: 20, zIndex: 100 }}>
            Web Platform Detected
          </Text>
          <View style={styles.phoneFrame}>
            <StatusBar barStyle="light-content" />
            <RootNav />
          </View>
        </View>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <View style={styles.mobileContainer}>
        <StatusBar barStyle="light-content" />
        <RootNav />
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  webContainer: {
    position: 'absolute' as any,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)' as any,
    display: 'flex' as any,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneFrame: {
    width: 375,  // iPhone standard width
    height: 667, // iPhone 8 height (or use 812 for iPhone X)
    backgroundColor: '#000',
    borderRadius: 35,
    overflow: 'hidden',
    boxShadow: '0 25px 80px rgba(255,215,0,0.2), 0 15px 40px rgba(192,192,192,0.15)' as any,
    border: '6px solid #222' as any,
    position: 'relative' as any,
    transform: 'scale(0.85)' as any, // Scale down to fit better on screen
  },
  mobileContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
});