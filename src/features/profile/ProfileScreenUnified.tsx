import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { 
  User, Trophy, Target, Settings, Bell, Shield, 
  HelpCircle, LogOut, ChevronRight, Award, Flame,
  Star, TrendingUp, Calendar, Clock, Heart, Users
} from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  FadeIn,
  FadeInDown,
  interpolate,
} from 'react-native-reanimated';
import { useStore } from '../../state/rootStore';
import { HapticButton } from '../../ui/HapticButton';
import { LuxuryTheme } from '../../design/luxuryTheme';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

export const ProfileScreenUnified = () => {
  const user = useStore(s => s.user);
  const goals = useStore(s => s.goals);
  const actions = useStore(s => s.actions);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  // Calculate stats
  const totalPoints = 2840;
  const currentStreak = 7;
  const longestStreak = 21;
  const completedGoals = goals.filter(g => g.status === 'Completed').length;
  const activeGoals = goals.filter(g => g.status === 'On Track').length;
  const totalActions = actions.length;
  const completedActions = actions.filter(a => a.done).length;
  const completionRate = totalActions ? Math.round((completedActions / totalActions) * 100) : 0;

  const scaleAnim = useSharedValue(1);

  const avatarStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnim.value }],
  }));

  const renderHeader = () => (
    <View style={styles.header}>
      <Animated.View 
        entering={FadeIn.duration(600)}
        style={styles.profileSection}
      >
        <Animated.View style={[styles.avatarContainer, avatarStyle]}>
          <LinearGradient
            colors={[LuxuryTheme.colors.primary.gold, LuxuryTheme.colors.primary.champagne]}
            style={styles.avatarGradient}
          />
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          <View style={styles.levelBadge}>
            <Star size={12} color="#000" fill="#000" />
            <Text style={styles.levelText}>12</Text>
          </View>
        </Animated.View>
        
        <Text style={styles.userName}>{user?.name || 'User'}</Text>
        <Text style={styles.userTitle}>Goal Achiever</Text>
        
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Flame size={20} color={LuxuryTheme.colors.primary.gold} />
            <Text style={styles.statValue}>{currentStreak}</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Trophy size={20} color={LuxuryTheme.colors.primary.gold} />
            <Text style={styles.statValue}>{totalPoints}</Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Target size={20} color={LuxuryTheme.colors.primary.gold} />
            <Text style={styles.statValue}>{activeGoals}</Text>
            <Text style={styles.statLabel}>Goals</Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );

  const renderAchievements = () => (
    <Animated.View 
      entering={FadeInDown.delay(200).springify()}
      style={styles.achievementsCard}
    >
      <View style={styles.cardHeader}>
        <Award size={20} color={LuxuryTheme.colors.primary.gold} />
        <Text style={styles.cardTitle}>Achievements</Text>
        <ChevronRight size={16} color={LuxuryTheme.colors.text.tertiary} />
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.achievementsList}
      >
        {[
          { icon: Flame, name: 'Fire Starter', desc: '7 day streak', color: '#FF6B6B' },
          { icon: Trophy, name: 'Champion', desc: '2500+ points', color: LuxuryTheme.colors.primary.gold },
          { icon: TrendingUp, name: 'Rising Star', desc: '90% completion', color: '#4ECDC4' },
          { icon: Heart, name: 'Dedicated', desc: '30 days active', color: '#FF6B9D' },
        ].map((achievement, index) => (
          <View key={index} style={styles.achievementItem}>
            <View style={[styles.achievementIcon, { backgroundColor: achievement.color + '20' }]}>
              <achievement.icon size={24} color={achievement.color} />
            </View>
            <Text style={styles.achievementName}>{achievement.name}</Text>
            <Text style={styles.achievementDesc}>{achievement.desc}</Text>
          </View>
        ))}
      </ScrollView>
    </Animated.View>
  );

  const renderStats = () => (
    <Animated.View 
      entering={FadeInDown.delay(300).springify()}
      style={styles.statsCard}
    >
      <View style={styles.cardHeader}>
        <TrendingUp size={20} color={LuxuryTheme.colors.primary.gold} />
        <Text style={styles.cardTitle}>Your Progress</Text>
      </View>
      
      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <Text style={styles.statBoxValue}>{completionRate}%</Text>
          <Text style={styles.statBoxLabel}>Completion Rate</Text>
        </View>
        
        <View style={styles.statBox}>
          <Text style={styles.statBoxValue}>{longestStreak}</Text>
          <Text style={styles.statBoxLabel}>Best Streak</Text>
        </View>
        
        <View style={styles.statBox}>
          <Text style={styles.statBoxValue}>{completedGoals}</Text>
          <Text style={styles.statBoxLabel}>Goals Completed</Text>
        </View>
        
        <View style={styles.statBox}>
          <Text style={styles.statBoxValue}>12</Text>
          <Text style={styles.statBoxLabel}>Level</Text>
        </View>
      </View>
    </Animated.View>
  );

  const renderSettings = () => (
    <Animated.View 
      entering={FadeInDown.delay(400).springify()}
      style={styles.settingsSection}
    >
      <Text style={styles.sectionTitle}>Settings</Text>
      
      <View style={styles.settingsList}>
        <HapticButton
          hapticType="light"
          style={styles.settingItem}
        >
          <View style={styles.settingLeft}>
            <Bell size={20} color={LuxuryTheme.colors.text.secondary} />
            <Text style={styles.settingText}>Notifications</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ 
              false: 'rgba(255,255,255,0.1)', 
              true: LuxuryTheme.colors.primary.gold + '40' 
            }}
            thumbColor={notificationsEnabled ? LuxuryTheme.colors.primary.gold : '#666'}
          />
        </HapticButton>
        
        <HapticButton
          hapticType="light"
          style={styles.settingItem}
        >
          <View style={styles.settingLeft}>
            <Users size={20} color={LuxuryTheme.colors.text.secondary} />
            <Text style={styles.settingText}>Manage Circle</Text>
          </View>
          <ChevronRight size={20} color={LuxuryTheme.colors.text.tertiary} />
        </HapticButton>
        
        <HapticButton
          hapticType="light"
          style={styles.settingItem}
        >
          <View style={styles.settingLeft}>
            <Shield size={20} color={LuxuryTheme.colors.text.secondary} />
            <Text style={styles.settingText}>Privacy</Text>
          </View>
          <ChevronRight size={20} color={LuxuryTheme.colors.text.tertiary} />
        </HapticButton>
        
        <HapticButton
          hapticType="light"
          style={styles.settingItem}
        >
          <View style={styles.settingLeft}>
            <HelpCircle size={20} color={LuxuryTheme.colors.text.secondary} />
            <Text style={styles.settingText}>Help & Support</Text>
          </View>
          <ChevronRight size={20} color={LuxuryTheme.colors.text.tertiary} />
        </HapticButton>
        
        <HapticButton
          hapticType="light"
          style={[styles.settingItem, styles.logoutItem]}
        >
          <View style={styles.settingLeft}>
            <LogOut size={20} color="#EF4444" />
            <Text style={[styles.settingText, styles.logoutText]}>Sign Out</Text>
          </View>
        </HapticButton>
      </View>
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
        {renderAchievements()}
        {renderStats()}
        {renderSettings()}
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
    marginBottom: 32,
  },
  profileSection: {
    alignItems: 'center',
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    padding: 3,
    marginBottom: 16,
  },
  avatarGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 50,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    backgroundColor: LuxuryTheme.colors.background.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: LuxuryTheme.colors.primary.gold,
  },
  levelBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: LuxuryTheme.colors.primary.gold,
    borderRadius: 14,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    borderWidth: 2,
    borderColor: LuxuryTheme.colors.background.card,
  },
  levelText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: LuxuryTheme.colors.text.primary,
    marginBottom: 4,
  },
  userTitle: {
    fontSize: 14,
    color: LuxuryTheme.colors.text.tertiary,
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: LuxuryTheme.colors.background.card,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: LuxuryTheme.colors.background.cardBorder,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: LuxuryTheme.colors.text.primary,
    marginTop: 4,
  },
  statLabel: {
    fontSize: 11,
    color: LuxuryTheme.colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  achievementsCard: {
    backgroundColor: LuxuryTheme.colors.background.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: LuxuryTheme.colors.background.cardBorder,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: LuxuryTheme.colors.text.primary,
    flex: 1,
  },
  achievementsList: {
    marginHorizontal: -8,
  },
  achievementItem: {
    alignItems: 'center',
    marginHorizontal: 12,
    width: 80,
  },
  achievementIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  achievementName: {
    fontSize: 12,
    fontWeight: '600',
    color: LuxuryTheme.colors.text.primary,
    textAlign: 'center',
  },
  achievementDesc: {
    fontSize: 10,
    color: LuxuryTheme.colors.text.tertiary,
    textAlign: 'center',
    marginTop: 2,
  },
  statsCard: {
    backgroundColor: LuxuryTheme.colors.background.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: LuxuryTheme.colors.background.cardBorder,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statBox: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statBoxValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: LuxuryTheme.colors.primary.gold,
    marginBottom: 4,
  },
  statBoxLabel: {
    fontSize: 11,
    color: LuxuryTheme.colors.text.tertiary,
    textAlign: 'center',
  },
  settingsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: LuxuryTheme.colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
    marginLeft: 4,
  },
  settingsList: {
    backgroundColor: LuxuryTheme.colors.background.card,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: LuxuryTheme.colors.background.cardBorder,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingText: {
    fontSize: 15,
    color: LuxuryTheme.colors.text.primary,
  },
  logoutItem: {
    borderBottomWidth: 0,
  },
  logoutText: {
    color: '#EF4444',
  },
});