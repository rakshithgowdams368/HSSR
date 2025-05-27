"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { 
  LayoutGrid, 
  Image as ImageIcon, 
  Video as VideoIcon, 
  Code as CodeIcon, 
  Headphones, 
  MessageSquare, 
  ArrowRight, 
  Check,
  Sparkles,
  Zap,
  Shield,
  Award,
  Users,
  Star,
  ChevronRight,
  Menu,
  X,
  CheckCircle
} from "lucide-react";

const LandingPage = () => {
  const { user, isLoaded } = useUser();
  const [mounted, setMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Auto-rotate testimonials
    const interval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % 3);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  // Function to handle sign in click
  const handleSignInClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate loading for 5 seconds
    setTimeout(() => {
      setIsLoading(false);
      setShowWelcome(true);
    }, 5000);
  };

  // Function to handle welcome popup close
  const handleWelcomeClose = () => {
    setShowWelcome(false);
    if (typeof window !== 'undefined') {
      window.location.href = '/dashboard';
    }
  };

  const features = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "AI-Powered Creation",
      description: "State-of-the-art AI models for superior quality outputs"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Generate content in seconds, not hours"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Private",
      description: "Your data is encrypted and never shared"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Premium Quality",
      description: "Professional-grade outputs every time"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Creative Director",
      company: "Design Studio",
      image: "/avatars/avatar-1.jpg",
      content: "NexusAI has revolutionized our creative workflow. What used to take days now takes minutes."
    },
    {
      name: "Michael Chen",
      role: "Software Engineer",
      company: "Tech Corp",
      image: "/avatars/avatar-2.jpg",
      content: "The code generation capabilities are incredible. It's like having a senior developer on demand."
    },
    {
      name: "Emily Rodriguez",
      role: "Content Creator",
      company: "Media House",
      image: "/avatars/avatar-3.jpg",
      content: "From images to videos, the quality is consistently amazing. This tool is a game-changer."
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "$9",
      period: "/month",
      description: "Perfect for individuals",
      features: [
        "5 generations per day",
        "Standard quality",
        "Basic editing tools",
        "Email support",
        "1 user account"
      ],
      cta: "Start Free Trial",
      highlighted: false
    },
    {
      name: "Professional",
      price: "$29",
      period: "/month",
      description: "Best for professionals",
      features: [
        "50 generations per day",
        "High quality outputs",
        "Advanced editing suite",
        "Priority support",
        "API access",
        "3 user accounts"
      ],
      cta: "Start Free Trial",
      highlighted: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large organizations",
      features: [
        "Unlimited generations",
        "Maximum quality",
        "Custom AI training",
        "24/7 dedicated support",
        "Advanced API access",
        "Unlimited users"
      ],
      cta: "Contact Sales",
      highlighted: false
    }
  ];

  const categories = [
    { id: "all", name: "All", icon: <LayoutGrid className="w-5 h-5" /> },
    { id: "image", name: "Image", icon: <ImageIcon className="w-5 h-5" /> },
    { id: "video", name: "Video", icon: <VideoIcon className="w-5 h-5" /> },
    { id: "code", name: "Code", icon: <CodeIcon className="w-5 h-5" /> },
    { id: "audio", name: "Audio", icon: <Headphones className="w-5 h-5" /> },
    { id: "chat", name: "Chat", icon: <MessageSquare className="w-5 h-5" /> }
  ];

  // New AI showcase content with unique tiles and descriptions
  const showcaseItems = [
    {
      category: ["all", "image"],
      title: "Photorealistic Landscapes",
      description: "Generate stunning natural scenes with our advanced image models",
      emoji: "🏞️"
    },
    {
      category: ["all", "image"],
      title: "Product Visualizations",
      description: "Create professional product mockups and concept designs instantly",
      emoji: "📱"
    },
    {
      category: ["all", "video"],
      title: "Animated Explainers",
      description: "Turn complex topics into engaging animated videos",
      emoji: "🎬"
    },
    {
      category: ["all", "code"],
      title: "Full-Stack Web Apps",
      description: "Generate production-ready code for web applications",
      emoji: "💻"
    },
    {
      category: ["all", "audio"],
      title: "Voice Synthesis",
      description: "Create natural-sounding voiceovers and audio content",
      emoji: "🎙️"
    },
    {
      category: ["all", "chat"],
      title: "Customer Support AI",
      description: "Build intelligent chatbots trained on your business data",
      emoji: "🤖"
    }
  ];
  
  const filteredShowcase = selectedCategory === "all" 
    ? showcaseItems 
    : showcaseItems.filter(item => item.category.includes(selectedCategory));

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Loading Animation */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/90 z-50 opacity-0 animate-[fadeIn_0.3s_ease-out_forwards]">
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-4 border-violet-500/30 border-t-violet-500 animate-spin"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Sparkles className="w-8 h-8 text-violet-400 animate-pulse" />
            </div>
          </div>
        </div>
      )}

      {/* Welcome Popup with Micro-Interactions */}
      {showWelcome && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50 opacity-0 animate-[fadeIn_0.3s_ease-out_forwards]">
          <div className="bg-gradient-to-br from-violet-900 to-fuchsia-900 p-8 rounded-xl max-w-md w-full mx-4 relative overflow-hidden opacity-0 animate-[scaleIn_0.7s_ease-out_forwards] transform scale-75">
            {/* Confetti animation */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-3 h-3 rounded-full animate-[confetti_1.5s_ease-out_infinite]"
                  style={{
                    backgroundColor: `hsl(${Math.floor(Math.random() * 360)}, 100%, 70%)`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 0.5}s`
                  }}
                />
              ))}
            </div>

            <div className="text-center relative z-10">
              <div className="mb-6 mx-auto w-16 h-16 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center opacity-0 animate-[rotateScale_0.8s_ease-out_0.2s_forwards]">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>

              <h2 className="text-2xl font-bold mb-2 text-white opacity-0 animate-[slideUp_0.6s_ease-out_0.3s_forwards]">
                Congratulations!
              </h2>

              <p className="text-lg mb-4 text-violet-100 opacity-0 animate-[slideUp_0.6s_ease-out_0.4s_forwards]">
                You are now part of my family
              </p>

              <div className="text-xl font-semibold mb-6 bg-gradient-to-r from-violet-200 to-fuchsia-200 text-transparent bg-clip-text opacity-0 animate-[slideUp_0.6s_ease-out_0.5s_forwards]">
                Welcome, {user?.firstName || "User"}!
              </div>

              <div className="opacity-0 animate-[slideUp_0.6s_ease-out_0.6s_forwards]">
                <Button 
                  onClick={handleWelcomeClose}
                  className="bg-white text-violet-900 hover:bg-violet-100 transition-all duration-300 font-semibold px-6 py-3 text-lg"
                >
                  Click here
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="fixed w-full bg-black/80 backdrop-blur-lg z-40 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl">NexusAI</span>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-8">
                <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
                <a href="#showcase" className="text-gray-300 hover:text-white transition-colors">Showcase</a>
                <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
                <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">Testimonials</a>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              <Button 
                variant="ghost" 
                className="text-gray-300 hover:text-white"
                onClick={handleSignInClick}
              >
                Sign In
              </Button>
              <Button className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:opacity-90"
                onClick={handleSignInClick}>
                Get Started
              </Button>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-300 hover:text-white"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-lg transition-all duration-300">
            <div className="px-4 pt-2 pb-3 space-y-1">
              <a href="#features" className="block px-3 py-2 text-gray-300 hover:text-white">Features</a>
              <a href="#showcase" className="block px-3 py-2 text-gray-300 hover:text-white">Showcase</a>
              <a href="#pricing" className="block px-3 py-2 text-gray-300 hover:text-white">Pricing</a>
              <a href="#testimonials" className="block px-3 py-2 text-gray-300 hover:text-white">Testimonials</a>
              <div className="pt-4 space-y-2">
                <Button 
                  variant="ghost" 
                  className="w-full text-gray-300 hover:text-white"
                  onClick={handleSignInClick}
                >
                  Sign In
                </Button>
                <Link href="/sign-up" className="block">
                  <Button className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 via-transparent to-fuchsia-500/20 blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight opacity-0 animate-[slideUp_0.8s_ease-out_forwards]">
              Create Anything with
              <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 text-transparent bg-clip-text"> AI</span>
            </h1>
            
            <p className="mt-6 text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto opacity-0 animate-[slideUp_0.8s_ease-out_0.1s_forwards]">
              One platform for generating images, videos, code, audio, and conversations. 
              Powered by state-of-the-art AI models.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center opacity-0 animate-[slideUp_0.8s_ease-out_0.2s_forwards]">
              <Link href="/dashboard">
                <Button size="lg" className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:opacity-90">
                  Start Creating for Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
            
            <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-gray-400 opacity-0 animate-[fadeIn_0.8s_ease-out_0.3s_forwards]">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                5 free generations daily
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Cancel anytime
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose NexusAI?
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Experience the future of AI-powered content creation with our comprehensive suite of tools.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-violet-500/50 transition-all opacity-0 animate-[slideUp_0.6s_ease-out_forwards]"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 bg-violet-500/10 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section id="showcase" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Create Amazing Content
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              See what you can create with our AI-powered tools.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  selectedCategory === category.id
                    ? 'bg-violet-500 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {category.icon}
                <span>{category.name}</span>
              </button>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredShowcase.map((item, index) => (
              <div 
                key={index} 
                className="bg-gray-800 rounded-xl overflow-hidden group cursor-pointer hover:scale-105 transition-transform"
              >
                <div className="aspect-video bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center">
                  <div className="text-6xl">{item.emoji}</div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Loved by Creators Worldwide
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Join thousands of satisfied users who are creating amazing content with NexusAI.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="bg-gray-800 p-8 rounded-xl transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-violet-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {testimonials[activeTestimonial].name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">{testimonials[activeTestimonial].name}</h4>
                    <p className="text-gray-400">{testimonials[activeTestimonial].role} at {testimonials[activeTestimonial].company}</p>
                  </div>
                </div>
                <blockquote className="text-xl text-gray-300 mb-6">
                  &quot;{testimonials[activeTestimonial].content}&quot;
                </blockquote>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
              </div>
              
              <div className="flex justify-center gap-2 mt-6">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === activeTestimonial ? 'bg-violet-500 w-8' : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Choose the perfect plan for your needs. Always flexible to scale.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-gray-800 rounded-2xl p-8 ${
                  plan.highlighted ? 'ring-2 ring-violet-500' : ''
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-violet-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-gray-400 mb-4">{plan.description}</p>
                  <div className="flex items-baseline">
                    <span className="text-5xl font-bold">{plan.price}</span>
                    <span className="text-gray-400 ml-2">{plan.period}</span>
                  </div>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link href={plan.highlighted ? "/dashboard" : plan.cta === "Contact Sales" ? "/talk-to-sales" : "/dashboard"}>
                  <Button 
                    className={`w-full ${
                      plan.highlighted 
                        ? 'bg-violet-500 hover:bg-violet-600' 
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-violet-600 to-fuchsia-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Creative Process?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Join over 50,000 creators who are already using NexusAI to bring their ideas to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="bg-white text-violet-600 hover:bg-white/90">
                Get Started for Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/talk-to-sales">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Talk to Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl">NexusAI</span>
              </Link>
              <p className="text-gray-400 mb-4">
                Empowering creativity with artificial intelligence.
              </p>
              <div className="flex space-x-4">
                {/* Social links */}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="https://nexusai.dev/api" className="hover:text-white transition-colors">API</a></li>
                <li><a href="https://docs.nexusai.dev" className="hover:text-white transition-colors">Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="https://nexusai.dev/about" className="hover:text-white transition-colors">About</a></li>
                <li><a href="https://nexusai.dev/blog" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="https://nexusai.dev/careers" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="https://nexusai.dev/contact" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="https://nexusai.dev/privacy" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="https://nexusai.dev/terms" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="https://nexusai.dev/security" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="https://nexusai.dev/cookies" className="hover:text-white transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 NexusAI. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Custom CSS animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes scaleIn {
          from { 
            opacity: 0; 
            transform: scale(0.8); 
          }
          to { 
            opacity: 1; 
            transform: scale(1); 
          }
        }
        
        @keyframes rotateScale {
          from { 
            opacity: 0; 
            transform: rotate(-180deg) scale(0); 
          }
          to { 
            opacity: 1; 
            transform: rotate(0deg) scale(1); 
          }
        }
        
        @keyframes confetti {
          0% { 
            opacity: 1; 
            transform: translateY(0) scale(0); 
          }
          50% { 
            opacity: 1; 
            transform: translateY(-50px) scale(1); 
          }
          100% { 
            opacity: 0; 
            transform: translateY(-100px) scale(1); 
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
