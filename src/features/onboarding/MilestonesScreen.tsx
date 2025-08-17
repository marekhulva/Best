import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  TextInput,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { 
  Flag, Plus, Trash2, ChevronUp, ChevronDown,
  Sparkles, TrendingUp, Calendar
} from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  FadeIn,
  FadeInDown,
  Layout,
  SlideInRight,
  SlideOutLeft,
} from 'react-native-reanimated';
import DraggableFlatList, {
  ScaleDecorator,
  RenderItemParams,
} from 'react-native-draggable-flatlist';
import { HapticButton } from '../../ui/HapticButton';
import { LuxuryTheme } from '../../design/luxuryTheme';
import { OnboardingGoal, Milestone } from './types';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

interface Props {
  goal: OnboardingGoal;
  onSubmit: (milestones: Milestone[]) => void;
  onBack: () => void;
}

const generateSmartMilestones = (goal: OnboardingGoal): Milestone[] => {
  const totalDays = Math.ceil(
    (goal.targetDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  
  const milestoneCount = Math.min(5, Math.max(3, Math.floor(totalDays / 30)));
  const milestones: Milestone[] = [];
  
  for (let i = 1; i <= milestoneCount; i++) {
    const progress = i / milestoneCount;
    const daysFromNow = Math.floor(totalDays * progress);
    const milestoneDate = new Date();
    milestoneDate.setDate(milestoneDate.getDate() + daysFromNow);
    
    let title = `Milestone ${i}`;
    let targetValue = goal.targetValue ? Math.floor(goal.targetValue * progress) : undefined;
    
    // Smart milestone naming based on category
    if (goal.category === 'fitness' && goal.title.toLowerCase().includes('lose')) {
      title = i === 1 ? 'First 10% Progress' :
              i === milestoneCount ? 'Reach Target Weight' :
              `${Math.floor(progress * 100)}% to Goal`;
    } else if (goal.category === 'mindfulness') {
      title = i === 1 ? 'Establish Routine' :
              i === milestoneCount ? 'Master Practice' :
              `Week ${Math.floor(daysFromNow / 7)} Check-in`;
    } else if (goal.category === 'productivity') {
      title = i === 1 ? 'Foundation Phase' :
              i === milestoneCount ? 'Complete Project' :
              `Phase ${i} Complete`;
    }
    
    milestones.push({
      id: `milestone-${i}`,
      title,
      targetDate: milestoneDate,
      targetValue,
      unit: goal.unit,
      completed: false,
      order: i,
    });
  }
  
  return milestones;
};

export const MilestonesScreen: React.FC<Props> = ({ goal, onSubmit, onBack }) => {
  const [milestones, setMilestones] = useState<Milestone[]>(() => 
    generateSmartMilestones(goal)
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAutoGenMessage, setShowAutoGenMessage] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAutoGenMessage(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleAddMilestone = () => {
    const newMilestone: Milestone = {
      id: `milestone-${Date.now()}`,
      title: '',
      targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      completed: false,
      order: milestones.length + 1,
    };
    setMilestones([...milestones, newMilestone]);
    setEditingId(newMilestone.id);
  };

  const handleDeleteMilestone = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Delete Milestone',
      'Are you sure you want to remove this milestone?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setMilestones(milestones.filter(m => m.id !== id));
          }
        }
      ]
    );
  };

  const handleUpdateMilestone = (id: string, updates: Partial<Milestone>) => {
    setMilestones(milestones.map(m => 
      m.id === id ? { ...m, ...updates } : m
    ));
  };

  const renderMilestone = ({ item, drag, isActive }: RenderItemParams<Milestone>) => {
    const isEditing = editingId === item.id;
    
    return (
      <ScaleDecorator>
        <Animated.View
          entering={SlideInRight.springify()}
          exiting={SlideOutLeft.springify()}
          layout={Layout.springify()}
        >
          <HapticButton
            hapticType="light"
            onLongPress={drag}
            disabled={isActive}
            style={[styles.milestoneCard, isActive && styles.milestoneCardActive]}
          >
            <LinearGradient
              colors={
                isActive 
                  ? ['rgba(231, 180, 58, 0.15)', 'rgba(231, 180, 58, 0.05)']
                  : ['rgba(255,255,255,0.03)', 'rgba(255,255,255,0.01)']
              }
              style={StyleSheet.absoluteFillObject}
            />
            
            <View style={styles.milestoneContent}>
              <View style={styles.milestoneHeader}>
                <View style={styles.milestoneIcon}>
                  <Flag 
                    color={LuxuryTheme.colors.primary.gold} 
                    size={20}
                  />
                </View>
                
                {isEditing ? (
                  <TextInput
                    style={styles.milestoneInput}
                    value={item.title}
                    onChangeText={(text) => handleUpdateMilestone(item.id, { title: text })}
                    onBlur={() => setEditingId(null)}
                    autoFocus
                    placeholder="Milestone name..."
                    placeholderTextColor={LuxuryTheme.colors.text.muted}
                  />
                ) : (
                  <TouchableOpacity
                    onPress={() => setEditingId(item.id)}
                    style={styles.milestoneTitleButton}
                  >
                    <Text style={styles.milestoneTitle}>
                      {item.title || 'Tap to edit...'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              
              <View style={styles.milestoneDetails}>
                <View style={styles.milestoneDate}>
                  <Calendar color={LuxuryTheme.colors.text.tertiary} size={14} />
                  <Text style={styles.milestoneDateText}>
                    {item.targetDate.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </Text>
                </View>
                
                {item.targetValue && (
                  <View style={styles.milestoneTarget}>
                    <TrendingUp color={LuxuryTheme.colors.text.tertiary} size={14} />
                    <Text style={styles.milestoneTargetText}>
                      {item.targetValue} {item.unit}
                    </Text>
                  </View>
                )}
              </View>
              
              <HapticButton
                hapticType="light"
                onPress={() => handleDeleteMilestone(item.id)}
                style={styles.deleteButton}
              >
                <Trash2 color={LuxuryTheme.colors.text.muted} size={16} />
              </HapticButton>
            </View>
          </HapticButton>
        </Animated.View>
      </ScaleDecorator>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={LuxuryTheme.gradientPresets.obsidianDepth}
        style={StyleSheet.absoluteFillObject}
      />
      
      <View style={styles.header}>
        <Animated.View entering={FadeIn.duration(600)}>
          <Text style={styles.screenTitle}>Set Your Milestones</Text>
          <Text style={styles.screenSubtitle}>
            Break your journey into achievable steps
          </Text>
        </Animated.View>
      </View>
      
      {showAutoGenMessage && (
        <Animated.View 
          entering={FadeInDown.springify()}
          exiting={SlideOutLeft.springify()}
          style={styles.autoGenMessage}
        >
          <LinearGradient
            colors={['rgba(231, 180, 58, 0.1)', 'rgba(231, 180, 58, 0.05)']}
            style={StyleSheet.absoluteFillObject}
          />
          <Sparkles color={LuxuryTheme.colors.primary.gold} size={16} />
          <Text style={styles.autoGenText}>
            AI-generated milestones based on your goal
          </Text>
        </Animated.View>
      )}
      
      <View style={styles.goalSummary}>
        <Text style={styles.goalLabel}>YOUR GOAL</Text>
        <Text style={styles.goalText}>{goal.title}</Text>
        <Text style={styles.goalDeadline}>
          By {goal.targetDate.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </Text>
      </View>
      
      <DraggableFlatList
        data={milestones}
        onDragEnd={({ data }) => setMilestones(data)}
        keyExtractor={(item) => item.id}
        renderItem={renderMilestone}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <HapticButton
            hapticType="light"
            onPress={handleAddMilestone}
            style={styles.addButton}
          >
            <Plus color={LuxuryTheme.colors.text.secondary} size={20} />
            <Text style={styles.addButtonText}>Add Milestone</Text>
          </HapticButton>
        }
      />
      
      <View style={styles.footer}>
        <HapticButton
          hapticType="light"
          onPress={onBack}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </HapticButton>
        
        <HapticButton
          hapticType="medium"
          onPress={() => onSubmit(milestones)}
          style={styles.continueButton}
          disabled={milestones.length === 0}
        >
          <LinearGradient
            colors={[LuxuryTheme.colors.primary.gold, LuxuryTheme.colors.primary.champagne]}
            style={StyleSheet.absoluteFillObject}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
          <Text style={styles.continueButtonText}>Continue</Text>
        </HapticButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LuxuryTheme.colors.background.primary,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  screenTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: LuxuryTheme.colors.text.primary,
    marginBottom: 8,
  },
  screenSubtitle: {
    fontSize: 16,
    color: LuxuryTheme.colors.text.tertiary,
  },
  autoGenMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 24,
    marginBottom: 16,
    padding: 12,
    borderRadius: 12,
    overflow: 'hidden',
    gap: 8,
  },
  autoGenText: {
    fontSize: 13,
    color: LuxuryTheme.colors.primary.gold,
    fontWeight: '600',
  },
  goalSummary: {
    marginHorizontal: 24,
    marginBottom: 24,
    padding: 16,
    backgroundColor: 'rgba(231, 180, 58, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(231, 180, 58, 0.15)',
  },
  goalLabel: {
    fontSize: 10,
    color: LuxuryTheme.colors.primary.gold,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  goalText: {
    fontSize: 18,
    fontWeight: '600',
    color: LuxuryTheme.colors.text.primary,
    marginBottom: 4,
  },
  goalDeadline: {
    fontSize: 14,
    color: LuxuryTheme.colors.text.secondary,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  milestoneCard: {
    backgroundColor: LuxuryTheme.colors.background.card,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: LuxuryTheme.colors.interactive.border,
    overflow: 'hidden',
  },
  milestoneCardActive: {
    borderColor: LuxuryTheme.colors.primary.gold,
    transform: [{ scale: 1.02 }],
  },
  milestoneContent: {
    padding: 16,
  },
  milestoneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  milestoneIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(231, 180, 58, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  milestoneTitleButton: {
    flex: 1,
  },
  milestoneTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: LuxuryTheme.colors.text.primary,
  },
  milestoneInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: LuxuryTheme.colors.text.primary,
    padding: 0,
  },
  milestoneDetails: {
    flexDirection: 'row',
    gap: 20,
    marginLeft: 48,
  },
  milestoneDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  milestoneDateText: {
    fontSize: 13,
    color: LuxuryTheme.colors.text.tertiary,
  },
  milestoneTarget: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  milestoneTargetText: {
    fontSize: 13,
    color: LuxuryTheme.colors.text.tertiary,
  },
  deleteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: LuxuryTheme.colors.interactive.border,
    borderStyle: 'dashed',
    marginTop: 8,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: LuxuryTheme.colors.text.secondary,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 20,
    gap: 12,
  },
  backButton: {
    flex: 0.3,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: LuxuryTheme.colors.interactive.border,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: LuxuryTheme.colors.text.secondary,
  },
  continueButton: {
    flex: 0.7,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});