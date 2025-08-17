import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useStore } from '../../state/rootStore';
import { ShareComposer } from './ShareComposer';
import { PostCard } from './components/PostCard';
import { FeedCard } from './components/FeedCard';
import { Post } from '../../state/slices/socialSlice';
import { PromptChips } from './components/PromptChips';
import { ComposerRow } from './components/ComposerRow';
import { LuxuryGradientBackground } from '../../ui/LuxuryGradientBackground';
import { GoldParticles } from '../../ui/GoldParticles';
import { GradientBackground } from '../../ui/atoms/GradientBackground';
import { LuxuryTheme } from '../../design/luxuryTheme';
import { useSocialV1 } from '../../utils/featureFlags';
import { LiquidGlassTabs } from './components/LiquidGlassTabs';
import { PostPromptCard } from './components/PostPromptCard';
import { NeonDivider } from '../../ui/atoms/NeonDivider';
import { AnimatedFeedView } from './components/AnimatedFeedView';

export const SocialScreen = () => {
  const feedView = useStore(s=>s.feedView);
  const setFeedView = useStore(s=>s.setFeedView);
  const circle = useStore(s=>s.circleFeed);
  const follow = useStore(s=>s.followFeed);
  const posts: Post[] = feedView==='circle'?circle:follow;
  const openShare = useStore(s=>s.openShare);
  const react = useStore(s=>s.react);
  const v1Enabled = useSocialV1();

  // Use enhanced gradient background if V1 is enabled
  const BackgroundComponent = v1Enabled ? GradientBackground : LuxuryGradientBackground;

  return (
    <View style={[styles.container, v1Enabled && styles.containerV1]}>
      {/* Luxury Gradient Background matching onboarding */}
      <LinearGradient
        colors={['#0A0A0A', '#1A1A1A', '#0A0A0A']}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      {/* Subtle Gold Accent */}
      <LinearGradient
        colors={['rgba(231, 180, 58, 0.02)', 'transparent', 'rgba(231, 180, 58, 0.03)']}
        style={[StyleSheet.absoluteFillObject, { opacity: 0.3 }]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
        
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Liquid Glass Tabs */}
          <LiquidGlassTabs
            activeTab={feedView}
            onTabChange={setFeedView}
          />

          {/* Post Prompt Card - Scrollable */}
          <PostPromptCard
            onOpenComposer={(type) => openShare({ 
              type, 
              visibility: feedView 
            })}
          />

          {/* Neon Divider between create and consume */}
          <NeonDivider 
            color="rgba(255,255,255,0.1)"
            thickness={1}
            margin={24}
            animated={true}
          />

          {/* Animated Feed View */}
          <AnimatedFeedView feedKey={feedView}>
            <View style={styles.postsContainer}>
              {posts.map(p => (
                <FeedCard
                  key={p.id}
                  post={p}
                  onReact={(emoji) => react(p.id, emoji, feedView)}
                  onComment={() => {
                    // TODO: Open comment modal
                    console.log('Comment on post:', p.id);
                  }}
                  onProfileTap={() => {
                    // TODO: Navigate to profile
                    console.log('View profile:', p.user);
                  }}
                />
              ))}
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
    backgroundColor: '#0A0A0A',
  },
  containerV1: {
    backgroundColor: LuxuryTheme.colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
    paddingHorizontal: 0,
    paddingBottom: 120,
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
    gap: 12,  // Increased gap between cards
    paddingHorizontal: 16,  // Add horizontal padding for posts
  },
});