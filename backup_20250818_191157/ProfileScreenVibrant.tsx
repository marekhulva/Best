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
import { Settings, Award, Star, Activity, LogOut, ChevronRight } from 'lucide-react-native';
import { LuxuryGradientBackground } from '../../ui/LuxuryGradientBackground';
import { GoldParticles } from '../../ui/GoldParticles';
import { LuxuryTheme } from '../../design/luxuryTheme';
import { useStore } from '../../state/rootStore';

const { width } = Dimensions.get('window');

export const ProfileScreenVibrant = () => {
  const profile = useStore(s => s.profile);
  const glowAnim = useSharedValue(0);
  const rotateAnim = useSharedValue(0);

  React.useEffect(() => {
    glowAnim.value = withRepeat(
      withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    rotateAnim.value = withRepeat(
      withTiming(360, { duration: 20000, easing: Easing.linear }),
      -1
    );
  }, []);

  const profileGlowStyle = useAnimatedStyle(() => ({
    shadowOpacity: interpolate(glowAnim.value, [0, 1], [0.5, 0.9]),
    shadowRadius: interpolate(glowAnim.value, [0, 1], [20, 40]),
  }));

  const starfieldStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotateAnim.value}deg` }],
  }));

  const menuItems = [
    { icon: Award, label: 'Achievements', color: '#FFD700', count: '12' },
    { icon: Activity, label: 'Activity Stats', color: '#C0C0C0', count: '89%' },
    { icon: Star, label: 'Milestones', color: '#F7E7CE', count: '5' },
    { icon: Settings, label: 'Settings', color: '#E5E4E2' },
    { icon: LogOut, label: 'Sign Out', color: '#C0C0C0' },
  ];

  return (
    <View style={styles.container}>
      <LuxuryGradientBackground variant="mixed">
        {/* Elegant particles */}
        <Animated.View style={[StyleSheet.absoluteFillObject, starfieldStyle]}>
          <GoldParticles
            variant="mixed"
            particleCount={20}
          />
        </Animated.View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Header */}
          <Animated.View style={[styles.profileCard, profileGlowStyle, { shadowColor: '#FFD700' }]}>
            <BlurView intensity={40} tint="dark" style={styles.profileCardInner}>
              <LinearGradient
                colors={['rgba(255,215,0,0.1)', 'rgba(192,192,192,0.05)']}
                style={StyleSheet.absoluteFillObject}
              />
              
              {/* Avatar with gradient ring */}
              <View style={styles.avatarContainer}>
                <LinearGradient
                  colors={['#FFD700', '#C0C0C0', '#F7E7CE']}
                  style={styles.avatarRing}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {profile?.name?.charAt(0) || 'U'}
                  </Text>
                </View>
              </View>

              <Text style={styles.profileName}>{profile?.name || 'Space Traveler'}</Text>
              <Text style={styles.profileBio}>Exploring the infinite universe of possibilities</Text>

              {/* Stats Row */}
              <View style={styles.statsRow}>
                <View style={styles.stat}>
                  <LinearGradient
                    colors={['#FFD700', '#F7E7CE']}
                    style={styles.statGradient}
                  >
                    <Text style={styles.statNumber}>127</Text>
                  </LinearGradient>
                  <Text style={styles.statLabel}>Days</Text>
                </View>
                <View style={styles.stat}>
                  <LinearGradient
                    colors={['#C0C0C0', '#E5E4E2']}
                    style={styles.statGradient}
                  >
                    <Text style={styles.statNumber}>42</Text>
                  </LinearGradient>
                  <Text style={styles.statLabel}>Goals</Text>
                </View>
                <View style={styles.stat}>
                  <LinearGradient
                    colors={['#FFD700', '#F7E7CE']}
                    style={styles.statGradient}
                  >
                    <Text style={styles.statNumber}>89%</Text>
                  </LinearGradient>
                  <Text style={styles.statLabel}>Success</Text>
                </View>
              </View>
            </BlurView>
          </Animated.View>

          {/* Menu Items */}
          <View style={styles.menuSection}>
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Pressable
                  key={index}
                  style={({ pressed }) => [
                    styles.menuItem,
                    pressed && styles.menuItemPressed
                  ]}
                >
                  <BlurView intensity={20} tint="dark" style={styles.menuItemInner}>
                    <LinearGradient
                      colors={[`${item.color}15`, 'transparent']}
                      style={StyleSheet.absoluteFillObject}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    />
                    
                    <View style={styles.menuItemContent}>
                      <View style={styles.menuItemLeft}>
                        <View style={[styles.iconContainer, { backgroundColor: `${item.color}20` }]}>
                          <Icon color={item.color} size={20} />
                        </View>
                        <Text style={styles.menuItemLabel}>{item.label}</Text>
                      </View>
                      
                      <View style={styles.menuItemRight}>
                        {item.count && (
                          <Text style={[styles.menuItemCount, { color: item.color }]}>
                            {item.count}
                          </Text>
                        )}
                        <ChevronRight color="rgba(255,255,255,0.3)" size={16} />
                      </View>
                    </View>
                  </BlurView>
                </Pressable>
              );
            })}
          </View>

          {/* Level Card */}
          <BlurView intensity={30} tint="dark" style={styles.levelCard}>
            <LinearGradient
              colors={['rgba(255,215,0,0.2)', 'rgba(192,192,192,0.1)']}
              style={StyleSheet.absoluteFillObject}
            />
            
            <Text style={styles.levelTitle}>Current Level</Text>
            <View style={styles.levelInfo}>
              <LinearGradient
                colors={['#FFD700', '#C0C0C0']}
                style={styles.levelBadge}
              >
                <Text style={styles.levelNumber}>15</Text>
              </LinearGradient>
              <View style={styles.levelDetails}>
                <Text style={styles.levelName}>Cosmic Explorer</Text>
                <Text style={styles.levelProgress}>2,847 / 3,000 XP</Text>
              </View>
            </View>
            
            <View style={styles.xpBar}>
              <LinearGradient
                colors={['#FFD700', '#F7E7CE']}
                style={[styles.xpFill, { width: '95%' }]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            </View>
          </BlurView>

          {/* Quote */}
          <View style={styles.quoteCard}>
            <LinearGradient
              colors={['rgba(255,215,0,0.05)', 'rgba(192,192,192,0.05)', 'rgba(229,228,226,0.05)']}
              style={StyleSheet.absoluteFillObject}
            />
            <Text style={styles.quoteText}>
              "You are made of stardust and infinite potential"
            </Text>
          </View>
        </ScrollView>
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
  profileCard: {
    borderRadius: 24,
    marginBottom: 24,
  },
  profileCardInner: {
    borderRadius: 24,
    overflow: 'hidden',
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,212,255,0.2)',
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    padding: 3,
    marginBottom: 16,
  },
  avatarRing: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    padding: 3,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 47,
    backgroundColor: 'rgba(0,0,0,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  profileName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  profileBio: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 24,
  },
  stat: {
    alignItems: 'center',
  },
  statGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  menuSection: {
    gap: 12,
    marginBottom: 20,
  },
  menuItem: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  menuItemPressed: {
    opacity: 0.8,
  },
  menuItemInner: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  menuItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuItemCount: {
    fontSize: 14,
    fontWeight: '700',
  },
  levelCard: {
    borderRadius: 20,
    overflow: 'hidden',
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.2)',
  },
  levelTitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 12,
  },
  levelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  levelBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelNumber: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  levelDetails: {
    flex: 1,
  },
  levelName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  levelProgress: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4,
  },
  xpBar: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  xpFill: {
    height: '100%',
    borderRadius: 4,
  },
  quoteCard: {
    borderRadius: 20,
    overflow: 'hidden',
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  quoteText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 24,
  },
});