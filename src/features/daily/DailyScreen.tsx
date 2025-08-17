import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
  Easing,
  FadeInDown,
  withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
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
import { Sparkles, Calendar, TrendingUp } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

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
      { scale: interpolate(pulseAnimation.value, [0, 1], [1, 1.02]) }
    ],
  }));

  const getMotivationalText = () => {
    if (progress === 100) return 'Perfect Day! You crushed it! 🏆';
    if (progress >= 90) return 'Almost there! Finish strong! ⚡';
    if (progress >= 70) return 'Great momentum! Keep going! 🔥';
    if (progress >= 50) return "You're halfway there! 💪";
    if (progress > 0) return 'Good start! Build that momentum! 🚀';
    return 'Ready to make today count? ✨';
  };

  return (
    <View style={styles.container}>
      {/* Luxury Gradient Background matching onboarding */}
      <LinearGradient
        colors={['#0A0A0A', '#1A1A1A', '#0A0A0A']}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      {/* Subtle Gold Accent Gradient */}
      <LinearGradient
        colors={['rgba(231, 180, 58, 0.03)', 'transparent', 'rgba(231, 180, 58, 0.02)']}
        style={[StyleSheet.absoluteFillObject, { opacity: 0.5 }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
      
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Elegant Header */}
        <Animated.View 
          entering={FadeInDown.duration(600).springify()}
          style={styles.header}
        >
          <View style={styles.dateContainer}>
            <Calendar size={14} color={LuxuryTheme.colors.text.tertiary} />
            <Text style={styles.dateText}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </Text>
          </View>
          <Text style={styles.title}>Daily Mission</Text>
          <Text style={styles.subtitle}>{getMotivationalText()}</Text>
        </Animated.View>

        {/* Premium Progress Card */}
        <Animated.View 
          entering={FadeInDown.delay(100).springify()}
          style={[styles.progressCard, pulseAnimatedStyle]}
        >
          <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFillObject} />
          <LinearGradient
            colors={['rgba(231, 180, 58, 0.05)', 'rgba(231, 180, 58, 0.02)']}
            style={StyleSheet.absoluteFillObject}
          />
          
          {/* Radial Progress with Premium Styling */}
          <View style={styles.progressContainer}>
            <Animated.View style={[styles.progressWrapper, progress > 90 && glowStyle]}>
              <RadialProgress progress={progress} size={140} strokeWidth={8} />
              {progress > 90 && (
                <Animated.View style={[StyleSheet.absoluteFillObject, shimmerStyle]}>
                  <LinearGradient
                    colors={['transparent', `${LuxuryTheme.colors.primary.gold}20`, 'transparent']}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={StyleSheet.absoluteFillObject}
                  />
                </Animated.View>
              )}
            </Animated.View>
            
            <View style={styles.progressStats}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{completed}</Text>
                <Text style={styles.statLabel}>Done</Text>
              </View>
              
              <View style={styles.statDivider} />
              
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{actions.length - completed}</Text>
                <Text style={styles.statLabel}>Left</Text>
              </View>
              
              <View style={styles.statDivider} />
              
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: LuxuryTheme.colors.primary.gold }]}>
                  {Math.round(progress)}%
                </Text>
                <Text style={styles.statLabel}>Progress</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Actions Section with Premium Design */}
        {actions.length > 0 ? (
          <Animated.View 
            entering={FadeInDown.delay(200).springify()}
            style={styles.actionsSection}
          >
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <TrendingUp size={16} color={LuxuryTheme.colors.primary.gold} />
                <Text style={styles.sectionTitle}>TODAY'S ACTIONS</Text>
              </View>
              <View style={styles.sectionBadge}>
                <Text style={styles.sectionBadgeText}>{actions.length}</Text>
              </View>
            </View>
            
            <View style={styles.actionsList}>
              {actions.map((action, index) => (
                <Animated.View
                  key={action.id}
                  entering={FadeInDown.delay(250 + index * 50).springify()}
                >
                  <ActionItem 
                    id={action.id} 
                    title={action.title} 
                    goalTitle={action.goalTitle} 
                    done={action.done} 
                    streak={action.streak}
                  />
                </Animated.View>
              ))}
            </View>
          </Animated.View>
        ) : (
          <Animated.View 
            entering={FadeInDown.delay(200).springify()}
            style={styles.emptyState}
          >
            <View style={styles.emptyIcon}>
              <Sparkles size={48} color={LuxuryTheme.colors.text.tertiary} />
            </View>
            <Text style={styles.emptyTitle}>No Actions Yet</Text>
            <Text style={styles.emptySubtitle}>
              Complete your onboarding to set up your daily actions
            </Text>
          </Animated.View>
        )}

        {/* Premium Review Button */}
        {(new Date().getHours() >= 18 || allCompleted) && (
          <Animated.View 
            entering={FadeInDown.delay(400).springify()}
            style={styles.reviewButtonContainer}
          >
            <HapticButton 
              onPress={openReview} 
              style={styles.reviewButton}
              hapticType="medium"
            >
              <LinearGradient
                colors={[LuxuryTheme.colors.primary.gold, LuxuryTheme.colors.primary.champagne]}
                style={StyleSheet.absoluteFillObject}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
              <View style={styles.reviewButtonContent}>
                <Sparkles size={20} color="#000" />
                <Text style={styles.reviewButtonText}>Review Your Day</Text>
              </View>
            </HapticButton>
          </Animated.View>
        )}
      </ScrollView>

      {/* Modals and Overlays */}
      <DailyReviewModal />
      
      <SocialSharePrompt
        visible={showSharePrompt}
        onClose={() => setShowSharePrompt(false)}
        progress={progress}
        completedActions={completed}
        totalActions={actions.length}
        streak={7}
      />
      
      <ConfettiView active={allCompleted} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 24,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  dateText: {
    fontSize: 12,
    color: LuxuryTheme.colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    fontWeight: '600',
  },
  title: { 
    fontSize: 36,
    fontWeight: '300',
    color: LuxuryTheme.colors.text.primary,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: LuxuryTheme.colors.primary.gold,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  progressCard: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(231, 180, 58, 0.1)',
  },
  progressContainer: { 
    padding: 32,
    alignItems: 'center',
  },
  progressWrapper: {
    marginBottom: 24,
  },
  progressStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '600',
    color: LuxuryTheme.colors.text.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: LuxuryTheme.colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionsSection: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: LuxuryTheme.colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  sectionBadge: {
    backgroundColor: 'rgba(231, 180, 58, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(231, 180, 58, 0.2)',
  },
  sectionBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: LuxuryTheme.colors.primary.gold,
  },
  actionsList: {
    gap: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    marginBottom: 20,
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: LuxuryTheme.colors.text.primary,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: LuxuryTheme.colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 20,
  },
  reviewButtonContainer: {
    marginTop: 24,
    marginBottom: 20,
  },
  reviewButton: {
    borderRadius: 24,
    overflow: 'hidden',
    height: 56,
  },
  reviewButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    height: '100%',
  },
  reviewButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    letterSpacing: 0.5,
  },
});