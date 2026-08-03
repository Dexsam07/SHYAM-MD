<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="200" viewBox="0 0 1200 200" role="img" aria-label="WE'LL COME EVERYONE 🎉">
  <defs>
    <!-- Gradient background -->
    <linearGradient id="grad" x1="0%" y1="0%" x2="200%" y2="0%">
      <stop offset="0%"   stop-color="#00c6ff"/>
      <stop offset="25%"  stop-color="#7a5cff"/>
      <stop offset="50%"  stop-color="#ff2ae0"/>
      <stop offset="75%"  stop-color="#ff8a00"/>
      <stop offset="100%" stop-color="#00c6ff"/>
      <animateTransform attributeName="gradientTransform" type="translate" from="-1,0" to="1,0" dur="10s" repeatCount="indefinite"/>
    </linearGradient>

    <!-- Border animated rainbow -->
    <linearGradient id="borderGrad" x1="0%" y1="0%" x2="200%" y2="0%">
      <stop offset="0%"   stop-color="#00c6ff"/>
      <stop offset="25%"  stop-color="#7a5cff"/>
      <stop offset="50%"  stop-color="#ff2ae0"/>
      <stop offset="75%"  stop-color="#ff8a00"/>
      <stop offset="100%" stop-color="#00c6ff"/>
      <animateTransform attributeName="gradientTransform" type="translate" from="-1,0" to="1,0" dur="6s" repeatCount="indefinite"/>
    </linearGradient>

    <!-- Text glow -->
    <filter id="textGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="b"/>
      <feMerge>
        <feMergeNode in="b"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <!-- NEW: Animated rainbow for dots -->
    <linearGradient id="dotsGrad" x1="0%" y1="0%" x2="200%" y2="0%">
      <stop offset="0%"   stop-color="#00ffa3"/>
      <stop offset="50%"  stop-color="#00c3ff"/>
      <stop offset="100%" stop-color="#7cff00"/>
      <animateTransform attributeName="gradientTransform" type="translate" from="-1,0" to="1,0" dur="7s" repeatCount="indefinite"/>
    </linearGradient>

    <!-- NEW: Clip-path so dots stay strictly inside the bubble (rect + tail union) -->
    <clipPath id="bubbleClip">
      <rect x="40" y="30" width="1120" height="140" rx="36"/>
      <path d="M600,170 L560,195 L585,160 Z"/>
    </clipPath>
  </defs>

  <!-- Gradient background -->
  <rect width="1200" height="200" fill="url(#grad)"/>

  <!-- Speech bubble box (unchanged styles) -->
  <rect x="40" y="30" width="1120" height="140" rx="36" fill="black"
        stroke="url(#borderGrad)" stroke-width="5">
    <animate attributeName="stroke-width" values="5;8;5" dur="2s" repeatCount="indefinite"/>
  </rect>
  <!-- Tail (unchanged styles) -->
  <path d="M600,170 L560,195 L585,160 Z" fill="black" stroke="url(#borderGrad)" stroke-width="5"/>

  <!-- NEW: Live colorful dots INSIDE the bubble only -->
  <g clip-path="url(#bubbleClip)" opacity="0.65">
    <!-- Layer 1: smooth gliding dots -->
    <circle cx="80"  cy="70"  r="3" fill="url(#dotsGrad)">
      <animate attributeName="cx" values="80;1140;80" dur="11s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.4;1;0.4" dur="2.2s" repeatCount="indefinite"/>
    </circle>
    <circle cx="220" cy="115" r="3.2" fill="url(#dotsGrad)">
      <animate attributeName="cx" values="220;1140;220" dur="12s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.35;0.95;0.35" dur="2.4s" begin="0.2s" repeatCount="indefinite"/>
    </circle>
    <circle cx="420" cy="95"  r="2.6" fill="url(#dotsGrad)">
      <animate attributeName="cx" values="420;1140;420" dur="10s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.5;1;0.5" dur="1.9s" begin="0.35s" repeatCount="indefinite"/>
    </circle>
    <circle cx="640" cy="75"  r="2.8" fill="url(#dotsGrad)">
      <animate attributeName="cx" values="640;1140;640" dur="10.8s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.4;0.9;0.4" dur="2.1s" begin="0.15s" repeatCount="indefinite"/>
    </circle>
    <circle cx="860" cy="125" r="2.7" fill="url(#dotsGrad)">
      <animate attributeName="cx" values="860;1140;860" dur="13s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.6;1;0.6" dur="2.3s" begin="0.25s" repeatCount="indefinite"/>
    </circle>
    <circle cx="1040" cy="95" r="3.0" fill="url(#dotsGrad)">
      <animate attributeName="cx" values="1040;1140;1040" dur="9s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.45;0.95;0.45" dur="1.7s" begin="0.55s" repeatCount="indefinite"/>
    </circle>

    <!-- Layer 2: tiny fast sparkles -->
    <circle cx="150" cy="105" r="1.9" fill="url(#dotsGrad)">
      <animate attributeName="cx" values="150;1140;150" dur="7s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0;1;0" dur="1.1s" repeatCount="indefinite"/>
    </circle>
    <circle cx="500" cy="130" r="1.7" fill="url(#dotsGrad)">
      <animate attributeName="cx" values="500;1140;500" dur="6.5s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0;1;0" dur="0.95s" begin="0.2s" repeatCount="indefinite"/>
    </circle>
    <circle cx="720" cy="90"  r="1.8" fill="url(#dotsGrad)">
      <animate attributeName="cx" values="720;1140;720" dur="6.2s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0;1;0" dur="0.95s" begin="0.35s" repeatCount="indefinite"/>
    </circle>
    <circle cx="980" cy="110" r="1.6" fill="url(#dotsGrad)">
      <animate attributeName="cx" values="980;1140;980" dur="6.8s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0;1;0" dur="0.9s" begin="0.5s" repeatCount="indefinite"/>
    </circle>
  </g>

  <!-- Text center blinking (unchanged) -->
  <g text-anchor="middle" font-family="Fira Code, Segoe UI, Inter, Arial, sans-serif">
    <text x="600" y="115" fill="#ffffff" font-size="58" font-weight="800" filter="url(#textGlow)">
      WE'LL COME EVERYONE 🎉
      <animate attributeName="opacity" values="1;0.3;1" dur="1.2s" repeatCount="indefinite"/>
    </text>
  </g>
</svg>
