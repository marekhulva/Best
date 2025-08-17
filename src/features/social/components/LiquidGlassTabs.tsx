import React from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { LuxuryTheme } from '../../../design/luxuryTheme';
import { LuxuryColors } from '../../../design/luxuryColors';
import { isFeatureEnabled } from '../../../utils/featureFlags';

const { width } = Dimensions.get('window');
const TAB_WIDTH = (width - 48) / 2;

interface LiquidGlassTabsProps {
  activeTab: 'circle' | 'follow';
  onTabChange: (tab: 'circle' | 'follow') => void;
}

export const LiquidGlassTabs: React.FC<LiquidGlassTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  const slideAnim = useSharedValue(activeTab === 'circle' ? 0 : 1);
  const glowAnim = useSharedValue(0);
  const isLuxury = true; // Always use luxury theme to match onboarding
  const styles = React.useMemo(() => createStyles(isLuxury), [isLuxury]);

  React.useEffect(() => {
    slideAnim.value = withSpring(activeTab === 'circle' ? 0 : 1, {
      damping: 20,
      stiffness: 200,
    });
    
    // Pulse glow on change
    glowAnim.value = withTiming(1, { duration: 200 }, () => {
      glowAnim.value = withTiming(0, { duration: 400 });
    });
  }, [activeTab]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{
      translateX: interpolate(slideAnim.value, [0, 1], [0, TAB_WIDTH]),
    }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(glowAnim.value, [0, 1], [0.5, 1]),
  }));

  return (
    <View style={styles.container}>
      <BlurView intensity={isLuxury ? 10 : 30} tint="dark" style={[
        styles.blurContainer,
        isLuxury && typeof LuxuryColors !== 'undefined' && { backgroundColor: LuxuryColors.black.pure }
      ]}>
        {/* Conditional gradient based on luxury theme */}
        {!isLuxury ? (
          <>
            <LinearGradient
              colors={['#E7B43A', '#C0C0C0', '#E7B43A']}
              style={[StyleSheet.absoluteFillObject, { opacity: 0.15 }]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              locations={[0, 0.5, 1]}
            />
            <LinearGradient
              colors={['rgba(18,18,18,0.7)', 'rgba(18,18,18,0.85)']}
              style={StyleSheet.absoluteFillObject}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            />
          </>
        ) : null}
        
        {/* Active indicator with conditional styling */}
        <Animated.View style={[styles.indicator, indicatorStyle]}>
          {isLuxury && typeof LuxuryColors !== 'undefined' ? (
            <View style={[styles.indicatorGradient, { backgroundColor: LuxuryColors.glow.goldSubtle }]} />
          ) : (
            <LinearGradient
              colors={activeTab === 'circle' ? 
                ['rgba(231,180,58,0.3)', 'rgba(231,180,58,0.15)'] : 
                ['rgba(192,192,192,0.3)', 'rgba(192,192,192,0.15)']
              }
              style={styles.indicatorGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          )}
          <Animated.View style={[
            styles.indicatorGlow, 
            glowStyle,
            isLuxury && typeof LuxuryColors !== 'undefined' && { borderColor: LuxuryColors.gold.primary }
          ]} />
        </Animated.View>
        
        {/* Tab buttons */}
        <View style={styles.tabsRow}>
          <Pressable
            style={styles.tab}
            onPress={() => onTabChange('circle')}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'circle' && styles.tabTextActive,
              isLuxury && typeof LuxuryColors !== 'undefined' && { 
                color: activeTab === 'circle' ? LuxuryColors.gold.primary : LuxuryColors.silver.bright 
              }
            ]}>
              {!isLuxury && '👥 '}Circle
            </Text>
            {activeTab === 'circle' && (
              <Animated.View style={[styles.underline, glowStyle]}>
                {isLuxury && typeof LuxuryColors !== 'undefined' ? (
                  <View style={[styles.underlineGradient, { backgroundColor: LuxuryColors.gold.primary }]} />
                ) : (
                  <LinearGradient
                    colors={['#FFD700', '#FFA500', '#FFD700']}
                    style={styles.underlineGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    locations={[0, 0.5, 1]}
                  />
                )}
              </Animated.View>
            )}
          </Pressable>
          
          <Pressable
            style={styles.tab}
            onPress={() => onTabChange('follow')}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'follow' && styles.tabTextActive,
              isLuxury && typeof LuxuryColors !== 'undefined' && { 
                color: activeTab === 'follow' ? LuxuryColors.gold.primary : LuxuryColors.silver.bright 
              }
            ]}>
              {!isLuxury && '🌍 '}Following
            </Text>
            {activeTab === 'follow' && (
              <Animated.View style={[styles.underline, glowStyle]}>
                {isLuxury && typeof LuxuryColors !== 'undefined' ? (
                  <View style={[styles.underlineGradient, { backgroundColor: LuxuryColors.gold.primary }]} />
                ) : (
                  <LinearGradient
                    colors={['#C0C0C0', '#E5E4E2', '#C0C0C0']}
                    style={styles.underlineGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    locations={[0, 0.5, 1]}
                  />
                )}
              </Animated.View>
            )}
          </Pressable>
        </View>
      </BlurView>
    </View>
  );
};

const createStyles = (isLuxury: boolean) => StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginVertical: 16,
    height: 56,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(231, 180, 58, 0.1)',
    shadowColor: LuxuryTheme.colors.primary.gold,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: isLuxury ? 8 : 12,
    elevation: isLuxury ? 3 : 5,
  },
  blurContainer: {
    flex: 1,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: isLuxury && typeof LuxuryColors !== 'undefined' ? LuxuryColors.gold.primary : 'rgba(255,255,255,0.15)',
    backgroundColor: isLuxury && typeof LuxuryColors !== 'undefined' ? LuxuryColors.black.pure : 'rgba(18,18,18,0.5)',
  },
  indicator: {
    position: 'absolute',
    width: TAB_WIDTH,
    height: '100%',
    borderRadius: 24,
    overflow: 'hidden',
  },
  indicatorGradient: {
    flex: 1,
    borderRadius: 24,
  },
  indicatorGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  tabsRow: {
    flexDirection: 'row',
    flex: 1,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '700',
    color: isLuxury && typeof LuxuryColors !== 'undefined' ? LuxuryColors.silver.bright : 'rgba(255,255,255,0.5)',
    letterSpacing: 0.5,
  },
  tabTextActive: {
    color: isLuxury && typeof LuxuryColors !== 'undefined' ? LuxuryColors.gold.primary : '#FFFFFF',
    textShadowColor: isLuxury && typeof LuxuryColors !== 'undefined' ? LuxuryColors.glow.gold : 'rgba(255,255,255,0.6)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: isLuxury ? 6 : 10,
    fontWeight: '800',
  },
  underline: {
    position: 'absolute',
    bottom: 6,
    width: '70%',
    height: 3,
    borderRadius: 2,
    overflow: 'hidden',
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
  },
  underlineGradient: {
    flex: 1,
  },
});