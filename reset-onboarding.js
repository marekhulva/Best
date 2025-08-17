// Quick reset script - paste this in browser console to reset onboarding
localStorage.removeItem('onboarding_completed');
localStorage.removeItem('onboarding_milestones');
console.log('Onboarding reset! Refresh the page.');
window.location.reload();