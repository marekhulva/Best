import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { useStore } from '../../state/rootStore';
import { ShareComposer } from './ShareComposer';
import { PostCard } from './components/PostCard';
import { FeedCard } from './components/FeedCard';
import { Post } from '../../state/slices/socialSlice';
import { PromptChips } from './components/PromptChips';
import { ComposerRow } from './components/ComposerRow';
import { LuxuryTheme } from '../../design/luxuryTheme';
import { useSocialV1 } from '../../utils/featureFlags';
import { LiquidGlassTabs } from './components/LiquidGlassTabs';
import { PostPromptCard } from './components/PostPromptCard';
import { NeonDivider } from '../../ui/atoms/NeonDivider';
import { AnimatedFeedView } from './components/AnimatedFeedView';
import { Users, Globe, TrendingUp, Award, MessageSquare, Heart } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

export const SocialScreen = () => {
  const feedView = useStore(s=>s.feedView);
  const setFeedView = useStore(s=>s.setFeedView);
  const circle = useStore(s=>s.circleFeed);
  const follow = useStore(s=>s.followFeed);
  const posts: Post[] = feedView==='circle'?circle:follow;
  const openShare = useStore(s=>s.openShare);
  const react = useStore(s=>s.react);
  const v1Enabled = useSocialV1();

  const handleTabChange = (tab: 'circle' | 'follow') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFeedView(tab);
  };

  // Mock leaderboard data
  const topPerformers = [
    { name: 'Sarah M.', points: 2840, rank: 1 },
    { name: 'Mike R.', points: 2720, rank: 2 },
    { name: 'Alex K.', points: 2650, rank: 3 },
  ];

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
        colors={['rgba(231, 180, 58, 0.02)', 'transparent', 'rgba(231, 180, 58, 0.03)']}
        style={[StyleSheet.absoluteFillObject, { opacity: 0.5 }]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0, y: 1 }}
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
          <Text style={styles.title}>Community</Text>
          <Text style={styles.subtitle}>Connect & celebrate together</Text>
        </Animated.View>

        {/* Premium Tab Selector */}
        <Animated.View 
          entering={FadeInDown.delay(100).springify()}
          style={styles.tabContainer}
        >
          <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFillObject} />
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.03)', 'rgba(255, 255, 255, 0.01)']}
            style={StyleSheet.absoluteFillObject}
          />
          
          <View style={styles.tabsRow}>
            <Pressable
              onPress={() => handleTabChange('circle')}
              style={[styles.tab, feedView === 'circle' && styles.tabActive]}
            >
              {feedView === 'circle' && (
                <LinearGradient
                  colors={[LuxuryTheme.colors.primary.gold, LuxuryTheme.colors.primary.champagne]}
                  style={StyleSheet.absoluteFillObject}
                />
              )}
              <Users 
                size={16} 
                color={feedView === 'circle' ? '#000' : LuxuryTheme.colors.text.tertiary} 
              />
              <Text style={[styles.tabText, feedView === 'circle' && styles.tabTextActive]}>
                Your Circle
              </Text>
            </Pressable>
            
            <Pressable
              onPress={() => handleTabChange('follow')}
              style={[styles.tab, feedView === 'follow' && styles.tabActive]}
            >
              {feedView === 'follow' && (
                <LinearGradient
                  colors={[LuxuryTheme.colors.primary.gold, LuxuryTheme.colors.primary.champagne]}
                  style={StyleSheet.absoluteFillObject}
                />
              )}
              <Globe 
                size={16} 
                color={feedView === 'follow' ? '#000' : LuxuryTheme.colors.text.tertiary} 
              />
              <Text style={[styles.tabText, feedView === 'follow' && styles.tabTextActive]}>
                Explore
              </Text>
            </Pressable>
          </View>
        </Animated.View>

        {/* Leaderboard Card - Only in Circle View */}
        {feedView === 'circle' && (
          <Animated.View 
            entering={FadeInDown.delay(200).springify()}
            style={styles.leaderboardCard}
          >
            <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFillObject} />
            <LinearGradient
              colors={['rgba(231, 180, 58, 0.05)', 'rgba(231, 180, 58, 0.02)']}
              style={StyleSheet.absoluteFillObject}
            />
            
            <View style={styles.leaderboardHeader}>
              <Award size={18} color={LuxuryTheme.colors.primary.gold} />
              <Text style={styles.leaderboardTitle}>Top Performers</Text>
              <View style={styles.leaderboardBadge}>
                <Text style={styles.leaderboardBadgeText}>This Week</Text>
              </View>
            </View>
            
            <View style={styles.leaderboardList}>
              {topPerformers.map((user, index) => (
                <Animated.View 
                  key={user.rank}
                  entering={FadeInDown.delay(250 + index * 50).springify()}
                  style={styles.leaderboardItem}
                >
                  <View style={styles.leaderboardRank}>
                    <Text style={[
                      styles.rankNumber,
                      user.rank === 1 && styles.rankGold
                    ]}>
                      {user.rank}
                    </Text>
                  </View>
                  <Text style={styles.leaderboardName}>{user.name}</Text>
                  <View style={styles.leaderboardPoints}>
                    <Text style={styles.pointsNumber}>{user.points}</Text>
                    <Text style={styles.pointsLabel}>pts</Text>
                  </View>
                </Animated.View>
              ))}
            </View>
          </Animated.View>
        )}

        {/* Share Composer Card */}
        <Animated.View 
          entering={FadeInDown.delay(300).springify()}
          style={styles.shareCard}
        >
          <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFillObject} />
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.03)', 'rgba(255, 255, 255, 0.01)']}
            style={StyleSheet.absoluteFillObject}
          />
          
          <View style={styles.shareContent}>
            <View style={styles.shareHeader}>
              <MessageSquare size={16} color={LuxuryTheme.colors.primary.gold} />
              <Text style={styles.shareTitle}>Share your progress</Text>
            </View>
            
            <View style={styles.promptSection}>
              <PromptChips
                onPick={(text) => {
                  openShare({ 
                    type: 'status', 
                    visibility: feedView, 
                    promptSeed: text 
                  });
                }}
              />
            </View>
            
            <ComposerRow
              onStatus={() => openShare({ type: 'status', visibility: feedView })}
              onPhoto={() => openShare({ type: 'photo', visibility: feedView })}
              onAudio={() => openShare({ type: 'audio', visibility: feedView })}
            />
          </View>
        </Animated.View>

        {/* Feed Posts */}
        <View style={styles.postsContainer}>
          {v1Enabled ? (
            <AnimatedFeedView posts={posts} onReact={react} feedView={feedView} />
          ) : (
            posts.map((post, index) => (
              <Animated.View
                key={post.id}
                entering={FadeInDown.delay(400 + index * 50).springify()}
              >
                <PostCard
                  post={post}
                  onReact={(emoji) => react(post.id, emoji, feedView)}
                />
              </Animated.View>
            ))
          )}
        </View>
      </ScrollView>

      <ShareComposer />
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
  title: {
    fontSize: 36,
    fontWeight: '300',
    color: LuxuryTheme.colors.text.primary,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: LuxuryTheme.colors.text.secondary,
    fontWeight: '400',
    letterSpacing: 0.3,
  },
  tabContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 4,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  tabActive: {
    backgroundColor: LuxuryTheme.colors.primary.gold,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: LuxuryTheme.colors.text.tertiary,
    letterSpacing: 0.3,
  },
  tabTextActive: {
    color: '#000',
  },
  leaderboardCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(231, 180, 58, 0.1)',
    padding: 20,
  },
  leaderboardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 8,
  },
  leaderboardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: LuxuryTheme.colors.text.primary,
    flex: 1,
  },
  leaderboardBadge: {
    backgroundColor: 'rgba(231, 180, 58, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  leaderboardBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: LuxuryTheme.colors.primary.gold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  leaderboardList: {
    gap: 12,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  leaderboardRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: LuxuryTheme.colors.text.secondary,
  },
  rankGold: {
    color: LuxuryTheme.colors.primary.gold,
  },
  leaderboardName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: LuxuryTheme.colors.text.primary,
  },
  leaderboardPoints: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  pointsNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: LuxuryTheme.colors.text.primary,
  },
  pointsLabel: {
    fontSize: 12,
    color: LuxuryTheme.colors.text.tertiary,
  },
  shareCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  shareContent: {
    padding: 20,
  },
  shareHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  shareTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: LuxuryTheme.colors.text.primary,
  },
  promptSection: {
    marginBottom: 16,
  },
  postsContainer: {
    gap: 12,
  },
});