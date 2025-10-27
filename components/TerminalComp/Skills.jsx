import React, { useState, useEffect } from 'react';

// --- Data for your skills, organized by category ---
const skillsData = {
  languages: ["JavaScript (ES6+)", "TypeScript", "Python","C++", "HTML5", "CSS3",],
  frontend: ["React", "Tailwind CSS", "EJS", "Vite",],
  backend: ["Node.js", "Express.js", "REST APIs",],
  databases: ["MongoDB", "Mongoose", "MongoDB Atlas",],
  tools: ["Git & GitHub", "Docker", "Postman", "Linux/CLI"],
  ai_ml: ["Cohere API", "TensorFlow (Basics)", "Pandas", "NumPy"],
};

// Terminal commands for each category
const terminalCommands = {
  languages: "ls -la /skills/languages/",
  frontend: "cat /skills/frontend/stack.txt",
  backend: "ps aux | grep backend",
  databases: "show databases;",
  tools: "which --all tools",
  ai_ml: "python -m pip list | grep ai"
};

// --- Enhanced SVG Icons ---
const CodeIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M8.7 15.9L4.8 12l3.9-3.9c.39-.39.39-1.01 0-1.4s-1.01-.39-1.4 0l-4.59 4.59c-.39.39-.39 1.02 0 1.41l4.59 4.6c.39.39 1.01.39 1.4 0 .39-.39.39-1.01 0-1.41zm6.6 0l3.9-3.9-3.9-3.9c-.39-.39-.39-1.01 0-1.4s1.01-.39 1.4 0l4.59 4.59c.39.39.39 1.02 0 1.41l-4.59 4.6c-.39.39-1.01.39-1.4 0-.39-.39-.39-1.01 0-1.41z"/>
  </svg>
);

const LayersIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M11.99 18.54l-7.37-5.73L3 14.07l9 7 9-7-1.63-1.27zM12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27L12 16zm0-11.47L17.74 9 12 13.47 6.26 9 12 4.53z"/>
  </svg>
);

const ServerIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M4 1h16c1.1 0 2 .9 2 2v6c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2zm0 8h16c1.1 0 2 .9 2 2v6c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2v-6c0-1.1.9-2 2-2zm2 2v2h2v-2H6zm0-8v2h2V3H6zm12 8v2h2v-2h-2zm0-8v2h2V3h-2z"/>
  </svg>
);

const DatabaseIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 3C7.58 3 4 4.79 4 7s3.58 4 8 4 8-1.79 8-4-3.58-4-8-4zM4 9v3c0 2.21 3.58 4 8 4s8-1.79 8-4V9c0 2.21-3.58 4-8 4s-8-1.79-8-4zm0 5v3c0 2.21 3.58 4 8 4s8-1.79 8-4v-3c0 2.21-3.58 4-8 4s-8-1.79-8-4z"/>
  </svg>
);

const ToolIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>
  </svg>
);

const BrainIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>
);

// Typing animation hook
const useTypewriter = (text, speed = 50) => {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayText('');
    setIsComplete(false);
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText(prev => prev + text.charAt(i));
        i++;
      } else {
        setIsComplete(true);
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return { displayText, isComplete };
};

// Terminal window component
const TerminalWindow = ({ title, command, children, isActive, onClick }) => {
  const { displayText, isComplete } = useTypewriter(command, 30);
  
  return (
    <div 
      className={`relative overflow-hidden rounded-lg transition-all duration-500 cursor-pointer transform hover:scale-[1.02] ${
        isActive 
          ? 'bg-black/40 backdrop-blur-xl border border-green-400/50 shadow-lg shadow-green-400/20' 
          : 'bg-black/20 backdrop-blur-md border border-green-400/20 hover:border-green-400/40'
      }`}
      onClick={onClick}
    >
      {/* Terminal header */}
      <div className="flex items-center justify-between p-3 bg-black/30 border-b border-green-400/20">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          </div>
          <span className="text-green-400 text-sm font-mono ml-2">~ {title}</span>
        </div>
        <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-400 animate-pulse' : 'bg-green-400/30'}`}></div>
      </div>

      {/* Terminal content */}
      <div className="p-4 space-y-3">
        {/* Command line */}
        <div className="flex items-center space-x-2 text-green-400 font-mono text-sm">
          <span className="text-green-300">$</span>
          <span className={isActive ? 'text-green-400' : 'text-green-400/60'}>
            {isActive ? displayText : command}
          </span>
          {isActive && !isComplete && (
            <span className="w-2 h-4 bg-green-400 animate-pulse"></span>
          )}
        </div>

        {/* Skills output */}
        {(isActive && isComplete) && (
          <div className="space-y-2 animate-fade-in">
            {children}
          </div>
        )}
      </div>

      {/* Glow effect */}
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 via-transparent to-green-400/10 pointer-events-none"></div>
      )}
    </div>
  );
};

