import React, { useState, useEffect } from "react";

// Enhanced SVG Icons with hover animations - Mobile responsive
const CodeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-8 h-8 sm:w-10 sm:h-10 mb-2 sm:mb-3 text-green-400 group-hover:text-green-300 transition-all duration-300 group-hover:scale-110"
  >
    <polyline points="16 18 22 12 16 6"></polyline>
    <polyline points="8 6 2 12 8 18"></polyline>
  </svg>
);

const ServerIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-8 h-8 sm:w-10 sm:h-10 mb-2 sm:mb-3 text-green-400 group-hover:text-green-300 transition-all duration-300 group-hover:scale-110"
  >
    <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
    <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
    <line x1="6" y1="6" x2="6.01" y2="6"></line>
    <line x1="6" y1="18" x2="6.01" y2="18"></line>
  </svg>
);

const BrainIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-8 h-8 sm:w-10 sm:h-10 mb-2 sm:mb-3 text-green-400 group-hover:text-green-300 transition-all duration-300 group-hover:scale-110"
  >
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.9-3.35 2.5 2.5 0 0 1 3.24-2.26 2.5 2.5 0 0 1 2.62-3.33 2.5 2.5 0 0 1 2.62-3.33 2.5 2.5 0 0 1 2.24-1.32Z" />
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.9-3.35 2.5 2.5 0 0 0-3.24-2.26 2.5 2.5 0 0 0-2.62-3.33 2.5 2.5 0 0 0-2.62-3.33 2.5 2.5 0 0 0-2.24-1.32Z" />
  </svg>
);

const YoutubeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-8 h-8 sm:w-10 sm:h-10 mb-2 sm:mb-3 text-green-400 group-hover:text-green-300 transition-all duration-300 group-hover:scale-110"
  >
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <path d="m10 15 5-3-5-3z" />
  </svg>
);

// Typewriter effect component
const TypewriterText = ({ text, delay = 50 }) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, delay);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, delay]);

  return (
    <span>
      {displayText}
      {currentIndex < text.length && (
        <span className="animate-pulse text-green-400">|</span>
      )}
    </span>
  );
};

