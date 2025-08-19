import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { 
  TrendingUp, Target, Trophy, Zap, Calendar, 
  BarChart3, Clock, Award, Flame, Brain,
  ArrowUp, ArrowDown, Activity, Users
} from 'lucide-react-native';
import { LuxuryGradientBackground } from '../../ui/LuxuryGradientBackground';
import { GoldParticles } from '../../ui/GoldParticles';
import { useStore } from '../../state/rootStore';
import { CircleProgress } from './CircleProgress';
import { LuxuryTheme } from '../../design/luxuryTheme';

const { width } = Dimensions.get('window');

type MainTab = 'personal' | 'circle';

export const ProgressEnhanced = () => {
  const [mainTab, setMainTab] = useState<MainTab>('personal');
  const goals = useStore(s => s.goals);
  const actions = useStore(s => s.actions);
  
  // Calculate metrics
  const completedToday = actions.filter(a => a.done).length;
  const totalToday = actions.length;
  const todayRate = totalToday ? Math.round((completedToday / totalToday) * 100) : 0;
  
  // Animation values
  const pulseAnim = useSharedValue(0);
  const glowAnim = useSharedValue(0);
  const chartAnim = useSharedValue(0);

  React.useEffect(() => {
    pulseAnim.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1
    );

    glowAnim.value = withRepeat(
      withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    chartAnim.value = withTiming(1, { duration: 1000, easing: Easing.out(Easing.ease) });
  }, []);

  const heroGlowStyle = useAnimatedStyle(() => ({
    shadowOpacity: interpolate(glowAnim.value, [0, 1], [0.3, 0.6]),
    shadowRadius: interpolate(glowAnim.value, [0, 1], [15, 30]),
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(pulseAnim.value, [0, 1], [1, 1.05]) }],
  }));

  // Sample data for visualization
  const weekData = [
    { day: 'M', value: 85, label: 'Mon' },
    { day: 'T', value: 92, label: 'Tue' },
    { day: 'W', value: 78, label: 'Wed' },
    { day: 'T', value: 95, label: 'Thu' },
    { day: 'F', value: 88, label: 'Fri' },
    { day: 'S', value: 73, label: 'Sat' },
    { day: 'S', value: 90, label: 'Sun' },
  ];

  const insights = [
    { icon: Brain, text: "You're 3x more likely to complete morning workouts", type: 'positive' },
    { icon: Flame, text: "Your meditation streak improves focus by 40%", type: 'correlation' },
    { icon: Activity, text: "Sundays are your power days - 95% completion", type: 'pattern' },
  ];

  const milestones = [
    { date: '2 days ago', event: '30-day meditation streak achieved!', icon: '🧘' },
    { date: '1 week ago', event: 'Personal best: 100% daily completion', icon: '🏆' },
    { date: '2 weeks ago', event: 'Unlocked "Consistency Champion" badge', icon: '🎖️' },
  ];

  // Calculate streaks for each goal
  const goalProgress = goals.map(goal => ({
    ...goal,
    currentStreak: Math.floor(Math.random() * 30),
    bestStreak: Math.floor(Math.random() * 50) + 20,
    completionRate: Math.floor(Math.random() * 40) + 60,
    trend: Math.random() > 0.5 ? 'up' : 'down',
    predictedCompletion: '2 weeks',
  }));

  return (
    <View style={styles.container}>
      <LuxuryGradientBackground variant="silver">
        <GoldParticles variant="mixed" particleCount={12} />
        
        {/* Main Tab Selector - Always visible */}
        <View style={styles.mainTabWrapper}>
          <View style={styles.mainTabContainer}>
            <Pressable
              onPress={() => setMainTab('personal')}
              style={[styles.mainTab, mainTab === 'personal' && styles.mainTabActive]}
            >
              <BarChart3 size={16} color={mainTab === 'personal' ? LuxuryTheme.colors.primary.gold : LuxuryTheme.colors.primary.silver} />
              <Text style={[styles.mainTabText, mainTab === 'personal' && styles.mainTabTextActive]}>
                Personal
              </Text>
            </Pressable>
            
            <Pressable
              onPress={() => setMainTab('circle')}
              style={[styles.mainTab, mainTab === 'circle' && styles.mainTabActive]}
            >
              <Users size={16} color={mainTab === 'circle' ? LuxuryTheme.colors.primary.gold : LuxuryTheme.colors.primary.silver} />
              <Text style={[styles.mainTabText, mainTab === 'circle' && styles.mainTabTextActive]}>
                Circle
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Show Circle Progress if that tab is selected */}
        {mainTab === 'circle' ? (
          <CircleProgress />
        ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* HERO DASHBOARD */}
          <Animated.View style={[styles.heroCard, heroGlowStyle, { shadowColor: LuxuryTheme.colors.primary.gold }]}>
            <BlurView intensity={30} tint="dark" style={styles.heroCardInner}>
              <LinearGradient
                colors={['rgba(255,215,0,0.12)', 'rgba(192,192,192,0.05)']}
                style={StyleSheet.absoluteFillObject}
              />
              
              {/* Consistency Score */}
              <Animated.View style={[styles.scoreContainer, pulseStyle]}>
                <LinearGradient
                  colors={[LuxuryTheme.colors.primary.gold, LuxuryTheme.colors.primary.champagne, LuxuryTheme.colors.primary.gold]}
                  style={styles.scoreRing}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
                <View style={styles.scoreInner}>
                  <Text style={styles.scoreNumber}>87</Text>
                  <Text style={styles.scoreLabel}>Consistency</Text>
                </View>
              </Animated.View>


              {/* Quick Stats */}
              <View style={styles.quickStats}>
                <View style={styles.statCard}>
                  <Flame size={20} color="#FFD700" />
                  <Text style={styles.statValue}>23</Text>
                  <Text style={styles.statLabel}>Active Streaks</Text>
                </View>
                
                <View style={styles.statCard}>
                  <TrendingUp size={20} color="#06FFA5" />
                  <Text style={styles.statValue}>+12%</Text>
                  <Text style={styles.statLabel}>vs Last Week</Text>
                </View>
                
                <View style={styles.statCard}>
                  <Clock size={20} color="#C0C0C0" />
                  <Text style={styles.statValue}>7AM</Text>
                  <Text style={styles.statLabel}>Best Time</Text>
                </View>
              </View>
            </BlurView>
          </Animated.View>

          {/* WEEKLY RHYTHM CHART */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <BarChart3 size={20} color="#FFD700" />
              <Text style={styles.sectionTitle}>Weekly Rhythm</Text>
            </View>

            <BlurView intensity={25} tint="dark" style={styles.chartCard}>
              <LinearGradient
                colors={['rgba(255,215,0,0.08)', 'rgba(192,192,192,0.03)']}
                style={StyleSheet.absoluteFillObject}
              />
              
              <View style={styles.chart}>
                {weekData.map((day, index) => {
                  const isToday = index === new Date().getDay() - 1;
                  const barHeight = (day.value / 100) * 120;
                  
                  return (
                    <View key={index} style={styles.barContainer}>
                      <Text style={styles.barValue}>{day.value}%</Text>
                      <View style={styles.barWrapper}>
                        <Animated.View
                          style={[
                            styles.bar,
                            { height: barHeight },
                            isToday && styles.todayBar,
                          ]}
                        >
                          <LinearGradient
                            colors={isToday ? ['#FFD700', '#F7E7CE'] : ['#C0C0C0', '#E5E4E2']}
                            style={StyleSheet.absoluteFillObject}
                          />
                        </Animated.View>
                      </View>
                      <Text style={[styles.barLabel, isToday && styles.todayLabel]}>
                        {day.day}
                      </Text>
                    </View>
                  );
                })}
              </View>

              {/* Best day indicator */}
              <View style={styles.bestDayIndicator}>
                <Trophy size={16} color="#FFD700" />
                <Text style={styles.bestDayText}>Thursday is your strongest day</Text>
              </View>
            </BlurView>
          </View>

          {/* GOAL-SPECIFIC PROGRESS */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Target size={20} color="#C0C0C0" />
              <Text style={styles.sectionTitle}>Goal Progress</Text>
            </View>

            <View style={styles.goalsContainer}>
              {goalProgress.map((goal, index) => (
                <BlurView key={index} intensity={20} tint="dark" style={styles.goalCard}>
                  <LinearGradient
                    colors={['rgba(255,215,0,0.05)', 'rgba(255,255,255,0.02)']}
                    style={StyleSheet.absoluteFillObject}
                  />
                  
                  <View style={styles.goalHeader}>
                    <View style={styles.goalInfo}>
                      <View style={[styles.goalDot, { backgroundColor: goal.color }]} />
                      <Text style={styles.goalTitle}>{goal.title}</Text>
                    </View>
                    {goal.trend === 'up' ? (
                      <ArrowUp size={16} color="#06FFA5" />
                    ) : (
                      <ArrowDown size={16} color="#FF4365" />
                    )}
                  </View>

                  <View style={styles.goalMetrics}>
                    <View style={styles.metric}>
                      <Text style={styles.metricValue}>{goal.currentStreak}</Text>
                      <Text style={styles.metricLabel}>Current</Text>
                    </View>
                    <View style={styles.metric}>
                      <Text style={styles.metricValue}>{goal.bestStreak}</Text>
                      <Text style={styles.metricLabel}>Best</Text>
                    </View>
                    <View style={styles.metric}>
                      <Text style={styles.metricValue}>{goal.completionRate}%</Text>
                      <Text style={styles.metricLabel}>Rate</Text>
                    </View>
                  </View>

                  {/* Progress bar */}
                  <View style={styles.progressBar}>
                    <LinearGradient
                      colors={['#FFD700', '#F7E7CE']}
                      style={[styles.progressFill, { width: `${goal.completionRate}%` }]}
                    />
                  </View>

                  <Text style={styles.prediction}>
                    📅 Predicted completion: {goal.predictedCompletion}
                  </Text>
                </BlurView>
              ))}
            </View>
          </View>

          {/* AI INSIGHTS */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Brain size={20} color="#E5E4E2" />
              <Text style={styles.sectionTitle}>Smart Insights</Text>
            </View>

            <View style={styles.insightsContainer}>
              {insights.map((insight, index) => {
                const Icon = insight.icon;
                return (
                  <BlurView key={index} intensity={25} tint="dark" style={styles.insightCard}>
                    <LinearGradient
                      colors={
                        insight.type === 'positive' 
                          ? ['rgba(255,215,0,0.1)', 'rgba(255,215,0,0.05)']
                          : ['rgba(192,192,192,0.1)', 'rgba(192,192,192,0.05)']
                      }
                      style={StyleSheet.absoluteFillObject}
                    />
                    <Icon size={20} color={insight.type === 'positive' ? '#FFD700' : '#C0C0C0'} />
                    <Text style={styles.insightText}>{insight.text}</Text>
                  </BlurView>
                );
              })}
            </View>
          </View>

          {/* ACHIEVEMENT TIMELINE */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Award size={20} color="#FFD700" />
              <Text style={styles.sectionTitle}>Recent Achievements</Text>
            </View>

            <BlurView intensity={20} tint="dark" style={styles.timelineCard}>
              <LinearGradient
                colors={['rgba(255,215,0,0.05)', 'rgba(192,192,192,0.03)']}
                style={StyleSheet.absoluteFillObject}
              />
              
              {milestones.map((milestone, index) => (
                <View key={index} style={styles.timelineItem}>
                  <Text style={styles.timelineIcon}>{milestone.icon}</Text>
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineDate}>{milestone.date}</Text>
                    <Text style={styles.timelineEvent}>{milestone.event}</Text>
                  </View>
                </View>
              ))}
            </BlurView>
          </View>

          {/* STREAK VISUALIZATION */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Flame size={20} color="#FFD700" />
              <Text style={styles.sectionTitle}>Streak History</Text>
            </View>

            <BlurView intensity={25} tint="dark" style={styles.streakCard}>
              <LinearGradient
                colors={['rgba(255,215,0,0.08)', 'rgba(192,192,192,0.03)']}
                style={StyleSheet.absoluteFillObject}
              />
              
              {/* Current streaks display */}
              <View style={styles.streakHeader}>
                <Text style={styles.streakTitle}>Active Streaks</Text>
                <View style={styles.streakBadge}>
                  <Flame size={16} color="#FFD700" />
                  <Text style={styles.streakCount}>5 goals on fire</Text>
                </View>
              </View>
              
              {/* Streak bars */}
              <View style={styles.streakBars}>
                <View style={styles.streakItem}>
                  <Text style={styles.streakLabel}>Morning Workout</Text>
                  <View style={styles.streakBarContainer}>
                    <LinearGradient
                      colors={['#FFD700', '#F7E7CE']}
                      style={[styles.streakBar, { width: '80%' }]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    />
                    <Text style={styles.streakDays}>24 days</Text>
                  </View>
                </View>
                
                <View style={styles.streakItem}>
                  <Text style={styles.streakLabel}>Meditation</Text>
                  <View style={styles.streakBarContainer}>
                    <LinearGradient
                      colors={['#FFD700', '#F7E7CE']}
                      style={[styles.streakBar, { width: '100%' }]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    />
                    <Text style={styles.streakDays}>30 days 🔥</Text>
                  </View>
                </View>
                
                <View style={styles.streakItem}>
                  <Text style={styles.streakLabel}>Reading</Text>
                  <View style={styles.streakBarContainer}>
                    <LinearGradient
                      colors={['#C0C0C0', '#E5E4E2']}
                      style={[styles.streakBar, { width: '40%' }]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    />
                    <Text style={styles.streakDays}>12 days</Text>
                  </View>
                </View>
                
                <View style={styles.streakItem}>
                  <Text style={styles.streakLabel}>No Social Media</Text>
                  <View style={styles.streakBarContainer}>
                    <LinearGradient
                      colors={['#C0C0C0', '#E5E4E2']}
                      style={[styles.streakBar, { width: '20%' }]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    />
                    <Text style={styles.streakDays}>6 days</Text>
                  </View>
                </View>
              </View>
              
              {/* Longest streak highlight */}
              <View style={styles.longestStreak}>
                <Trophy size={20} color="#FFD700" />
                <Text style={styles.longestStreakText}>
                  Longest streak: <Text style={styles.longestStreakNumber}>45 days</Text> (Meditation)
                </Text>
              </View>
            </BlurView>
          </View>

          {/* MOMENTUM INDICATOR */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Activity size={20} color="#FFD700" />
              <Text style={styles.sectionTitle}>Momentum</Text>
            </View>

            <BlurView intensity={30} tint="dark" style={styles.momentumCard}>
              <LinearGradient
                colors={['rgba(255,215,0,0.1)', 'rgba(255,215,0,0.05)']}
                style={StyleSheet.absoluteFillObject}
              />
              
              <View style={styles.momentumContent}>
                <View style={styles.momentumIndicator}>
                  <TrendingUp size={40} color="#FFD700" />
                  <Text style={styles.momentumText}>Strong Upward Trend</Text>
                </View>
                
                <Text style={styles.momentumDetail}>
                  You've maintained consistent progress for 3 weeks straight!
                </Text>
                
                <View style={styles.momentumStats}>
                  <View style={styles.momentumStat}>
                    <Text style={styles.momentumValue}>+23%</Text>
                    <Text style={styles.momentumLabel}>This Month</Text>
                  </View>
                  <View style={styles.momentumStat}>
                    <Text style={styles.momentumValue}>92%</Text>
                    <Text style={styles.momentumLabel}>Consistency</Text>
                  </View>
                </View>
              </View>
            </BlurView>
          </View>
        </ScrollView>
        )}
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

  // Main Tabs
  mainTabWrapper: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  mainTabContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  mainTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(192,192,192,0.1)',
  },
  mainTabActive: {
    backgroundColor: 'rgba(255,215,0,0.15)',
    borderColor: 'rgba(255,215,0,0.3)',
  },
  mainTabText: {
    fontSize: 14,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.6)',
  },
  mainTabTextActive: {
    color: '#FFD700',
  },

  // Hero Card
  heroCard: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 20,
  },
  heroCardInner: {
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.1)',
    alignItems: 'center',
  },
  scoreContainer: {
    marginBottom: 20,
  },
  scoreRing: {
    width: 140,
    height: 140,
    borderRadius: 70,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreInner: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.8)',
    width: 132,
    height: 132,
    borderRadius: 66,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreNumber: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFD700',
  },
  scoreLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
  },

  // Quick Stats
  quickStats: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.5)',
  },

  // Section
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Chart
  chartCard: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.1)',
    overflow: 'hidden',
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
    marginBottom: 16,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  barWrapper: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    width: '70%',
    borderRadius: 4,
    overflow: 'hidden',
  },
  todayBar: {
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  barValue: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 4,
  },
  barLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
  },
  todayLabel: {
    color: '#FFD700',
    fontWeight: '600',
  },
  bestDayIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,215,0,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  bestDayText: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: '600',
  },

  // Goals
  goalsContainer: {
    gap: 12,
  },
  goalCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.1)',
    overflow: 'hidden',
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  goalDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  goalTitle: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  goalMetrics: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 12,
  },
  metric: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFD700',
  },
  metricLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.5)',
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
  },
  prediction: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },

  // Insights
  insightsContainer: {
    gap: 8,
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.1)',
    overflow: 'hidden',
  },
  insightText: {
    flex: 1,
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 18,
  },

  // Timeline
  timelineCard: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.1)',
    overflow: 'hidden',
    gap: 12,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  timelineIcon: {
    fontSize: 24,
  },
  timelineContent: {
    flex: 1,
  },
  timelineDate: {
    fontSize: 11,
    color: '#C0C0C0',
    marginBottom: 2,
  },
  timelineEvent: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },

  // Streak Visualization
  streakCard: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.1)',
    overflow: 'hidden',
  },
  streakHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  streakTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,215,0,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.2)',
  },
  streakCount: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: '600',
  },
  streakBars: {
    gap: 16,
    marginBottom: 20,
  },
  streakItem: {
    gap: 8,
  },
  streakLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  streakBarContainer: {
    height: 28,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
  },
  streakBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 14,
  },
  streakDays: {
    position: 'absolute',
    right: 12,
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  longestStreak: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,215,0,0.08)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.15)',
  },
  longestStreakText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
  longestStreakNumber: {
    color: '#FFD700',
    fontWeight: '700',
  },

  // Momentum
  momentumCard: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.1)',
    overflow: 'hidden',
  },
  momentumContent: {
    alignItems: 'center',
    gap: 12,
  },
  momentumIndicator: {
    alignItems: 'center',
    gap: 8,
  },
  momentumText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFD700',
  },
  momentumDetail: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 20,
  },
  momentumStats: {
    flexDirection: 'row',
    gap: 32,
    marginTop: 8,
  },
  momentumStat: {
    alignItems: 'center',
  },
  momentumValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFD700',
  },
  momentumLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
  },
});