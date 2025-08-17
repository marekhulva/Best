import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../../state/rootStore';
import { GlassSurface } from '../../ui/GlassSurface';
import { RadialProgress } from '../../ui/RadialProgress';
import { HapticButton } from '../../ui/HapticButton';
import { ConfettiView } from '../../ui/ConfettiView';
import { useShimmer } from '../../design/useShimmer';
import { DailyReviewModal } from './DailyReviewModalEnhanced';
import { ActionItem } from './ActionItem';
import { SocialSharePrompt } from '../social/SocialSharePrompt';
import { LuxuryTheme } from '../../design/luxuryTheme';

const { width } = Dimensions.get('window');

export const DailyScreen = () => {
  const actions = useStore(s=>s.actions);
  const completed = actions.filter(a=>a.done).length;
  const progress = actions.length ? (completed/actions.length)*100 : 0;
  const openReview = useStore(s=>s.openDailyReview);
  const [showSharePrompt, setShowSharePrompt] = useState(false);
  const allCompleted = actions.length > 0 && completed === actions.length;
  const pulseAnimation = useSharedValue(0);
  const { shimmerStyle, glowStyle } = useShimmer(progress > 90);
  
  // Show share prompt when progress reaches milestones
  useEffect(() => {
    if (progress >= 70 && progress < 100 && !showSharePrompt) {
      setTimeout(() => setShowSharePrompt(true), 2000);
    }
  }, [progress]);

  // Pulse animation for Review Day button in evening
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 18) { // After 6 PM
      pulseAnimation.value = withRepeat(
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    }
  }, []);

  const pulseAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: interpolate(pulseAnimation.value, [0, 1], [1, 1.05]) }
    ],
    opacity: interpolate(pulseAnimation.value, [0, 1], [0.9, 1]),
  }));

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={LuxuryTheme.gradientPresets.obsidianDepth}
        style={StyleSheet.absoluteFillObject}
      />
      
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.dateText}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </Text>
          <Text style={styles.title}>Today's Mission</Text>
        </View>

        {/* Centered radial progress with shimmer */}
        <View style={styles.progressContainer}>
          <Animated.View style={[styles.progressWrapper, progress > 90 && glowStyle]}>
            <RadialProgress progress={progress} size={180} strokeWidth={12} />
            {progress > 90 && (
              <Animated.View style={[StyleSheet.absoluteFillObject, shimmerStyle]}>
                <LinearGradient
                  colors={['transparent', `${LuxuryTheme.colors.primary.gold}30`, 'transparent']}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={StyleSheet.absoluteFillObject}
                />
              </Animated.View>
            )}
          </Animated.View>
          <Text style={styles.progressText}>{completed}/{actions.length} Actions</Text>
          {progress > 90 && <Text style={styles.motivationalText}>Almost there! Keep going! 🔥</Text>}
        </View>

        {/* Progress Card */}
        <GlassSurface 
          style={styles.progressCard}
          neonGlow={progress > 90 ? 'gold' : 'none'}
        >
          <Text style={styles.subtle}>
            {progress === 100 ? '🎉 Perfect day! Review your wins!' : 
             progress > 90 ? '⚡ Almost there! Finish strong!' :
             'Complete your actions to keep the streak alive.'}
          </Text>
        </GlassSurface>

        {/* Actions List */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Actions</Text>
          {actions.map(a => (
            <ActionItem 
              key={a.id} 
              id={a.id} 
              title={a.title} 
              goalTitle={a.goalTitle} 
              done={a.done} 
              streak={a.streak}
            />
          ))}
        </View>

        {/* Review Button - Shows in evening or when all completed */}
        {(new Date().getHours() >= 18 || allCompleted) && (
          <Animated.View style={[styles.reviewButtonContainer, pulseAnimatedStyle]}>
            <HapticButton onPress={openReview} style={styles.reviewButton}>
              <LinearGradient
                colors={[LuxuryTheme.colors.primary.gold, LuxuryTheme.colors.primary.champagne]}
                style={StyleSheet.absoluteFillObject}
              />
              <Text style={styles.reviewButtonText}>✨ Review Your Day</Text>
            </HapticButton>
          </Animated.View>
        )}
      </ScrollView>

      {/* Modal lives at screen root; stays decoupled */}
      <DailyReviewModal />
      
      {/* Social Share Prompt */}
      <SocialSharePrompt
        visible={showSharePrompt}
        onClose={() => setShowSharePrompt(false)}
        progress={progress}
        completedActions={completed}
        totalActions={actions.length}
        streak={7}
      />
      
      {/* Confetti when all actions completed */}
      <ConfettiView active={allCompleted} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LuxuryTheme.colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 32,
  },
  dateText: {
    fontSize: 13,
    color: LuxuryTheme.colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  title: { 
    color: LuxuryTheme.colors.text.primary, 
    fontSize: 32, 
    fontWeight: 'bold', 
    marginBottom: 4,
  },
  progressContainer: { 
    alignItems: 'center', 
    marginVertical: 32,
  },
  progressWrapper: {
    marginBottom: 16,
  },
  progressText: {
    color: LuxuryTheme.colors.text.primary,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  motivationalText: {
    color: LuxuryTheme.colors.primary.gold,
    fontSize: 16,
    fontWeight: '600',
  },
  progressCard: {
    padding: 20,
    marginBottom: 24,
    borderRadius: 20,
    backgroundColor: LuxuryTheme.colors.background.card,
    borderWidth: 1,
    borderColor: LuxuryTheme.colors.background.cardBorder,
  },
  subtle: {
    color: LuxuryTheme.colors.text.secondary,
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  actionsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: LuxuryTheme.colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },
  reviewButtonContainer: {
    marginTop: 24,
    marginBottom: 20,
  },
  reviewButton: {
    borderRadius: 20,
    overflow: 'hidden',
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
  },
});