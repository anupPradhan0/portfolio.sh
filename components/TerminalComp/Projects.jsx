import React, { useState } from "react";

// --- Data for your 5 projects ---
const projectsData = [
  {
    name: "WhatsApp Campaign Management Platform",
    description: "A full-stack MERN application for managing WhatsApp marketing campaigns with role-based access for admins and resellers. Features include client onboarding, financial transaction tracking with credit/debit records, and an integrated complaint management system. Built with React and TypeScript, featuring hierarchical user tree visualization with collapsible nodes and modal views. Backend powered by Node.js, Express, and MongoDB with Mongoose ODM for handling transactions, user management, and campaign operations. Integrated Cloudinary for image storage with automated cleanup scheduling.",
    imageUrl: "./images/whatsApp-Campaign.png",
    liveUrl: "https://whats-app-campaigner.vercel.app",
    githubUrl: "https://github.com/M0rs-Ruki/WhatsApp-Campaigner",
    tech: ["React", "Tailwind CSS","TypeScript","Node.js","Express","MongoDB","Mongoose(ODM)","Cloudinary"]
  },

  {
    name: "AI-powered personal finance tracker",
    description: "RukiAI is an AI-driven personal finance tracker designed to help users log expenses,set budgets, and receive smart, personalized financial advice. Built with Node.js, MongoDB, and EJS, it integrates Cohere's AI API to deliver real-time insights while also featuring a custom local AI model to demonstrate advanced AI capabilities for recruiters. The project showcases both cloud-based AI integration and self-hosted model development in one application.",
    imageUrl: "./images/ruki-ai-project.png",
    liveUrl: "https://www.rukiai.online/",
    githubUrl: "https://github.com/M0rs-Ruki/AI-Personal-Finance-Tracker",
    tech: ["Node.js","Express", "MongoDB", "EJS", "Tailwind", "JavaScript", "Cohere AI"]
  },

  // {
  //   name: "Interactive Terminal Portfolio Web Application",
  //   description: "This project is an interactive, command-line themed personal portfolio built with React and styled with Tailwind CSS. It departs from traditional portfolio layouts by simulating a classic developer terminal, allowing users to navigate through sections like 'About,' 'Projects,' 'Skills,' and 'Contact' by typing commands.",
  //   imageUrl: "./images/terminal-portfolio-project.png",
  //   liveUrl: "https://terminal-portfolio-bice-sigma.vercel.app/",
  //   githubUrl: "https://github.com/M0rs-Ruki/terminal-portfolio",
  //   tech: ["React", "Tailwind CSS", "JavaScript", "HTML", "CSS"]
  // },

  {
    name: "Neural Network From Scratch (in Python)",
    description: "Tech: Python, NumPy,Matplotlib,Tensorflow Implemented a basic neural network from the ground up using only Python and NumPy—no external ML libraries. Designed input, hidden, and output layers; implemented forward propagation, activation functions (Sigmoid/ReLU), and backpropagation manually. Trained on sample data to demonstrate model learning.",
    imageUrl: "./images/neural-network-project.png",
    liveUrl: "https://digit-recognizer-fullstack.vercel.app/",
    githubUrl: "https://github.com/M0rs-Ruki/digit-recognition-neural-network",
    tech: ["Python", "NumPy", "Matplotlib", "Tensorflow", "Jupyter Notebook"]
  },

  {
    name: "Network Marketing Full-stack",
    description: "Network Marketing Platform is a full-stack web application for managing a multi-level marketing (MLM) system. It allows users to register, refer others through unique affiliate links, track team members, view transaction and purchase histories, and monitor course progress.",
    imageUrl: "./images/network-marketing-project.png",
    liveUrl: "#",
    githubUrl: "https://github.com/M0rs-Ruki/Network-Marketing",
    tech: ["MongoDB", "Express", "Node.js", "HTML", "CSS", "JavaScript", "Tailwind"]
  },

  {
    name: "YouTube Backend",
    description: "Designed and built a backend system simulating YouTube features using Node.js, Express, and MongoDB. Implemented video upload, metadata storage, user registration & login with JWT auth Structured REST APIs to handle likes, comments, views, and subscriptions Deployed with Postman testing and MongoDB Atlas",
    imageUrl: "./images/youtube-backend-project.png",
    liveUrl: "#",
    githubUrl: "https://github.com/M0rs-Ruki/YouTube-Clone-Backend",
    tech: ["Node.js", "Express", "MongoDB", "JWT", "Postman", "MongoDB Atlas" ]
  },

  {
    name: "Ai Fiesta clone Fun projects",
    description: "AI Madness is a premium web application that lets users submit a single prompt and instantly compare responses from multiple AI models (ChatGPT, Claude, Gemini, Perplexity, DeepSeek) on one dashboard. Built with Node.js, Express, MongoDB, and Cohere API, featuring glassmorphism design, neon effects, and toggle-enabled AI panels for seamless multi-model testing.",
    imageUrl: "./images/ai-fiesta-project.png",
    liveUrl: "https://ai-madness.onrender.com/",
    githubUrl: "https://github.com/M0rs-Ruki/AI-Madness",
    tech: ["Node.js", "MongoDB", "Express", "HTML", "CSS", "JavaScript", "Tailwind", "Cohere AI"]
  },

];

