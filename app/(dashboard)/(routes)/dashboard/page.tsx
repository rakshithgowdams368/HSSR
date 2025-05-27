// app/(dashboard)/(routes)/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
  ArrowRight,
  Code,
  ImageIcon,
  MessageSquare,
  Music,
  VideoIcon,
  Sparkles,
  Brain,
  Zap,
  BarChart3,
  Crown,
  TrendingUp,
  Clock,
  Layers,
  Wand2,
  Gamepad2,
  ArrowUpRight,
  Star,
  Activity
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const tools = [
  {
    label: "Conversation",
    icon: MessageSquare,
    href: "/conversation",
    color: "from-violet-500 to-purple-600",
    bgColor: "bg-violet-500/10",
    description: "Chat with advanced AI models",
    popular: true,
    stats: { usage: "15.2k", growth: "+12%" }
  },
  {
    label: "Image Generation",
    icon: ImageIcon,
    color: "from-pink-500 to-rose-600",
    bgColor: "bg-pink-500/10",
    href: "/image",
    description: "Create stunning AI artworks",
    popular: true,
    stats: { usage: "12.8k", growth: "+18%" }
  },
  {
    label: "Code Generation",
    icon: Code,
    color: "from-green-500 to-emerald-600",
    bgColor: "bg-green-500/10",
    href: "/code",
    description: "Generate clean code instantly",
    popular: false,
    stats: { usage: "8.4k", growth: "+15%" }
  },
  {
    label: "Video Generation",
    icon: VideoIcon,
    color: "from-orange-500 to-amber-600",
    bgColor: "bg-orange-500/10",
    href: "/video",
    description: "Create AI-powered videos",
    popular: false,
    stats: { usage: "5.6k", growth: "+22%" }
  },
  {
    label: "Music Generation",
    icon: Music,
    href: "/music",
    color: "from-cyan-500 to-blue-600",
    bgColor: "bg-cyan-500/10",
    description: "Compose unique AI music",
    popular: false,
    stats: { usage: "6.9k", growth: "+9%" }
  },
];

const quickActions = [
  { icon: Wand2, label: "Quick Generate", color: "text-purple-500" },
  { icon: Layers, label: "Templates", color: "text-blue-500" },
  { icon: Gamepad2, label: "Playground", color: "text-green-500" },
];

const recentActivities = [
  { type: "image", action: "Generated", time: "2 min ago", title: "Fantasy Landscape" },
  { type: "code", action: "Created", time: "15 min ago", title: "React Component" },
  { type: "audio", action: "Composed", time: "1 hour ago", title: "Ambient Music" },
  { type: "conversation", action: "Chatted", time: "2 hours ago", title: "AI Assistant" },
];

