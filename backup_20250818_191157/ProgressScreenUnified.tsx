import React, { useState } from 'react';
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
  TrendingUp, Target, Trophy, Calendar, Clock,
  BarChart3, Activity, Award, Flame, ArrowUp, ArrowDown
} from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  FadeIn,
  FadeInDown,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { useStore } from '../../state/rootStore';
import { HapticButton } from '../../ui/HapticButton';
import { LuxuryTheme } from '../../design/luxuryTheme';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

type Period = 'week' | 'month' | 'year';

export const ProgressScreenUnified = () => {
  const [selectedPeriod, setPeriod] = useState<Period>('week');
  const goals = useStore(s => s.goals);
  const actions = useStore(s => s.actions);
  
  // Calculate metrics
  const completedToday = actions.filter(a => a.done).length;
  const totalToday = actions.length;
  const todayRate = totalToday ? Math.round((completedToday / totalToday) * 100) : 0;
  
  // Mock data for charts
  const weekData = [65, 72, 68, 81, 79, 85, todayRate];
  const streakDays = 7;
  const totalPoints = 2840;

  const pulseAnim = useSharedValue(0);
  
  React.useEffect(() => {
    pulseAnim.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pulseAnim.value, [0, 1], [0.3, 0.6]),
  }));

  const renderHeader = () => (
    <View style={styles.header}>
      <Animated.View entering={FadeIn.duration(600)}>
        <Text style={styles.screenTitle}>Progress</Text>
        <Text style={styles.screenSubtitle}>Track your journey to excellence</Text>
      </Animated.View>
    </View>
  );

  const renderPeriodSelector = () => (
    <View style={styles.periodSelector}>
      {(['week', 'month', 'year'] as Period[]).map((period) => (
        <HapticButton
          key={period}
          hapticType="light"
          onPress={() => setPeriod(period)}
          style={[styles.periodButton, selectedPeriod === period && styles.periodButtonActive]}
        >
          <Text style={[styles.periodText, selectedPeriod === period && styles.periodTextActive]}>
            {period.charAt(0).toUpperCase() + period.slice(1)}
          </Text>
        </HapticButton>
      ))}
    </View>
  );

  const renderStatsGrid = () => (
    <View style={styles.statsGrid}>
      <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.statCard}>
        <LinearGradient
          colors={['rgba(231, 180, 58, 0.08)', 'rgba(231, 180, 58, 0.02)']}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.statIcon}>
          <Flame size={24} color={LuxuryTheme.colors.primary.gold} />
        </View>
        <Text style={styles.statNumber}>{streakDays}</Text>
        <Text style={styles.statLabel}>Day Streak</Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.statCard}>
        <LinearGradient
          colors={['rgba(96, 165, 250, 0.08)', 'rgba(96, 165, 250, 0.02)']}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.statIcon}>
          <Trophy size={24} color="#60A5FA" />
        </View>
        <Text style={styles.statNumber}>{totalPoints}</Text>
        <Text style={styles.statLabel}>Total Points</Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.statCard}>
        <LinearGradient
          colors={['rgba(34, 197, 94, 0.08)', 'rgba(34, 197, 94, 0.02)']}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.statIcon}>
          <TrendingUp size={24} color="#22C55E" />
        </View>
        <Text style={styles.statNumber}>{todayRate}%</Text>
        <Text style={styles.statLabel}>Today</Text>
      </Animated.View>
    </View>
  );

  const renderChart = () => (
    <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.chartCard}>
      <View style={styles.chartHeader}>
        <Text style={styles.chartTitle}>Completion Rate</Text>
        <View style={styles.chartTrend}>
          <ArrowUp size={16} color="#22C55E" />
          <Text style={styles.chartTrendText}>+12%</Text>
        </View>
      </View>
      
      <View style={styles.chart}>
        {weekData.map((value, index) => (
          <View key={index} style={styles.chartBar}>
            <View style={styles.chartBarContainer}>
              <Animated.View 
                entering={FadeInDown.delay(500 + index * 50).springify()}
                style={[
                  styles.chartBarFill,
                  { 
                    height: `${value}%`,
                    backgroundColor: index === weekData.length - 1 
                      ? LuxuryTheme.colors.primary.gold 
                      : 'rgba(231, 180, 58, 0.3)'
                  }
                ]}
              />
            </View>
            <Text style={styles.chartLabel}>
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}
            </Text>
          </View>
        ))}
      </View>
    </Animated.View>
  );

  const renderGoals = () => (
    <View style={styles.goalsSection}>
      <View style={styles.sectionHeader}>
        <Target size={20} color={LuxuryTheme.colors.primary.gold} />
        <Text style={styles.sectionTitle}>Active Goals</Text>
      </View>
      
      {goals.length === 0 ? (
        <View style={styles.emptyGoals}>
          <Text style={styles.emptyText}>Complete onboarding to set your goals</Text>
        </View>
      ) : (
        goals.map((goal, index) => (
          <Animated.View
            key={goal.id}
            entering={FadeInDown.delay(600 + index * 100).springify()}
            style={styles.goalCard}
          >
            <View style={styles.goalHeader}>
              <View style={styles.goalInfo}>
                <Text style={styles.goalTitle}>{goal.title}</Text>
                <Text style={styles.goalDeadline}>
                  {new Date(goal.deadline).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </Text>
              </View>
              
              <View style={[
                styles.goalStatus,
                { 
                  backgroundColor: goal.status === 'On Track' 
                    ? 'rgba(34, 197, 94, 0.1)' 
                    : 'rgba(239, 68, 68, 0.1)'
                }
              ]}>
                <Text style={[
                  styles.goalStatusText,
                  { 
                    color: goal.status === 'On Track' 
                      ? '#22C55E' 
                      : '#EF4444'
                  }
                ]}>
                  {goal.status}
                </Text>
              </View>
            </View>
            
            <View style={styles.goalProgress}>
              <View style={styles.goalProgressBar}>
                <View style={[
                  styles.goalProgressFill,
                  { width: `${goal.consistency}%` }
                ]}>
                  <LinearGradient
                    colors={['#22C55E', '#10B981']}
                    style={StyleSheet.absoluteFillObject}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  />
                </View>
              </View>
              <Text style={styles.goalProgressText}>{goal.consistency}% Consistency</Text>
            </View>
          </Animated.View>
        ))
      )}
    </View>
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
        {renderPeriodSelector()}
        {renderStatsGrid()}
        {renderChart()}
        {renderGoals()}
      </ScrollView>
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
    marginBottom: 24,
  },
  screenTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: LuxuryTheme.colors.text.primary,
    marginBottom: 4,
  },
  screenSubtitle: {
    fontSize: 16,
    color: LuxuryTheme.colors.text.tertiary,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 16,
    padding: 4,
    marginBottom: 24,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: 'rgba(231, 180, 58, 0.1)',
  },
  periodText: {
    fontSize: 14,
    fontWeight: '600',
    color: LuxuryTheme.colors.text.tertiary,
  },
  periodTextActive: {
    color: LuxuryTheme.colors.primary.gold,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: LuxuryTheme.colors.background.card,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: LuxuryTheme.colors.background.cardBorder,
    overflow: 'hidden',
  },
  statIcon: {
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: LuxuryTheme.colors.text.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: LuxuryTheme.colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chartCard: {
    backgroundColor: LuxuryTheme.colors.background.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: LuxuryTheme.colors.background.cardBorder,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: LuxuryTheme.colors.text.primary,
  },
  chartTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  chartTrendText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#22C55E',
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
  },
  chartBarContainer: {
    width: '60%',
    height: 100,
    justifyContent: 'flex-end',
  },
  chartBarFill: {
    width: '100%',
    borderRadius: 4,
    minHeight: 4,
  },
  chartLabel: {
    fontSize: 11,
    color: LuxuryTheme.colors.text.tertiary,
    marginTop: 8,
  },
  goalsSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: LuxuryTheme.colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  emptyGoals: {
    padding: 24,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 16,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: LuxuryTheme.colors.text.tertiary,
  },
  goalCard: {
    backgroundColor: LuxuryTheme.colors.background.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: LuxuryTheme.colors.background.cardBorder,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  goalInfo: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: LuxuryTheme.colors.text.primary,
    marginBottom: 4,
  },
  goalDeadline: {
    fontSize: 12,
    color: LuxuryTheme.colors.text.tertiary,
  },
  goalStatus: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  goalStatusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  goalProgress: {
    gap: 8,
  },
  goalProgressBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  goalProgressFill: {
    height: '100%',
    borderRadius: 3,
    overflow: 'hidden',
  },
  goalProgressText: {
    fontSize: 12,
    color: LuxuryTheme.colors.text.tertiary,
  },
});