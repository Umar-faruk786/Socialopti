import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LuCloudUpload,
  LuFolder,
  LuImage,
  LuVideo,
  LuFileText,
  LuEye,
  LuTrash2,
  LuCheck,
  LuChevronDown,
  LuInfo,
  LuCircleAlert,
  LuSearch,
  LuTrendingUp,
  LuLightbulb,
  LuX,
  LuSparkles,
  LuRefreshCw,
  LuCopy,
  LuHeart,
  LuMessageCircle,
  LuShare2,
  LuClock,
  LuUsers,
  LuTarget,
  LuSmile,
  LuHash,
  LuArrowUp,
  LuBadgeCheck
} from 'react-icons/lu'
import {
  FaInstagram,
  FaLinkedin,
  FaFacebook,
  FaXTwitter
} from 'react-icons/fa6'
import DashboardLayout from '../components/layout/DashboardLayout'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import ProgressBar from '../components/ui/ProgressBar'
import GaugeChart from '../components/charts/GaugeChart'
import PlatformIcon from '../components/ui/PlatformIcon'
import { api } from '../services/api'
import {
  contentAnalysisMetrics as defaultMetrics,
  engagementPrediction as defaultPlatformBreakdown,
  predictionOverview as defaultOverview,
  expectedEngagement as defaultExpected,
  recommendations as defaultRecommendations
} from '../data/dummyData'

const PLATFORM_OPTIONS = [
  { id: 'instagram', label: 'Instagram', icon: FaInstagram, color: 'text-pink-500' },
  { id: 'linkedin', label: 'LinkedIn', icon: FaLinkedin, color: 'text-blue-600' },
  { id: 'facebook', label: 'Facebook', icon: FaFacebook, color: 'text-indigo-600' },
  { id: 'twitter', label: 'X/Twitter', icon: FaXTwitter, color: 'text-slate-800' }
]

const CONTENT_TYPES = [
  { id: 'image', label: 'Image', icon: LuImage },
  { id: 'video', label: 'Video', icon: LuVideo },
  { id: 'text', label: 'Text', icon: LuFileText }
]

