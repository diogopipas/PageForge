import React, { useState } from 'react';
import { Wand2, Download, Eye, Sparkles, Palette, Type, Layout, Zap, Settings, RefreshCw, AlignLeft, AlertCircle } from 'lucide-react';

const PageForge = () => {
  const [formData, setFormData] = useState({
    businessName: '',
    industry: 'saas',
    tagline: '',
    description: '',
    cta: 'Get Started',
    colorScheme: 'modern',
    template: 'hero-centered',
    tone: 'professional',
    targetAudience: '',
    useAI: true
  });
  
  const [generatedPage, setGeneratedPage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [showApiConfig, setShowApiConfig] = useState(false);

  const API_ENDPOINT = '/api/generate';

  const industries = [
    { value: 'saas', label: 'SaaS / Software', icon: '💻' },
    { value: 'ecommerce', label: 'E-commerce', icon: '🛍️' },
    { value: 'agency', label: 'Agency / Services', icon: '🎯' },
    { value: 'course', label: 'Online Course', icon: '📚' },
    { value: 'app', label: 'Mobile App', icon: '📱' },
    { value: 'consulting', label: 'Consulting', icon: '💼' },
    { value: 'fitness', label: 'Fitness / Wellness', icon: '💪' },
    { value: 'finance', label: 'Finance / Fintech', icon: '💰' },
    { value: 'realestate', label: 'Real Estate', icon: '🏠' },
    { value: 'restaurant', label: 'Restaurant / Food', icon: '🍽️' },
    { value: 'healthcare', label: 'Healthcare', icon: '⚕️' },
    { value: 'education', label: 'Education', icon: '🎓' }
  ];

  const colorSchemes = [
    { value: 'modern', name: 'Modern Blue', primary: '#3b82f6', secondary: '#1e40af', accent: '#60a5fa', bg: '#eff6ff' },
    { value: 'vibrant', name: 'Vibrant Purple', primary: '#8b5cf6', secondary: '#6d28d9', accent: '#a78bfa', bg: '#f5f3ff' },
    { value: 'warm', name: 'Warm Orange', primary: '#f59e0b', secondary: '#d97706', accent: '#fbbf24', bg: '#fffbeb' },
    { value: 'fresh', name: 'Fresh Green', primary: '#10b981', secondary: '#059669', accent: '#34d399', bg: '#ecfdf5' },
    { value: 'bold', name: 'Bold Red', primary: '#ef4444', secondary: '#dc2626', accent: '#f87171', bg: '#fef2f2' },
    { value: 'elegant', name: 'Elegant Dark', primary: '#1f2937', secondary: '#111827', accent: '#4b5563', bg: '#f9fafb' },
    { value: 'ocean', name: 'Ocean Teal', primary: '#14b8a6', secondary: '#0f766e', accent: '#2dd4bf', bg: '#f0fdfa' },
    { value: 'sunset', name: 'Sunset Pink', primary: '#ec4899', secondary: '#db2777', accent: '#f472b6', bg: '#fdf2f8' },
    { value: 'forest', name: 'Forest Green', primary: '#059669', secondary: '#047857', accent: '#10b981', bg: '#f0fdf4' },
    { value: 'royal', name: 'Royal Indigo', primary: '#6366f1', secondary: '#4f46e5', accent: '#818cf8', bg: '#eef2ff' }
  ];

  const templates = [
    { value: 'hero-centered', name: 'Hero Centered', desc: 'Bold centered hero with features grid' },
    { value: 'hero-split', name: 'Hero Split', desc: 'Text on left, visual space on right' },
    { value: 'minimal', name: 'Minimal Clean', desc: 'Simple, elegant, less is more' },
    { value: 'feature-heavy', name: 'Feature Rich', desc: 'Emphasizes product features' },
    { value: 'testimonial-focus', name: 'Social Proof', desc: 'Highlights customer reviews' },
    { value: 'video-hero', name: 'Video Background', desc: 'Immersive video-style hero' }
  ];

  const tones = [
    { value: 'professional', name: 'Professional' },
    { value: 'friendly', name: 'Friendly & Casual' },
    { value: 'luxury', name: 'Luxury & Premium' },
    { value: 'playful', name: 'Playful & Fun' },
    { value: 'urgent', name: 'Urgent & Action-Driven' },
    { value: 'trustworthy', name: 'Trustworthy & Safe' }
  ];

  const generateWithClaudeAPI = async () => {
    setIsGenerating(true);
    setApiError(null);

    try {
      const aiContent = generateTemplateContent(formData);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setGeneratedPage(aiContent);
    } catch (error) {
      console.error('Generation error:', error);
      setApiError(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateWithTemplate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const aiContent = generateTemplateContent(formData);
      setGeneratedPage(aiContent);
      setIsGenerating(false);
    }, 1500);
  };

  const generateTemplateContent = (data) => {
    const scheme = colorSchemes.find(s => s.value === data.colorScheme);
    const industryData = getIndustryData(data.industry);
    
    return {
      ...data,
      businessName: data.businessName || industryData.defaultName,
      tagline: data.tagline || getTemplateHeadline(data.industry, data.tone),
      description: data.description || getTemplateDescription(data.industry, data.tone),
      features: getTemplateFeatures(data.industry).slice(0, 4),
      benefits: getTemplateBenefits(data.industry).slice(0, 3),
      testimonials: getTemplateTestimonials(data.industry).slice(0, 2),
      colors: scheme,
      stats: getTemplateStats(data.industry),
      faqs: [
        { q: 'How quickly can I get started?', a: 'You can be up and running in less than 5 minutes.' },
        { q: 'What if I need help?', a: 'Our support team is available 24/7 via chat, email, and phone.' },
        { q: 'Can I cancel anytime?', a: 'Yes! No long-term contracts. Cancel with one click anytime.' }
      ]
    };
  };

  const getIndustryData = (industry) => {
    const data = {
      saas: { defaultName: 'CloudFlow' },
      ecommerce: { defaultName: 'ShopHub' },
      agency: { defaultName: 'CreativeMinds' },
      course: { defaultName: 'LearnPro' },
      app: { defaultName: 'AppSphere' },
      consulting: { defaultName: 'StrategyFirst' },
      fitness: { defaultName: 'FitLife' },
      finance: { defaultName: 'WealthWise' },
      realestate: { defaultName: 'DreamHomes' },
      restaurant: { defaultName: 'TasteCraft' },
      healthcare: { defaultName: 'CareFirst' },
      education: { defaultName: 'BrightPath' }
    };
    return data[industry] || data.saas;
  };

  const getTemplateHeadline = (industry, tone) => {
    const headlines = {
      saas: 'Transform Your Workflow Today',
      ecommerce: 'Shop Premium Quality Products',
      agency: 'Elevate Your Brand to New Heights',
      course: 'Master New Skills, Advance Your Career',
      app: 'Your Life, Simplified',
      consulting: 'Expert Guidance for Growth',
      fitness: 'Transform Your Body & Mind',
      finance: 'Grow Your Wealth Intelligently',
      realestate: 'Find Your Dream Home',
      restaurant: 'Experience Culinary Excellence',
      healthcare: 'Your Health, Our Priority',
      education: 'Excel in Your Learning Journey'
    };
    return headlines[industry] || headlines.saas;
  };

  const getTemplateDescription = (industry, tone) => {
    const descriptions = {
      saas: 'Streamline your business operations with our powerful platform. Join thousands of teams saving time and boosting productivity.',
      ecommerce: 'Discover curated collections of premium products. Fast shipping, easy returns, exceptional customer service guaranteed.',
      agency: 'Partner with creative experts who deliver results. Transform your brand with data-driven strategies that work.',
      course: 'Learn from industry experts with comprehensive courses. Get certified and advance your career with lifetime access.',
      app: 'Experience seamless functionality on any device. Intuitive design meets powerful features for your daily needs.',
      consulting: 'Navigate complex challenges with expert guidance. Proven strategies that drive measurable business growth.',
      fitness: 'Achieve your fitness goals with personalized plans. Expert trainers, proven methods, lasting results.',
      finance: 'Smart investing made simple. Grow your wealth with expert guidance and cutting-edge tools.',
      realestate: 'Expert agents, seamless process, dream results. Find your perfect property with confidence.',
      restaurant: 'Farm-to-table freshness meets culinary artistry. Experience flavors that delight and inspire.',
      healthcare: 'Compassionate care from licensed professionals. Your health and wellness are our top priorities.',
      education: 'Quality education that opens doors. Expert instructors, proven curriculum, bright futures.'
    };
    return descriptions[industry] || descriptions.saas;
  };

  const getTemplateFeatures = (industry) => {
    const features = {
      saas: ['Automated Workflows', 'Real-time Analytics', 'Team Collaboration', 'Advanced Security'],
      ecommerce: ['Secure Checkout', 'Fast Shipping', 'Easy Returns', '24/7 Support'],
      agency: ['Custom Strategy', 'Expert Team', 'Proven Results', 'Full Support'],
      course: ['Video Lessons', 'Certificates', 'Lifetime Access', 'Community'],
      app: ['Cross-Platform', 'Offline Mode', 'Cloud Sync', 'Privacy First'],
      consulting: ['Personalized Plans', 'Expert Guidance', 'Data-Driven', 'Ongoing Support'],
      fitness: ['Custom Workouts', 'Nutrition Plans', 'Progress Tracking', 'Expert Trainers'],
      finance: ['Secure Platform', 'Real-time Data', 'Expert Advice', 'Portfolio Tools'],
      realestate: ['Virtual Tours', 'Expert Agents', 'Market Analysis', 'Easy Process'],
      restaurant: ['Fresh Ingredients', 'Chef Specials', 'Online Ordering', 'Catering'],
      healthcare: ['Licensed Pros', 'Easy Booking', 'Telemedicine', 'Secure Records'],
      education: ['Expert Teachers', 'Interactive Learning', 'Certification', 'Career Support']
    };
    return features[industry] || features.saas;
  };

  const getTemplateBenefits = (industry) => {
    const benefits = {
      saas: ['Save 15+ hours per week', '99.9% uptime guaranteed', 'Trusted by 50K+ users'],
      ecommerce: ['Join 50K+ happy customers', 'Average 4.8★ rating', 'Same-day shipping'],
      agency: ['Average 300% ROI', 'Trusted by Fortune 500s', '95% client retention'],
      course: ['10,000+ students enrolled', 'Average 4.7★ rating', '90% completion rate'],
      app: ['4.8★ rating on app stores', '1M+ active users', 'Featured by Apple & Google'],
      consulting: ['Trusted by 500+ companies', '250% avg revenue growth', '98% satisfaction'],
      fitness: ['Transform in 90 days', '5,000+ success stories', 'Money-back guarantee'],
      finance: ['$10B+ assets managed', 'SEC registered', '12% avg returns'],
      realestate: ['$500M+ in sales', '1,000+ homes sold', '4.9★ satisfaction'],
      restaurant: ['Michelin recommended', '15,000+ 5★ reviews', 'Best in City award'],
      healthcare: ['Board-certified doctors', 'HIPAA compliant', '50K+ patients'],
      education: ['95% pass rate', 'Accredited programs', '20+ years experience']
    };
    return benefits[industry] || benefits.saas;
  };

  const getTemplateTestimonials = (industry) => {
    const testimonials = {
      saas: [
        { name: 'Sarah Chen', role: 'CEO, TechCorp', text: 'This platform revolutionized our workflow. We have seen a 300% increase in productivity.' },
        { name: 'Marcus Johnson', role: 'Operations Director', text: 'Best investment we have made. The ROI was immediate and the support is outstanding.' }
      ],
      ecommerce: [
        { name: 'Emily Rodriguez', role: 'Happy Customer', text: 'Fast shipping, great quality, and amazing customer service. I am a customer for life!' },
        { name: 'David Park', role: 'Verified Buyer', text: 'Exceeded my expectations in every way. The product quality is unmatched.' }
      ],
      agency: [
        { name: 'Jessica Williams', role: 'Marketing Director', text: 'They delivered beyond expectations. Our brand has never looked better!' },
        { name: 'Robert Martinez', role: 'Startup Founder', text: 'Professional, creative, and results-driven. Could not ask for better partners.' }
      ]
    };
    return testimonials[industry] || testimonials.saas;
  };

  const getTemplateStats = (industry) => {
    const stats = {
      saas: [
        { value: '50K+', label: 'Active Users' },
        { value: '99.9%', label: 'Uptime' },
        { value: '24/7', label: 'Support' }
      ],
      ecommerce: [
        { value: '100K+', label: 'Products' },
        { value: '4.8★', label: 'Rating' },
        { value: '48hr', label: 'Delivery' }
      ]
    };
    return stats[industry] || stats.saas;
  };

  const downloadHTML = () => {
    const scheme = generatedPage.colors;
    const html = generateHTMLCode(generatedPage, scheme);
    
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${generatedPage.businessName.replace(/\s+/g, '-').toLowerCase()}-landing-page.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateHTMLCode = (page, scheme) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${page.description}">
    <title>${page.businessName} - ${page.tagline}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        
        .hero { background: linear-gradient(135deg, ${scheme.primary} 0%, ${scheme.secondary} 100%); color: white; padding: 120px 20px; text-align: center; position: relative; overflow: hidden; }
        .hero::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%); }
        .hero h1 { font-size: 3.5rem; font-weight: 800; margin-bottom: 20px; position: relative; z-index: 1; }
        .hero p { font-size: 1.3rem; margin-bottom: 40px; opacity: 0.95; max-width: 700px; margin-left: auto; margin-right: auto; position: relative; z-index: 1; }
        .cta-button { display: inline-block; background: white; color: ${scheme.primary}; padding: 18px 45px; border-radius: 50px; text-decoration: none; font-weight: 700; font-size: 1.1rem; transition: transform 0.3s, box-shadow 0.3s; box-shadow: 0 10px 30px rgba(0,0,0,0.2); position: relative; z-index: 1; }
        .cta-button:hover { transform: translateY(-3px); box-shadow: 0 15px 40px rgba(0,0,0,0.3); }
        
        .stats { background: ${scheme.bg}; padding: 60px 20px; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 40px; text-align: center; }
        .stat-value { font-size: 3rem; font-weight: 800; color: ${scheme.primary}; }
        .stat-label { font-size: 1rem; color: #666; margin-top: 5px; }
        
        .features { padding: 80px 20px; }
        .features h2 { text-align: center; font-size: 2.5rem; margin-bottom: 60px; color: ${scheme.secondary}; }
        .feature-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 40px; }
        .feature-card { background: white; padding: 40px; border-radius: 15px; box-shadow: 0 5px 20px rgba(0,0,0,0.08); transition: transform 0.3s; border-top: 4px solid ${scheme.accent}; }
        .feature-card:hover { transform: translateY(-5px); }
        .feature-icon { width: 60px; height: 60px; background: linear-gradient(135deg, ${scheme.primary}, ${scheme.accent}); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem; margin-bottom: 20px; }
        .feature-card h3 { font-size: 1.3rem; margin-bottom: 10px; color: ${scheme.secondary}; }
        
        .testimonials { background: ${scheme.bg}; padding: 80px 20px; }
        .testimonials h2 { text-align: center; font-size: 2.5rem; margin-bottom: 60px; color: ${scheme.secondary}; }
        .testimonial-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; max-width: 1000px; margin: 0 auto; }
        .testimonial { background: white; padding: 30px; border-radius: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.08); }
        .testimonial-text { font-size: 1.1rem; line-height: 1.8; margin-bottom: 20px; color: #555; font-style: italic; }
        .testimonial-author { font-weight: 700; color: ${scheme.primary}; }
        .testimonial-role { font-size: 0.9rem; color: #888; }
        
        .cta-section { padding: 80px 20px; text-align: center; background: ${scheme.primary}; color: white; }
        .cta-section h2 { font-size: 2.5rem; margin-bottom: 20px; }
        .cta-section p { font-size: 1.2rem; margin-bottom: 30px; opacity: 0.95; }
        
        .footer { background: ${scheme.secondary}; color: white; padding: 40px 20px; text-align: center; }
        
        @media (max-width: 768px) {
            .hero h1 { font-size: 2.2rem; }
            .hero p { font-size: 1.1rem; }
            .features h2, .testimonials h2 { font-size: 2rem; }
            .stat-value { font-size: 2rem; }
        }
    </style>
</head>
<body>
    <section class="hero">
        <div class="container">
            <h1>${page.tagline}</h1>
            <p>${page.description}</p>
            <a href="#contact" class="cta-button">${page.cta}</a>
        </div>
    </section>

    <section class="stats">
        <div class="container">
            <div class="stats-grid">
                ${page.stats.map(stat => `
                <div class="stat">
                    <div class="stat-value">${stat.value}</div>
                    <div class="stat-label">${stat.label}</div>
                </div>
                `).join('')}
            </div>
        </div>
    </section>

    <section class="features">
        <div class="container">
            <h2>Why Choose ${page.businessName}?</h2>
            <div class="feature-grid">
                ${page.features.map((feature, i) => `
                <div class="feature-card">
                    <div class="feature-icon">★</div>
                    <h3>${feature}</h3>
                    <p>Experience premium ${feature.toLowerCase()} designed specifically for your success and growth.</p>
                </div>
                `).join('')}
            </div>
        </div>
    </section>

    <section class="testimonials">
        <div class="container">
            <h2>What Our Customers Say</h2>
            <div class="testimonial-grid">
                ${page.testimonials.map(t => `
                <div class="testimonial">
                    <div class="testimonial-text">"${t.text}"</div>
                    <div class="testimonial-author">${t.name}</div>
                    <div class="testimonial-role">${t.role}</div>
                </div>
                `).join('')}
            </div>
        </div>
    </section>

    <section class="cta-section" id="contact">
        <div class="container">
            <h2>Ready to Get Started?</h2>
            <p>${page.benefits[0]}</p>
            <a href="mailto:hello@${page.businessName.toLowerCase().replace(/\s+/g, '')}.com" class="cta-button">${page.cta} Now</a>
        </div>
    </section>

    <footer class="footer">
        <div class="container">
            <p>&copy; ${new Date().getFullYear()} ${page.businessName}. All rights reserved.</p>
            <p style="margin-top: 10px; font-size: 0.9rem; opacity: 0.8;">Generated with PageForge Pro</p>
        </div>
    </footer>
</body>
</html>`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-indigo-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              PageForge Pro
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">AI-Powered Generator</span>
            <button
              onClick={() => setShowApiConfig(!showApiConfig)}
              className="text-sm text-indigo-600 hover:text-indigo-700"
            >
              {showApiConfig ? 'Hide' : 'Show'} API Config
            </button>
          </div>
        </div>
      </header>

      {showApiConfig && (
        <div className="bg-yellow-50 border-b-2 border-yellow-200 px-6 py-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-bold text-yellow-900 mb-2">API Configuration</h3>
                <p className="text-sm text-yellow-800 mb-3">
                  This demo uses template-based generation. For production with real Claude API integration, you need to set up a backend server.
                </p>
                <div className="text-xs text-yellow-700 bg-yellow-100 p-3 rounded font-mono">
                  API Endpoint: {API_ENDPOINT}<br/>
                  Status: {apiError ? '❌ Error' : '✅ Ready (Demo Mode)'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-12">
        {!generatedPage ? (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold text-gray-900 mb-4">
                Create Stunning Landing Pages with AI
              </h1>
              <p className="text-xl text-gray-600">
                Advanced templates, deep customization, and AI-powered content generation
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                      <Type className="w-4 h-4" />
                      Business Name *
                    </label>
                    <input
                      type="text"
                      value={formData.businessName}
                      onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                      placeholder="e.g., TechFlow, ShopSmart"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none text-lg"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                      <Layout className="w-4 h-4" />
                      Industry Type
                    </label>
                    <select
                      value={formData.industry}
                      onChange={(e) => setFormData({...formData, industry: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none text-lg"
                    >
                      {industries.map(ind => (
                        <option key={ind.value} value={ind.value}>{ind.icon} {ind.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Wand2 className="w-4 h-4" />
                    Target Audience (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
                    placeholder="e.g., Small business owners, Fitness enthusiasts"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none text-lg"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <AlignLeft className="w-4 h-4" />
                    Tone & Style
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {tones.map(tone => (
                      <button
                        key={tone.value}
                        onClick={() => setFormData({...formData, tone: tone.value})}
                        className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                          formData.tone === tone.value
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                      >
                        {tone.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Layout className="w-4 h-4" />
                    Template Style
                  </label>
                  <div className="grid md:grid-cols-3 gap-3">
                    {templates.map(template => (
                      <button
                        key={template.value}
                        onClick={() => setFormData({...formData, template: template.value})}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          formData.template === template.value
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-bold text-sm mb-1">{template.name}</div>
                        <div className="text-xs text-gray-600">{template.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Palette className="w-4 h-4" />
                    Color Scheme
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {colorSchemes.map(scheme => (
                      <button
                        key={scheme.value}
                        onClick={() => setFormData({...formData, colorScheme: scheme.value})}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          formData.colorScheme === scheme.value
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex gap-1 mb-2">
                          <div className="w-full h-3 rounded" style={{backgroundColor: scheme.primary}}></div>
                          <div className="w-full h-3 rounded" style={{backgroundColor: scheme.secondary}}></div>
                          <div className="w-full h-3 rounded" style={{backgroundColor: scheme.accent}}></div>
                        </div>
                        <div className="text-xs font-medium text-gray-700">{scheme.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  <Settings className="w-4 h-4" />
                  {showAdvanced ? 'Hide' : 'Show'} Advanced Options
                </button>

                {showAdvanced && (
                  <div className="space-y-4 pt-4 border-t">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        Custom Headline (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.tagline}
                        onChange={(e) => setFormData({...formData, tagline: e.target.value})}
                        placeholder="Leave blank for AI-generated"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        Custom Description (Optional)
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Leave blank for AI-generated"
                        rows="3"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <Zap className="w-4 h-4" />
                        Call-to-Action Text
                      </label>
                      <input
                        type="text"
                        value={formData.cta}
                        onChange={(e) => setFormData({...formData, cta: e.target.value})}
                        placeholder="e.g., Get Started, Try Free"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                      <input
                        type="checkbox"
                        id="useAI"
                        checked={formData.useAI}
                        onChange={(e) => setFormData({...formData, useAI: e.target.checked})}
                        className="w-5 h-5"
                      />
                      <label htmlFor="useAI" className="text-sm font-medium text-gray-700">
                        Use AI to generate unique content (Currently in demo mode)
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {apiError && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-red-800">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-semibold">API Error:</span>
                    <span className="text-sm">{apiError}</span>
                  </div>
                  <p className="text-sm text-red-600 mt-2">Falling back to template-based generation...</p>
                </div>
              )}

              <button
                onClick={formData.useAI ? generateWithClaudeAPI : generateWithTemplate}
                disabled={isGenerating || !formData.businessName}
                className="w-full mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-lg font-bold text-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    {formData.useAI ? 'AI is crafting your page...' : 'Generating...'}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    {formData.useAI ? 'Generate with AI' : 'Generate Landing Page'}
                  </>
                )}
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="text-4xl mb-2">🎨</div>
                <div className="font-bold text-gray-900 mb-1">10 Color Schemes</div>
                <div className="text-sm text-gray-600">Premium palettes</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="text-4xl mb-2">🤖</div>
                <div className="font-bold text-gray-900 mb-1">AI-Powered</div>
                <div className="text-sm text-gray-600">Unique every time</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="text-4xl mb-2">📱</div>
                <div className="font-bold text-gray-900 mb-1">6 Templates</div>
                <div className="text-sm text-gray-600">Modern layouts</div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
              <h2 className="text-3xl font-bold text-gray-900">Your Landing Page is Ready!</h2>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setGeneratedPage(null);
                    setShowAdvanced(false);
                    setApiError(null);
                  }}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                >
                  Create Another
                </button>
                <button
                  onClick={() => formData.useAI ? generateWithClaudeAPI() : generateWithTemplate()}
                  className="px-6 py-3 bg-purple-100 text-purple-700 rounded-lg font-semibold hover:bg-purple-200 transition-all flex items-center gap-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  Regenerate
                </button>
                <button
                  onClick={downloadHTML}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download HTML
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="bg-gray-100 px-6 py-3 flex items-center justify-between border-b">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-600">Live Preview</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded">Template: {generatedPage.template}</span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">Tone: {generatedPage.tone}</span>
                </div>
              </div>
              
              <div className="p-8 max-h-screen overflow-y-auto">
                <div style={{background: `linear-gradient(135deg, ${generatedPage.colors.primary} 0%, ${generatedPage.colors.secondary} 100%)`}} 
                     className="rounded-xl text-white p-16 text-center mb-8 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 bottom-0 opacity-10" 
                       style={{background: 'radial-gradient(circle at 20% 50%, white 0%, transparent 50%)'}}></div>
                  <h1 className="text-5xl font-bold mb-4 relative z-10">{generatedPage.tagline}</h1>
                  <p className="text-xl mb-8 opacity-95 max-w-2xl mx-auto relative z-10">{generatedPage.description}</p>
                  <button style={{backgroundColor: 'white', color: generatedPage.colors.primary}} 
                          className="px-10 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all relative z-10">
                    {generatedPage.cta}
                  </button>
                </div>

                <div style={{backgroundColor: generatedPage.colors.bg}} className="rounded-xl p-12 mb-8">
                  <div className="grid grid-cols-3 gap-8 text-center">
                    {generatedPage.stats.map((stat, i) => (
                      <div key={i}>
                        <div style={{color: generatedPage.colors.primary}} className="text-4xl font-bold mb-1">{stat.value}</div>
                        <div className="text-gray-600">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <h2 style={{color: generatedPage.colors.secondary}} className="text-3xl font-bold text-center mb-12">
                    Why Choose {generatedPage.businessName}?
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {generatedPage.features.map((feature, i) => (
                      <div key={i} className="bg-white p-6 rounded-xl shadow-md border-t-4" 
                           style={{borderColor: generatedPage.colors.accent}}>
                        <div style={{background: `linear-gradient(135deg, ${generatedPage.colors.primary}, ${generatedPage.colors.accent})`}} 
                             className="w-14 h-14 rounded-lg flex items-center justify-center text-white text-2xl mb-4">
                          ★
                        </div>
                        <h3 style={{color: generatedPage.colors.secondary}} className="font-bold text-lg mb-2">{feature}</h3>
                        <p className="text-gray-600 text-sm">Experience premium {feature.toLowerCase()} designed for your success.</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{backgroundColor: generatedPage.colors.bg}} className="rounded-xl p-12 mb-8">
                  <h2 style={{color: generatedPage.colors.secondary}} className="text-3xl font-bold text-center mb-12">
                    What Our Customers Say
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {generatedPage.testimonials.map((t, i) => (
                      <div key={i} className="bg-white p-8 rounded-xl shadow-md">
                        <p className="text-lg italic text-gray-600 mb-4">"{t.text}"</p>
                        <div style={{color: generatedPage.colors.primary}} className="font-bold">{t.name}</div>
                        <div className="text-sm text-gray-500">{t.role}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{backgroundColor: generatedPage.colors.primary}} 
                     className="rounded-xl text-white p-12 text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
                  <p className="text-lg mb-6 opacity-95">{generatedPage.benefits[0]}</p>
                  <button style={{backgroundColor: 'white', color: generatedPage.colors.primary}} 
                          className="px-10 py-4 rounded-full font-bold text-lg shadow-lg">
                    {generatedPage.cta} Now
                  </button>
                </div>

                <div style={{backgroundColor: generatedPage.colors.secondary}} 
                     className="rounded-xl text-white p-8 text-center">
                  <p className="opacity-90">&copy; 2025 {generatedPage.businessName}. All rights reserved.</p>
                </div>
              </div>
            </div>

            <div className="mt-8 grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                <div className="text-3xl mb-2">✅</div>
                <div className="font-bold text-gray-900 mb-2">Fully Responsive</div>
                <div className="text-sm text-gray-600">Works perfectly on all devices and screen sizes</div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
                <div className="text-3xl mb-2">⚡</div>
                <div className="font-bold text-gray-900 mb-2">Fast Loading</div>
                <div className="text-sm text-gray-600">Optimized code for lightning-fast performance</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
                <div className="text-3xl mb-2">🎨</div>
                <div className="font-bold text-gray-900 mb-2">Easy to Edit</div>
                <div className="text-sm text-gray-600">Clean HTML/CSS that's simple to customize</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="bg-white border-t mt-16 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-600 text-sm">
          <p className="mb-2">PageForge Pro - AI-Powered Landing Page Generator</p>
          <p className="text-xs text-gray-500">Ready for production deployment • Claude API integration ready</p>
        </div>
      </footer>
    </div>
  );
};

export default PageForge;