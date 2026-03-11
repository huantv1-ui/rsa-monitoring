/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { Rocket, Sparkles, Zap, Github, ArrowRight } from "lucide-react";

export default function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30">
      {/* Navigation */}
      <nav className="border-b border-white/5 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <Rocket className="w-5 h-5 text-zinc-950" />
              </div>
              <span className="font-bold text-xl tracking-tight">Vibrant</span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
              <a href="#" className="hover:text-emerald-400 transition-colors">Features</a>
              <a href="#" className="hover:text-emerald-400 transition-colors">Documentation</a>
              <a href="#" className="hover:text-emerald-400 transition-colors">Pricing</a>
              <button className="bg-zinc-100 text-zinc-950 px-4 py-2 rounded-full hover:bg-emerald-400 transition-all font-semibold">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main>
        <div className="relative overflow-hidden pt-20 pb-32">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px]" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-6">
                <Sparkles className="w-3 h-3" />
                Now powered by Gemini 3.1
              </span>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
                Build faster with <br />
                <span className="text-emerald-400">intelligent</span> components
              </h1>
              <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                A high-performance React starter kit designed for modern web applications. 
                Optimized for speed, accessibility, and developer experience.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button className="w-full sm:w-auto px-8 py-4 bg-emerald-500 text-zinc-950 rounded-2xl font-bold text-lg hover:bg-emerald-400 hover:scale-105 transition-all flex items-center justify-center gap-2 group">
                  Start Building
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="w-full sm:w-auto px-8 py-4 bg-zinc-900 border border-white/10 rounded-2xl font-bold text-lg hover:bg-zinc-800 transition-all flex items-center justify-center gap-2">
                  <Github className="w-5 h-5" />
                  Star on GitHub
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-white/5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Zap className="w-6 h-6 text-emerald-400" />}
              title="Lightning Fast"
              description="Optimized build pipeline with Vite ensuring your development cycle stays productive."
            />
            <FeatureCard 
              icon={<Sparkles className="w-6 h-6 text-indigo-400" />}
              title="Modern Stack"
              description="Built with React 19, Tailwind CSS 4, and Framer Motion for smooth interactions."
            />
            <FeatureCard 
              icon={<Rocket className="w-6 h-6 text-amber-400" />}
              title="Ready to Deploy"
              description="Production-ready configuration for Cloud Run and other modern hosting platforms."
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-50">
            <Rocket className="w-5 h-5" />
            <span className="font-bold">Vibrant</span>
          </div>
          <p className="text-zinc-500 text-sm">
            © 2026 Vibrant React Starter. Built with passion and AI.
          </p>
          <div className="flex gap-6 text-zinc-500">
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
            <a href="#" className="hover:text-white transition-colors">Discord</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-emerald-500/20 transition-all"
    >
      <div className="w-12 h-12 rounded-2xl bg-zinc-950 border border-white/10 flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-zinc-400 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}
