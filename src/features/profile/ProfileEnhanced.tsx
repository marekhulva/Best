import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { 
  Trophy, Flame, Target, TrendingUp, Star, 
  Award, Calendar, Users, Heart, MessageCircle 
} from 'lucide-react-native';
import { LuxuryGradientBackground } from '../../ui/LuxuryGradientBackground';
import { GoldParticles } from '../../ui/GoldParticles';
import { useStore } from '../../state/rootStore';
import { PostCardEnhanced } from '../social/components/PostCardEnhanced';
import { ResetOnboardingButton } from '../onboarding/ResetButton';
import { LuxuryTheme } from '../../design/luxuryTheme';

const { width } = Dimensions.get('window');

export const ProfileEnhanced = () => {
  const profile = useStore(s => s.profile);
  const goals = useStore(s => s.goals);
  const circleFeed = useStore(s => s.circleFeed);
  
  // Get user's own posts
  const userPosts = circleFeed.filter(post => post.user === (profile?.name || 'User'));
  const pinnedPosts = userPosts.slice(0, 2); // First 2 as pinned
  const recentPosts = userPosts.slice(2, 5); // Next 3 as recent
  
  const glowAnim = useSharedValue(0);
  const pulseAnim = useSharedValue(0);

  React.useEffect(() => {
    glowAnim.value = withRepeat(
      withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    pulseAnim.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const profileGlowStyle = useAnimatedStyle(() => ({
    shadowOpacity: interpolate(glowAnim.value, [0, 1], [0.3, 0.6]),
    shadowRadius: interpolate(glowAnim.value, [0, 1], [20, 35]),
  }));

  const badgeAnimation = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(pulseAnim.value, [0, 1], [1, 1.1]) }],
  }));

  // Sample data for demonstration
  const achievements = [
    { icon: Flame, label: '30 Day Streak', color: LuxuryTheme.colors.primary.gold },
    { icon: Trophy, label: '10 Goals Completed', color: LuxuryTheme.colors.primary.silver },
    { icon: Star, label: 'Top Performer', color: LuxuryTheme.colors.primary.champagne },
  ];

  const activeGoals = goals.slice(0, 3).map(goal => ({
    ...goal,
    progress: Math.floor(Math.random() * 100),
  }));

  const stats = {
    inspirationGiven: 234,
    accountabilityScore: 92,
    consistencyRate: 87,
    totalDays: 127,
  };

  return (
    <View style={styles.container}>
      <LuxuryGradientBackground variant="mixed">
        <GoldParticles variant="mixed" particleCount={15} />
        
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* HERO SECTION - Personal Brand */}
          <Animated.View style={[styles.heroCard, profileGlowStyle, { shadowColor: LuxuryTheme.colors.primary.gold }]}>
            <BlurView intensity={40} tint="dark" style={styles.heroCardInner}>
              <LinearGradient
                colors={['rgba(255,215,0,0.1)', 'rgba(192,192,192,0.05)']}
                style={StyleSheet.absoluteFillObject}
              />
              
              {/* Avatar with luxury ring */}
              <View style={styles.avatarSection}>
                <LinearGradient
                  colors={[LuxuryTheme.colors.primary.gold, LuxuryTheme.colors.primary.silver, LuxuryTheme.colors.primary.champagne]}
                  style={styles.avatarRing}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {profile?.name?.charAt(0) || 'U'}
                  </Text>
                </View>
                {/* Streak flame badge */}
                <View style={styles.streakBadge}>
                  <Flame size={16} color="#FFD700" />
                  <Text style={styles.streakNumber}>30</Text>
                </View>
              </View>

              <Text style={styles.profileName}>{profile?.name || 'Achiever'}</Text>
              <Text style={styles.profileBio}>Building my best self, one day at a time ✨</Text>

              {/* Achievement Badges */}
              <View style={styles.achievementRow}>
                {achievements.map((achievement, index) => {
                  const Icon = achievement.icon;
                  return (
                    <Animated.View 
                      key={index} 
                      style={[styles.achievementBadge, index === 0 && badgeAnimation]}
                    >
                      <LinearGradient
                        colors={[`${achievement.color}20`, `${achievement.color}10`]}
                        style={StyleSheet.absoluteFillObject}
                      />
                      <Icon size={20} color={achievement.color} />
                      <Text style={styles.achievementLabel}>{achievement.label}</Text>
                    </Animated.View>
                  );
                })}
              </View>

              {/* Signature Stats */}
              <View style={styles.signatureStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{stats.totalDays}</Text>
                  <Text style={styles.statLabel}>Days</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{stats.consistencyRate}%</Text>
                  <Text style={styles.statLabel}>Consistency</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{stats.accountabilityScore}</Text>
                  <Text style={styles.statLabel}>Score</Text>
                </View>
              </View>
            </BlurView>
          </Animated.View>

          {/* CURRENT JOURNEY - What I'm Building */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Target size={20} color="#FFD700" />
              <Text style={styles.sectionTitle}>Current Journey</Text>
            </View>

            <BlurView intensity={30} tint="dark" style={styles.journeyCard}>
              <LinearGradient
                colors={['rgba(255,215,0,0.08)', 'rgba(192,192,192,0.03)']}
                style={StyleSheet.absoluteFillObject}
              />
              
              {/* Active Goals */}
              <View style={styles.goalsGrid}>
                {activeGoals.map((goal, index) => (
                  <View key={index} style={styles.goalItem}>
                    <View style={styles.goalHeader}>
                      <View style={[styles.goalDot, { backgroundColor: goal.color }]} />
                      <Text style={styles.goalTitle}>{goal.title}</Text>
                    </View>
                    
                    {/* Progress Ring */}
                    <View style={styles.progressRing}>
                      <LinearGradient
                        colors={['#FFD700', '#F7E7CE']}
                        style={[styles.progressArc, { 
                          transform: [{ rotate: `${(goal.progress / 100) * 360}deg` }] 
                        }]}
                      />
                      <Text style={styles.progressText}>{goal.progress}%</Text>
                    </View>
                    
                    <Text style={styles.goalCategory}>{goal.category}</Text>
                  </View>
                ))}
              </View>

              {/* This Week's Focus */}
              <View style={styles.focusCard}>
                <LinearGradient
                  colors={['rgba(255,215,0,0.1)', 'rgba(255,215,0,0.05)']}
                  style={StyleSheet.absoluteFillObject}
                />
                <Text style={styles.focusLabel}>This Week's Focus</Text>
                <Text style={styles.focusText}>Complete morning meditation every day</Text>
              </View>
            </BlurView>
          </View>

          {/* PUBLIC TIMELINE - My Story */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Calendar size={20} color="#C0C0C0" />
              <Text style={styles.sectionTitle}>My Story</Text>
            </View>

            {/* Pinned Posts */}
            {pinnedPosts.length > 0 && (
              <View style={styles.pinnedSection}>
                <Text style={styles.pinnedLabel}>📌 Pinned</Text>
                {pinnedPosts.map(post => (
                  <View key={post.id} style={styles.pinnedPost}>
                    <PostCardEnhanced 
                      post={post} 
                      onReact={() => {}} 
                    />
                  </View>
                ))}
              </View>
            )}

            {/* Recent Activity */}
            <View style={styles.recentSection}>
              <Text style={styles.recentLabel}>Recent Activity</Text>
              {recentPosts.map(post => (
                <View key={post.id} style={styles.recentPost}>
                  <PostCardEnhanced 
                    post={post} 
                    onReact={() => {}} 
                  />
                </View>
              ))}
            </View>
          </View>

          {/* SOCIAL PROOF - Community Impact */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Users size={20} color="#E5E4E2" />
              <Text style={styles.sectionTitle}>Community Impact</Text>
            </View>

            <BlurView intensity={25} tint="dark" style={styles.impactCard}>
              <LinearGradient
                colors={['rgba(192,192,192,0.08)', 'rgba(255,215,0,0.03)']}
                style={StyleSheet.absoluteFillObject}
              />

              <View style={styles.impactGrid}>
                <View style={styles.impactItem}>
                  <Heart size={24} color="#FFD700" />
                  <Text style={styles.impactNumber}>{stats.inspirationGiven}</Text>
                  <Text style={styles.impactLabel}>Inspiration Given</Text>
                </View>
                
                <View style={styles.impactItem}>
                  <MessageCircle size={24} color="#C0C0C0" />
                  <Text style={styles.impactNumber}>89</Text>
                  <Text style={styles.impactLabel}>Supportive Comments</Text>
                </View>
                
                <View style={styles.impactItem}>
                  <Award size={24} color="#F7E7CE" />
                  <Text style={styles.impactNumber}>12</Text>
                  <Text style={styles.impactLabel}>Milestones Celebrated</Text>
                </View>
              </View>

              {/* Testimonial */}
              <View style={styles.testimonialCard}>
                <Text style={styles.testimonialText}>
                  "Your consistency inspires me every day! 🌟"
                </Text>
                <Text style={styles.testimonialAuthor}>- Jordan</Text>
              </View>
            </BlurView>
          </View>

          {/* Growth Visualization */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <TrendingUp size={20} color="#FFD700" />
              <Text style={styles.sectionTitle}>Growth Timeline</Text>
            </View>

            <BlurView intensity={20} tint="dark" style={styles.timelineCard}>
              <LinearGradient
                colors={['rgba(255,215,0,0.05)', 'rgba(192,192,192,0.05)']}
                style={StyleSheet.absoluteFillObject}
              />
              
              {/* Milestone Timeline */}
              <View style={styles.timeline}>
                <View style={styles.timelineItem}>
                  <View style={styles.timelineDot} />
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineDate}>Today</Text>
                    <Text style={styles.timelineEvent}>30-day meditation streak! 🧘</Text>
                  </View>
                </View>
                
                <View style={styles.timelineItem}>
                  <View style={styles.timelineDot} />
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineDate}>1 week ago</Text>
                    <Text style={styles.timelineEvent}>Completed first 5K run 🏃</Text>
                  </View>
                </View>
                
                <View style={styles.timelineItem}>
                  <View style={styles.timelineDot} />
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineDate}>1 month ago</Text>
                    <Text style={styles.timelineEvent}>Started morning routine ☀️</Text>
                  </View>
                </View>
              </View>
            </BlurView>
          </View>
        </ScrollView>
      </LuxuryGradientBackground>
      <ResetOnboardingButton />
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

  // Hero Section
  heroCard: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 24,
  },
  heroCardInner: {
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.1)',
  },
  avatarSection: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    padding: 3,
  },
  avatar: {
    position: 'absolute',
    top: 3,
    left: 3,
    right: 3,
    bottom: 3,
    backgroundColor: '#0A0A0A',
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFD700',
  },
  streakBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#0A0A0A',
    borderRadius: 12,
    padding: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  streakNumber: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '700',
  },
  profileName: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  profileBio: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: 20,
  },
  achievementRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  achievementBadge: {
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.2)',
    overflow: 'hidden',
  },
  achievementLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.8)',
  },
  signatureStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFD700',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(192,192,192,0.2)',
  },

  // Section Styles
  section: {
    marginBottom: 24,
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

  // Journey Card
  journeyCard: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.1)',
    overflow: 'hidden',
  },
  goalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  goalItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'rgba(255,215,0,0.05)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.1)',
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  goalDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  goalTitle: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
    flex: 1,
  },
  progressRing: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: 'rgba(255,215,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: 8,
  },
  progressArc: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: 'transparent',
    borderTopColor: '#FFD700',
  },
  progressText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFD700',
  },
  goalCategory: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
  },
  focusCard: {
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.2)',
    overflow: 'hidden',
  },
  focusLabel: {
    fontSize: 12,
    color: '#FFD700',
    marginBottom: 4,
  },
  focusText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },

  // Timeline Section
  pinnedSection: {
    marginBottom: 16,
  },
  pinnedLabel: {
    fontSize: 14,
    color: '#FFD700',
    marginBottom: 8,
    fontWeight: '600',
  },
  pinnedPost: {
    marginBottom: 8,
  },
  recentSection: {
    marginTop: 8,
  },
  recentLabel: {
    fontSize: 14,
    color: '#C0C0C0',
    marginBottom: 8,
    fontWeight: '600',
  },
  recentPost: {
    marginBottom: 8,
  },

  // Impact Section
  impactCard: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(192,192,192,0.1)',
    overflow: 'hidden',
  },
  impactGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  impactItem: {
    alignItems: 'center',
    gap: 4,
  },
  impactNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  impactLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
  },
  testimonialCard: {
    backgroundColor: 'rgba(255,215,0,0.05)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.1)',
  },
  testimonialText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  testimonialAuthor: {
    fontSize: 12,
    color: '#FFD700',
    textAlign: 'right',
  },

  // Timeline
  timelineCard: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.1)',
    overflow: 'hidden',
  },
  timeline: {
    gap: 16,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: 12,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFD700',
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
  },
  timelineDate: {
    fontSize: 12,
    color: '#C0C0C0',
    marginBottom: 2,
  },
  timelineEvent: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
});