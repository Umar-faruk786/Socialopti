// Centralized API client for SocialOpti FastAPI Backend
// Gracefully falls back to local data if backend server is unreachable

import * as dummyData from '../data/dummyData'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

function getAuthHeaders(isJson = true) {
  const token = localStorage.getItem('socialopti_token')
  const headers = {}
  if (isJson) {
    headers['Content-Type'] = 'application/json'
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  const isFormData = options.body instanceof FormData
  const headers = {
    ...getAuthHeaders(!isFormData),
    ...(options.headers || {})
  }

  try {
    const response = await fetch(url, { ...options, headers })
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const error = new Error(errorData.detail || errorData.message || `Request failed with status ${response.status}`)
      error.status = response.status
      error.data = errorData
      throw error
    }
    return await response.json()
  } catch (err) {
    // If backend is offline or network error, log warning and let caller handle fallback
    console.warn(`[API Network/Server Error] on ${endpoint}:`, err.message)
    throw err
  }
}

export const api = {
  // Authentication
  async register(data) {
    try {
      const res = await request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data)
      })
      if (res.access_token) {
        localStorage.setItem('socialopti_token', res.access_token)
      }
      return res
    } catch (err) {
      return {
        access_token: 'dummy-token',
        user: { id: 'dummy', name: data.name, email: data.email, role: 'Creator' }
      }
    }
  },

  async login(credentials) {
    try {
      const res = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      })
      if (res.access_token) {
        localStorage.setItem('socialopti_token', res.access_token)
      }
      return res
    } catch (err) {
      // Offline fallback
      return {
        access_token: 'dummy-token',
        user: dummyData.currentUser
      }
    }
  },

  async getMe() {
    try {
      return await request('/auth/me')
    } catch (err) {
      return dummyData.currentUser
    }
  },

  logout() {
    localStorage.removeItem('socialopti_token')
  },

  // User Profile & Settings
  async getProfile() {
    try {
      return await request('/profile')
    } catch (err) {
      return {
        ...dummyData.currentUser,
        total_analyses: 128,
        posts_analyzed: 56,
        social_accounts: dummyData.socialAccounts
      }
    }
  },

  async updateProfile(data) {
    try {
      return await request('/profile', {
        method: 'PUT',
        body: JSON.stringify(data)
      })
    } catch (err) {
      return { ...dummyData.currentUser, ...data }
    }
  },

  async getSettings() {
    try {
      return await request('/settings')
    } catch (err) {
      return { theme: 'light', email: true, push: true, weekly: false, marketing: false }
    }
  },

  async updateSettings(data) {
    try {
      return await request('/settings', {
        method: 'PUT',
        body: JSON.stringify(data)
      })
    } catch (err) {
      return data
    }
  },

  // Content Optimization & AI
  async uploadMedia(file) {
    try {
      const formData = new FormData()
      formData.append('file', file)
      return await request('/content/upload-media', {
        method: 'POST',
        body: formData
      })
    } catch (err) {
      const isVideo = file.type?.startsWith('video/')
      return {
        url: URL.createObjectURL(file),
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        type: file.type,
        aspect: isVideo ? '16:9 Video' : '4:5 Portrait',
        dimensions: isVideo ? '1920 × 1080 HD' : '1080 × 1350 High Res'
      }
    }
  },

  async optimizeContent(payload) {
    try {
      const res = await request('/content/optimize', {
        method: 'POST',
        body: JSON.stringify(payload)
      })
      // Save last result in session storage for immediate viewing on analysis/rec/pred pages
      if (res.analysis) sessionStorage.setItem('socialopti_last_analysis', JSON.stringify(res.analysis))
      if (res.recommendations) sessionStorage.setItem('socialopti_last_recommendations', JSON.stringify(res.recommendations))
      if (res.prediction) sessionStorage.setItem('socialopti_last_prediction', JSON.stringify(res.prediction))
      return res
    } catch (err) {
      // Fallback
      return {
        content: { id: 'sample-1', ...payload },
        analysis: dummyData.contentAnalysisMetrics,
        recommendations: dummyData.recommendations,
        prediction: {
          total_engagement_score: 89,
          reach_probability: 82,
          virality_probability: 73,
          engagement_probability: 89,
          expected_engagement: dummyData.expectedEngagement,
          platform_breakdown: dummyData.engagementPrediction
        }
      }
    }
  },

  async getLatestAnalysis(contentId) {
    try {
      const endpoint = contentId ? `/analysis/${contentId}` : '/analysis/latest'
      return await request(endpoint)
    } catch (err) {
      const cached = sessionStorage.getItem('socialopti_last_analysis')
      return cached ? JSON.parse(cached) : dummyData.contentAnalysisMetrics
    }
  },

  async getLatestRecommendations(contentId) {
    try {
      const endpoint = contentId ? `/recommendations/${contentId}` : '/recommendations/latest'
      return await request(endpoint)
    } catch (err) {
      const cached = sessionStorage.getItem('socialopti_last_recommendations')
      return cached ? JSON.parse(cached) : dummyData.recommendations
    }
  },

  async getLatestPrediction(contentId) {
    try {
      const endpoint = contentId ? `/prediction/${contentId}` : '/prediction/latest'
      return await request(endpoint)
    } catch (err) {
      const cached = sessionStorage.getItem('socialopti_last_prediction')
      if (cached) return JSON.parse(cached)
      return {
        total_engagement_score: 89,
        reach_probability: 82,
        virality_probability: 73,
        engagement_probability: 89,
        expected_engagement: dummyData.expectedEngagement,
        platform_breakdown: dummyData.engagementPrediction
      }
    }
  },

  // Analytics & Dashboard
  async getDashboardAnalytics() {
    try {
      return await request('/analytics/dashboard')
    } catch (err) {
      return {
        summaryCards: dummyData.summaryCards,
        engagementOverview: dummyData.engagementOverview,
        platformPerformance: dummyData.platformPerformance,
        contentScoreDistribution: dummyData.contentScoreDistribution,
        aiInsights: dummyData.aiInsights
      }
    }
  },

  async getAnalyticsOverview(range = 'This Month') {
    try {
      return await request(`/analytics/overview?range=${encodeURIComponent(range)}`)
    } catch (err) {
      return {
        stats: [
          { label: 'Total Reach', value: '245K', delta: '+21.5%', icon: 'users', color: 'bg-accent-orangeLight text-amber-600' },
          { label: 'Total Engagement', value: '18.6K', delta: '+14.8%', icon: 'trend', color: 'bg-accent-greenLight text-emerald-600' },
          { label: 'Avg. Engagement Rate', value: '7.6%', delta: '+8.2%', icon: 'bar', color: 'bg-accent-purpleLight text-purple-600' },
          { label: 'Total Posts', value: '56', delta: '+12.4%', icon: 'file', color: 'bg-accent-blueLight text-blue-600' },
        ],
        weeklyAnalytics: dummyData.weeklyAnalytics,
        monthlyAnalytics: dummyData.monthlyAnalytics,
        platformComparison: dummyData.platformComparison,
        topPosts: dummyData.topPosts,
        contentTypeDistribution: dummyData.contentTypeDistribution,
        heatmapData: dummyData.heatmapData
      }
    }
  },

  // History
  async getHistory(params = {}) {
    const query = new URLSearchParams()
    if (params.page) query.append('page', params.page)
    if (params.pageSize) query.append('page_size', params.pageSize)
    if (params.query) query.append('query', params.query)
    if (params.platform) query.append('platform', params.platform)

    try {
      return await request(`/history?${query.toString()}`)
    } catch (err) {
      return {
        items: dummyData.historyData,
        total: dummyData.historyData.length,
        page: 1,
        page_size: 6,
        total_pages: 2
      }
    }
  },

  async deleteContent(contentId) {
    try {
      return await request(`/content/${contentId}`, { method: 'DELETE' })
    } catch (err) {
      return { message: 'Deleted locally', id: contentId }
    }
  },

  // Trends & Calendar
  async getTrends() {
    try {
      return await request('/trends')
    } catch (err) {
      return {
        trends: [
          { id: '1', topic: 'AI Automation in 2026', category: 'Tech & AI', platform: 'LinkedIn', volume: 125000, growth_rate: 34.2, sample_hashtags: ['#AIAutomation', '#FutureOfWork'] }
        ],
        top_hashtags: ['#AIRevolution', '#ProductivityHacks']
      }
    }
  },

  async getCalendarEvents() {
    try {
      return await request('/calendar/events')
    } catch (err) {
      return null
    }
  }
}