export default function DashboardPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'recent' | 'favorites'>('overview');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black">
      {/* Hero Section with Animated Background */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-transparent to-cyan-600/20 blur-3xl animate-pulse" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_100%)]" />
        </div>

        {/* Content Container */}
        <div className="relative px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {/* Header with Animation */}
            <div className="text-center space-y-6 mb-12 opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards]">
              <div className="flex items-center justify-center space-x-3 mb-4 hover:scale-105 transition-transform duration-300">
                <div className="relative">
                  <div className="absolute inset-0 bg-violet-500 blur-xl opacity-50 animate-pulse" />
                  <Brain className="h-10 w-10 sm:h-12 sm:w-12 text-violet-500 relative" />
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-cyan-500">
                  AI Creation Studio
                </h1>
              </div>
              <p className="text-gray-400 text-base sm:text-lg md:text-xl max-w-3xl mx-auto opacity-0 animate-[fadeIn_0.8s_ease-out_0.2s_forwards]">
                Unlock the power of AI to generate conversations, images, code, videos, and music
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex justify-center gap-2 sm:gap-4 mb-8">
              {quickActions.map((action, index) => (
                <button
                  key={action.label}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-900/50 backdrop-blur-sm rounded-full border border-gray-800 hover:border-gray-700 transition-all opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards]"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <action.icon className={`h-4 w-4 ${action.color}`} />
                  <span className="text-sm font-medium hidden sm:inline">{action.label}</span>
                </button>
              ))}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
              {[
                { icon: Zap, label: "AI Speed", value: "83%", change: "+15%", color: "text-violet-500", bg: "bg-violet-500/10" },
                { icon: BarChart3, label: "Total model used", value: "5", change: "+78%", color: "text-cyan-500", bg: "bg-cyan-500/10" },
                { icon: Crown, label: "Current Plan", value: "Basic", change: "Active", color: "text-amber-500", bg: "bg-amber-500/10" },
                { icon: Activity, label: "Success Rate", value: "75.5%", change: "+12.3%", color: "text-green-500", bg: "bg-green-500/10" }
              ].map((stat, index) => (
                <div
                  key={stat.label}
                  className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-4 sm:p-6 hover:border-gray-700 hover:-translate-y-1 transition-all duration-300 opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards]"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${stat.bg}`}>
                        <stat.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.color}`} />
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs sm:text-sm">{stat.label}</p>
                        <p className="text-xl sm:text-2xl font-bold text-white">{stat.value}</p>
                      </div>
                    </div>
                    <div className={`text-xs sm:text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-500' :
                        stat.change.startsWith('-') ? 'text-red-500' :
                          'text-gray-500'
                      }`}>
                      {stat.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tabs Navigation */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex bg-gray-900/50 backdrop-blur-sm rounded-lg p-1 border border-gray-800">
                {(['overview', 'recent', 'favorites'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 sm:px-6 py-2 rounded-md text-sm font-medium transition-all ${activeTab === tab
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-400 hover:text-white'
                      }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Tools Grid */}
            <div className={`transition-all duration-300 ${activeTab !== 'overview' ? 'hidden' : ''}`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {tools.map((tool, index) => (
                  <div
                    key={tool.href}
                    className="opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards] hover:-translate-y-2 transition-transform duration-200"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <Card
                      onClick={() => router.push(tool.href)}
                      onMouseEnter={() => setHoveredCard(tool.href)}
                      onMouseLeave={() => setHoveredCard(null)}
                      className="relative overflow-hidden cursor-pointer border border-gray-800 bg-gray-900/50 backdrop-blur-sm transition-all duration-300 hover:border-gray-700 hover:shadow-2xl group"
                    >
                      {/* Popular badge */}
                      {tool.popular && (
                        <div className="absolute top-4 right-4 z-10">
                          <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-gradient-to-r from-violet-500 to-cyan-500 text-white rounded-full">
                            <Star className="h-3 w-3" />
                            Popular
                          </span>
                        </div>
                      )}

                      {/* Card content */}
                      <div className="p-6">
                        <div className="flex items-center space-x-4 mb-4">
                          <div className={`p-3 rounded-xl bg-gradient-to-br ${tool.color} shadow-lg hover:scale-110 hover:rotate-3 transition-transform duration-300`}>
                            <tool.icon className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-white">{tool.label}</h3>
                            <p className="text-sm text-gray-400">{tool.description}</p>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-gray-400">
                              <Activity className="h-4 w-4 inline mr-1" />
                              {tool.stats.usage} uses
                            </span>
                            <span className={`font-medium ${tool.stats.growth.startsWith('+') ? 'text-green-500' : 'text-red-500'
                              }`}>
                              <TrendingUp className="h-4 w-4 inline mr-1" />
                              {tool.stats.growth}
                            </span>
                          </div>
                        </div>

                        {/* Hover effect content */}
                        <div className={`mt-4 flex items-center text-sm font-medium transition-all duration-300 ${hoveredCard === tool.href ? "text-white translate-x-2" : "text-gray-400"
                          }`}>
                          <span>Get Started</span>
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </div>
                      </div>

                      {/* Gradient border on hover */}
                      <div className={`absolute inset-0 bg-gradient-to-r ${tool.color} opacity-0 group-hover:opacity-10 transition-all duration-300`} />
                    </Card>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activities Tab */}
            <div className={`transition-all duration-300 ${activeTab !== 'recent' ? 'hidden' : ''}`}>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-800 hover:border-gray-700 transition-all opacity-0 animate-[fadeInLeft_0.6s_ease-out_forwards]"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-gray-800 rounded-lg">
                        {activity.type === 'image' && <ImageIcon className="h-5 w-5 text-pink-500" />}
                        {activity.type === 'code' && <Code className="h-5 w-5 text-green-500" />}
                        {activity.type === 'audio' && <Music className="h-5 w-5 text-cyan-500" />}
                        {activity.type === 'conversation' && <MessageSquare className="h-5 w-5 text-violet-500" />}
                      </div>
                      <div>
                        <p className="font-medium text-white">{activity.title}</p>
                        <p className="text-sm text-gray-400">{activity.action} • {activity.time}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Favorites Tab */}
            <div className={`transition-all duration-300 ${activeTab !== 'favorites' ? 'hidden' : ''}`}>
              <div className="text-center py-12 opacity-0 animate-[fadeIn_0.6s_ease-out_forwards]">
                <Star className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">No favorites yet</h3>
                <p className="text-gray-500">Star your favorite tools to access them quickly</p>
              </div>
            </div>

            {/* Bottom CTA Section */}
            <div className="mt-16 text-center opacity-0 animate-[fadeInUp_0.6s_ease-out_0.5s_forwards]">
              <div className="inline-flex items-center justify-center p-1 rounded-full bg-gradient-to-r from-violet-600 to-cyan-600">
                <Button
                  size="lg"
                  className="rounded-full bg-black text-white border-0 hover:bg-gray-900 transition-all px-6 sm:px-8"
                  onClick={() => router.push("/upgrade")}
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  <span className="hidden sm:inline">Upgrade to Pro for Unlimited Access</span>
                  <span className="sm:hidden">Upgrade to Pro</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeInUp {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes fadeInLeft {
          from { 
            opacity: 0; 
            transform: translateX(-20px); 
          }
          to { 
            opacity: 1; 
            transform: translateX(0); 
          }
        }
      `}</style>
    </div>
  );
}
