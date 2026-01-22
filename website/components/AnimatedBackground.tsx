'use client';

export default function AnimatedBackground() {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 bg-slate-950">
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.3">
              <animate
                attributeName="stop-color"
                values="#7c3aed; #3b82f6; #7c3aed"
                dur="8s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2">
              <animate
                attributeName="stop-color"
                values="#3b82f6; #7c3aed; #3b82f6"
                dur="8s"
                repeatCount="indefinite"
              />
            </stop>
          </linearGradient>

          <linearGradient id="gradient2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.2">
              <animate
                attributeName="stop-color"
                values="#8b5cf6; #6366f1; #8b5cf6"
                dur="10s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.3">
              <animate
                attributeName="stop-color"
                values="#6366f1; #8b5cf6; #6366f1"
                dur="10s"
                repeatCount="indefinite"
              />
            </stop>
          </linearGradient>

          <radialGradient id="gradient3" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.4">
              <animate
                attributeName="stop-color"
                values="#a78bfa; #60a5fa; #a78bfa"
                dur="12s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Animated circles with gradients */}
        <circle cx="20%" cy="30%" r="300" fill="url(#gradient1)" opacity="0.5">
          <animate
            attributeName="cx"
            values="20%; 30%; 20%"
            dur="20s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="cy"
            values="30%; 40%; 30%"
            dur="15s"
            repeatCount="indefinite"
          />
        </circle>

        <circle cx="80%" cy="60%" r="350" fill="url(#gradient2)" opacity="0.4">
          <animate
            attributeName="cx"
            values="80%; 70%; 80%"
            dur="18s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="cy"
            values="60%; 50%; 60%"
            dur="22s"
            repeatCount="indefinite"
          />
        </circle>

        <circle cx="50%" cy="50%" r="400" fill="url(#gradient3)" opacity="0.3">
          <animate
            attributeName="r"
            values="400; 450; 400"
            dur="16s"
            repeatCount="indefinite"
          />
        </circle>

        <circle cx="10%" cy="80%" r="250" fill="url(#gradient1)" opacity="0.3">
          <animate
            attributeName="cx"
            values="10%; 15%; 10%"
            dur="14s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="cy"
            values="80%; 70%; 80%"
            dur="19s"
            repeatCount="indefinite"
          />
        </circle>

        <circle cx="90%" cy="20%" r="280" fill="url(#gradient2)" opacity="0.35">
          <animate
            attributeName="cx"
            values="90%; 85%; 90%"
            dur="17s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="cy"
            values="20%; 25%; 20%"
            dur="21s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </div>
  );
}
