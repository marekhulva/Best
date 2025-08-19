import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { 
  Heart, MessageCircle, Share2, Trophy, Flame, 
  TrendingUp, Users, Award, Sparkles, ChevronRight
} from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  FadeIn,
  FadeInDown,
  Layout,
} from 'react-native-reanimated';
import { useStore } from '../../state/rootStore';
import { HapticButton } from '../../ui/HapticButton';
import { LuxuryTheme } from '../../design/luxuryTheme';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

type FeedTab = 'circle' | 'global';

export const SocialScreenUnified = () => {
  const [activeTab, setActiveTab] = useState<FeedTab>('circle');
  const circleFeed = useStore(s => s.circleFeed);
  const globalFeed = useStore(s => s.globalFeed);
  
  const feed = activeTab === 'circle' ? circleFeed : globalFeed;

  const renderHeader = () => (
    <View style={styles.header}>
      <Animated.View entering={FadeIn.duration(600)}>
        <Text style={styles.screenTitle}>Community</Text>
        <Text style={styles.screenSubtitle}>Celebrate wins together</Text>
      </Animated.View>
      
      <View style={styles.tabBar}>
        <HapticButton
          hapticType="light"
          onPress={() => setActiveTab('circle')}
          style={[styles.tab, activeTab === 'circle' && styles.tabActive]}
        >
          <Users 
            size={18} 
            color={activeTab === 'circle' ? LuxuryTheme.colors.primary.gold : LuxuryTheme.colors.text.tertiary}
          />
          <Text style={[styles.tabText, activeTab === 'circle' && styles.tabTextActive]}>
            Your Circle
          </Text>
        </HapticButton>
        
        <HapticButton
          hapticType="light"
          onPress={() => setActiveTab('global')}
          style={[styles.tab, activeTab === 'global' && styles.tabActive]}
        >
          <Trophy 
            size={18} 
            color={activeTab === 'global' ? LuxuryTheme.colors.primary.gold : LuxuryTheme.colors.text.tertiary}
          />
          <Text style={[styles.tabText, activeTab === 'global' && styles.tabTextActive]}>
            Trending
          </Text>
        </HapticButton>
      </View>
    </View>
  );

  const renderPost = (post: any, index: number) => {
    const categoryColor = 
      post.category === 'fitness' ? '#22C55E' :
      post.category === 'mindfulness' ? '#60A5FA' :
      post.category === 'productivity' ? '#A78BFA' : 
      LuxuryTheme.colors.primary.gold;

    return (
      <Animated.View
        key={post.id}
        entering={FadeInDown.delay(index * 50).springify()}
        layout={Layout.springify()}
        style={styles.postCard}
      >
        <View style={styles.postHeader}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <LinearGradient
                colors={[categoryColor, categoryColor + '80']}
                style={StyleSheet.absoluteFillObject}
              />
              <Text style={styles.avatarText}>
                {post.user.charAt(0).toUpperCase()}
              </Text>
            </View>
            
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{post.user}</Text>
              <Text style={styles.postTime}>{post.time}</Text>
            </View>
          </View>
          
          {post.streak > 0 && (
            <View style={styles.streakBadge}>
              <Flame size={14} color={LuxuryTheme.colors.primary.gold} />
              <Text style={styles.streakText}>{post.streak}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.postContent}>
          <Text style={styles.postAction}>{post.action}</Text>
          
          {post.milestone && (
            <View style={styles.milestoneCard}>
              <LinearGradient
                colors={['rgba(231, 180, 58, 0.1)', 'rgba(231, 180, 58, 0.05)']}
                style={StyleSheet.absoluteFillObject}
              />
              <Trophy size={16} color={LuxuryTheme.colors.primary.gold} />
              <Text style={styles.milestoneText}>{post.milestone}</Text>
            </View>
          )}
          
          {post.progress && (
            <View style={styles.progressInfo}>
              <View style={styles.progressBar}>
                <View style={styles.progressBarBg} />
                <View style={[styles.progressBarFill, { width: `${post.progress}%` }]}>
                  <LinearGradient
                    colors={[categoryColor, categoryColor + '80']}
                    style={StyleSheet.absoluteFillObject}
                  />
                </View>
              </View>
              <Text style={styles.progressText}>{post.progress}% Complete</Text>
            </View>
          )}
        </View>
        
        <View style={styles.postFooter}>
          <View style={styles.reactions}>
            <HapticButton
              hapticType="light"
              style={styles.reactionButton}
            >
              <Heart size={18} color={LuxuryTheme.colors.text.tertiary} />
              <Text style={styles.reactionCount}>{post.kudos || 0}</Text>
            </HapticButton>
            
            <HapticButton
              hapticType="light"
              style={styles.reactionButton}
            >
              <MessageCircle size={18} color={LuxuryTheme.colors.text.tertiary} />
              <Text style={styles.reactionCount}>{post.comments?.length || 0}</Text>
            </HapticButton>
            
            <HapticButton
              hapticType="light"
              style={styles.reactionButton}
            >
              <Share2 size={18} color={LuxuryTheme.colors.text.tertiary} />
            </HapticButton>
          </View>
          
          <View style={[styles.categoryTag, { backgroundColor: categoryColor + '20' }]}>
            <Text style={[styles.categoryTagText, { color: categoryColor }]}>
              {post.category}
            </Text>
          </View>
        </View>
        
        {post.comments && post.comments.length > 0 && (
          <View style={styles.commentsPreview}>
            <View style={styles.commentDivider} />
            {post.comments.slice(0, 2).map((comment: any, idx: number) => (
              <View key={idx} style={styles.comment}>
                <Text style={styles.commentUser}>{comment.user}</Text>
                <Text style={styles.commentText}>{comment.text}</Text>
              </View>
            ))}
          </View>
        )}
      </Animated.View>
    );
  };

  const renderLeaderboard = () => (
    <View style={styles.leaderboardCard}>
      <LinearGradient
        colors={['rgba(231, 180, 58, 0.08)', 'rgba(231, 180, 58, 0.02)']}
        style={StyleSheet.absoluteFillObject}
      />
      
      <View style={styles.leaderboardHeader}>
        <Award size={20} color={LuxuryTheme.colors.primary.gold} />
        <Text style={styles.leaderboardTitle}>Top Performers</Text>
        <ChevronRight size={16} color={LuxuryTheme.colors.text.tertiary} />
      </View>
      
      <View style={styles.leaderboardList}>
        {[
          { rank: 1, name: 'Sarah M.', points: 2840 },
          { rank: 2, name: 'Mike R.', points: 2720 },
          { rank: 3, name: 'Alex K.', points: 2650 },
        ].map((user) => (
          <View key={user.rank} style={styles.leaderboardItem}>
            <View style={styles.leaderboardRank}>
              <Text style={[
                styles.rankNumber,
                user.rank === 1 && styles.rankGold
              ]}>
                #{user.rank}
              </Text>
            </View>
            <Text style={styles.leaderboardName}>{user.name}</Text>
            <Text style={styles.leaderboardPoints}>{user.points} pts</Text>
          </View>
        ))}
      </View>
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
        
        {activeTab === 'circle' && (
          <Animated.View entering={FadeIn.duration(400)}>
            {renderLeaderboard()}
          </Animated.View>
        )}
        
        {feed.map((post, index) => renderPost(post, index))}
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
    marginBottom: 24,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 16,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
  },
  tabActive: {
    backgroundColor: 'rgba(231, 180, 58, 0.1)',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: LuxuryTheme.colors.text.tertiary,
  },
  tabTextActive: {
    color: LuxuryTheme.colors.primary.gold,
  },
  leaderboardCard: {
    backgroundColor: LuxuryTheme.colors.background.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: LuxuryTheme.colors.background.cardBorder,
    overflow: 'hidden',
  },
  leaderboardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  leaderboardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: LuxuryTheme.colors.text.primary,
    flex: 1,
  },
  leaderboardList: {
    gap: 12,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leaderboardRank: {
    width: 32,
  },
  rankNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: LuxuryTheme.colors.text.secondary,
  },
  rankGold: {
    color: LuxuryTheme.colors.primary.gold,
  },
  leaderboardName: {
    flex: 1,
    fontSize: 14,
    color: LuxuryTheme.colors.text.primary,
  },
  leaderboardPoints: {
    fontSize: 14,
    fontWeight: '600',
    color: LuxuryTheme.colors.text.tertiary,
  },
  postCard: {
    backgroundColor: LuxuryTheme.colors.background.card,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: LuxuryTheme.colors.background.cardBorder,
    overflow: 'hidden',
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  userDetails: {
    gap: 2,
  },
  userName: {
    fontSize: 15,
    fontWeight: '600',
    color: LuxuryTheme.colors.text.primary,
  },
  postTime: {
    fontSize: 12,
    color: LuxuryTheme.colors.text.tertiary,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(231, 180, 58, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  streakText: {
    fontSize: 14,
    fontWeight: '600',
    color: LuxuryTheme.colors.primary.gold,
  },
  postContent: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  postAction: {
    fontSize: 16,
    color: LuxuryTheme.colors.text.primary,
    lineHeight: 22,
  },
  milestoneCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    padding: 12,
    backgroundColor: 'rgba(231, 180, 58, 0.05)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  milestoneText: {
    fontSize: 14,
    color: LuxuryTheme.colors.primary.gold,
    fontWeight: '600',
  },
  progressInfo: {
    marginTop: 12,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressText: {
    fontSize: 12,
    color: LuxuryTheme.colors.text.tertiary,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  reactions: {
    flexDirection: 'row',
    gap: 16,
  },
  reactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reactionCount: {
    fontSize: 13,
    color: LuxuryTheme.colors.text.tertiary,
  },
  categoryTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryTagText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  commentsPreview: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  commentDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginBottom: 12,
  },
  comment: {
    marginBottom: 8,
  },
  commentUser: {
    fontSize: 13,
    fontWeight: '600',
    color: LuxuryTheme.colors.text.secondary,
    marginBottom: 2,
  },
  commentText: {
    fontSize: 13,
    color: LuxuryTheme.colors.text.tertiary,
  },
});