// --- SVG Icons ---
const GitHubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

const ExternalLinkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
    <polyline points="15 3 21 3 21 9"></polyline>
    <line x1="10" y1="14" x2="21" y2="3"></line>
  </svg>
);

const TerminalIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 3h18a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM3 7v12h18V7H3zm6.5 6l-2-2 2-2L8 7.5 5.5 10 8 12.5 9.5 11zm6 2h-3v-2h3v2z"/>
  </svg>
);

const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

// --- The Main Projects Component ---
const Projects = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  
  // Responsive projects per page - 1 on mobile, 2 on desktop
  const projectsPerPage = window.innerWidth < 768 ? 1 : 2;
  const totalPages = Math.ceil(projectsData.length / projectsPerPage);
  
  // Get current projects to display
  const startIndex = currentPage * projectsPerPage;
  const currentProjects = projectsData.slice(startIndex, startIndex + projectsPerPage);
  
  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="text-white space-y-4 sm:space-y-8 max-w-7xl mx-auto p-3 sm:p-4">
      {/* Header with terminal-style decoration */}
      <div className="flex items-center space-x-2 sm:space-x-4 mb-4 sm:mb-8">
        <TerminalIcon />
        <h2 className="text-lg sm:text-2xl text-green-400 font-bold font-mono tracking-wider">
          ~/projects
        </h2>
        <div className="flex-1 h-px bg-gradient-to-r from-green-400/50 to-transparent"></div>
        <span className="text-green-400/60 text-xs sm:text-sm font-mono">
          {projectsData.length} repos
        </span>
      </div>

      {/* Page indicator - Mobile optimized */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
        <div className="flex items-center space-x-2 text-green-400 font-mono">
          <span className="text-xs sm:text-sm">Page {currentPage + 1} of {totalPages}</span>
          <div className="flex space-x-1">
            {Array.from({ length: totalPages }, (_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 ${
                  i === currentPage ? 'bg-green-400' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
        <div className="text-green-400/60 text-xs sm:text-sm font-mono">
          Showing {startIndex + 1}-{Math.min(startIndex + projectsPerPage, projectsData.length)} of {projectsData.length}
        </div>
      </div>

      {/* Grid container - Responsive: 1 column on mobile, 2 on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 min-h-[400px] sm:min-h-[600px]">
        {currentProjects.map((project, index) => {
          const globalIndex = startIndex + index;
          return (
            <div
              key={globalIndex}
              className="relative group cursor-pointer"
              onMouseEnter={() => setHoveredIndex(globalIndex)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Glassmorphism card */}
              <div className="backdrop-blur-md bg-gray-900/30 border border-green-500/20 rounded-lg sm:rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-[1.01] sm:hover:scale-[1.02] hover:border-green-400/40 hover:shadow-2xl hover:shadow-green-500/10">
                
                {/* Terminal header bar */}
                <div className="bg-gray-800/50 px-3 sm:px-4 py-2 border-b border-green-500/20 flex items-center space-x-2">
                  <div className="flex space-x-1 sm:space-x-2">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500/60"></div>
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500/60"></div>
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500/60"></div>
                  </div>
                  <div className="flex-1 text-center overflow-hidden">
                    <span className="text-green-400/70 text-xs font-mono block truncate">
                      {project.name.toLowerCase().replace(/\s+/g, '-')}
                    </span>
                  </div>
                </div>

                {/* Project Image with overlay */}
                <div className="relative h-40 sm:h-56 overflow-hidden">
                  <img 
                    src={project.imageUrl} 
                    alt={project.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent"></div>
                  
                  {/* Hover overlay with glitch effect */}
                  <div className={`absolute inset-0 bg-green-500/5 transition-all duration-300 ${
                    hoveredIndex === globalIndex ? 'opacity-100' : 'opacity-0'
                  }`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-cyan-400/10"></div>
                  </div>
                </div>

                {/* Project Content - Mobile optimized */}
                <div className="p-4 sm:p-8 space-y-3 sm:space-y-5">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-green-400 text-base sm:text-xl mb-2 sm:mb-3 font-mono group-hover:text-green-300 transition-colors leading-tight">
                      {project.name}
                    </h3>
                  </div>
                  
                  {/* Tech stack badges - Mobile responsive */}
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {project.tech.map((tech, techIndex) => (
                      <span 
                        key={techIndex}
                        className="px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs bg-green-500/20 text-green-400 rounded-full border border-green-500/30 font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                    {project.description}
                  </p>
                  
                  {/* Terminal-style command line - Mobile responsive */}
                  <div className="bg-gray-800/50 rounded-md p-2 sm:p-4 font-mono text-xs sm:text-sm border border-gray-700/50 overflow-hidden">
                    <div className="flex items-center space-x-1 sm:space-x-2 text-green-400">
                      <span className="text-green-500 flex-shrink-0">$</span>
                      <span className="text-gray-400 flex-shrink-0">git clone</span>
                      <span className="text-blue-400 truncate min-w-0">
                        {project.githubUrl.split('/').pop()}.git
                      </span>
                    </div>
                  </div>
                  
                  {/* Links Section - Mobile optimized */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-3 border-t border-gray-700/30 space-y-2 sm:space-y-0">
                    <div className="flex space-x-4 sm:space-x-6">
                      <a 
                        href={project.liveUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center space-x-1 sm:space-x-2 text-gray-400 hover:text-green-400 transition-all duration-200 hover:scale-105 font-mono text-sm sm:text-base"
                      >
                        <ExternalLinkIcon />
                        <span>live</span>
                      </a>
                      <a 
                        href={project.githubUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center space-x-1 sm:space-x-2 text-gray-400 hover:text-green-400 transition-all duration-200 hover:scale-105 font-mono text-sm sm:text-base"
                      >
                        <GitHubIcon />
                        <span>code</span>
                      </a>
                    </div>
                    
                    {/* Status indicator */}
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-green-400 text-xs font-mono">active</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Glow effect on hover */}
              <div className={`absolute inset-0 rounded-lg sm:rounded-xl transition-all duration-300 pointer-events-none ${
                hoveredIndex === globalIndex 
                  ? 'shadow-xl sm:shadow-2xl shadow-green-500/20 ring-1 ring-green-500/20' 
                  : ''
              }`}></div>
            </div>
          );
        })}
      </div>

      {/* Navigation Controls - Mobile responsive */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-4 sm:mt-8 space-y-4 sm:space-y-0">
        <button
          onClick={prevPage}
          disabled={currentPage === 0}
          className={`flex items-center space-x-2 px-3 py-2 sm:px-4 rounded-lg border font-mono text-xs sm:text-sm transition-all duration-300 w-full sm:w-auto justify-center sm:justify-start ${
            currentPage === 0
              ? 'border-gray-700/50 text-gray-600 cursor-not-allowed'
              : 'border-green-500/30 text-green-400 hover:border-green-400 hover:bg-green-500/10 hover:scale-105'
          }`}
        >
          <ChevronLeftIcon />
          <span>prev</span>
        </button>

        {/* Terminal-style page info - Mobile responsive */}
        <div className="px-3 py-2 sm:px-6 sm:py-3 bg-gray-900/30 backdrop-blur-sm border border-green-500/20 rounded-lg w-full sm:w-auto">
          <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm font-mono">
            <div className="flex items-center space-x-2">
              <span className="text-green-400">~/projects</span>
              <span className="text-gray-500">$</span>
              <span className="text-gray-400 hidden sm:inline">morscode.site</span>
            </div>
            <div className="flex-1 hidden sm:block"></div>
            <span className="text-green-400/60">
              {startIndex + 1}-{Math.min(startIndex + projectsPerPage, projectsData.length)} of {projectsData.length}
            </span>
          </div>
        </div>

        <button
          onClick={nextPage}
          disabled={currentPage === totalPages - 1}
          className={`flex items-center space-x-2 px-3 py-2 sm:px-4 rounded-lg border font-mono text-xs sm:text-sm transition-all duration-300 w-full sm:w-auto justify-center sm:justify-start ${
            currentPage === totalPages - 1
              ? 'border-gray-700/50 text-gray-600 cursor-not-allowed'
              : 'border-green-500/30 text-green-400 hover:border-green-400 hover:bg-green-500/10 hover:scale-105'
          }`}
        >
          <span>next</span>
          <ChevronRightIcon />
        </button>
      </div>
    </div>
  );
};

export default Projects;