import React, { useState, useEffect } from "react";

// --- Enhanced SVG Icons with hover effects ---
const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-300 group-hover:stroke-green-400 group-hover:scale-110">
    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
  </svg>
);

const LocationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-300 group-hover:stroke-green-400 group-hover:scale-110">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const YoutubeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-300 group-hover:stroke-red-400 group-hover:scale-110">
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <path d="m10 15 5-3-5-3z" />
  </svg>
);

const TwitterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-300 group-hover:stroke-blue-400 group-hover:scale-110">
    <path d="M18 6 6 18"></path>
    <path d="m6 6 12 12"></path>
  </svg>
);

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-300 group-hover:stroke-pink-400 group-hover:scale-110">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
  </svg>
);

const LinkedinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-300 group-hover:stroke-blue-500 group-hover:scale-110">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect width="4" height="12" x="2" y="9"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const GithubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-300 group-hover:stroke-purple-400 group-hover:scale-110">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

const LeetcodeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-300 group-hover:stroke-yellow-400 group-hover:scale-110">
    <polyline points="4 17 10 11 4 5"></polyline>
    <line x1="12" x2="20" y1="19" y2="19"></line>
  </svg>
);

const ResumeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-300 group-hover:stroke-orange-400 group-hover:scale-110">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7,10 12,15 17,10"></polyline>
    <line x1="12" x2="12" y1="15" y2="3"></line>
  </svg>
);

