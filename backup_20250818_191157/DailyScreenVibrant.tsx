import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
  Easing,
  withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useStore } from '../../state/rootStore';
import { LuxuryGradientBackground } from '../../ui/LuxuryGradientBackground';
import { GoldParticles } from '../../ui/GoldParticles';
import { LuxuryTheme } from '../../design/luxuryTheme';
import { ActionItem } from './ActionItem';
import { DailyReviewModal } from './DailyReviewModalEnhanced';

const { width } = Dimensions.get('window');

export const DailyScreenVibrant = () => {
  const actions = useStore(s => s.actions);
  const completed = actions.filter(a => a.done).length;
  const progress = actions.length ? (completed / actions.length) * 100 : 0;
  const openReview = useStore(s => s.openDailyReview);
  const [showCelebration, setShowCelebration] = useState(false);
  
  const pulseAnimation = useSharedValue(0);
  const progressScale = useSharedValue(1);
  const glowIntensity = useSharedValue(0);

  useEffect(() => {
    // Animate progress changes
    progressScale.value = withSpring(1.1, {}, () => {
      progressScale.value = withSpring(1);
    });

    // Glow effect based on progress
    glowIntensity.value = withTiming(progress / 100, { duration: 500 });

    // Celebration at 100%
    if (progress === 100 && !showCelebration) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  }, [progress]);

  useEffect(() => {
    // Continuous pulse for evening review
    const hour = new Date().getHours();
    if (hour >= 18) {
      pulseAnimation.value = withRepeat(
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    }
  }, []);

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: progressScale.value }],
  }));

  const glowAnimatedStyle = useAnimatedStyle(() => ({
    shadowOpacity: interpolate(glowIntensity.value, [0, 1], [0.3, 0.8]),
    shadowRadius: interpolate(glowIntensity.value, [0, 1], [10, 30]),
  }));

  const pulseAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: interpolate(pulseAnimation.value, [0, 1], [1, 1.05]) }
    ],
    opacity: interpolate(pulseAnimation.value, [0, 1], [0.9, 1]),
  }));

  return (
    <View style={styles.container}>
      <LuxuryGradientBackground variant="gold">
        <GoldParticles
          variant="gold"
          particleCount={12}
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header with progress */}
          <BlurView intensity={30} tint="dark" style={styles.headerCard}>
            <LinearGradient
              colors={['rgba(255,215,0,0.08)', 'rgba(192,192,192,0.03)']}
              style={StyleSheet.absoluteFillObject}
            />
            
            <View style={styles.headerContent}>
              <Text style={styles.greeting}>
                {new Date().getHours() < 12 ? '☀️ Good Morning!' : 
                 new Date().getHours() < 18 ? '🌤️ Good Afternoon!' : 
                 '🌅 Good Evening!'}
              </Text>
              
              {/* Animated Progress Ring */}
              <Animated.View style={[progressAnimatedStyle, glowAnimatedStyle, styles.progressContainer]}>
                <View style={styles.progressRing}>
                  <LinearGradient
                    colors={['#FFD700', '#F7E7CE', '#FFD700']}
                    style={styles.progressGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  />
                  <View style={styles.progressInner}>
                    <Text style={styles.progressNumber}>{Math.round(progress)}</Text>
                    <Text style={styles.progressLabel}>%</Text>
                  </View>
                </View>
              </Animated.View>

              <View style={styles.statsRow}>
                <View style={styles.statCard}>
                  <LinearGradient
                    colors={['rgba(255,215,0,0.15)', 'rgba(255,215,0,0.05)']}
                    style={StyleSheet.absoluteFillObject}
                  />
                  <Text style={styles.statNumber}>{completed}</Text>
                  <Text style={styles.statLabel}>Done</Text>
                </View>
                <View style={styles.statCard}>
                  <LinearGradient
                    colors={['rgba(192,192,192,0.15)', 'rgba(192,192,192,0.05)']}
                    style={StyleSheet.absoluteFillObject}
                  />
                  <Text style={styles.statNumber}>{actions.length - completed}</Text>
                  <Text style={styles.statLabel}>Left</Text>
                </View>
              </View>
            </View>
          </BlurView>

          {/* Actions Title */}
          <View style={styles.sectionHeader}>
            <LinearGradient
              colors={['#FFD700', '#C0C0C0']}
              style={styles.sectionGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.sectionTitle}>Today's Actions</Text>
            </LinearGradient>
          </View>

          {/* Action Items with colorful accents */}
          <View style={styles.actionsContainer}>
            {actions.map((action, index) => (
              <View key={action.id} style={styles.actionWrapper}>
                <ActionItem
                  id={action.id}
                  title={action.title}
                  goalTitle={action.goalTitle}
                  done={action.done}
                  streak={action.streak}
                  goalColor={['#FFD700', '#C0C0C0', '#F7E7CE', '#E5E4E2'][index % 4]}
                />
              </View>
            ))}
          </View>

          {/* Review Button */}
          <Animated.View style={pulseAnimatedStyle}>
            <LinearGradient
              colors={['#FFD700', '#F7E7CE']}
              style={styles.reviewButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <BlurView intensity={20} tint="light" style={styles.reviewButtonInner}>
                <Text style={styles.reviewButtonText} onPress={openReview}>
                  ✨ Review Your Day
                </Text>
              </BlurView>
            </LinearGradient>
          </Animated.View>

          {/* Motivational Quote */}
          <BlurView intensity={30} tint="dark" style={styles.quoteCard}>
            <LinearGradient
              colors={['rgba(255,215,0,0.05)', 'rgba(192,192,192,0.05)']}
              style={StyleSheet.absoluteFillObject}
            />
            <Text style={styles.quoteText}>
              "Every sunrise is an opportunity to reset and shine brighter"
            </Text>
          </BlurView>
        </ScrollView>

        <DailyReviewModal />
      </LuxuryGradientBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  headerCard: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  headerContent: {
    padding: 20,
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 20,
    textShadowColor: 'rgba(255,215,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  progressContainer: {
    marginVertical: 20,
    shadowColor: '#FFD700',
  },
  progressRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    padding: 8,
    overflow: 'hidden',
  },
  progressGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  progressInner: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressNumber: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  progressLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  statCard: {
    borderRadius: 16,
    padding: 16,
    minWidth: 80,
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
  sectionHeader: {
    marginVertical: 16,
  },
  sectionGradient: {
    borderRadius: 16,
    padding: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  actionsContainer: {
    gap: 8,
  },
  actionWrapper: {
    marginBottom: 4,
  },
  reviewButton: {
    borderRadius: 20,
    padding: 2,
    marginTop: 24,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
  },
  reviewButtonInner: {
    borderRadius: 18,
    padding: 18,
    overflow: 'hidden',
  },
  reviewButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  quoteCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  quoteText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 24,
  },
});