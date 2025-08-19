#!/bin/bash

echo "🧹 SAFE CLEANUP SCRIPT"
echo "======================"
echo ""
echo "This script will remove ONLY unused variant files."
echo "All active components will be preserved."
echo ""
echo "Files to be removed:"
echo "-------------------"
echo "  • DailyScreenUltra.tsx"
echo "  • DailyScreenUnified.tsx"
echo "  • DailyScreenVibrant.tsx"
echo "  • ProgressEnhanced.tsx"
echo "  • ProgressScreenUnified.tsx"
echo "  • ProgressScreenVibrant.tsx"
echo "  • ProfileScreen.tsx"
echo "  • ProfileScreenUnified.tsx"
echo "  • ProfileScreenVibrant.tsx"
echo "  • SocialScreenUnified.tsx"
echo ""
read -p "Do you want to proceed? (y/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo ""
    echo "Creating backup first..."
    
    # Create backup directory with timestamp
    BACKUP_DIR="backup_$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$BACKUP_DIR"
    
    # Backup files before deletion
    echo "Backing up files to $BACKUP_DIR/"
    
    # Daily variants
    [ -f "src/features/daily/DailyScreenUltra.tsx" ] && cp "src/features/daily/DailyScreenUltra.tsx" "$BACKUP_DIR/"
    [ -f "src/features/daily/DailyScreenUnified.tsx" ] && cp "src/features/daily/DailyScreenUnified.tsx" "$BACKUP_DIR/"
    [ -f "src/features/daily/DailyScreenVibrant.tsx" ] && cp "src/features/daily/DailyScreenVibrant.tsx" "$BACKUP_DIR/"
    
    # Progress variants
    [ -f "src/features/progress/ProgressEnhanced.tsx" ] && cp "src/features/progress/ProgressEnhanced.tsx" "$BACKUP_DIR/"
    [ -f "src/features/progress/ProgressScreenUnified.tsx" ] && cp "src/features/progress/ProgressScreenUnified.tsx" "$BACKUP_DIR/"
    [ -f "src/features/progress/ProgressScreenVibrant.tsx" ] && cp "src/features/progress/ProgressScreenVibrant.tsx" "$BACKUP_DIR/"
    
    # Profile variants
    [ -f "src/features/profile/ProfileScreen.tsx" ] && cp "src/features/profile/ProfileScreen.tsx" "$BACKUP_DIR/"
    [ -f "src/features/profile/ProfileScreenUnified.tsx" ] && cp "src/features/profile/ProfileScreenUnified.tsx" "$BACKUP_DIR/"
    [ -f "src/features/profile/ProfileScreenVibrant.tsx" ] && cp "src/features/profile/ProfileScreenVibrant.tsx" "$BACKUP_DIR/"
    
    # Social variants
    [ -f "src/features/social/SocialScreenUnified.tsx" ] && cp "src/features/social/SocialScreenUnified.tsx" "$BACKUP_DIR/"
    
    echo "✅ Backup complete!"
    echo ""
    echo "Removing unused files..."
    
    # Remove files
    rm -f src/features/daily/DailyScreenUltra.tsx
    rm -f src/features/daily/DailyScreenUnified.tsx
    rm -f src/features/daily/DailyScreenVibrant.tsx
    rm -f src/features/progress/ProgressEnhanced.tsx
    rm -f src/features/progress/ProgressScreenUnified.tsx
    rm -f src/features/progress/ProgressScreenVibrant.tsx
    rm -f src/features/profile/ProfileScreen.tsx
    rm -f src/features/profile/ProfileScreenUnified.tsx
    rm -f src/features/profile/ProfileScreenVibrant.tsx
    rm -f src/features/social/SocialScreenUnified.tsx
    
    echo "✅ Cleanup complete!"
    echo ""
    echo "📁 Backup saved in: $BACKUP_DIR/"
    echo "   (You can delete this backup folder once you confirm everything works)"
    echo ""
    echo "🎯 Active components preserved:"
    echo "  • DailyScreen.tsx ✓"
    echo "  • SocialScreen.tsx ✓"
    echo "  • ProgressMVPEnhanced.tsx ✓"
    echo "  • ProfileEnhanced.tsx ✓"
    echo "  • All components in use ✓"
    
else
    echo "Cleanup cancelled."
fi