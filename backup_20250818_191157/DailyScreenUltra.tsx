import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSpring,
  withSequence,
  withDelay,
  interpolate,
  Easing,
  FadeInDown,
  FadeIn,
  FadeInUp,
  runOnJS,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useStore } from '../../state/rootStore';
import { RadialProgress } from '../../ui/RadialProgress';
import { HapticButton } from '../../ui/HapticButton';
import { ConfettiView } from '../../ui/ConfettiView';
import { DailyReviewModal } from './DailyReviewModalEnhanced';
import { SocialSharePrompt } from '../social/SocialSharePrompt';
import { 
  Sparkles, Zap, Trophy, TrendingUp, Clock, Calendar, Target,
  Coffee, Dumbbell, BookOpen, Brain, Heart, Code, Music, Palette,
  ChevronRight, CheckCircle2, Circle, Star, Flame, Award
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { LuxuryTheme } from '../../design/luxuryTheme';
import Svg, { Defs, LinearGradient as SvgGradient, Stop, Circle as SvgCircle, G, Text as SvgText } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

// Task type icons mapping
const getTaskIcon = (title: string, category?: string) => {
  const lowerTitle = title.toLowerCase();
  const iconProps = { size: 20, color: LuxuryTheme.colors.primary.gold };
  
  if (lowerTitle.includes('workout') || lowerTitle.includes('exercise') || lowerTitle.includes('gym')) {
    return <Dumbbell {...iconProps} />;
  }
  if (lowerTitle.includes('meditat') || lowerTitle.includes('mindful')) {
    return <Brain {...iconProps} />;
  }
  if (lowerTitle.includes('read') || lowerTitle.includes('study') || lowerTitle.includes('learn')) {
    return <BookOpen {...iconProps} />;
  }
  if (lowerTitle.includes('code') || lowerTitle.includes('program') || lowerTitle.includes('develop')) {
    return <Code {...iconProps} />;
  }
  if (lowerTitle.includes('coffee') || lowerTitle.includes('morning')) {
    return <Coffee {...iconProps} />;
  }
  if (lowerTitle.includes('music') || lowerTitle.includes('practice')) {
    return <Music {...iconProps} />;
  }
  if (lowerTitle.includes('draw') || lowerTitle.includes('design') || lowerTitle.includes('art')) {
    return <Palette {...iconProps} />;
  }
  if (lowerTitle.includes('health') || lowerTitle.includes('wellness')) {
    return <Heart {...iconProps} />;
  }
  
  return <Target {...iconProps} />;
};

// Motivational messages based on progress
const getMotivationalMessage = (progress: number, timeOfDay: string) => {
  if (progress === 0) {
    if (timeOfDay === 'morning') return "Rise and shine! 🌅";
    if (timeOfDay === 'afternoon') return "Afternoon boost! ⚡";
    return "Evening hustle! 🌙";
  }
  if (progress < 25) return "Great start! 💪";
  if (progress < 50) return "Building momentum! 🚀";
  if (progress < 75) return "Crushing it! 🔥";
  if (progress < 100) return "Almost there! 🎯";
  return "Champion! 🏆";
};

export const DailyScreenUltra = () => {
  const actions = useStore(s => s.actions);
  const completed = actions.filter(a => a.done).length;
  const progress = actions.length ? (completed / actions.length) * 100 : 0;
  const openReview = useStore(s => s.openDailyReview);
  const toggleAction = useStore(s => s.toggleAction);
  const [showSharePrompt, setShowSharePrompt] = useState(false);
  const [showJournalPrompt, setShowJournalPrompt] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [dailyScore, setDailyScore] = useState(0);
  const [scoreAnimating, setScoreAnimating] = useState(false);
  
  // Animation values
  const pulseAnimation = useSharedValue(0);
  const progressScale = useSharedValue(0);
  const glowIntensity = useSharedValue(0);
  const ringProgress = useSharedValue(0);
  const scoreAnimation = useSharedValue(0);
  const confettiTrigger = useSharedValue(0);
  
  // Calculate daily score
  useEffect(() => {
    const baseScore = completed * 10;
    const streakBonus = actions.reduce((sum, a) => sum + (a.streak || 0) * 2, 0);
    const completionBonus = progress === 100 ? 50 : 0;
    const newScore = baseScore + streakBonus + completionBonus;
    
    if (newScore > dailyScore) {
      setScoreAnimating(true);
      scoreAnimation.value = withSequence(
        withSpring(1.2, { damping: 10 }),
        withSpring(1, { damping: 15 })
      );
      setTimeout(() => {
        setDailyScore(newScore);
        setScoreAnimating(false);
      }, 300);
    }
  }, [completed, actions]);
  
  // Calculate time-based data
  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  };
  
  const timeOfDay = getTimeOfDay();
  const currentStreak = 7; // Mock data - would come from store
  const bestStreak = 21; // Mock data
  
  // Sort actions by time and separate upcoming
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();
  
  const sortedActions = [...actions].sort((a, b) => {
    if (!a.time && !b.time) return 0;
    if (!a.time) return 1;
    if (!b.time) return -1;
    const [aHour, aMin] = a.time.split(':').map(Number);
    const [bHour, bMin] = b.time.split(':').map(Number);
    return (aHour * 60 + aMin) - (bHour * 60 + bMin);
  });
  
  const upcomingActions = sortedActions.filter(action => {
    if (!action.time || action.done) return false;
    const [hour, min] = action.time.split(':').map(Number);
    return hour > currentHour || (hour === currentHour && min > currentMinutes);
  });
  
  const currentActions = sortedActions.filter(action => {
    if (action.done) return true;
    if (!action.time) return true;
    const [hour, min] = action.time.split(':').map(Number);
    return hour <= currentHour || (hour === currentHour && min <= currentMinutes);
  });
  
  // Animations on mount and progress change
  useEffect(() => {
    // Smooth ring progress animation
    ringProgress.value = withTiming(progress / 100, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    });
    
    // Scale in animation
    progressScale.value = withSpring(1, { 
      damping: 12,
      stiffness: 100,
    });
    
    // Glow pulse for active progress
    if (progress > 0 && progress < 100) {
      glowIntensity.value = withRepeat(
        withSequence(
          withTiming(0.8, { duration: 1000 }),
          withTiming(0.3, { duration: 1000 })
        ),
        -1
      );
    }
    
    // Trigger confetti at 100%
    if (progress === 100) {
      confettiTrigger.value = 1;
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      if (!showJournalPrompt) {
        setTimeout(() => setShowJournalPrompt(true), 1500);
      }
    }
  }, [progress]);
  
  // Animated styles
  const progressCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: progressScale.value }],
  }));
  
  const glowStyle = useAnimatedStyle(() => ({
    shadowOpacity: interpolate(glowIntensity.value, [0, 1], [0.2, 0.5]),
    shadowRadius: interpolate(glowIntensity.value, [0, 1], [20, 40]),
  }));
  
  const scoreStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scoreAnimation.value }],
  }));
  
  // Week calendar data
  const getWeekData = () => {
    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const today = new Date().getDay();
    const adjustedToday = today === 0 ? 6 : today - 1;
    
    return days.map((day, index) => ({
      day,
      isToday: index === adjustedToday,
      isCompleted: index < adjustedToday, // Mock - would check actual data
      isFuture: index > adjustedToday,
    }));
  };
  
  const handleActionToggle = (actionId: string) => {
    toggleAction(actionId);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Trigger animation for completion
    const action = actions.find(a => a.id === actionId);
    if (action && !action.done) {
      // Will be completed
      confettiTrigger.value = withSequence(
        withTiming(0.3, { duration: 100 }),
        withTiming(0, { duration: 100 })
      );
    }
  };
  
  const handleEmojiSelect = (emoji: string) => {
    setSelectedEmoji(emoji);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Save to store/backend
    setTimeout(() => setShowJournalPrompt(false), 500);
  };
  
  return (
    <View style={styles.container}>
      {/* Adaptive gradient background */}
      <LinearGradient
        colors={['#000000', '#0A0A0A', '#1A0F2E']}
        style={StyleSheet.absoluteFillObject}
        locations={[0, 0.5, 1]}
      />
      
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Date & Greeting */}
        <Animated.View 
          entering={FadeInDown.duration(500).springify()}
          style={styles.headerSection}
        >
          <Text style={styles.dateText}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </Text>
          <Text style={styles.greetingText}>
            {getMotivationalMessage(progress, timeOfDay)}
          </Text>
        </Animated.View>
        
        {/* Main Progress Card - Glassmorphic with gradient ring */}
        <Animated.View 
          entering={FadeInDown.delay(100).springify()}
          style={[styles.progressCard, progressCardStyle, glowStyle]}
        >
          <BlurView intensity={20} tint="dark" style={styles.glassCard}>
            <LinearGradient
              colors={['rgba(255,215,0,0.03)', 'transparent']}
              style={StyleSheet.absoluteFillObject}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            
            {/* Gradient border effect */}
            <View style={styles.gradientBorder}>
              <LinearGradient
                colors={['#FFD700', '#C0C0C0', '#FFD700']}
                style={styles.borderGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
            </View>
            
            {/* Enhanced Progress Ring */}
            <View style={styles.progressRingContainer}>
              <Svg width={180} height={180} style={styles.svgRing}>
                <Defs>
                  <SvgGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <Stop offset="0%" stopColor="#FFD700" stopOpacity="1" />
                    <Stop offset="50%" stopColor="#FFA500" stopOpacity="0.9" />
                    <Stop offset="100%" stopColor="#FFD700" stopOpacity="1" />
                  </SvgGradient>
                </Defs>
                
                {/* Background ring */}
                <SvgCircle
                  cx="90"
                  cy="90"
                  r="75"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="12"
                  fill="none"
                />
                
                {/* Animated progress ring */}
                <SvgCircle
                  cx="90"
                  cy="90"
                  r="75"
                  stroke="url(#ringGradient)"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray="471"
                  strokeDashoffset={471 - (471 * progress / 100)}
                  strokeLinecap="round"
                  transform="rotate(-90 90 90)"
                />
              </Svg>
              
              {/* Center content */}
              <View style={styles.progressCenter}>
                <Text style={styles.progressPercentage}>{Math.round(progress)}%</Text>
                <Text style={styles.progressLabel}>Complete</Text>
                {progress === 100 && (
                  <Animated.View entering={FadeIn.delay(300)}>
                    <Trophy size={24} color="#FFD700" />
                  </Animated.View>
                )}
              </View>
            </View>
            
            {/* Daily Score with XP animation */}
            <Animated.View style={[styles.scoreSection, scoreStyle]}>
              <View style={styles.scoreRow}>
                <Zap size={16} color="#FFD700" />
                <Text style={styles.scoreText}>
                  {scoreAnimating ? '+' : ''}{dailyScore} points today
                </Text>
              </View>
              {scoreAnimating && (
                <Animated.Text 
                  entering={FadeInUp.duration(500)}
                  style={styles.scorePlus}
                >
                  +{dailyScore - (dailyScore - 10)}
                </Animated.Text>
              )}
            </Animated.View>
            
            {/* Stats row */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{completed}</Text>
                <Text style={styles.statLabel}>Done</Text>
              </View>
              
              <View style={styles.statDivider} />
              
              <View style={styles.statItem}>
                <View style={styles.streakContainer}>
                  <Flame size={16} color="#FFD700" />
                  <Text style={styles.statValue}>{currentStreak}</Text>
                </View>
                <Text style={styles.statLabel}>Streak</Text>
              </View>
              
              <View style={styles.statDivider} />
              
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{actions.length}</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
            </View>
          </BlurView>
        </Animated.View>
        
        {/* Current Actions - Enhanced Mission List */}
        <View style={styles.missionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>ACTIVE MISSIONS</Text>
            <View style={styles.missionBadge}>
              <Text style={styles.missionBadgeText}>{completed}/{currentActions.length}</Text>
            </View>
          </View>
          
          {currentActions.map((action, index) => (
            <Animated.View
              key={action.id}
              entering={FadeInDown.delay(200 + index * 50).springify()}
            >
              <Pressable 
                onPress={() => handleActionToggle(action.id)}
                style={({ pressed }) => [
                  styles.missionCard,
                  action.done && styles.missionCardDone,
                  pressed && styles.missionCardPressed,
                ]}
              >
                <BlurView intensity={15} tint="dark" style={styles.missionGlass}>
                  <LinearGradient
                    colors={action.done 
                      ? ['rgba(34,197,94,0.05)', 'transparent']
                      : ['rgba(255,255,255,0.04)', 'transparent']
                    }
                    style={StyleSheet.absoluteFillObject}
                  />
                  
                  <View style={styles.missionContent}>
                    {/* Task icon */}
                    <View style={styles.missionIcon}>
                      {getTaskIcon(action.title)}
                    </View>
                    
                    {/* Task details */}
                    <View style={styles.missionDetails}>
                      <Text style={[styles.missionTitle, action.done && styles.missionTitleDone]}>
                        {action.title}
                      </Text>
                      {action.goalTitle && (
                        <View style={styles.missionMeta}>
                          <Target size={10} color="rgba(255,255,255,0.5)" />
                          <Text style={styles.missionGoal}>{action.goalTitle}</Text>
                        </View>
                      )}
                    </View>
                    
                    {/* Time badge */}
                    {action.time && (
                      <View style={[styles.timePill, action.done && styles.timePillDone]}>
                        <Clock size={12} color={action.done ? '#666' : '#FFD700'} />
                        <Text style={[styles.timeText, action.done && styles.timeTextDone]}>
                          {action.time}
                        </Text>
                      </View>
                    )}
                    
                    {/* Animated checkbox */}
                    <Animated.View style={styles.checkbox}>
                      {action.done ? (
                        <Animated.View 
                          entering={FadeIn.duration(200)}
                          style={styles.checkboxChecked}
                        >
                          <LinearGradient
                            colors={['#FFD700', '#FFA500']}
                            style={StyleSheet.absoluteFillObject}
                          />
                          <CheckCircle2 size={24} color="#000" strokeWidth={3} />
                        </Animated.View>
                      ) : (
                        <Circle size={24} color="rgba(255,255,255,0.3)" strokeWidth={1.5} />
                      )}
                    </Animated.View>
                  </View>
                </BlurView>
              </Pressable>
            </Animated.View>
          ))}
        </View>
        
        {/* Upcoming Tasks Preview */}
        {upcomingActions.length > 0 && (
          <Animated.View 
            entering={FadeInDown.delay(400).springify()}
            style={styles.upcomingSection}
          >
            <Text style={styles.upcomingSectionTitle}>COMING UP</Text>
            <View style={styles.upcomingList}>
              {upcomingActions.slice(0, 3).map((action) => (
                <View key={action.id} style={styles.upcomingItem}>
                  <Clock size={14} color="rgba(255,255,255,0.3)" />
                  <Text style={styles.upcomingTime}>{action.time}</Text>
                  <Text style={styles.upcomingTitle}>{action.title}</Text>
                </View>
              ))}
            </View>
          </Animated.View>
        )}
        
        {/* Weekly Streak Calendar */}
        <Animated.View 
          entering={FadeInDown.delay(500).springify()}
          style={styles.weekSection}
        >
          <Text style={styles.weekTitle}>THIS WEEK</Text>
          <View style={styles.weekCalendar}>
            {getWeekData().map((day, index) => (
              <View key={index} style={styles.dayContainer}>
                <Text style={[
                  styles.dayLabel,
                  day.isToday && styles.dayLabelToday
                ]}>
                  {day.day}
                </Text>
                <View style={[
                  styles.dayIndicator,
                  day.isCompleted && styles.dayCompleted,
                  day.isToday && styles.dayToday,
                  day.isFuture && styles.dayFuture,
                ]}>
                  {day.isCompleted && (
                    <CheckCircle2 size={16} color="#06FFA5" />
                  )}
                  {day.isToday && !day.isCompleted && (
                    <View style={styles.dayTodayDot} />
                  )}
                </View>
              </View>
            ))}
          </View>
        </Animated.View>
        
        {/* Review Day Button - Enhanced */}
        <Animated.View 
          entering={FadeInDown.delay(600).springify()}
          style={styles.reviewSection}
        >
          <HapticButton 
            onPress={openReview}
            style={styles.reviewButton}
            hapticType="medium"
          >
            <LinearGradient
              colors={['#FFD700', '#FFA500', '#FFD700']}
              style={StyleSheet.absoluteFillObject}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
            <View style={styles.reviewContent}>
              <Award size={20} color="#000" />
              <Text style={styles.reviewText}>Review Your Day</Text>
              <ChevronRight size={20} color="#000" />
            </View>
          </HapticButton>
        </Animated.View>
      </ScrollView>
      
      {/* Micro-journaling Prompt */}
      {showJournalPrompt && progress === 100 && (
        <Animated.View 
          entering={FadeInUp.duration(500).springify()}
          style={styles.journalPrompt}
        >
          <BlurView intensity={30} tint="dark" style={styles.journalCard}>
            <Text style={styles.journalTitle}>How did today feel?</Text>
            <View style={styles.emojiSlider}>
              {['😞', '😐', '🙂', '😃', '🔥'].map((emoji) => (
                <Pressable
                  key={emoji}
                  onPress={() => handleEmojiSelect(emoji)}
                  style={[
                    styles.emojiOption,
                    selectedEmoji === emoji && styles.emojiSelected
                  ]}
                >
                  <Text style={styles.emojiText}>{emoji}</Text>
                </Pressable>
              ))}
            </View>
          </BlurView>
        </Animated.View>
      )}
      
      {/* Confetti for completion */}
      <ConfettiView active={progress === 100} />
      
      {/* Modals */}
      <DailyReviewModal />
      <SocialSharePrompt
        visible={showSharePrompt}
        onClose={() => setShowSharePrompt(false)}
        progress={progress}
        completedActions={completed}
        totalActions={actions.length}
        streak={currentStreak}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  
  // Header Section
  headerSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  dateText: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  greetingText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  
  // Progress Card
  progressCard: {
    marginBottom: 24,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#FFD700',
  },
  glassCard: {
    padding: 20,
    borderRadius: 24,
    overflow: 'hidden',
  },
  gradientBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 24,
    padding: 1,
  },
  borderGradient: {
    flex: 1,
    borderRadius: 24,
  },
  progressRingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 180,
  },
  svgRing: {
    position: 'absolute',
  },
  progressCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressPercentage: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -2,
  },
  progressLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '600',
    letterSpacing: 0.5,
    marginTop: -4,
  },
  
  // Score Section
  scoreSection: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 12,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,215,0,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFD700',
    letterSpacing: 0.5,
  },
  scorePlus: {
    position: 'absolute',
    top: -20,
    fontSize: 16,
    fontWeight: '700',
    color: '#06FFA5',
  },
  
  // Stats Row
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '600',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  
  // Missions Section
  missionsSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 1,
  },
  missionBadge: {
    backgroundColor: 'rgba(255,215,0,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  missionBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFD700',
  },
  missionCard: {
    marginBottom: 10,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  missionCardDone: {
    opacity: 0.7,
    borderColor: 'rgba(34,197,94,0.3)',
  },
  missionCardPressed: {
    transform: [{ scale: 0.98 }],
  },
  missionGlass: {
    padding: 16,
  },
  missionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  missionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,215,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  missionDetails: {
    flex: 1,
  },
  missionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  missionTitleDone: {
    color: 'rgba(255,255,255,0.5)',
    textDecorationLine: 'line-through',
  },
  missionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  missionGoal: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
  },
  timePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,215,0,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginRight: 12,
  },
  timePillDone: {
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  timeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFD700',
  },
  timeTextDone: {
    color: 'rgba(255,255,255,0.3)',
  },
  checkbox: {
    width: 24,
    height: 24,
  },
  checkboxChecked: {
    width: 24,
    height: 24,
    borderRadius: 12,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Upcoming Section
  upcomingSection: {
    marginBottom: 20,
  },
  upcomingSectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 1,
    marginBottom: 12,
  },
  upcomingList: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  upcomingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    opacity: 0.6,
  },
  upcomingTime: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.5)',
    marginLeft: 8,
    marginRight: 12,
  },
  upcomingTitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.4)',
    flex: 1,
  },
  
  // Week Section
  weekSection: {
    marginBottom: 20,
  },
  weekTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 1,
    marginBottom: 12,
  },
  weekCalendar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  dayContainer: {
    alignItems: 'center',
    flex: 1,
  },
  dayLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.4)',
    marginBottom: 8,
  },
  dayLabelToday: {
    color: '#FFD700',
  },
  dayIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCompleted: {
    backgroundColor: 'rgba(6,255,165,0.15)',
  },
  dayToday: {
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  dayFuture: {
    opacity: 0.3,
  },
  dayTodayDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFD700',
  },
  
  // Review Section
  reviewSection: {
    marginBottom: 20,
  },
  reviewButton: {
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  reviewContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 24,
    height: '100%',
  },
  reviewText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    letterSpacing: 0.5,
  },
  
  // Journal Prompt
  journalPrompt: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    right: 16,
  },
  journalCard: {
    padding: 20,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  journalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  emojiSlider: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  emojiOption: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiSelected: {
    backgroundColor: 'rgba(255,215,0,0.2)',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  emojiText: {
    fontSize: 24,
  },
});