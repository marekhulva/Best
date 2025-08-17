import React, { useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Dimensions, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSpring,
  withSequence,
  interpolate,
  Easing,
  FadeInDown,
  FadeIn,
  runOnJS,
} from 'react-native-reanimated';
import { useStore } from '../../state/rootStore';
import { ShareComposer } from './ShareComposer';
import { FeedCard } from './components/FeedCard';
import { Post } from '../../state/slices/socialSlice';
import { LuxuryTheme } from '../../design/luxuryTheme';
import { LiquidGlassTabs } from './components/LiquidGlassTabs';
import { PostPromptCard } from './components/PostPromptCard';
import { NeonDivider } from '../../ui/atoms/NeonDivider';
import { AnimatedFeedView } from './components/AnimatedFeedView';
import { Users, TrendingUp, Bell, Sparkles, Activity, Flame } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

export const SocialScreen = () => {
  const feedView = useStore(s=>s.feedView);
  const setFeedView = useStore(s=>s.setFeedView);
  const circle = useStore(s=>s.circleFeed);
  const follow = useStore(s=>s.followFeed);
  const posts: Post[] = feedView==='circle'?circle:follow;
  const openShare = useStore(s=>s.openShare);
  const react = useStore(s=>s.react);
  
  // State for engagement triggers
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [unreadCount, setUnreadCount] = React.useState(3); // Mock unread
  const [activeUsers, setActiveUsers] = React.useState(247); // Mock active users
  const scrollY = useSharedValue(0);
  const pulseAnimation = useSharedValue(0);
  const notificationBounce = useSharedValue(0);
  const liveIndicatorAnim = useSharedValue(0);
  
  // Simulate live activity updates
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsers(prev => prev + Math.floor(Math.random() * 5) - 2);
      if (Math.random() > 0.7) {
        setUnreadCount(prev => prev + 1);
        notificationBounce.value = withSequence(
          withSpring(1.2),
          withSpring(1)
        );
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }, 8000);
    return () => clearInterval(interval);
  }, []);
  
  // Pulse animation for urgency
  useEffect(() => {
    pulseAnimation.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1
    );
    
    // Live indicator animation
    liveIndicatorAnim.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 600 }),
        withTiming(0.3, { duration: 600 })
      ),
      -1
    );
  }, []);
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setTimeout(() => {
      setIsRefreshing(false);
      setUnreadCount(0);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 1500);
  };

  const headerOpacityStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, 100], [1, 0.95]),
  }));
  
  const notificationStyle = useAnimatedStyle(() => ({
    transform: [{ scale: notificationBounce.value }],
  }));
  
  const liveIndicatorStyle = useAnimatedStyle(() => ({
    opacity: liveIndicatorAnim.value,
  }));
  
  const pulseStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pulseAnimation.value, [0, 1], [0.3, 0.6]),
  }));

  return (
    <View style={styles.container}>
      {/* Pure Black Background */}
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: '#000000' }]} />
      
      {/* Pinned Liquid Glass Tabs at the top */}
      <View style={styles.pinnedHeader}>
        <LiquidGlassTabs
          activeTab={feedView}
          onTabChange={(tab) => {
            setFeedView(tab);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        />
      </View>
        
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor="#FFD700"
              colors={['#FFD700']}
            />
          }
          onScroll={(event) => {
            scrollY.value = event.nativeEvent.contentOffset.y;
          }}
          scrollEventThrottle={16}
        >
          {/* Social Proof Banner */}
          <Animated.View 
            entering={FadeInDown.duration(500).springify()}
            style={styles.socialProofBanner}
          >
            <LinearGradient
              colors={['rgba(255, 215, 0, 0.1)', 'rgba(255, 215, 0, 0.05)']}
              style={StyleSheet.absoluteFillObject}
            />
            <Flame size={16} color="#FFD700" />
            <Text style={styles.socialProofText}>
              <Text style={styles.socialProofHighlight}>Sarah</Text> just hit a 30-day streak!
            </Text>
            <Sparkles size={14} color="#FFD700" />
          </Animated.View>

          
          {/* Post Prompt Card - Enhanced with urgency */}
          <PostPromptCard
            onOpenComposer={(type) => {
              openShare({ type, visibility: feedView });
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }}
          />

          
          {/* Premium Divider */}
          <NeonDivider 
            color="rgba(255, 215, 0, 0.1)"
            thickness={1}
            margin={20}
            animated={true}
          />

          {/* Feed Label with Live Count */}
          <View style={styles.feedHeader}>
            <Text style={styles.feedTitle}>
              {feedView === 'circle' ? 'YOUR CIRCLE' : 'DISCOVER'}
            </Text>
            {posts.length > 0 && (
              <View style={styles.feedBadge}>
                <Text style={styles.feedBadgeText}>{posts.length} new</Text>
              </View>
            )}
          </View>
          
          {/* Animated Feed View - Enhanced */}
          <AnimatedFeedView feedKey={feedView}>
            <View style={styles.postsContainer}>
              {posts.length === 0 ? (
                <Animated.View 
                  entering={FadeIn.duration(600)}
                  style={styles.emptyState}
                >
                  <View style={styles.emptyIcon}>
                    <Users size={40} color="rgba(255, 255, 255, 0.2)" />
                  </View>
                  <Text style={styles.emptyTitle}>
                    {feedView === 'circle' ? 'Your Circle is Quiet' : 'No Posts Yet'}
                  </Text>
                  <Text style={styles.emptySubtitle}>
                    {feedView === 'circle' 
                      ? 'Be the first to share your progress!' 
                      : 'Follow more people to see their journey'}
                  </Text>
                </Animated.View>
              ) : (
                posts.map((p, index) => (
                  <Animated.View
                    key={p.id}
                    entering={FadeInDown.delay(50 * Math.min(index, 5)).springify()}
                  >
                    <FeedCard
                      post={p}
                      onReact={(emoji) => {
                        react(p.id, emoji, feedView);
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }}
                      onComment={() => {
                        console.log('Comment on post:', p.id);
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }}
                      onProfileTap={() => {
                        console.log('View profile:', p.user);
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }}
                    />
                  </Animated.View>
                ))
              )}
              
              {/* Load More Indicator */}
              {posts.length > 0 && (
                <Animated.View 
                  entering={FadeInDown.delay(300).springify()}
                  style={styles.loadMoreContainer}
                >
                  <Text style={styles.loadMoreText}>Pull to discover more</Text>
                  <Activity size={16} color="rgba(255, 255, 255, 0.3)" />
                </Animated.View>
              )}
            </View>
          </AnimatedFeedView>
        </ScrollView>

        <ShareComposer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  glowOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  pinnedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    paddingTop: 10,
    paddingBottom: 8,
  },
  liveHeader: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    zIndex: 100,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  liveHeaderBlur: {
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.1)',
  },
  liveContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  activeUsersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4AE54A',
  },
  activeUsersText: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: '600',
  },
  trendingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendingText: {
    fontSize: 12,
    color: '#4AE54A',
    fontWeight: '600',
  },
  notificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFD700',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  notificationCount: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 100, // Account for pinned header at top
    paddingHorizontal: 0,
    paddingBottom: 120,
  },
  socialProofBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 215, 0, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.1)',
  },
  socialProofText: {
    flex: 1,
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  socialProofHighlight: {
    color: '#FFD700',
    fontWeight: '700',
  },
  urgencyMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(96, 165, 250, 0.05)',
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  urgencyText: {
    fontSize: 12,
    color: '#60A5FA',
    fontWeight: '600',
  },
  statsStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginHorizontal: 16,
    marginVertical: 16,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.4)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  feedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  feedTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.5)',
    letterSpacing: 1.5,
  },
  feedBadge: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  feedBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFD700',
  },
  tabContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(192,192,192,0.15)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    shadowColor: '#C0C0C0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  tabActive: {
    borderColor: 'rgba(255,215,0,0.3)',
    backgroundColor: 'rgba(255,215,0,0.1)',
  },
  tabText: {
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '700',
    fontSize: 15,
  },
  tabTextActive: {
    color: '#FFFFFF',
    textShadowColor: '#FFD700',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  shareCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.2)',
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  shareCardContent: {
    padding: 16,
    gap: 12,
  },
  shareTitle: {
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
    fontSize: 16,
  },
  promptSection: {
    marginVertical: 4,
  },
  postsContainer: {
    gap: 12,
    paddingHorizontal: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.4)',
    textAlign: 'center',
  },
  loadMoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 20,
    marginTop: 8,
  },
  loadMoreText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.3)',
  },
});