// Matrix rain effect (responsive)
const MatrixRain = () => {
  const chars = "01";
  // Responsive columns - fewer on mobile
  const columns = window.innerWidth < 768 ? 20 : 50;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
      {Array.from({ length: columns }).map((_, i) => (
        <div
          key={i}
          className="absolute text-green-400 text-xs font-mono"
          style={{
            left: `${(i * 100) / columns}%`,
            animation: `matrix-fall 10s linear infinite ${Math.random() * 5}s`,
          }}
        >
          {Array.from({ length: 20 }).map((_, j) => (
            <div key={j} className="opacity-20">
              {chars[Math.floor(Math.random() * chars.length)]}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

const About = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Matrix background effect */}
      <MatrixRain />

      {/* Main content - Mobile responsive container */}
      <div
        className={`relative z-10 max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 transition-all duration-1000 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {/* Terminal header - Mobile responsive */}
        <div className="mb-6 sm:mb-8 border border-green-800 bg-black/50 backdrop-blur-sm rounded-lg p-3 sm:p-4">
          <div>
            <span className="text-green-400 font-mono text-sm sm:text-base">
              <TypewriterText text="Loading developer profile..." delay={50} />
            </span>
          </div>
        </div>

        <div className="space-y-8 sm:space-y-12">
          {/* About Me Section - Mobile optimized */}
          <section className="border border-green-800/30 bg-gradient-to-br from-green-900/10 to-black/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 lg:p-8 shadow-2xl shadow-green-900/20 hover:shadow-green-900/40 transition-all duration-500">
            <div className="flex items-center mb-4 sm:mb-6">
              <span className="text-green-400 font-mono mr-2 sm:mr-4"></span>
              <h2 className="text-lg sm:text-2xl text-green-400 font-bold font-mono tracking-wider">
                ABOUT_ME.exe
              </h2>
              <div className="ml-auto">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>

            <div className="ml-3 sm:ml-6 border-l-2 border-green-800/30 pl-3 sm:pl-6">
              <p className="text-gray-300 leading-relaxed text-sm sm:text-lg font-light">
                I'm a{" "}
                <span className="text-green-400 font-semibold">
                  MERN Stack Developer
                </span>{" "}
                with a backend focus, building reliable RESTful APIs and
                full‑stack applications using MongoDB, Express.js, React,
                Node.js, and TypeScript, with JWT‑based auth and responsive
                interfaces in React, Tailwind, HTML/CSS, and EJS. Strong in data
                modeling with Mongoose, media handling via Cloudinary
                integration (storage/CDN, not a database), and pragmatic tooling
                across Git/GitHub, Docker, Postman, and API testing for robust
                delivery.​ Comfortable augmeting products with AI/ML libraries
                (TensorFlow, NumPy, pandas) and shipping to Vercel/Render,
                guided by a build‑to‑learn mindset and ongoing BCA studies (CGPA
                8.96)..
              </p>

              <div className="mt-4 sm:mt-6 flex flex-wrap gap-2">
                {[
                  "MongoDB",
                  "Express",
                  "React",
                  "Node.js",
                  "JavaScript",
                  "TypeScript",
                ].map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 sm:px-3 bg-green-900/30 border border-green-800/50 rounded-full text-green-400 text-xs sm:text-sm font-mono hover:bg-green-800/30 transition-colors duration-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* Education Section - Mobile optimized */}
          <section className="border border-green-800/30 bg-gradient-to-br from-green-900/10 to-black/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 lg:p-8 shadow-2xl shadow-green-900/20 hover:shadow-green-900/40 transition-all duration-500">
            <div className="flex items-center mb-4 sm:mb-6">
              <span className="text-green-400 font-mono mr-2 sm:mr-4"></span>
              <h2 className="text-lg sm:text-2xl text-green-400 font-bold font-mono tracking-wider">
                EDUCATION.log
              </h2>
              <div className="ml-auto">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>

            <div className="ml-3 sm:ml-6 border-l-2 border-green-800/30 pl-3 sm:pl-6 space-y-6">
              {/* Amity University */}
              <div className="border-b border-green-800/20 pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                  <h3 className="text-green-400 font-semibold text-base sm:text-lg font-mono">
                    Amity University
                  </h3>
                  <span className="text-gray-400 text-sm font-mono">
                    2024 — 2027
                  </span>
                </div>
                <p className="text-gray-300 text-sm sm:text-base">
                  Doing my Bachelors of Computer Application (BCA).
                </p>
                <div className="mt-2">
                  <span className="px-2 py-1 bg-green-900/30 border border-green-800/50 rounded-full text-green-400 text-xs font-mono">
                    CGPA: 8.96
                  </span>
                </div>
              </div>

              {/* Autonomous College Khariar */}
              <div className="border-b border-green-800/20 pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                  <h3 className="text-green-400 font-semibold text-base sm:text-lg font-mono">
                    Autonomous College Khariar
                  </h3>
                  <span className="text-gray-400 text-sm font-mono">
                    2022 — 2024
                  </span>
                </div>
                <p className="text-gray-300 text-sm sm:text-base">
                  I did my 11th and 12th in I.T.
                </p>
              </div>

              {/* High School */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                  <h3 className="text-green-400 font-semibold text-base sm:text-lg font-mono">
                    High School
                  </h3>
                  <span className="text-gray-400 text-sm font-mono">
                    2009 — 2022
                  </span>
                </div>
                <p className="text-gray-300 text-sm sm:text-base">
                  I did my schooling from our village school.
                </p>
              </div>
            </div>
          </section>

          {/* Skills Section - Mobile responsive grid */}
          <section>
            <div className="flex items-center mb-6 sm:mb-8">
              <span className="text-green-400 font-mono mr-2 sm:mr-4"></span>
              <h2 className="text-lg sm:text-2xl text-green-400 font-bold font-mono tracking-wider">
                What i'm doing
              </h2>
            </div>

            {/* Responsive grid: 1 column on mobile, 2 on tablet+ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Full Stack Developer Card - Mobile optimized */}
              <div className="group border border-green-800/40 bg-gradient-to-br from-green-900/20 to-black/80 backdrop-blur-sm p-4 sm:p-6 rounded-xl hover:border-green-400/60 transition-all duration-500 hover:scale-[1.02] sm:hover:scale-105 hover:shadow-2xl hover:shadow-green-900/30 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-green-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <CodeIcon />
                  </div>
                  <h3 className="font-bold text-green-400 text-lg sm:text-xl mb-2 sm:mb-3 font-mono">
                    Lerning Machine Learning
                  </h3>
                  <p className="text-gray-400 text-sm sm:text-base leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                    Driven by a deep passion for technology's potential, I am on
                    an exciting and immersive journey into the field of machine
                    learning. My current focus is on building hands-on projects
                    to deepen my understanding of the entire ML pipeline, from
                    data preprocessing to model deployment. I am mastering
                    essential tools like scikit-learn and TensorFlow to build
                    and refine models, with the ultimate goal of creating
                    elegant and effective solutions to real-world challenges.
                  </p>
                </div>
              </div>

              {/* Backend Card - Mobile optimized */}
              {/* <div className="group border border-green-800/40 bg-gradient-to-br from-green-900/20 to-black/80 backdrop-blur-sm p-4 sm:p-6 rounded-xl hover:border-green-400/60 transition-all duration-500 hover:scale-[1.02] sm:hover:scale-105 hover:shadow-2xl hover:shadow-green-900/30 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-green-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <ServerIcon />
                  </div>
                  <h3 className="font-bold text-green-400 text-lg sm:text-xl mb-2 sm:mb-3 font-mono">
                    Back-End Systems
                  </h3>
                  <p className="text-gray-400 text-sm sm:text-base leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                    Mastering backend development with JavaScript, Node.js, Express, APIs, and MongoDB to architect scalable web applications.
                  </p>
                </div>
              </div> */}

              {/* AI/ML Card - Mobile optimized */}
              {/* <div className="group border border-green-800/40 bg-gradient-to-br from-green-900/20 to-black/80 backdrop-blur-sm p-4 sm:p-6 rounded-xl hover:border-green-400/60 transition-all duration-500 hover:scale-[1.02] sm:hover:scale-105 hover:shadow-2xl hover:shadow-green-900/30 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-green-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <BrainIcon />
                  </div>
                  <h3 className="font-bold text-green-400 text-lg sm:text-xl mb-2 sm:mb-3 font-mono">
                    AI/ML Research
                  </h3>
                  <p className="text-gray-400 text-sm sm:text-base leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                    Diving deep into AI/ML with focus on data-driven models, pattern recognition, and developing intelligent applications.
                  </p>
                </div>
              </div> */}

              {/* YouTube Card - Mobile optimized */}
              <div className="group border border-green-800/40 bg-gradient-to-br from-green-900/20 to-black/80 backdrop-blur-sm p-4 sm:p-6 rounded-xl hover:border-green-400/60 transition-all duration-500 hover:scale-[1.02] sm:hover:scale-105 hover:shadow-2xl hover:shadow-green-900/30 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-green-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <YoutubeIcon />
                  </div>
                  <h3 className="font-bold text-green-400 text-lg sm:text-xl mb-2 sm:mb-3 font-mono">
                    Content Creation
                  </h3>
                  <p className="text-gray-400 text-sm sm:text-base leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                    Beyond coding, I am passionate about sharing my experiences.
                    Once a month, I create and upload a video that offers a look
                    into my life as a developer—from the technical challenges of
                    a new project to the personal lessons learned along the way.
                    My goal is to build in public and share my process with the
                    community.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Status footer - Mobile responsive */}
          <div className="mt-8 sm:mt-12 border-t border-green-800/30 pt-4 sm:pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-green-400/70 font-mono text-xs sm:text-sm space-y-2 sm:space-y-0">
              <span>Status: Ready for new challenges</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        @keyframes matrix-fall {
          0% {
            transform: translateY(-100vh);
          }
          100% {
            transform: translateY(100vh);
          }
        }
      `}</style>
    </div>
  );
};

export default About;