// Skill badge component
const SkillBadge = ({ skill, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <span 
      className={`inline-block transition-all duration-500 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      } bg-gradient-to-r from-green-400/20 to-emerald-400/20 backdrop-blur-sm 
      text-green-300 text-xs font-mono py-1.5 px-3 rounded-md border border-green-400/30
      hover:border-green-400/60 hover:bg-green-400/10 hover:text-green-200 cursor-pointer
      hover:shadow-md hover:shadow-green-400/20`}
    >
      {skill}
    </span>
  );
};

// Matrix-like background effect
const MatrixBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-10">
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-black to-emerald-900/20"></div>
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className={`absolute text-green-400 font-mono text-xs animate-pulse`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 3}s`
          }}
        >
          {Math.random().toString(36).substring(7)}
        </div>
      ))}
    </div>
  );
};

// Main Skills component
const Skills = () => {
  const [activeCategory, setActiveCategory] = useState('languages');
  const [terminalStarted, setTerminalStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setTerminalStarted(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const categories = [
    { key: 'languages', title: 'Languages', icon: <CodeIcon />, skills: skillsData.languages },
    { key: 'frontend', title: 'Frontend', icon: <LayersIcon />, skills: skillsData.frontend },
    { key: 'backend', title: 'Backend', icon: <ServerIcon />, skills: skillsData.backend },
    { key: 'databases', title: 'Databases', icon: <DatabaseIcon />, skills: skillsData.databases },
    { key: 'ai_ml', title: 'AI/ML', icon: <BrainIcon />, skills: skillsData.ai_ml },
    { key: 'tools', title: 'Tools', icon: <ToolIcon />, skills: skillsData.tools },
  ];

  return (
    <div className="relative p-6">
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={`text-4xl md:text-6xl font-bold font-mono transition-all duration-1000 ${
            terminalStarted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
          }`}>
            <span className="text-green-400">{"<"}</span>
            <span className="text-white"> TECH STACK </span>
            <span className="text-green-400">{"/>"}</span>
          </h1>
          <div className={`mt-4 text-green-300/80 font-mono transition-all duration-1000 delay-300 ${
            terminalStarted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <span className="text-green-400">$</span> ./skills --interactive --display-all
          </div>
        </div>

        {/* Terminal Windows Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <div
              key={category.key}
              className={`transition-all duration-500 ${
                terminalStarted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <TerminalWindow
                title={category.title}
                command={terminalCommands[category.key]}
                isActive={activeCategory === category.key}
                onClick={() => setActiveCategory(category.key)}
              >
                <div className="flex items-center space-x-2 text-green-400 mb-3">
                  {category.icon}
                  <span className="font-mono text-sm">{category.title.toLowerCase()}_modules:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, skillIndex) => (
                    <SkillBadge 
                      key={skill} 
                      skill={skill} 
                      delay={skillIndex * 100}
                    />
                  ))}
                </div>
              </TerminalWindow>
            </div>
          ))}
        </div>

        <div className={`text-center mt-12 transition-all duration-1000 delay-1000 ${
          terminalStarted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <p className="text-green-300/60 font-mono text-sm">
            <span className="text-green-400">└─$</span> Click on any terminal to explore skills
          </p>
        </div>
      </div>

      <style jsx="true">{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Skills;