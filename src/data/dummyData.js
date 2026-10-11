// Centralized dummy data — frontend only, no backend/API calls.

export const currentUser = {
  name: 'Umar Faruk',
  role: 'Admin',
  email: 'umarfaruk@example.com',
  phone: '+91 98765 43210',
  bio: 'Passionate about AI, Tech and Content Creation.',
  avatar: 'https://i.pravatar.cc/150?img=13',
}

export const summaryCards = [
  { id: 1, label: 'Total Analyses', value: '128', delta: '+18.2%', trend: 'up', icon: 'chart', color: 'blue', spark: [4, 6, 5, 8, 7, 9, 8, 11, 9, 12] },
  { id: 2, label: 'Avg. Content Score', value: '87%', delta: '+9.4%', trend: 'up', icon: 'check', color: 'green', spark: [7, 7, 8, 7, 9, 8, 9, 10, 9, 10] },
  { id: 3, label: 'Engagement Score', value: '76%', delta: '+12.7%', trend: 'up', icon: 'smile', color: 'purple', spark: [5, 6, 6, 7, 6, 8, 7, 8, 9, 8] },
  { id: 4, label: 'Total Reach', value: '245K', delta: '+21.5%', trend: 'up', icon: 'users', color: 'orange', spark: [3, 5, 4, 6, 8, 7, 9, 10, 11, 12] },
  { id: 5, label: 'Predicted Posts', value: '56', delta: '+15.1%', trend: 'up', icon: 'send', color: 'teal', spark: [6, 5, 7, 6, 8, 7, 9, 8, 10, 9] },
]

export const engagementOverview = [
  { day: 'Mon', engagement: 42, reach: 30 },
  { day: 'Tue', engagement: 58, reach: 40 },
  { day: 'Wed', engagement: 78, reach: 55 },
  { day: 'Thu', engagement: 90, reach: 70 },
  { day: 'Fri', engagement: 65, reach: 58 },
  { day: 'Sat', engagement: 52, reach: 45 },
  { day: 'Sun', engagement: 80, reach: 62 },
]

export const platformPerformance = [
  { name: 'Instagram', value: 42, color: '#EC4899' },
  { name: 'LinkedIn', value: 25, color: '#3B82F6' },
  { name: 'Facebook', value: 18, color: '#8B5CF6' },
  { name: 'Twitter (X)', value: 10, color: '#111827' },
  { name: 'Others', value: 5, color: '#F59E0B' },
]

