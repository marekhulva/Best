import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Flame, Trophy, Zap, CheckCircle2, Circle, Target, Clock } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useStore } from '../../state/rootStore';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
  interpolate,
  Easing,
  FadeIn,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { LuxuryTheme } from '../../design/luxuryTheme';
import { PrivacySelectionModal } from './PrivacySelectionModal';

interface ActionItemProps {
  id: string;
  title: string;
  goalTitle?: string;
  done?: boolean;
  streak: number;
  time?: string;
  type?: 'goal' | 'performance' | 'commitment' | 'oneTime' | 'one-time';
  goalColor?: string;
}

export const ActionItem: React.FC<ActionItemProps> = ({ 
  id, 
  title, 
  goalTitle, 
  done = false, 
  streak,
  time,
  type = 'goal',
  goalColor
}) => {
  const toggle = useStore(s => s.toggleAction);
  const openShare = useStore(s => s.openShare);
  const addCompletedAction = useStore(s => s.addCompletedAction);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const scaleAnimation = useSharedValue(1);
  const streakGlow = useSharedValue(0);
  const checkAnimation = useSharedValue(done ? 1 : 0);
  
  // Streak glow animation for high streaks
  useEffect(() => {
    if (streak > 7) {
      streakGlow.value = withRepeat(
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    }
  }, [streak]);

  // Complete animation
  useEffect(() => {
    checkAnimation.value = withSpring(done ? 1 : 0, {
      damping: 15,
      stiffness: 150,
    });
  }, [done]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(checkAnimation.value, [0, 1], [1, 0.7]),
    transform: [{ scale: interpolate(checkAnimation.value, [0, 1], [1, 0.98]) }],
  }));

  const checkboxStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(checkAnimation.value, [0, 1], [1, 1.1]) }],
  }));

  const streakBadgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(streakGlow.value, [0, 1], [1, 1.05]) }],
  }));

  const getStreakIcon = () => {
    if (streak >= 30) return <Trophy size={12} color={LuxuryTheme.colors.primary.gold} />;
    if (streak >= 7) return <Zap size={12} color={LuxuryTheme.colors.primary.gold} />;
    return <Flame size={12} color={LuxuryTheme.colors.primary.gold} />;
  };

  const handleToggle = () => {
    if (!done) {
      // Show privacy modal when completing an action
      console.log('Opening privacy modal for action:', title);
      setShowPrivacyModal(true);
    } else {
      // Allow unchecking
      toggle(id);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handlePrivacySelect = (visibility: 'public' | 'private', contentType: 'photo' | 'audio' | 'text' | 'check') => {
    // Mark action as complete
    toggle(id);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Map content type to action type
    const actionType = contentType === 'photo' ? 'photo' : 
                      contentType === 'audio' ? 'audio' : 
                      contentType === 'text' ? 'milestone' : // Text becomes milestone type for variety
                      'check';
    
    // Generate mock media URL for photos (in real app, would capture actual photo)
    const mediaUrl = contentType === 'photo' 
      ? `https://picsum.photos/400/400?random=${Date.now()}` 
      : undefined;
    
    // Store the completed action with privacy setting and content type
    addCompletedAction({
      id: `${id}-${Date.now()}`,
      actionId: id,
      title,
      goalTitle,
      completedAt: new Date(),
      isPrivate: visibility === 'private',
      streak: streak + 1,
      type: actionType,
      mediaUrl,
      category: 'fitness', // Could be dynamic based on goal
    });
    
    // If public and not just a check, trigger share modal
    if (visibility === 'public' && contentType !== 'check') {
      setTimeout(() => {
        openShare({
          type: 'checkin',
          visibility: 'circle',
          actionTitle: title,
          goal: goalTitle,
          streak: streak + 1,
          goalColor: goalColor || LuxuryTheme.colors.primary.gold,
          contentType,
        });
      }, 500);
    }
    
    setShowPrivacyModal(false);
  };

  return (
    <Animated.View entering={FadeIn} style={animatedStyle}>
      <TouchableOpacity onPress={handleToggle} activeOpacity={0.7}>
        <View style={[styles.card, done && styles.cardDone]}>
          <BlurView intensity={10} tint="dark" style={StyleSheet.absoluteFillObject} />
          
          {/* Subtle gradient overlay */}
          <LinearGradient
            colors={done 
              ? ['rgba(34, 197, 94, 0.05)', 'rgba(34, 197, 94, 0.02)']
              : ['rgba(255, 255, 255, 0.03)', 'rgba(255, 255, 255, 0.01)']}
            style={StyleSheet.absoluteFillObject}
          />
          
          <View style={styles.row}>
            {/* Premium Checkbox */}
            <Animated.View style={[styles.checkbox, checkboxStyle]}>
              {done ? (
                <View style={styles.checkboxChecked}>
                  <LinearGradient
                    colors={[LuxuryTheme.colors.primary.gold, LuxuryTheme.colors.primary.champagne]}
                    style={StyleSheet.absoluteFillObject}
                  />
                  <CheckCircle2 color="#000" size={24} strokeWidth={3} />
                </View>
              ) : (
                <Circle color={LuxuryTheme.colors.text.tertiary} size={24} strokeWidth={1.5} />
              )}
            </Animated.View>
            
            {/* Content */}
            <View style={styles.content}>
              <View style={styles.titleRow}>
                <Text style={[styles.title, done && styles.titleDone]}>{title}</Text>
                {time && (
                  <View style={styles.timeBadge}>
                    <Clock size={12} color={done ? LuxuryTheme.colors.text.muted : LuxuryTheme.colors.primary.gold} />
                    <Text style={[styles.timeText, done && styles.timeTextDone]}>{time}</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.metaRow}>
                {goalTitle && (
                  <View style={styles.goalBadge}>
                    <Target size={10} color={LuxuryTheme.colors.text.tertiary} />
                    <Text style={styles.goalText}>{goalTitle}</Text>
                  </View>
                )}
                
                {streak > 0 && (
                  <Animated.View style={[styles.streakBadge, streak > 7 && streakBadgeStyle]}>
                    <LinearGradient
                      colors={streak >= 30 
                        ? ['rgba(231, 180, 58, 0.2)', 'rgba(231, 180, 58, 0.1)']
                        : streak >= 7
                        ? ['rgba(231, 180, 58, 0.15)', 'rgba(231, 180, 58, 0.08)']
                        : ['rgba(231, 180, 58, 0.1)', 'rgba(231, 180, 58, 0.05)']
                      }
                      style={StyleSheet.absoluteFillObject}
                    />
                    {getStreakIcon()}
                    <Text style={styles.streakText}>{streak}</Text>
                    {streak >= 7 && <Text style={styles.streakLabel}>day{streak !== 1 ? 's' : ''}</Text>}
                  </Animated.View>
                )}
              </View>
            </View>

            {/* Completion Indicator */}
            {done && (
              <View style={styles.doneIndicator}>
                <Text style={styles.doneText}>✓</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
      
      {/* Privacy Selection Modal */}
      <PrivacySelectionModal
        visible={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
        onSelect={handlePrivacySelect}
        actionTitle={title}
        streak={streak}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: { 
    marginBottom: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
  },
  cardDone: {
    backgroundColor: 'rgba(34, 197, 94, 0.03)',
    borderColor: 'rgba(34, 197, 94, 0.15)',
  },
  row: { 
    flexDirection: 'row', 
    alignItems: 'center',
    padding: 16,
  },
  checkbox: {
    marginRight: 14,
  },
  checkboxChecked: {
    width: 24,
    height: 24,
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  title: { 
    color: LuxuryTheme.colors.text.primary,
    fontSize: 15,
    fontWeight: '500',
    letterSpacing: 0.2,
    flex: 1,
    marginRight: 8,
  },
  titleDone: {
    color: LuxuryTheme.colors.text.tertiary,
    textDecorationLine: 'line-through',
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 215, 0, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.15)',
  },
  timeText: {
    fontSize: 13,
    fontWeight: '600',
    color: LuxuryTheme.colors.primary.gold,
    letterSpacing: 0.3,
  },
  timeTextDone: {
    color: LuxuryTheme.colors.text.muted,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  goalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  goalText: {
    color: LuxuryTheme.colors.text.tertiary,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    overflow: 'hidden',
  },
  streakText: {
    color: LuxuryTheme.colors.primary.gold,
    fontSize: 12,
    fontWeight: '700',
  },
  streakLabel: {
    color: LuxuryTheme.colors.primary.gold,
    fontSize: 10,
    fontWeight: '500',
    opacity: 0.8,
  },
  doneIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  doneText: {
    color: '#22C55E',
    fontSize: 14,
    fontWeight: '700',
  },
});