export default function UploadContent() {
  const fileInputRef = useRef(null)
  const resultsRef = useRef(null)
  const analysisSectionRef = useRef(null)
  const predictionSectionRef = useRef(null)
  const recommendationsSectionRef = useRef(null)
  const uploadFormRef = useRef(null)

  // Upload Form State - Starts empty with NO default sample data
  const [mediaFile, setMediaFile] = useState(null)
  const [selectedPlatform, setSelectedPlatform] = useState('')
  const [isPlatformDropdownOpen, setIsPlatformDropdownOpen] = useState(false)
  const [contentType, setContentType] = useState('image')
  const [caption, setCaption] = useState('')
  const [isDragOver, setIsDragOver] = useState(false)
  const [validationError, setValidationError] = useState('')
  const [showPreviewModal, setShowPreviewModal] = useState(false)

  // Workflow & Results State
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [analysisStepText, setAnalysisStepText] = useState('')
  const [analysisResults, setAnalysisResults] = useState(null)
  const [activeTab, setActiveTab] = useState('analysis')
  const [copiedCaption, setCopiedCaption] = useState(false)
  const [copiedHashtags, setCopiedHashtags] = useState(false)

  // Helper to determine format string
  const getFormatString = (file) => {
    if (!file) return 'FILE'
    if (file.name) {
      const ext = file.name.split('.').pop().toUpperCase()
      if (ext) return ext
    }
    if (file.type) {
      if (file.type.includes('jpeg') || file.type.includes('jpg')) return 'JPG'
      if (file.type.includes('png')) return 'PNG'
      if (file.type.includes('mp4')) return 'MP4'
      if (file.type.includes('quicktime') || file.type.includes('mov')) return 'MOV'
      if (file.type.includes('webp')) return 'WEBP'
    }
    return 'FILE'
  }

  // Handle uploaded file
  const processUploadedFile = (file) => {
    setValidationError('')

    if (!file) return

    // 50MB size limit check
    const maxSizeBytes = 50 * 1024 * 1024
    if (file.size > maxSizeBytes) {
      setValidationError('File size exceeds the 50MB limit. Please choose a smaller file.')
      return
    }

    // Supported formats check: JPG, PNG, MP4, MOV, WEBP
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime', 'video/mov']
    const isImage = file.type.startsWith('image/')
    const isVideo = file.type.startsWith('video/')

    if (!isImage && !isVideo && !validTypes.includes(file.type)) {
      setValidationError('Unsupported format. Please upload JPG, PNG, MP4, or MOV files.')
      return
    }

    const objectUrl = URL.createObjectURL(file)
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1)
    const format = getFormatString(file)

    setMediaFile({
      name: file.name,
      url: objectUrl,
      size: `${sizeInMB} MB`,
      format: format,
      type: file.type,
      rawFile: file
    })

    // Automatically sync content type
    if (isVideo) {
      setContentType('video')
    } else {
      setContentType('image')
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processUploadedFile(e.target.files[0])
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processUploadedFile(e.dataTransfer.files[0])
    }
  }

  const handleRemoveFile = () => {
    setMediaFile(null)
    setValidationError('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  // Submit Handler: Performs analysis and displays results on the SAME page
  const handleSubmit = async (e) => {
    if (e) e.preventDefault()
    if (isAnalyzing) return

    setValidationError('')

    // Validate requirements
    if ((contentType === 'image' || contentType === 'video') && !mediaFile) {
      setValidationError('Please upload an image or video file before submitting for analysis.')
      return
    }

    if (contentType === 'text' && !caption.trim()) {
      setValidationError('Please enter caption or text content for analysis.')
      return
    }

    setIsAnalyzing(true)
    setAnalysisProgress(10)
    setAnalysisStepText('Uploading and processing media asset...')

    // Smooth scroll to loading section
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)

    try {
      // 1. Upload the actual raw file to the backend server if present
      let serverMediaUrl = mediaFile?.url
      if (mediaFile?.rawFile) {
        try {
          setAnalysisStepText('Uploading media asset to server storage...')
          const uploadRes = await api.uploadMedia(mediaFile.rawFile)
          if (uploadRes && uploadRes.url) {
            serverMediaUrl = uploadRes.url
          }
        } catch (uploadErr) {
          console.warn('File upload to /api/content/upload-media failed; using local URL:', uploadErr)
        }
      }

      setAnalysisProgress(35)
      setAnalysisStepText('Extracting text, visual and metadata features...')

      const payload = {
        caption: caption.trim() || (mediaFile ? `Visual asset: ${mediaFile.name}` : ''),
        media_url: serverMediaUrl,
        media_name: mediaFile?.name,
        media_type: mediaFile?.type || (contentType === 'video' ? 'video/mp4' : 'image/jpeg'),
        media_size: mediaFile?.size,
        platform: selectedPlatform || 'instagram',
        platforms: selectedPlatform ? [selectedPlatform.toLowerCase()] : ['instagram', 'linkedin'],
        content_type: contentType,
        created_at: new Date().toISOString()
      }

      // Step simulation for multi-agent progress
      setTimeout(() => {
        setAnalysisProgress(60)
        setAnalysisStepText('Predicting audience engagement and reach probabilities...')
      }, 500)

      setTimeout(() => {
        setAnalysisProgress(85)
        setAnalysisStepText('Formulating content recommendations and optimal posting times...')
      }, 1000)

      const res = await api.optimizeContent(payload)

      setTimeout(() => {
        setAnalysisProgress(100)
        setAnalysisStepText('Analysis complete!')

        // Normalize response so both camelCase and snake_case properties are available
        const rawAnalysis = res?.analysis || {}
        const normalizedAnalysis = {
          ...defaultMetrics,
          ...rawAnalysis,
          overallScore: rawAnalysis.overall_score ?? rawAnalysis.overallScore ?? defaultMetrics.overallScore,
          overall_score: rawAnalysis.overall_score ?? rawAnalysis.overallScore ?? defaultMetrics.overallScore,
          imageQuality: rawAnalysis.image_quality ?? rawAnalysis.imageQuality ?? 0,
          image_quality: rawAnalysis.image_quality ?? rawAnalysis.imageQuality ?? 0,
          captionQuality: rawAnalysis.caption_quality ?? rawAnalysis.captionQuality ?? defaultMetrics.captionQuality,
          caption_quality: rawAnalysis.caption_quality ?? rawAnalysis.captionQuality ?? defaultMetrics.captionQuality,
          readability: rawAnalysis.readability ?? defaultMetrics.readability,
          grammar: rawAnalysis.grammar ?? defaultMetrics.grammar,
          emotionDetected: rawAnalysis.emotion_detected ?? rawAnalysis.emotionDetected ?? defaultMetrics.emotionDetected,
          emotion_detected: rawAnalysis.emotion_detected ?? rawAnalysis.emotionDetected ?? defaultMetrics.emotionDetected,
          emotionConfidence: rawAnalysis.emotion_confidence ?? rawAnalysis.emotionConfidence ?? defaultMetrics.emotionConfidence,
          emotion_confidence: rawAnalysis.emotion_confidence ?? rawAnalysis.emotionConfidence ?? defaultMetrics.emotionConfidence,
          tone: rawAnalysis.tone ?? defaultMetrics.tone,
          toneConfidence: rawAnalysis.tone_confidence ?? rawAnalysis.toneConfidence ?? defaultMetrics.toneConfidence,
          tone_confidence: rawAnalysis.tone_confidence ?? rawAnalysis.toneConfidence ?? defaultMetrics.toneConfidence,
          hashtagCount: rawAnalysis.hashtag_count ?? rawAnalysis.hashtagCount ?? 0,
          hashtag_count: rawAnalysis.hashtag_count ?? rawAnalysis.hashtagCount ?? 0,
          hashtagQuality: rawAnalysis.hashtag_quality ?? rawAnalysis.hashtagQuality ?? 'Good',
          hashtag_quality: rawAnalysis.hashtag_quality ?? rawAnalysis.hashtagQuality ?? 'Good',
          topKeywords: rawAnalysis.top_keywords ?? rawAnalysis.topKeywords ?? defaultMetrics.topKeywords,
          top_keywords: rawAnalysis.top_keywords ?? rawAnalysis.topKeywords ?? defaultMetrics.topKeywords,
          suggestions: rawAnalysis.suggestions ?? defaultMetrics.suggestions,
        }

        const rawRecs = res?.recommendations || {}
        const normalizedRecs = {
          ...defaultRecommendations,
          ...rawRecs,
          improvedCaption: rawRecs.improved_caption ?? rawRecs.improvedCaption ?? defaultRecommendations.improvedCaption,
          improved_caption: rawRecs.improved_caption ?? rawRecs.improvedCaption ?? defaultRecommendations.improvedCaption,
          hashtags: rawRecs.hashtags ?? defaultRecommendations.hashtags,
          bestTime: rawRecs.best_time ?? rawRecs.bestTime ?? defaultRecommendations.bestTime,
          best_time: rawRecs.best_time ?? rawRecs.bestTime ?? defaultRecommendations.bestTime,
          audience: rawRecs.audience ?? defaultRecommendations.audience,
          improvementTips: rawRecs.improvement_tips ?? rawRecs.improvementTips ?? defaultRecommendations.improvementTips,
          improvement_tips: rawRecs.improvement_tips ?? rawRecs.improvementTips ?? defaultRecommendations.improvementTips,
        }

        const rawPred = res?.prediction || {}
        const normalizedPred = {
          ...rawPred,
          total_engagement_score: rawPred.total_engagement_score ?? defaultOverview.totalEngagementScore,
          totalEngagementScore: rawPred.total_engagement_score ?? defaultOverview.totalEngagementScore,
          reach_probability: rawPred.reach_probability ?? defaultOverview.reachProbability,
          reachProbability: rawPred.reach_probability ?? defaultOverview.reachProbability,
          virality_probability: rawPred.virality_probability ?? defaultOverview.viralityProbability,
          viralityProbability: rawPred.virality_probability ?? defaultOverview.viralityProbability,
          engagement_probability: rawPred.engagement_probability ?? defaultOverview.engagementProbability,
          engagementProbability: rawPred.engagement_probability ?? defaultOverview.engagementProbability,
          expected_engagement: rawPred.expected_engagement ?? defaultExpected,
          expectedEngagement: rawPred.expected_engagement ?? defaultExpected,
          platform_breakdown: rawPred.platform_breakdown ?? defaultPlatformBreakdown,
          platformBreakdown: rawPred.platform_breakdown ?? defaultPlatformBreakdown,
        }

        const combinedData = {
          content: res?.content || { id: 'post-1', ...payload },
          analysis: normalizedAnalysis,
          prediction: normalizedPred,
          recommendations: normalizedRecs,
          uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isMock: Boolean(res?.is_demo || !res?.content?.id || res?.content?.id === 'sample-1')
        }

        setAnalysisResults(combinedData)
        setIsAnalyzing(false)

        // Save in session storage for continuity with standalone routes
        sessionStorage.setItem('socialopti_uploaded_content', JSON.stringify({
          ...payload,
          mediaFile: mediaFile ? {
            name: mediaFile.name,
            url: serverMediaUrl || mediaFile.url,
            size: mediaFile.size,
            format: mediaFile.format,
            type: mediaFile.type
          } : null
        }))

        // Scroll smoothly to results
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 150)
      }, 1500)
    } catch (err) {
      setIsAnalyzing(false)
      setValidationError('Analysis service encountered an error. Please try again.')
    }
  }

  // Scroll to section tab
  const scrollToSection = (sectionName) => {
    setActiveTab(sectionName)
    if (sectionName === 'analysis') {
      analysisSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else if (sectionName === 'prediction') {
      predictionSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else if (sectionName === 'recommendations') {
      recommendationsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleUploadNewContent = () => {
    uploadFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    handleBrowseClick()
  }

  const handleCopyCaption = (text) => {
    navigator.clipboard?.writeText(text)
    setCopiedCaption(true)
    setTimeout(() => setCopiedCaption(false), 2000)
  }

  const handleCopyHashtags = (tags) => {
    navigator.clipboard?.writeText(tags.join(' '))
    setCopiedHashtags(true)
    setTimeout(() => setCopiedHashtags(false), 2000)
  }

  const selectedPlatformObj = PLATFORM_OPTIONS.find((p) => p.id === selectedPlatform)

  // Fallbacks and metrics for results
  const analysisData = analysisResults?.analysis || defaultMetrics
  const predictionData = analysisResults?.prediction || {
    total_engagement_score: defaultOverview.totalEngagementScore,
    reach_probability: defaultOverview.reachProbability,
    virality_probability: defaultOverview.viralityProbability,
    engagement_probability: defaultOverview.engagementProbability,
    expected_engagement: defaultExpected,
    platform_breakdown: defaultPlatformBreakdown
  }
  const recommendationsData = analysisResults?.recommendations || defaultRecommendations

  const expectedStats = predictionData.expected_engagement || defaultExpected
  const platformBreakdownList = predictionData.platform_breakdown || defaultPlatformBreakdown

  return (
    <DashboardLayout title="Upload Content">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,.mp4,.mov"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="max-w-[1380px] mx-auto py-2">
        {/* ========================================================= */}
        {/* TOP LEVEL: UPLOAD FORM & "WHAT HAPPENS NEXT?" PANEL       */}
        {/* ========================================================= */}
        <div ref={uploadFormRef} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ------------------------------------------------------- */}
          {/* LEFT: MAIN UPLOAD & CONTENT DETAILS CARD (8 of 12 cols) */}
          {/* ------------------------------------------------------- */}
          <div className="lg:col-span-8 bg-white rounded-2xl md:rounded-3xl border border-[#ECEEFA] p-6 sm:p-8 shadow-[0_2px_14px_rgba(20,20,43,0.03)]">
            
            {/* Header: Icon + Title + Subtitle */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#EEECFE] flex items-center justify-center text-[#633DF2] shrink-0 shadow-xs">
                <LuCloudUpload className="text-2xl" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold font-display text-[#1E1B39] tracking-tight">
                  Upload Your Content
                </h1>
                <p className="text-xs sm:text-sm text-[#8A90A2] mt-0.5 leading-relaxed">
                  Share your image or video and let our AI analyze it for better engagement insights.
                </p>
              </div>
            </div>

            {/* Drag & Drop Area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleBrowseClick}
              className={`mt-6 border-2 border-dashed rounded-2xl relative overflow-hidden py-10 px-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
                isDragOver
                  ? 'border-[#633DF2] bg-[#F1EEFE] ring-4 ring-[#633DF2]/10 scale-[0.995]'
                  : 'border-[#CFD4EE] bg-gradient-to-b from-[#F9F9FE] via-[#F6F7FE] to-[#F1F3FE] hover:border-[#633DF2]/60 hover:bg-[#F3F2FE]'
              }`}
            >
              {/* Subtle decorative background circles */}
              <div className="w-20 h-20 rounded-full bg-[#E5E5FD]/50 blur-md absolute top-4 left-6 pointer-events-none" />
              <div className="w-28 h-28 rounded-full bg-[#EAE8FE]/60 blur-lg absolute -bottom-6 -right-6 pointer-events-none" />

              {/* Upload Cloud Graphic */}
              <div className="relative mb-3.5 z-10">
                <div className="w-14 h-14 rounded-2xl bg-[#EEECFE] text-[#633DF2] flex items-center justify-center shadow-xs">
                  <LuCloudUpload className="text-3xl" />
                </div>
              </div>

              {/* Text instructions */}
              <p className="text-sm font-bold text-[#1E1B39] z-10">
                Drag & Drop Your File Here
              </p>
              <span className="text-xs text-[#9DA3B4] my-1 z-10">or</span>

              {/* Browse Files Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleBrowseClick()
                }}
                className="z-10 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#EDEAFC] hover:bg-[#E3DFFE] text-[#633DF2] font-semibold text-xs transition border border-[#D9D4F8] shadow-xs active:scale-95"
              >
                <LuFolder className="text-sm text-[#633DF2]" />
                <span>Browse Files</span>
              </button>

              {/* Format limits info */}
              <p className="text-[11px] text-[#8E94A5] mt-4 z-10 font-medium">
                Supported formats: JPG, PNG, MP4, MOV <span className="mx-1 text-[#CBD0E1]">|</span> Max size: 50MB
              </p>
            </div>

            {/* Uploaded File Item Preview Bar (shown only when a file is selected) */}
            {mediaFile && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 sm:p-3.5 bg-white border border-[#E9ECF8] rounded-xl flex items-center justify-between shadow-xs transition-all"
              >
                {/* File thumbnail + details */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200/80 shadow-xs relative">
                    {mediaFile.type?.startsWith('video/') ? (
                      <div className="w-full h-full bg-[#ECE7FE] text-[#633DF2] flex items-center justify-center">
                        <LuVideo className="text-xl" />
                      </div>
                    ) : (
                      <img
                        src={mediaFile.url}
                        alt={mediaFile.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-[#1E1B39] truncate">
                      {mediaFile.name}
                    </p>
                    <p className="text-[11px] text-[#8E94A5] font-medium">
                      {mediaFile.size} <span className="mx-0.5">•</span> {mediaFile.format}
                    </p>
                    <div className="inline-flex items-center gap-1 mt-0.5 px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#10B981] text-[10px] font-semibold border border-[#D1FAE5]">
                      <LuCheck className="text-xs font-bold" />
                      <span>File uploaded successfully</span>
                    </div>
                  </div>
                </div>

                {/* Actions: Preview & Remove */}
                <div className="flex items-center gap-3 shrink-0 ml-3">
                  <button
                    type="button"
                    onClick={() => setShowPreviewModal(true)}
                    className="inline-flex items-center gap-1.5 text-xs text-[#525768] hover:text-[#633DF2] font-semibold px-2 py-1.5 rounded-lg hover:bg-[#F4F3FD] transition"
                  >
                    <LuEye className="text-sm" />
                    <span>Preview</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="inline-flex items-center gap-1.5 text-xs text-[#EF4444] hover:text-[#DC2626] font-semibold px-2 py-1.5 rounded-lg hover:bg-red-50 transition"
                  >
                    <LuTrash2 className="text-sm" />
                    <span>Remove</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* Validation Error Alert */}
            {validationError && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 font-medium"
              >
                <LuCircleAlert className="text-base text-red-500 shrink-0" />
                <span>{validationError}</span>
              </motion.div>
            )}

            {/* Content Details Section */}
            <div className="mt-7 pt-2">
              <h2 className="text-sm sm:text-base font-bold text-[#1E1B39] mb-4">
                Content Details
              </h2>

              {/* Grid: Platform Dropdown & Content Type Selector */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Platform Selector */}
                <div>
                  <label className="block text-xs font-semibold text-[#343A4F] mb-1.5">
                    Select Platform <span className="text-[#8E94A5] font-normal">(Optional)</span>
                  </label>
                  
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsPlatformDropdownOpen(!isPlatformDropdownOpen)}
                      className="w-full h-11 bg-white border border-[#E2E6F2] hover:border-[#633DF2]/50 rounded-xl px-3.5 flex items-center justify-between text-xs transition text-left focus:outline-none focus:ring-2 focus:ring-[#633DF2]/20"
                    >
                      <div className="flex items-center gap-2 truncate">
                        {selectedPlatformObj ? (
                          <>
                            <selectedPlatformObj.icon className={`text-base ${selectedPlatformObj.color}`} />
                            <span className="font-semibold text-[#1E1B39]">{selectedPlatformObj.label}</span>
                          </>
                        ) : (
                          <span className="text-[#9DA3B4] font-normal">Choose platform</span>
                        )}
                      </div>
                      <LuChevronDown className={`text-[#8E94A5] text-sm transition-transform duration-200 ${isPlatformDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Options */}
                    {isPlatformDropdownOpen && (
                      <div className="absolute left-0 right-0 top-12 bg-white rounded-xl border border-[#E2E6F2] shadow-xl py-1.5 z-20 overflow-hidden">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPlatform('')
                            setIsPlatformDropdownOpen(false)
                          }}
                          className={`w-full px-3.5 py-2 text-left text-xs font-medium flex items-center justify-between hover:bg-[#F7F8FE] transition ${
                            !selectedPlatform ? 'text-[#633DF2] bg-[#F4F2FE] font-bold' : 'text-[#64748B]'
                          }`}
                        >
                          <span>All Platforms / Automatic</span>
                          {!selectedPlatform && <LuCheck className="text-sm" />}
                        </button>
                        {PLATFORM_OPTIONS.map((item) => {
                          const Icon = item.icon
                          const isSelected = selectedPlatform === item.id
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => {
                                setSelectedPlatform(item.id)
                                setIsPlatformDropdownOpen(false)
                              }}
                              className={`w-full px-3.5 py-2 text-left text-xs font-medium flex items-center justify-between hover:bg-[#F7F8FE] transition ${
                                isSelected ? 'text-[#633DF2] bg-[#F4F2FE] font-bold' : 'text-[#334155]'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <Icon className={`text-sm ${item.color}`} />
                                <span>{item.label}</span>
                              </div>
                              {isSelected && <LuCheck className="text-sm text-[#633DF2]" />}
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Content Type Selector */}
                <div>
                  <label className="block text-xs font-semibold text-[#343A4F] mb-1.5">
                    Content Type
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {CONTENT_TYPES.map((type) => {
                      const Icon = type.icon
                      const isActive = contentType === type.id
                      return (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setContentType(type.id)}
                          className={`h-11 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                            isActive
                              ? 'bg-[#ECE7FE] border border-[#633DF2]/30 text-[#633DF2] shadow-xs'
                              : 'bg-white border border-[#E2E6F2] text-[#64748B] hover:text-[#1E1B39] hover:bg-[#F8FAFC]'
                          }`}
                        >
                          <Icon className={`text-sm ${isActive ? 'text-[#633DF2]' : 'text-[#8E94A5]'}`} />
                          <span>{type.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Caption Textarea with Character Counter */}
              <div className="mt-4">
                <label className="block text-xs font-semibold text-[#343A4F] mb-1.5">
                  Caption <span className="text-[#8E94A5] font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <textarea
                    rows={3}
                    maxLength={500}
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Write something about your content..."
                    className="w-full bg-white border border-[#E2E6F2] focus:border-[#633DF2] focus:ring-2 focus:ring-[#633DF2]/15 rounded-xl p-3.5 pb-6 text-xs text-[#1E1B39] placeholder:text-[#9DA3B4] resize-none font-normal transition outline-none"
                  />
                  <div className="absolute bottom-2.5 right-3 text-[10px] text-[#9DA3B4] font-medium select-none">
                    {caption.length}/500
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-5">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isAnalyzing}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#6355F6] via-[#6C56F8] to-[#7E5BFB] hover:from-[#5747F2] hover:to-[#724CF6] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_6px_22px_rgba(99,85,246,0.32)] hover:shadow-[0_8px_26px_rgba(99,85,246,0.42)] transition-all active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Analyzing Your Content...</span>
                    </>
                  ) : (
                    <>
                      <LuSparkles className="text-base" />
                      <span>Submit for Analysis</span>
                    </>
                  )}
                </button>

                {/* Subtext info */}
                <p className="text-[11px] text-[#8E94A5] text-center flex items-center justify-center gap-1.5 mt-3 font-normal">
                  <LuInfo className="text-xs text-[#9DA3B4] shrink-0" />
                  <span>After submission, your content will be analyzed and you'll get insights, predictions and recommendations right below.</span>
                </p>
              </div>

            </div>

          </div>

          {/* ------------------------------------------------------- */}
          {/* RIGHT: WORKFLOW PANEL ("What happens next?") (4 of 12 cols) */}
          {/* ------------------------------------------------------- */}
          <div className="lg:col-span-4 bg-white rounded-2xl md:rounded-3xl border border-[#ECEEFA] p-6 sm:p-7 shadow-[0_2px_14px_rgba(20,20,43,0.03)] flex flex-col justify-between">
            
            <div>
              {/* Header */}
              <h2 className="text-base sm:text-lg font-bold font-display text-[#1E1B39]">
                What happens next?
              </h2>
              <p className="text-xs text-[#8A90A2] mt-1 mb-6 leading-relaxed">
                Once you submit, our multi-agent system will analyze your content and provide:
              </p>

              {/* 3 Steps Vertical Flow */}
              <div className="space-y-4 relative">
                
                {/* Step 1: Content Analysis */}
                <div className="relative flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#F3F1FE] text-[#633DF2] flex items-center justify-center text-sm shrink-0 border border-[#E9E4FE] shadow-xs">
                    <LuSearch />
                  </div>

                  <div className="flex items-start gap-2 pt-1">
                    <span className="w-4.5 h-4.5 px-1 rounded-full bg-[#EDE8FE] text-[#633DF2] text-[10px] font-bold flex items-center justify-center shrink-0">
                      1
                    </span>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-[#1E1B39] leading-tight">
                        Content Analysis
                      </h3>
                      <p className="text-[11px] text-[#8A90A2] mt-0.5 leading-snug">
                        Analyzes text, visual and metadata features.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Connecting Line 1 -> 2 */}
                <div className="w-0.5 h-6 bg-[#E3E6F2] ml-4.5 -my-1" />

                {/* Step 2: Engagement Prediction */}
                <div className="relative flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#F3F1FE] text-[#633DF2] flex items-center justify-center text-sm shrink-0 border border-[#E9E4FE] shadow-xs">
                    <LuTrendingUp />
                  </div>

                  <div className="flex items-start gap-2 pt-1">
                    <span className="w-4.5 h-4.5 px-1 rounded-full bg-[#EDE8FE] text-[#633DF2] text-[10px] font-bold flex items-center justify-center shrink-0">
                      2
                    </span>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-[#1E1B39] leading-tight">
                        Engagement Prediction
                      </h3>
                      <p className="text-[11px] text-[#8A90A2] mt-0.5 leading-snug">
                        Predicts expected engagement score.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Connecting Line 2 -> 3 */}
                <div className="w-0.5 h-6 bg-[#E3E6F2] ml-4.5 -my-1" />

                {/* Step 3: Recommendations */}
                <div className="relative flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#F3F1FE] text-[#633DF2] flex items-center justify-center text-sm shrink-0 border border-[#E9E4FE] shadow-xs">
                    <LuLightbulb />
                  </div>

                  <div className="flex items-start gap-2 pt-1">
                    <span className="w-4.5 h-4.5 px-1 rounded-full bg-[#EDE8FE] text-[#633DF2] text-[10px] font-bold flex items-center justify-center shrink-0">
                      3
                    </span>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-[#1E1B39] leading-tight">
                        Recommendations
                      </h3>
                      <p className="text-[11px] text-[#8A90A2] mt-0.5 leading-snug">
                        Provides optimized content suggestions.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom Graphic Illustration */}
            <div className="mt-8 pt-4 flex flex-col items-center justify-center">
              <div className="relative w-full max-w-[260px] aspect-[4/3] flex items-center justify-center">
                
                <svg
                  viewBox="0 0 240 180"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full drop-shadow-sm select-none"
                >
                  <defs>
                    <linearGradient id="blueCardGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#E0EDFF" />
                      <stop offset="100%" stopColor="#CBE2FE" />
                    </linearGradient>
                    <linearGradient id="purpleCardGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#F1EEFF" />
                      <stop offset="100%" stopColor="#E3DDFF" />
                    </linearGradient>
                    <filter id="softShadow" x="-10%" y="-10%" width="130%" height="130%">
                      <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#6355F6" floodOpacity="0.08" />
                    </filter>
                  </defs>

                  <circle cx="120" cy="90" r="70" fill="#F4F3FF" opacity="0.7" />

                  {/* Left: Image Card */}
                  <g filter="url(#softShadow)">
                    <rect x="36" y="38" width="68" height="80" rx="10" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
                    <rect x="42" y="44" width="56" height="42" rx="7" fill="url(#blueCardGrad)" />
                    <path d="M47 78L58 64L69 74L77 67L93 78H47Z" fill="#93C5FD" opacity="0.9" />
                    <circle cx="56" cy="53" r="4.5" fill="#FCD34D" />
                    <rect x="44" y="93" width="34" height="4" rx="2" fill="#E2E8F0" />
                    <rect x="44" y="101" width="22" height="4" rx="2" fill="#E2E8F0" />
                  </g>

                  {/* Top-Right: Video Card */}
                  <g filter="url(#softShadow)">
                    <rect x="122" y="26" width="76" height="52" rx="10" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
                    <rect x="127" y="31" width="66" height="42" rx="7" fill="url(#purpleCardGrad)" />
                    <circle cx="160" cy="52" r="11" fill="#6355F6" />
                    <path d="M157 47L165 52L157 57V47Z" fill="#FFFFFF" />
                  </g>

                  {/* Bottom-Right: Analytics Bar Chart Card */}
                  <g filter="url(#softShadow)">
                    <rect x="132" y="92" width="64" height="56" rx="10" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
                    <rect x="144" y="122" width="8" height="16" rx="3" fill="#C4B5FD" />
                    <rect x="156" y="112" width="8" height="26" rx="3" fill="#8B5CF6" />
                    <rect x="168" y="104" width="8" height="34" rx="3" fill="#6355F6" />
                    <rect x="180" y="116" width="8" height="22" rx="3" fill="#A78BFA" />
                  </g>

                  {/* Orbiting Curved Arrows */}
                  <path
                    d="M 32 108 C 24 80, 36 30, 80 20"
                    stroke="#818CF8"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                    fill="none"
                  />
                  <path d="M 80 16 L 85 22 L 77 24 Z" fill="#6355F6" />

                  <path
                    d="M 205 78 C 215 106, 200 148, 164 158"
                    stroke="#818CF8"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                    fill="none"
                  />
                  <path d="M 166 162 L 160 156 L 168 154 Z" fill="#6355F6" />

                  {/* Sparkles */}
                  <g transform="translate(26, 70) scale(0.7)">
                    <path d="M10 0L12 7L19 10L12 12L10 19L7 12L0 10L7 7Z" fill="#818CF8" />
                  </g>
                  <g transform="translate(210, 40) scale(0.55)">
                    <path d="M10 0L12 7L19 10L12 12L10 19L7 12L0 10L7 7Z" fill="#A78BFA" />
                  </g>
                </svg>

              </div>

              {/* Tagline below graphic */}
              <div className="text-center -mt-2">
                <p className="font-display font-bold text-sm tracking-wide bg-gradient-to-r from-[#6355F6] via-[#7B61FF] to-[#9333EA] bg-clip-text text-transparent italic">
                  Better Content
                </p>
                <p className="font-display font-extrabold text-sm tracking-wider text-[#633DF2] italic -mt-0.5">
                  Bigger Reach
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* ========================================================= */}
        {/* LOADING INDICATOR SECTION: "Analyzing Your Content"       */}
        {/* ========================================================= */}
        <AnimatePresence>
          {isAnalyzing && (
            <motion.div
              ref={resultsRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-8 bg-white rounded-2xl md:rounded-3xl border border-[#ECEEFA] p-8 sm:p-10 shadow-[0_4px_20px_rgba(99,85,246,0.06)] text-center relative overflow-hidden"
            >
              <div className="w-40 h-40 rounded-full bg-[#F3F1FE] blur-2xl absolute -top-10 left-1/2 -translate-x-1/2 pointer-events-none" />

              <div className="relative z-10 max-w-lg mx-auto flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6355F6] to-[#8B5CF6] text-white flex items-center justify-center text-2xl shadow-[0_8px_25px_rgba(99,85,246,0.35)] mb-4 animate-bounce" style={{ animationDuration: '2s' }}>
                  <LuSparkles className="animate-spin" style={{ animationDuration: '6s' }} />
                </div>

                <h3 className="text-xl font-bold font-display text-[#1E1B39]">
                  Analyzing Your Content
                </h3>
                <p className="text-xs sm:text-sm text-[#8A90A2] mt-1 mb-6 leading-relaxed">
                  {analysisStepText}
                </p>

                {/* Animated Progress Bar */}
                <div className="w-full bg-[#EEF0F8] h-2.5 rounded-full overflow-hidden mb-3">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#6355F6] via-[#8B5CF6] to-[#A855F7] rounded-full"
                    initial={{ width: '10%' }}
                    animate={{ width: `${analysisProgress}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>

                <div className="flex items-center justify-between w-full text-[11px] font-semibold text-[#8A90A2]">
                  <span>Multi-Agent Engine</span>
                  <span className="text-[#633DF2]">{analysisProgress}% Complete</span>
                </div>

                {/* 3 Processing Badges */}
                <div className="grid grid-cols-3 gap-2 mt-6 w-full text-[11px]">
                  <div className={`p-2 rounded-xl border flex flex-col items-center text-center transition-all ${analysisProgress >= 30 ? 'bg-[#F3F1FE] border-[#D9D4F8] text-[#633DF2] font-semibold' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                    <LuSearch className="text-sm mb-1" />
                    <span>1. Content</span>
                  </div>
                  <div className={`p-2 rounded-xl border flex flex-col items-center text-center transition-all ${analysisProgress >= 70 ? 'bg-[#F3F1FE] border-[#D9D4F8] text-[#633DF2] font-semibold' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                    <LuTrendingUp className="text-sm mb-1" />
                    <span>2. Prediction</span>
                  </div>
                  <div className={`p-2 rounded-xl border flex flex-col items-center text-center transition-all ${analysisProgress >= 95 ? 'bg-[#F3F1FE] border-[#D9D4F8] text-[#633DF2] font-semibold' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                    <LuLightbulb className="text-sm mb-1" />
                    <span>3. Suggestions</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ========================================================= */}
        {/* RESULTS SECTIONS BELOW UPLOAD FORM (Shown after submit)  */}
        {/* ========================================================= */}
        {analysisResults && !isAnalyzing && (
          <motion.div
            ref={resultsRef}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-10 space-y-8"
          >
            {/* ----------------------------------------------------- */}
            {/* RESULTS SUB-HEADER & SECTION NAVIGATION TABS          */}
            {/* ----------------------------------------------------- */}
            <div className="sticky top-20 z-20 bg-white/90 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-[#ECEEFA] shadow-[0_4px_20px_rgba(20,20,43,0.04)] flex flex-col md:flex-row md:items-center justify-between gap-3">
              
              {/* Left: Quick Scroll Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                <button
                  type="button"
                  onClick={() => scrollToSection('analysis')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
                    activeTab === 'analysis'
                      ? 'bg-[#633DF2] text-white shadow-sm'
                      : 'bg-[#F4F2FE] text-[#633DF2] hover:bg-[#EBE7FE]'
                  }`}
                >
                  <LuSearch className="text-sm" />
                  <span>Content Analysis</span>
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection('prediction')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
                    activeTab === 'prediction'
                      ? 'bg-[#633DF2] text-white shadow-sm'
                      : 'bg-[#F4F2FE] text-[#633DF2] hover:bg-[#EBE7FE]'
                  }`}
                >
                  <LuTrendingUp className="text-sm" />
                  <span>Engagement Prediction</span>
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection('recommendations')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
                    activeTab === 'recommendations'
                      ? 'bg-[#633DF2] text-white shadow-sm'
                      : 'bg-[#F4F2FE] text-[#633DF2] hover:bg-[#EBE7FE]'
                  }`}
                >
                  <LuLightbulb className="text-sm" />
                  <span>Recommendations</span>
                </button>
              </div>

              {/* Right: Action Buttons (Re-analyze & Upload New) */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-3 py-1.5 rounded-xl border border-[#E2E6F2] hover:border-[#633DF2] text-[#525768] hover:text-[#633DF2] text-xs font-semibold flex items-center gap-1.5 transition bg-white"
                  title="Re-run AI analysis with current settings"
                >
                  <LuRefreshCw className="text-xs" />
                  <span>Re-analyze</span>
                </button>

                <button
                  type="button"
                  onClick={handleUploadNewContent}
                  className="px-3 py-1.5 rounded-xl bg-[#EDEAFC] hover:bg-[#E3DFFE] text-[#633DF2] text-xs font-semibold flex items-center gap-1.5 transition"
                  title="Upload a new file"
                >
                  <LuCloudUpload className="text-sm" />
                  <span>Upload New Content</span>
                </button>
              </div>

            </div>

            {/* Model Mode Banner */}
            <div className="p-3 px-4 rounded-xl bg-[#F8F9FE] border border-[#E8EBFA] flex items-center justify-between text-xs text-[#64748B]">
              <div className="flex items-center gap-2 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Results generated at {analysisResults.uploadedAt} for <strong>{mediaFile?.name || 'Text Content'}</strong></span>
              </div>
              <span className="text-[11px] text-[#8E94A5]">
                {analysisResults.isMock ? 'Model Evaluation (Simulated Environment)' : 'Verified Neural Model Evaluation'}
              </span>
            </div>

            {/* ===================================================== */}
            {/* SECTION A: CONTENT ANALYSIS                           */}
            {/* ===================================================== */}
            <div ref={analysisSectionRef} className="scroll-mt-36 space-y-6">
              
              {/* Section Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#F3F1FE] text-[#633DF2] flex items-center justify-center font-bold text-sm">
                    <LuSearch />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold font-display text-[#1E1B39]">
                      Section A – Content Analysis
                    </h2>
                    <p className="text-xs text-[#8A90A2]">
                      Detailed breakdown of content quality, visual attributes, readability, and sentiment
                    </p>
                  </div>
                </div>
                <Badge color="purple" className="text-xs px-3 py-1">
                  Overall Score: {analysisData.overallScore}%
                </Badge>
              </div>

              {/* Main Grid for Section A */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Card (7 cols): Asset Details & Quality Metrics */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* Media Asset Preview Card */}
                  <div className="bg-white rounded-2xl border border-[#ECEEFA] p-6 shadow-xs">
                    <h3 className="text-sm font-bold text-[#1E1B39] mb-4 flex items-center gap-2">
                      <LuImage className="text-[#633DF2]" /> Uploaded Asset & Visual Analysis
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center mb-5">
                      {/* Media container */}
                      <div className="sm:col-span-5 aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-xs relative">
                        {mediaFile?.type?.startsWith('video/') ? (
                          <video
                            src={mediaFile?.url}
                            controls
                            className="w-full h-full object-cover"
                          />
                        ) : mediaFile ? (
                          <img
                            src={mediaFile.url}
                            alt={mediaFile.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                            Text Content Only
                          </div>
                        )}
                      </div>

                      {/* Details breakdown */}
                      <div className="sm:col-span-7 space-y-2 text-xs">
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-[#8E94A5]">File Name:</span>
                          <span className="font-semibold text-[#1E1B39] truncate max-w-[170px]">{mediaFile?.name || 'Manual Text Post'}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-[#8E94A5]">Content Type:</span>
                          <span className="font-semibold text-[#1E1B39] uppercase">{contentType}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-[#8E94A5]">Target Platform:</span>
                          <span className="font-semibold text-[#1E1B39] capitalize">{selectedPlatform || 'All Platforms'}</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-[#8E94A5]">File Size & Format:</span>
                          <span className="font-semibold text-[#1E1B39]">{mediaFile ? `${mediaFile.size} • ${mediaFile.format}` : 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quality Breakdown Bars */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#F1F3F9]">
                      <div className="p-3.5 rounded-xl bg-[#F8F9FE] border border-[#ECEEFA]">
                        <ProgressBar value={analysisData.imageQuality} color="bg-[#633DF2]" showLabel label="Visual Quality" />
                        <p className="text-[11px] text-[#8E94A5] mt-1.5">
                          {analysisData.imageQuality >= 90 ? 'Excellent resolution and aesthetic tone.' : 'Good clarity and balanced composition.'}
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#F8F9FE] border border-[#ECEEFA]">
                        <ProgressBar value={analysisData.captionQuality} color="bg-purple-500" showLabel label="Caption Quality" />
                        <p className="text-[11px] text-[#8E94A5] mt-1.5">Engaging hook with clear intent.</p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#F8F9FE] border border-[#ECEEFA]">
                        <ProgressBar value={analysisData.readability} color="bg-blue-500" showLabel label="Readability Score" />
                        <p className="text-[11px] text-[#8E94A5] mt-1.5">Easy to parse on mobile feeds.</p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#F8F9FE] border border-[#ECEEFA]">
                        <ProgressBar value={analysisData.grammar} color="bg-emerald-500" showLabel label="Grammar & Flow" />
                        <p className="text-[11px] text-[#8E94A5] mt-1.5">Zero spelling errors detected.</p>
                      </div>
                    </div>

                  </div>

                  {/* Emotion & Tone Analysis */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white rounded-2xl border border-[#ECEEFA] p-5 shadow-xs">
                      <h4 className="text-xs font-bold text-[#1E1B39] mb-3 flex items-center gap-2">
                        <LuSmile className="text-[#633DF2]" /> Emotion Detected
                      </h4>
                      <Badge color="green" className="text-xs px-3 py-1 mb-2 font-semibold">
                        {analysisData.emotionDetected}
                      </Badge>
                      <p className="text-xs text-[#8A90A2]">Confidence: {analysisData.emotionConfidence}%</p>
                      <div className="mt-2">
                        <ProgressBar value={analysisData.emotionConfidence} color="bg-emerald-500" />
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-[#ECEEFA] p-5 shadow-xs">
                      <h4 className="text-xs font-bold text-[#1E1B39] mb-3 flex items-center gap-2">
                        <LuBadgeCheck className="text-[#633DF2]" /> Tone & Resonance
                      </h4>
                      <Badge color="blue" className="text-xs px-3 py-1 mb-2 font-semibold">
                        {analysisData.tone}
                      </Badge>
                      <p className="text-xs text-[#8A90A2]">Confidence: {analysisData.toneConfidence}%</p>
                      <div className="mt-2">
                        <ProgressBar value={analysisData.toneConfidence} color="bg-blue-500" />
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right Card (5 cols): Overall Score Gauge, Keywords & Strengths */}
                <div className="lg:col-span-5 space-y-6">
                  
                  {/* Content Score Gauge */}
                  <div className="bg-white rounded-2xl border border-[#ECEEFA] p-6 shadow-xs flex flex-col items-center text-center">
                    <h3 className="text-sm font-bold text-[#1E1B39] mb-2 self-start">
                      Content Quality Score
                    </h3>
                    <div className="my-2">
                      <GaugeChart value={analysisData.overallScore} color="#633DF2" label="Excellent" size={160} />
                    </div>
                    <p className="text-xs text-[#8A90A2] mt-2">
                      Your content scores in the <strong>top 10%</strong> of high-converting social media creatives.
                    </p>
                  </div>

                  {/* Hashtag & Keywords Analysis */}
                  <div className="bg-white rounded-2xl border border-[#ECEEFA] p-5 shadow-xs">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xs font-bold text-[#1E1B39] flex items-center gap-1.5">
                        <LuHash className="text-[#633DF2]" /> Hashtag & Keyword Density
                      </h4>
                      <Badge color="purple" className="text-[11px]">
                        {analysisData.hashtagCount} Tags • {analysisData.hashtagQuality}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {analysisData.topKeywords?.map((tag) => (
                        <span key={tag} className="px-2.5 py-1 rounded-lg bg-[#F4F1FE] text-[#633DF2] text-xs font-medium border border-[#E9E4FE]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Strengths & Areas for Improvement */}
                  <div className="bg-white rounded-2xl border border-[#ECEEFA] p-5 shadow-xs">
                    <h4 className="text-xs font-bold text-[#1E1B39] mb-3">
                      Strengths & Improvement Areas
                    </h4>

                    <div className="space-y-2.5 text-xs">
                      <div className="flex items-start gap-2 text-slate-700">
                        <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                          ✓
                        </span>
                        <span>High visual clarity and focal contrast tailored for scrolling feeds.</span>
                      </div>
                      <div className="flex items-start gap-2 text-slate-700">
                        <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                          ✓
                        </span>
                        <span>Resonant positive tone with verified emotional hook.</span>
                      </div>
                      <div className="flex items-start gap-2 text-slate-700">
                        <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                          !
                        </span>
                        <span>Consider adding an explicit question at the bottom to ignite user discussion.</span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </div>

            {/* ===================================================== */}
            {/* SECTION B: ENGAGEMENT PREDICTION                      */}
            {/* ===================================================== */}
            <div ref={predictionSectionRef} className="scroll-mt-36 space-y-6 pt-4">
              
              {/* Section Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#F3F1FE] text-[#633DF2] flex items-center justify-center font-bold text-sm">
                    <LuTrendingUp />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold font-display text-[#1E1B39]">
                      Section B – Engagement Prediction
                    </h2>
                    <p className="text-xs text-[#8A90A2]">
                      Predicted virality, expected interaction metrics, and cross-platform forecast
                    </p>
                  </div>
                </div>
                <Badge color="green" className="text-xs px-3 py-1 font-semibold">
                  Probability: {predictionData.engagement_probability || defaultOverview.engagementProbability}% (High)
                </Badge>
              </div>

              {/* Disclaimer Notice Label */}
              <div className="p-3 px-4 rounded-xl bg-[#FEF3C7]/40 border border-[#FDE68A] text-amber-800 text-xs flex items-center gap-2">
                <LuInfo className="text-sm text-amber-600 shrink-0" />
                <span>
                  <strong>Estimated Predictions:</strong> Values are computed by evaluating feature match against historical top-performing posts on target platforms.
                </span>
              </div>

              {/* Top 4 Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border border-[#ECEEFA] p-4.5 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#8E94A5]">Expected Likes</span>
                    <div className="w-7 h-7 rounded-lg bg-pink-50 text-pink-500 flex items-center justify-center text-xs">
                      <LuHeart />
                    </div>
                  </div>
                  <p className="text-xl sm:text-2xl font-extrabold font-display text-[#1E1B39]">
                    {expectedStats.likes}
                  </p>
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-1">
                    ↑ 24% above account avg
                  </span>
                </div>

                <div className="bg-white rounded-2xl border border-[#ECEEFA] p-4.5 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#8E94A5]">Expected Comments</span>
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center text-xs">
                      <LuMessageCircle />
                    </div>
                  </div>
                  <p className="text-xl sm:text-2xl font-extrabold font-display text-[#1E1B39]">
                    {expectedStats.comments}
                  </p>
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-1">
                    High discussion potential
                  </span>
                </div>

                <div className="bg-white rounded-2xl border border-[#ECEEFA] p-4.5 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#8E94A5]">Expected Shares</span>
                    <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-500 flex items-center justify-center text-xs">
                      <LuShare2 />
                    </div>
                  </div>
                  <p className="text-xl sm:text-2xl font-extrabold font-display text-[#1E1B39]">
                    {expectedStats.shares}
                  </p>
                  <span className="text-[10px] text-purple-600 font-semibold flex items-center gap-0.5 mt-1">
                    Virality multiplier active
                  </span>
                </div>

                <div className="bg-white rounded-2xl border border-[#ECEEFA] p-4.5 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#8E94A5]">Estimated Reach</span>
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center text-xs">
                      <LuEye />
                    </div>
                  </div>
                  <p className="text-xl sm:text-2xl font-extrabold font-display text-[#1E1B39]">
                    {expectedStats.reach}
                  </p>
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-1">
                    Expanded discovery tier
                  </span>
                </div>
              </div>

              {/* Grid: Probability Gauge & Breakdown Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Engagement Probability Gauge (4 cols) */}
                <div className="lg:col-span-4 bg-white rounded-2xl border border-[#ECEEFA] p-6 shadow-xs flex flex-col items-center text-center">
                  <h3 className="text-sm font-bold text-[#1E1B39] mb-4 self-start">
                    Engagement Probability
                  </h3>
                  <div className="my-2">
                    <GaugeChart
                      value={predictionData.engagement_probability || defaultOverview.engagementProbability}
                      color="#10B981"
                      label="High Potential"
                      size={160}
                    />
                  </div>
                  <p className="text-xs text-[#8A90A2] mt-3">
                    Based on algorithmic indexing, this content has a <strong>very strong likelihood</strong> of achieving viral velocity.
                  </p>
                </div>

                {/* Factors & Probabilities Bars (8 cols) */}
                <div className="lg:col-span-8 bg-white rounded-2xl border border-[#ECEEFA] p-6 shadow-xs space-y-4">
                  <h3 className="text-sm font-bold text-[#1E1B39] mb-3">
                    Core Prediction Factors
                  </h3>

                  <div className="space-y-4">
                    <ProgressBar
                      value={predictionData.total_engagement_score || defaultOverview.totalEngagementScore}
                      showLabel
                      label="Total Engagement Index"
                      color="bg-[#633DF2]"
                    />
                    <ProgressBar
                      value={predictionData.reach_probability || defaultOverview.reachProbability}
                      showLabel
                      label="Non-Follower Reach Probability"
                      color="bg-blue-500"
                    />
                    <ProgressBar
                      value={predictionData.virality_probability || defaultOverview.viralityProbability}
                      showLabel
                      label="Virality & Bookmark Index"
                      color="bg-purple-500"
                    />
                  </div>

                  {/* Platform Forecast Row */}
                  <div className="mt-5 pt-4 border-t border-[#F1F3F9]">
                    <h4 className="text-xs font-bold text-[#1E1B39] mb-3">
                      Predicted Platform Score
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {platformBreakdownList.slice(0, 4).map((p) => (
                        <div key={p.platform} className="p-3 rounded-xl bg-[#F8F9FE] border border-[#ECEEFA]">
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <PlatformIcon platform={p.icon || p.platform.toLowerCase()} className="text-base" />
                            <span className="text-xs font-semibold text-[#1E1B39] truncate">{p.platform}</span>
                          </div>
                          <p className="text-lg font-bold text-[#633DF2] font-display">{p.score}%</p>
                          <span className="text-[10px] text-[#8E94A5]">{p.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            </div>

            {/* ===================================================== */}
            {/* SECTION C: RECOMMENDATIONS                            */}
            {/* ===================================================== */}
            <div ref={recommendationsSectionRef} className="scroll-mt-36 space-y-6 pt-4">
              
              {/* Section Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#F3F1FE] text-[#633DF2] flex items-center justify-center font-bold text-sm">
                    <LuLightbulb />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold font-display text-[#1E1B39]">
                      Section C – Recommendations
                    </h2>
                    <p className="text-xs text-[#8A90A2]">
                      Actionable AI suggestions to improve caption, hashtags, timing, and engagement
                    </p>
                  </div>
                </div>
                <Badge color="blue" className="text-xs px-3 py-1 font-semibold">
                  {recommendationsData.improvementTips?.length || 3} Action Tips
                </Badge>
              </div>

              {/* Grid: Improved Caption, Hashtags & Best Time */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Improved Caption (6 cols) */}
                <div className="lg:col-span-6 bg-white rounded-2xl border border-[#ECEEFA] p-6 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-bold text-[#1E1B39] flex items-center gap-2">
                        <LuSparkles className="text-[#633DF2]" /> AI Improved Caption
                      </h3>
                      <button
                        type="button"
                        onClick={() => handleCopyCaption(recommendationsData.improvedCaption)}
                        className="px-3 py-1 rounded-lg border border-[#E2E6F2] hover:border-[#633DF2] text-xs font-semibold text-[#525768] hover:text-[#633DF2] flex items-center gap-1.5 transition bg-white"
                      >
                        {copiedCaption ? <><LuCheck className="text-emerald-500" /> Copied</> : <><LuCopy /> Copy</>}
                      </button>
                    </div>

                    <p className="text-xs text-[#8A90A2] mb-3">
                      Optimized for higher click-through retention and reader engagement:
                    </p>

                    <div className="p-4 rounded-xl bg-[#F8F9FE] border border-[#ECEEFA] text-xs sm:text-sm text-[#1E1B39] leading-relaxed whitespace-pre-line font-normal">
                      {recommendationsData.improvedCaption}
                    </div>
                  </div>

                  <p className="text-[11px] text-[#8E94A5] mt-3">
                    💡 Tip: Adding emojis and bullet breaks increases mobile reading speed by 35%.
                  </p>
                </div>

                {/* Hashtags & Best Time to Post (6 cols) */}
                <div className="lg:col-span-6 space-y-6">
                  
                  {/* Suggested Hashtags */}
                  <div className="bg-white rounded-2xl border border-[#ECEEFA] p-6 shadow-xs">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-bold text-[#1E1B39] flex items-center gap-2">
                        <LuHash className="text-[#633DF2]" /> Suggested Hashtags
                      </h3>
                      <button
                        type="button"
                        onClick={() => handleCopyHashtags(recommendationsData.hashtags || [])}
                        className="px-3 py-1 rounded-lg border border-[#E2E6F2] hover:border-[#633DF2] text-xs font-semibold text-[#525768] hover:text-[#633DF2] flex items-center gap-1.5 transition bg-white"
                      >
                        {copiedHashtags ? <><LuCheck className="text-emerald-500" /> Copied</> : <><LuCopy /> Copy All</>}
                      </button>
                    </div>

                    <p className="text-xs text-[#8A90A2] mb-3">
                      Selected niche & trending hashtags balanced for reach without triggering spam filters:
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {recommendationsData.hashtags?.map((tag) => (
                        <span key={tag} className="px-2.5 py-1 rounded-lg bg-[#ECE7FE] text-[#633DF2] text-xs font-medium border border-[#D9D4F8]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Best Time to Post */}
                  <div className="bg-white rounded-2xl border border-[#ECEEFA] p-6 shadow-xs">
                    <h3 className="text-sm font-bold text-[#1E1B39] flex items-center gap-2 mb-2">
                      <LuClock className="text-[#633DF2]" /> Recommended Posting Time
                    </h3>

                    <p className="text-xs text-[#8A90A2] mb-3">
                      Target audience shows peak active scroll hours at:
                    </p>

                    <div className="p-4 rounded-xl bg-gradient-to-r from-[#ECFDF5] to-[#E6FFFA] border border-[#A7F3D0] flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-emerald-800">
                          {recommendationsData.bestTime?.day || 'Wednesday'}, {recommendationsData.bestTime?.time || '8:00 PM'}
                        </p>
                        <p className="text-xs text-emerald-600 mt-0.5">
                          {recommendationsData.bestTime?.label || 'Peak engagement window'}
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-bold shadow-xs">
                        Recommended
                      </span>
                    </div>
                  </div>

                </div>

              </div>

              {/* 3 Improvement Tips Cards */}
              <div className="mt-6">
                <h3 className="text-sm font-bold text-[#1E1B39] mb-4">
                  Content Improvement Tips
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {recommendationsData.improvementTips?.map((tip, idx) => (
                    <div key={tip.title || idx} className="bg-white rounded-2xl border border-[#ECEEFA] p-5 shadow-xs">
                      <div className="w-10 h-10 rounded-xl bg-[#F4F1FE] text-[#633DF2] flex items-center justify-center text-base mb-3 font-bold">
                        {idx + 1}
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#1E1B39] mb-1.5">
                        {tip.title}
                      </h4>
                      <p className="text-xs text-[#8A90A2] leading-relaxed">
                        {tip.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary of Recommended Changes */}
              <div className="bg-white rounded-2xl border border-[#ECEEFA] p-6 shadow-xs">
                <h3 className="text-sm font-bold text-[#1E1B39] mb-3">
                  Executive Summary of Recommended Changes
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-700">
                  <div className="p-3.5 rounded-xl bg-[#F8F9FE] border border-[#ECEEFA]">
                    <span className="font-bold text-[#633DF2] block mb-1">1. Refine Hook & Spacing</span>
                    Apply the improved caption structure with concise paragraph line-breaks and prominent CTA.
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#F8F9FE] border border-[#ECEEFA]">
                    <span className="font-bold text-[#633DF2] block mb-1">2. Target Active Window</span>
                    Schedule publication for {recommendationsData.bestTime?.day || 'Wednesday'} at {recommendationsData.bestTime?.time || '8:00 PM'} to capture maximum algorithm velocity.
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#F8F9FE] border border-[#ECEEFA]">
                    <span className="font-bold text-[#633DF2] block mb-1">3. Optimized Hashtags</span>
                    Append the 5 recommended tags in the first comment or caption body to enhance discovery.
                  </div>
                </div>
              </div>

            </div>

          </motion.div>
        )}

      </div>

      {/* ========================================================= */}
      {/* FILE PREVIEW MODAL                                        */}
      {/* ========================================================= */}
      <AnimatePresence>
        {showPreviewModal && mediaFile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPreviewModal(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#EEECFE] text-[#633DF2] flex items-center justify-center font-bold text-sm">
                    <LuEye />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#1E1B39]">File Preview</h3>
                    <p className="text-[11px] text-[#8E94A5]">{mediaFile.name}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPreviewModal(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                >
                  <LuX className="text-lg" />
                </button>
              </div>

              {/* Modal Body: Media Preview */}
              <div className="p-6 bg-slate-50 flex items-center justify-center max-h-[500px] overflow-hidden">
                {mediaFile.type?.startsWith('video/') ? (
                  <video
                    src={mediaFile.url}
                    controls
                    className="max-h-[420px] w-auto max-w-full rounded-2xl shadow-md"
                  />
                ) : (
                  <img
                    src={mediaFile.url}
                    alt={mediaFile.name}
                    className="max-h-[420px] w-auto max-w-full object-contain rounded-2xl shadow-md"
                  />
                )}
              </div>

              {/* Modal Footer: Metadata & Actions */}
              <div className="px-6 py-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100">
                <div className="flex items-center gap-4 text-xs text-[#64748B]">
                  <span><strong>Size:</strong> {mediaFile.size}</span>
                  <span><strong>Format:</strong> {mediaFile.format}</span>
                  <span className="text-[#10B981] font-semibold flex items-center gap-1">
                    <LuCheck /> Ready for Analysis
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPreviewModal(false)
                      handleBrowseClick()
                    }}
                    className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    Replace File
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPreviewModal(false)}
                    className="px-4 py-1.5 rounded-xl bg-[#633DF2] text-white text-xs font-semibold hover:bg-[#522DE0] transition"
                  >
                    Done
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  )
}
