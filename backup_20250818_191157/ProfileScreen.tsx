import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlassSurface } from '../../ui/GlassSurface';

export const ProfileScreen = () => {
  return (
    <View style={{ flex:1, backgroundColor:'#000', padding:16 }}>
      <GlassSurface style={{ padding:16 }}>
        <Text style={styles.name}>You</Text>
        <Text style={styles.meta}>Active goals, finished goals, and recent posts will appear here.</Text>
      </GlassSurface>
    </View>
  );
};
const styles=StyleSheet.create({
  name:{ color:'#FFF', fontSize:24, fontWeight:'800' },
  meta:{ color:'rgba(255,255,255,0.6)', marginTop:8 }
});