// Enhanced Contact component with animations and mobile responsiveness
const Contact = () => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [socialsVisible, setSocialsVisible] = useState(false);

  // Staggered entrance animations
  useEffect(() => {
    const timer1 = setTimeout(() => setMounted(true), 100);
    const timer2 = setTimeout(() => setHeaderVisible(true), 300);
    const timer3 = setTimeout(() => setContentVisible(true), 600);
    const timer4 = setTimeout(() => setSocialsVisible(true), 900);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  const handleEmailClick = async (e) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText('anuppradhan929@gmail.com');
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      window.location.href = 'mailto:anuppradhan929@gmail.com';
    }
  };

  return (
    <div className="text-white max-w-5xl mx-auto p-3 sm:p-6 relative min-h-screen flex items-center">
      {/* Background gradient effects with animation */}
      <div className={`absolute inset-0 transition-all duration-1000 ease-out ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-cyan-500/10 rounded-3xl blur-xl"></div>
        <div className="absolute -top-4 -left-4 w-24 h-24 sm:w-32 sm:h-32 bg-green-400/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute -bottom-4 -right-4 w-32 h-32 sm:w-40 sm:h-40 bg-cyan-400/15 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>
      
      <div className={`relative w-full backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl transition-all duration-700 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        
        {/* Header with terminal styling - Animated */}
        <div className={`flex items-center mb-6 sm:mb-8 transition-all duration-500 ease-out ${headerVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
          <div className="flex space-x-1.5 sm:space-x-2 mr-3 sm:mr-4">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
          </div>
          <h2 className="text-lg sm:text-2xl font-mono text-green-400 font-bold tracking-wider">
            <span className="text-gray-500">$</span> contact --connect
          </h2>
        </div>

        {/* Terminal cursor animation */}
        <div className={`mb-4 sm:mb-6 transition-all duration-500 ease-out delay-200 ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
          <p className="text-gray-300 font-mono text-xs sm:text-sm leading-relaxed">
            <span className="text-green-400">&gt;</span> Establishing secure connection...
            <span className="inline-block w-1.5 h-3 sm:w-2 sm:h-4 bg-green-400 ml-1 animate-pulse"></span>
          </p>
          <p className="text-gray-400 font-mono text-xs sm:text-sm mt-1 sm:mt-2">
            Ready to collaborate on innovative projects and opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
          
          {/* Direct Contact Section - Animated */}
          <div className={`space-y-4 sm:space-y-6 transition-all duration-600 ease-out ${contentVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6'}`}>
            <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
              <h3 className="text-base sm:text-xl font-mono text-green-400 font-semibold">// Direct.Contact</h3>
            </div>
            
            {/* Email with copy functionality */}
            <div 
              onClick={handleEmailClick}
              className="group relative p-3 sm:p-4 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl hover:bg-white/10 hover:border-green-400/50 transition-all duration-300 cursor-pointer transform hover:scale-[1.02] hover:shadow-lg hover:shadow-green-400/20 active:scale-[0.98]"
            >
              <div className="flex items-center">
                <div className="p-2 bg-gradient-to-br from-green-400/20 to-cyan-400/20 rounded-lg mr-3 sm:mr-4 group-hover:from-green-400/30 group-hover:to-cyan-400/30 transition-all duration-300">
                  <MailIcon />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-400 text-xs sm:text-sm font-mono">EMAIL</p>
                  <p className="text-white font-mono text-sm sm:text-base group-hover:text-green-400 transition-colors duration-300 truncate">
                    anuppradhan929@gmail.com
                  </p>
                  {copiedEmail && (
                    <p className="text-green-400 text-xs font-mono animate-fade-in">
                      ✓ Copied to clipboard
                    </p>
                  )}
                </div>
                <div className="text-gray-500 group-hover:text-green-400 transition-colors duration-300 flex-shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="group relative p-3 sm:p-4 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl hover:bg-white/10 hover:border-blue-400/50 transition-all duration-300 transform hover:scale-[1.02]">
              <div className="flex items-center">
                <div className="p-2 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-lg mr-3 sm:mr-4 group-hover:from-blue-400/30 group-hover:to-purple-400/30 transition-all duration-300">
                  <LocationIcon />
                </div>
                <div>
                  <p className="text-gray-400 text-xs sm:text-sm font-mono">LOCATION</p>
                  <p className="text-white font-mono text-sm sm:text-base group-hover:text-blue-400 transition-colors duration-300">
                    Bhubaneswar, Odisha, India
                  </p>
                </div>
              </div>
            </div>
            
            {/* Resume Button */}
            <a
              href="https://drive.google.com/file/d/1s4BHphGSLMZjhUY5IXJbxySOiKFUaaAZ/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-3 sm:p-4 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl hover:bg-white/10 hover:border-orange-400/50 transition-all duration-300 cursor-pointer transform hover:scale-[1.02] hover:shadow-lg hover:shadow-orange-400/20 active:scale-[0.98] block"
            >
              <div className="flex items-center">
                <div className="p-2 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-lg mr-3 sm:mr-4 group-hover:from-orange-400/30 group-hover:to-red-400/30 transition-all duration-300">
                  <ResumeIcon />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-400 text-xs sm:text-sm font-mono">RESUME</p>
                  <p className="text-white font-mono text-sm sm:text-base group-hover:text-orange-400 transition-colors duration-300">
                    Download CV
                  </p>
                </div>
                <div className="text-gray-500 group-hover:text-orange-400 transition-colors duration-300 flex-shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7,10 12,15 17,10"></polyline>
                    <line x1="12" x2="12" y1="15" y2="3"></line>
                  </svg>
                </div>
              </div>
            </a>

          </div>

          {/* Social Links Section - Animated */}
          <div className={`space-y-4 sm:space-y-6 transition-all duration-600 ease-out delay-300 ${socialsVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6'}`}>
            <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
              <h3 className="text-base sm:text-xl font-mono text-green-400 font-semibold">// Social.Links</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              {[
                { icon: YoutubeIcon, name: "YouTube", href: "https://www.youtube.com/@morscode7", color: "red" },
                { icon: TwitterIcon, name: "Twitter / X", href: "https://x.com/AnupPradhan0", color: "blue" },
                { icon: InstagramIcon, name: "Instagram", href: "https://www.instagram.com/mors.365/", color: "pink" },
                { icon: LinkedinIcon, name: "LinkedIn", href: "https://www.linkedin.com/in/anup-pradhan77", color: "blue" },
                { icon: GithubIcon, name: "GitHub", href: "https://github.com/M0rs-Ruki", color: "purple" },
                { icon: LeetcodeIcon, name: "LeetCode", href: "https://leetcode.com/u/Anuppradhan/", color: "yellow" }
              ].map((social, index) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group relative p-3 sm:p-4 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl hover:bg-white/10 transition-all duration-300 transform hover:scale-[1.03] hover:shadow-lg hover:shadow-green-400/10 active:scale-[0.98] ${socialsVisible ? 'animate-fade-in-up' : ''}`}
                  style={{
                    animationDelay: `${index * 100 + 400}ms`
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 bg-gradient-to-br from-${social.color}-400/20 to-${social.color}-600/20 rounded-lg group-hover:from-${social.color}-400/30 group-hover:to-${social.color}-600/30 transition-all duration-300`}>
                      <social.icon />
                    </div>
                    <span className="font-mono text-sm sm:text-base group-hover:text-green-400 transition-colors duration-300">
                      {social.name}
                    </span>
                  </div>
                  
                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/5 to-green-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg sm:rounded-xl"></div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Terminal status bar - Animated */}
        <div className={`mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/10 transition-all duration-700 ease-out delay-500 ${socialsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs sm:text-sm font-mono space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="text-green-400">✓ Monkey D. Luffy </span>
              <span className="text-gray-500 hidden sm:inline">|</span>
              <span className="text-gray-400">Response time: &lt;100ms</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-gray-400">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for additional animations */}
      <style jsx="true">{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Mobile touch improvements */
        @media (hover: none) {
          .group:active {
            transform: scale(0.98);
          }
        }
      `}</style>
    </div>
  );
};

export default Contact;
