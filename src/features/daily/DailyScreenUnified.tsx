import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { 
  CheckCircle2, Circle, Clock, Calendar, Zap, 
  RefreshCw, Target, TrendingUp, Sparkles, Award
} from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  FadeIn,
  FadeInDown,
  Layout,
} from 'react-native-reanimated';
import { useStore } from '../../state/rootStore';
import { HapticButton } from '../../ui/HapticButton';
import { LuxuryTheme } from '../../design/luxuryTheme';
import * as Haptics from 'expo-haptics';
import { DailyReviewModal } from './DailyReviewModalEnhanced';

const { width, height } = Dimensions.get('window');

export const DailyScreenUnified = () => {
  const actions = useStore(s => s.actions);
  const toggleAction = useStore(s => s.toggleAction);
  const goals = useStore(s => s.goals);
  const openReview = useStore(s => s.openDailyReview);
  
  const completed = actions.filter(a => a.done).length;
  const progress = actions.length ? (completed / actions.length) * 100 : 0;
  
  const commitments = actions.filter(a => a.type === 'commitment');
  const oneTimeActions = actions.filter(a => a.type === 'one-time');
  
  const progressWidth = useSharedValue(0);
  const glowOpacity = useSharedValue(0);

  useEffect(() => {
    progressWidth.value = withTiming(progress, { duration: 600 });
    glowOpacity.value = withSequence(
      withTiming(0.6, { duration: 300 }),
      withTiming(0.3, { duration: 300 })
    );
  }, [progress]);

  const progressBarStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  const handleToggle = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleAction(id);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Animated.View entering={FadeIn.duration(600)}>
        <Text style={styles.dateText}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </Text>
        <Text style={styles.greeting}>Today's Mission</Text>
        
        <View style={styles.progressCard}>
          <LinearGradient
            colors={['rgba(231, 180, 58, 0.08)', 'rgba(231, 180, 58, 0.02)']}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Daily Progress</Text>
            <Text style={styles.progressPercentage}>{Math.round(progress)}%</Text>
          </View>
          
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBg} />
            <Animated.View style={[styles.progressBarFill, progressBarStyle]}>
              <LinearGradient
                colors={[LuxuryTheme.colors.primary.gold, LuxuryTheme.colors.primary.champagne]}
                style={StyleSheet.absoluteFillObject}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            </Animated.View>
          </View>
          
          <View style={styles.progressStats}>
            <View style={styles.progressStat}>
              <Text style={styles.progressStatNumber}>{completed}</Text>
              <Text style={styles.progressStatLabel}>Completed</Text>
            </View>
            <View style={styles.progressStatDivider} />
            <View style={styles.progressStat}>
              <Text style={styles.progressStatNumber}>{actions.length - completed}</Text>
              <Text style={styles.progressStatLabel}>Remaining</Text>
            </View>
            <View style={styles.progressStatDivider} />
            <View style={styles.progressStat}>
              <Text style={styles.progressStatNumber}>{actions.length}</Text>
              <Text style={styles.progressStatLabel}>Total</Text>
            </View>
          </View>
        </View>
      </Animated.View>
    </View>
  );

  const renderActionCard = (action: any, index: number) => {
    const isCommitment = action.type === 'commitment';
    const Icon = isCommitment ? RefreshCw : Zap;
    
    return (
      <Animated.View
        key={action.id}
        entering={FadeInDown.delay(index * 50).springify()}
        layout={Layout.springify()}
      >
        <HapticButton
          hapticType="light"
          onPress={() => handleToggle(action.id)}
          style={[styles.actionCard, action.done && styles.actionCardCompleted]}
        >
          <View style={styles.actionCardContent}>
            <View style={styles.actionLeft}>
              <TouchableOpacity
                onPress={() => handleToggle(action.id)}
                style={styles.checkbox}
              >
                {action.done ? (
                  <View style={styles.checkboxChecked}>
                    <LinearGradient
                      colors={[LuxuryTheme.colors.primary.gold, LuxuryTheme.colors.primary.champagne]}
                      style={StyleSheet.absoluteFillObject}
                    />
                    <CheckCircle2 color="#000" size={20} strokeWidth={3} />
                  </View>
                ) : (
                  <Circle color={LuxuryTheme.colors.text.tertiary} size={24} />
                )}
              </TouchableOpacity>
              
              <View style={styles.actionInfo}>
                <Text style={[styles.actionTitle, action.done && styles.actionTitleCompleted]}>
                  {action.title}
                </Text>
                <View style={styles.actionMeta}>
                  {action.goalTitle && (
                    <View style={styles.actionMetaItem}>
                      <Target size={12} color={LuxuryTheme.colors.text.tertiary} />
                      <Text style={styles.actionMetaText}>{action.goalTitle}</Text>
                    </View>
                  )}
                  {action.time && (
                    <View style={styles.actionMetaItem}>
                      <Clock size={12} color={LuxuryTheme.colors.text.tertiary} />
                      <Text style={styles.actionMetaText}>{action.time}</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
            
            <View style={styles.actionRight}>
              {action.streak > 0 && (
                <View style={styles.streakBadge}>
                  <Text style={styles.streakNumber}>{action.streak}</Text>
                  <Text style={styles.streakLabel}>streak</Text>
                </View>
              )}
              <View style={[styles.actionTypeIcon, { 
                backgroundColor: isCommitment ? 'rgba(34, 197, 94, 0.1)' : 'rgba(231, 180, 58, 0.1)' 
              }]}>
                <Icon 
                  size={16} 
                  color={isCommitment ? '#22C55E' : LuxuryTheme.colors.primary.gold} 
                />
              </View>
            </View>
          </View>
        </HapticButton>
      </Animated.View>
    );
  };

  const renderSection = (title: string, items: any[], icon: any) => {
    if (items.length === 0) return null;
    
    const IconComponent = icon;
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <IconComponent size={20} color={LuxuryTheme.colors.primary.gold} />
          <Text style={styles.sectionTitle}>{title}</Text>
          <View style={styles.sectionCount}>
            <Text style={styles.sectionCountText}>{items.length}</Text>
          </View>
        </View>
        
        {items.map((action, index) => renderActionCard(action, index))}
      </View>
    );
  };

  const renderEmptyState = () => (
    <Animated.View 
      entering={FadeIn.duration(600)}
      style={styles.emptyState}
    >
      <View style={styles.emptyStateIcon}>
        <Sparkles size={48} color={LuxuryTheme.colors.text.tertiary} />
      </View>
      <Text style={styles.emptyStateTitle}>No Actions Yet</Text>
      <Text style={styles.emptyStateSubtitle}>
        Complete your onboarding to add daily commitments and actions
      </Text>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={LuxuryTheme.gradientPresets.obsidianDepth}
        style={StyleSheet.absoluteFillObject}
      />
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderHeader()}
        
        {actions.length === 0 ? (
          renderEmptyState()
        ) : (
          <>
            {renderSection('Daily Commitments', commitments, RefreshCw)}
            {renderSection('One-Time Actions', oneTimeActions, Zap)}
          </>
        )}
        
        {progress === 100 && (
          <Animated.View 
            entering={FadeInDown.springify()}
            style={styles.completionCard}
          >
            <LinearGradient
              colors={['rgba(231, 180, 58, 0.15)', 'rgba(231, 180, 58, 0.05)']}
              style={StyleSheet.absoluteFillObject}
            />
            <Award size={32} color={LuxuryTheme.colors.primary.gold} />
            <Text style={styles.completionTitle}>Perfect Day!</Text>
            <Text style={styles.completionSubtitle}>You've completed all tasks</Text>
          </Animated.View>
        )}
        
        {/* Review Button for Evening */}
        {new Date().getHours() >= 18 && (
          <Animated.View 
            entering={FadeInDown.springify()}
            style={styles.reviewButtonContainer}
          >
            <HapticButton
              hapticType="medium"
              onPress={openReview}
              style={styles.reviewButton}
            >
              <LinearGradient
                colors={[LuxuryTheme.colors.primary.gold, LuxuryTheme.colors.primary.champagne]}
                style={StyleSheet.absoluteFillObject}
              />
              <Text style={styles.reviewButtonText}>✨ Review Your Day</Text>
            </HapticButton>
          </Animated.View>
        )}
      </ScrollView>
      
      <DailyReviewModal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LuxuryTheme.colors.background.primary,
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
  greeting: {
    fontSize: 32,
    fontWeight: 'bold',
    color: LuxuryTheme.colors.text.primary,
    marginBottom: 24,
  },
  progressCard: {
    backgroundColor: LuxuryTheme.colors.background.card,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: LuxuryTheme.colors.background.cardBorder,
    overflow: 'hidden',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: LuxuryTheme.colors.text.primary,
  },
  progressPercentage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: LuxuryTheme.colors.primary.gold,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 20,
  },
  progressBarBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  progressStat: {
    alignItems: 'center',
    flex: 1,
  },
  progressStatNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: LuxuryTheme.colors.text.primary,
    marginBottom: 4,
  },
  progressStatLabel: {
    fontSize: 11,
    color: LuxuryTheme.colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  progressStatDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: LuxuryTheme.colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    flex: 1,
  },
  sectionCount: {
    backgroundColor: 'rgba(231, 180, 58, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sectionCountText: {
    fontSize: 12,
    fontWeight: '600',
    color: LuxuryTheme.colors.primary.gold,
  },
  actionCard: {
    backgroundColor: LuxuryTheme.colors.background.card,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: LuxuryTheme.colors.background.cardBorder,
    overflow: 'hidden',
  },
  actionCardCompleted: {
    opacity: 0.7,
    backgroundColor: 'rgba(231, 180, 58, 0.05)',
  },
  actionCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    marginRight: 16,
  },
  checkboxChecked: {
    width: 24,
    height: 24,
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionInfo: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: LuxuryTheme.colors.text.primary,
    marginBottom: 4,
  },
  actionTitleCompleted: {
    textDecorationLine: 'line-through',
    color: LuxuryTheme.colors.text.tertiary,
  },
  actionMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  actionMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionMetaText: {
    fontSize: 12,
    color: LuxuryTheme.colors.text.tertiary,
  },
  actionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  streakBadge: {
    alignItems: 'center',
    backgroundColor: 'rgba(231, 180, 58, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  streakNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: LuxuryTheme.colors.primary.gold,
  },
  streakLabel: {
    fontSize: 10,
    color: LuxuryTheme.colors.text.tertiary,
    textTransform: 'uppercase',
  },
  actionTypeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateIcon: {
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: LuxuryTheme.colors.text.primary,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: LuxuryTheme.colors.text.tertiary,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  completionCard: {
    backgroundColor: LuxuryTheme.colors.background.card,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(231, 180, 58, 0.3)',
    overflow: 'hidden',
    marginTop: 20,
  },
  completionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: LuxuryTheme.colors.primary.gold,
    marginTop: 12,
  },
  completionSubtitle: {
    fontSize: 14,
    color: LuxuryTheme.colors.text.secondary,
    marginTop: 4,
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