export const recentAnalyses = [
  { id: 1, title: 'New Product Launch Post', date: 'May 24, 2024', platform: 'Instagram', score: 92, image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=100&h=100&fit=crop' },
  { id: 2, title: 'AI Tools Carousel', date: 'May 23, 2024', platform: 'LinkedIn', score: 85, image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100&h=100&fit=crop' },
  { id: 3, title: 'Motivational Quote', date: 'May 22, 2024', platform: 'Facebook', score: 78, image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=100&h=100&fit=crop' },
  { id: 4, title: 'Study Tips Video', date: 'May 21, 2024', platform: 'YouTube', score: 88, image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=100&h=100&fit=crop' },
  { id: 5, title: 'Tech News Update', date: 'May 20, 2024', platform: 'Twitter (X)', score: 65, image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=100&h=100&fit=crop' },
  { id: 6, title: 'Behind the Scenes', date: 'May 19, 2024', platform: 'Instagram', score: 90, image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=100&h=100&fit=crop' },
]

export const contentScoreDistribution = [
  { name: '90 – 100', value: 35, color: '#10B981' },
  { name: '70 – 89', value: 40, color: '#3B82F6' },
  { name: '50 – 69', value: 15, color: '#F59E0B' },
  { name: 'Below 50', value: 10, color: '#EF4444' },
]

export const aiInsights = [
  { id: 1, icon: 'trend', text: 'Your content performs best on Instagram between 7PM – 10PM.' },
  { id: 2, icon: 'bulb', text: 'Using 5–8 hashtags increases engagement by up to 22%.' },
  { id: 3, icon: 'bar', text: 'Carousel posts get 30% more engagement than single image posts.' },
]

export const platforms = [
  { id: 'instagram', name: 'Instagram', icon: 'instagram', color: '#EC4899' },
  { id: 'linkedin', name: 'LinkedIn', icon: 'linkedin', color: '#3B82F6' },
  { id: 'facebook', name: 'Facebook', icon: 'facebook', color: '#4F65D6' },
  { id: 'twitter', name: 'Twitter (X)', icon: 'twitter', color: '#111827' },
  { id: 'youtube', name: 'YouTube', icon: 'youtube', color: '#EF4444' },
  { id: 'tiktok', name: 'TikTok', icon: 'tiktok', color: '#111827' },
]

export const contentAnalysisMetrics = {
  imageQuality: 92,
  captionQuality: 88,
  readability: 85,
  grammar: 90,
  overallScore: 91,
  emotionDetected: 'Positive',
  emotionConfidence: 78,
  tone: 'Professional',
  toneConfidence: 85,
  hashtagCount: 7,
  hashtagQuality: 'Good',
  topKeywords: ['productivity', 'work', 'tech', 'growth', 'study'],
  suggestions: [
    'Add a clear call-to-action to boost interaction.',
    'Use 2-3 more trending hashtags related to your niche.',
    'Consider a brighter thumbnail to raise click-through rate.',
  ],
}

export const recommendations = {
  improvedCaption: "Ready to level up your workflow? These 5 AI tools helped me save 10+ hours a week ✨ Swipe to see which one is a game changer →",
  hashtags: ['#ProductivityHacks', '#AITools', '#WorkSmarter', '#TechTips', '#GrowthMindset', '#RemoteWork', '#Efficiency'],
  bestTime: { day: 'Today', time: '8:00 PM', label: 'high engagement time' },
  audience: { ageRange: '22–34', interests: ['Technology', 'Productivity', 'Startups'], regions: ['India', 'USA', 'UAE'] },
  improvementTips: [
    { title: 'Improve Image', desc: 'Increase brightness and contrast for better visibility.' },
    { title: 'Content Tips', desc: 'Add a call-to-action to improve engagement.' },
    { title: 'Audience Targeting', desc: 'Target the right audience for better results.' },
  ],
}

export const engagementPrediction = [
  { platform: 'Instagram', icon: 'instagram', score: 89, label: 'Excellent', color: '#EC4899' },
  { platform: 'LinkedIn', icon: 'linkedin', score: 76, label: 'Very Good', color: '#3B82F6' },
  { platform: 'Facebook', icon: 'facebook', score: 68, label: 'Good', color: '#4F65D6' },
  { platform: 'Twitter (X)', icon: 'twitter', score: 61, label: 'Average', color: '#111827' },
  { platform: 'YouTube', icon: 'youtube', score: 83, label: 'Very Good', color: '#EF4444' },
]

export const predictionOverview = {
  totalEngagementScore: 89,
  reachProbability: 82,
  viralityProbability: 73,
  engagementProbability: 89,
}

export const expectedEngagement = {
  likes: '1.2K – 1.8K',
  comments: '120 – 250',
  shares: '80 – 150',
  reach: '8K – 12K',
}

export const weeklyAnalytics = [
  { day: 'Mon', score: 62 }, { day: 'Tue', score: 70 }, { day: 'Wed', score: 68 },
  { day: 'Thu', score: 82 }, { day: 'Fri', score: 78 }, { day: 'Sat', score: 88 }, { day: 'Sun', score: 91 },
]

export const monthlyAnalytics = [
  { month: 'Jan', score: 58 }, { month: 'Feb', score: 63 }, { month: 'Mar', score: 67 },
  { month: 'Apr', score: 72 }, { month: 'May', score: 76 }, { month: 'Jun', score: 81 },
]

export const platformComparison = [
  { platform: 'Instagram', engagement: 8200 },
  { platform: 'LinkedIn', engagement: 4600 },
  { platform: 'Facebook', engagement: 3100 },
  { platform: 'Twitter (X)', engagement: 1800 },
  { platform: 'YouTube', engagement: 6300 },
]

export const topPosts = [
  { id: 1, title: 'New Product Launch Post', platform: 'Instagram', score: 92, engagement: '12.4K' },
  { id: 2, title: 'Behind the Scenes', platform: 'Instagram', score: 90, engagement: '9.8K' },
  { id: 3, title: 'Study Tips Video', platform: 'YouTube', score: 88, engagement: '8.1K' },
]

export const contentTypeDistribution = [
  { name: 'Image', value: 45, color: '#635BFF' },
  { name: 'Carousel', value: 30, color: '#8B5CF6' },
  { name: 'Video', value: 15, color: '#3B82F6' },
  { name: 'Text', value: 10, color: '#C2C4D6' },
]

export const historyData = [
  { id: 1, title: 'New Product Launch Post', platform: 'Instagram', contentScore: 92, engagementScore: 89, date: 'May 24, 2024', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=100&h=100&fit=crop' },
  { id: 2, title: 'AI Tools Carousel', platform: 'LinkedIn', contentScore: 85, engagementScore: 76, date: 'May 23, 2024', image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100&h=100&fit=crop' },
  { id: 3, title: 'Motivational Quote', platform: 'Facebook', contentScore: 79, engagementScore: 68, date: 'May 22, 2024', image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=100&h=100&fit=crop' },
  { id: 4, title: 'Study Tips Video', platform: 'YouTube', contentScore: 88, engagementScore: 83, date: 'May 21, 2024', image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=100&h=100&fit=crop' },
  { id: 5, title: 'Tech News Update', platform: 'Twitter (X)', contentScore: 65, engagementScore: 61, date: 'May 20, 2024', image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=100&h=100&fit=crop' },
  { id: 6, title: 'Behind the Scenes', platform: 'Instagram', contentScore: 90, engagementScore: 87, date: 'May 19, 2024', image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=100&h=100&fit=crop' },
  { id: 7, title: 'Weekend Vibes Reel', platform: 'Instagram', contentScore: 82, engagementScore: 80, date: 'May 18, 2024', image: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=100&h=100&fit=crop' },
  { id: 8, title: 'Client Testimonial', platform: 'LinkedIn', contentScore: 87, engagementScore: 72, date: 'May 17, 2024', image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=100&h=100&fit=crop' },
]

export const socialAccounts = [
  { platform: 'Instagram', handle: '@umarfaruk.tech', connected: true, icon: 'instagram' },
  { platform: 'LinkedIn', handle: 'Umar Faruk', connected: true, icon: 'linkedin' },
  { platform: 'Facebook', handle: 'Not Connected', connected: false, icon: 'facebook' },
  { platform: 'Twitter (X)', handle: '@umarfaruk_dev', connected: true, icon: 'twitter' },
  { platform: 'YouTube', handle: 'Not Connected', connected: false, icon: 'youtube' },
]

export const heatmapData = {
  days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  hours: ['12AM', '4AM', '8AM', '12PM', '4PM', '8PM'],
  // 7 days x 6 hour-blocks, values 0-100 (intensity)
  values: [
    [10, 15, 40, 60, 55, 70],
    [8, 12, 45, 65, 58, 80],
    [12, 18, 50, 70, 62, 85],
    [15, 20, 55, 75, 68, 90],
    [20, 25, 60, 80, 72, 95],
    [30, 20, 35, 50, 78, 88],
    [25, 15, 30, 45, 60, 72],
  ],
}
