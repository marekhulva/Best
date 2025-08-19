import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
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
import { TrendingUp, Target, Trophy, Zap } from 'lucide-react-native';
import { LuxuryGradientBackground } from '../../ui/LuxuryGradientBackground';
import { GoldParticles } from '../../ui/GoldParticles';
import { LuxuryTheme } from '../../design/luxuryTheme';
import { useStore } from '../../state/rootStore';

const { width } = Dimensions.get('window');

export const ProgressScreenVibrant = () => {
  const goals = useStore(s => s.goals);
  const dailyProgress = useStore(s => s.dailyProgress);
  const weeklyProgress = useStore(s => s.weeklyProgress);
  
  const pulseAnim = useSharedValue(0);
  const glowAnim = useSharedValue(0);

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
  }, []);

  const glowStyle = useAnimatedStyle(() => ({
    shadowOpacity: interpolate(glowAnim.value, [0, 1], [0.3, 0.7]),
    shadowRadius: interpolate(glowAnim.value, [0, 1], [10, 25]),
  }));

  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(pulseAnim.value, [0, 1], [1, 1.05]) }],
  }));

  return (
    <View style={styles.container}>
      <LuxuryGradientBackground variant="silver">
        <GoldParticles
          variant="silver"
          particleCount={15}
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Stats */}
          <BlurView intensity={30} tint="light" style={styles.headerCard}>
            <LinearGradient
              colors={['rgba(192,192,192,0.15)', 'rgba(255,215,0,0.05)']}
              style={StyleSheet.absoluteFillObject}
            />
            
            <Text style={styles.headerTitle}>Your Journey</Text>
            
            <View style={styles.statsGrid}>
              <Animated.View style={[styles.statCard, glowStyle, { shadowColor: '#FFD700' }]}>
                <LinearGradient
                  colors={['rgba(255,215,0,0.2)', 'rgba(192,192,192,0.1)']}
                  style={StyleSheet.absoluteFillObject}
                />
                <View style={styles.statContent}>
                  <TrendingUp color="#FFD700" size={24} />
                  <Text style={styles.statNumber}>87%</Text>
                  <Text style={styles.statLabel}>This Week</Text>
                </View>
              </Animated.View>

              <Animated.View style={[styles.statCard, glowStyle, { shadowColor: '#C0C0C0' }]}>
                <LinearGradient
                  colors={['rgba(192,192,192,0.2)', 'rgba(255,215,0,0.1)']}
                  style={StyleSheet.absoluteFillObject}
                />
                <View style={styles.statContent}>
                  <Zap color="#C0C0C0" size={24} />
                  <Text style={styles.statNumber}>23</Text>
                  <Text style={styles.statLabel}>Day Streak</Text>
                </View>
              </Animated.View>

              <Animated.View style={[styles.statCard, glowStyle, { shadowColor: '#FFD700' }]}>
                <LinearGradient
                  colors={['rgba(255,215,0,0.2)', 'rgba(229,228,226,0.1)']}
                  style={StyleSheet.absoluteFillObject}
                />
                <View style={styles.statContent}>
                  <Trophy color="#FFD700" size={24} />
                  <Text style={styles.statNumber}>5</Text>
                  <Text style={styles.statLabel}>Goals Hit</Text>
                </View>
              </Animated.View>
            </View>
          </BlurView>

          {/* Progress Chart */}
          <BlurView intensity={25} tint="light" style={styles.chartCard}>
            <LinearGradient
              colors={['rgba(255,215,0,0.1)', 'rgba(192,192,192,0.1)']}
              style={StyleSheet.absoluteFillObject}
            />
            <Text style={styles.chartTitle}>Weekly Progress</Text>
            
            <View style={styles.chart}>
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => {
                const height = Math.random() * 100 + 50;
                const isToday = index === new Date().getDay() - 1;
                
                return (
                  <View key={index} style={styles.barContainer}>
                    <Animated.View style={isToday ? scaleStyle : {}}>
                      <LinearGradient
                        colors={
                          isToday 
                            ? ['#FFD700', '#F7E7CE']
                            : ['rgba(255,215,0,0.3)', 'rgba(192,192,192,0.3)']
                        }
                        style={[
                          styles.bar,
                          { height },
                          isToday && styles.todayBar
                        ]}
                      />
                    </Animated.View>
                    <Text style={[styles.dayLabel, isToday && styles.todayLabel]}>
                      {day}
                    </Text>
                  </View>
                );
              })}
            </View>
          </BlurView>

          {/* Goals Progress */}
          <View style={styles.goalsSection}>
            <LinearGradient
              colors={['#00D4FF', '#8B5CF6']}
              style={styles.sectionHeader}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.sectionTitle}>Active Goals</Text>
            </LinearGradient>

            {goals.map((goal, index) => {
              const progress = Math.random() * 100;
              const colors = [
                ['#00F5FF', '#00D4FF'],
                ['#8B5CF6', '#06FFA5'],
                ['#06FFA5', '#00F5FF'],
              ][index % 3];

              return (
                <BlurView key={goal.id} intensity={20} tint="light" style={styles.goalCard}>
                  <LinearGradient
                    colors={[colors[0] + '15', colors[1] + '10']}
                    style={StyleSheet.absoluteFillObject}
                  />
                  
                  <View style={styles.goalHeader}>
                    <View>
                      <Text style={styles.goalTitle}>{goal.title}</Text>
                      <Text style={styles.goalDeadline}>
                        {goal.deadline} • {Math.round(progress)}% complete
                      </Text>
                    </View>
                    <Target color={colors[0]} size={20} />
                  </View>

                  <View style={styles.progressBar}>
                    <LinearGradient
                      colors={colors}
                      style={[styles.progressFill, { width: `${progress}%` }]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    />
                  </View>
                </BlurView>
              );
            })}
          </View>

          {/* Motivational Quote */}
          <Animated.View style={[styles.quoteCard, glowStyle, { shadowColor: '#FFD700' }]}>
            <LinearGradient
              colors={['rgba(255,215,0,0.1)', 'rgba(192,192,192,0.1)', 'rgba(229,228,226,0.1)']}
              style={StyleSheet.absoluteFillObject}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <Text style={styles.quoteText}>
              "Progress is not linear, but every step forward lights up your path like the northern lights"
            </Text>
          </Animated.View>
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
  headerCard: {
    borderRadius: 24,
    overflow: 'hidden',
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.2)',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 20,
    textShadowColor: 'rgba(255,215,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  statContent: {
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
  },
  chartCard: {
    borderRadius: 20,
    overflow: 'hidden',
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,212,255,0.2)',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 150,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
  },
  bar: {
    width: 30,
    borderRadius: 8,
    marginBottom: 8,
  },
  todayBar: {
    shadowColor: '#00F5FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  dayLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
  },
  todayLabel: {
    color: '#00F5FF',
    fontWeight: '700',
  },
  goalsSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  goalCard: {
    borderRadius: 16,
    overflow: 'hidden',
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  goalDeadline: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  quoteCard: {
    borderRadius: 20,
    overflow: 'hidden',
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.2)',
  },
  quoteText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 24,
  },
});