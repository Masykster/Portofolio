import { useState } from 'react';
import { useStore } from '../store/useStore';
import type { BentoItem } from '../store/useStore';
import { Copy, Check, Eye, ShieldAlert, ShieldCheck } from 'lucide-react';

// Parsing hex color to rgb
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let r = 255, g = 255, b = 255;
  const cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    r = parseInt(cleanHex[0] + cleanHex[0], 16);
    g = parseInt(cleanHex[1] + cleanHex[1], 16);
    b = parseInt(cleanHex[2] + cleanHex[2], 16);
  } else if (cleanHex.length === 6) {
    r = parseInt(cleanHex.substring(0, 2), 16);
    g = parseInt(cleanHex.substring(2, 4), 16);
    b = parseInt(cleanHex.substring(4, 6), 16);
  }
  return { r, g, b };
}

// Relative luminance calculator (WCAG 2.1)
function getRelativeLuminance(r: number, g: number, b: number): number {
  const rs = r / 255;
  const gs = g / 255;
  const bs = b / 255;

  const R = rs <= 0.03928 ? rs / 12.92 : Math.pow((rs + 0.055) / 1.055, 2.4);
  const G = gs <= 0.03928 ? gs / 12.92 : Math.pow((gs + 0.055) / 1.055, 2.4);
  const B = bs <= 0.03928 ? bs / 12.92 : Math.pow((bs + 0.055) / 1.055, 2.4);

  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

export default function Exporter() {
  const {
    // Glass
    blur,
    bgOpacity,
    borderOpacity,
    borderRadius,
    borderWidth,
    borderColor,
    bgColor,
    textColor,
    insetShadowOpacity,
    noiseOverlay,

    // Bg
    bgType,
    bgSolidColor,
    bgGradient,
    bgImage,

    // Grid
    cols,
    gap,
    items,
    exportType,
    setExportType
  } = useStore();

  const [copied, setCopied] = useState(false);

  // A11y Contrast Calculator
  const checkContrast = () => {
    // Step 1: Parse colors
    const glassRGB = hexToRgb(bgColor);
    
    // Step 2: Establish approximate canvas backdrop beneath the glass
    let backdropRGB = { r: 15, g: 23, b: 42 }; // default Slate-900
    if (bgType === 'solid') {
      backdropRGB = hexToRgb(bgSolidColor);
    } else if (bgType === 'gradient') {
      // average purple/pink mesh midpoint tint
      backdropRGB = { r: 99, g: 102, b: 241 }; // Indigo-500
    } else if (bgType === 'image') {
      backdropRGB = { r: 30, g: 41, b: 59 }; // Slate-800 average
    }

    // Step 3: Compute composite blended background color of the glass card
    const blendedRGB = {
      r: Math.round(glassRGB.r * bgOpacity + backdropRGB.r * (1 - bgOpacity)),
      g: Math.round(glassRGB.g * bgOpacity + backdropRGB.g * (1 - bgOpacity)),
      b: Math.round(glassRGB.b * bgOpacity + backdropRGB.b * (1 - bgOpacity))
    };

    // Step 4: Calculate luminances
    const bgLuminance = getRelativeLuminance(blendedRGB.r, blendedRGB.g, blendedRGB.b);
    
    // Text luminance (White or Dark Gray #111827)
    const textRGB = textColor === 'light' ? { r: 255, g: 255, b: 255 } : { r: 17, g: 24, b: 39 };
    const textLuminance = getRelativeLuminance(textRGB.r, textRGB.g, textRGB.b);

    // Step 5: Compute contrast ratio
    const l1 = Math.max(bgLuminance, textLuminance);
    const l2 = Math.min(bgLuminance, textLuminance);
    const ratio = (l1 + 0.05) / (l2 + 0.05);

    return {
      ratio: Math.round(ratio * 10) / 10,
      passAA: ratio >= 4.5,
      passAAA: ratio >= 7.0
    };
  };

  const a11y = checkContrast();

  // Code Generation logic
  const generateCssCode = () => {
    return `/* Bento Grid Container */
.bento-grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: ${gap}px;
}

@media (min-width: 768px) {
  .bento-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .bento-grid {
    grid-template-columns: repeat(${cols}, minmax(0, 1fr));
  }
}

/* Glassmorphism Card Style */
.bento-card {
  backdrop-filter: blur(${blur}px);
  -webkit-backdrop-filter: blur(${blur}px);
  background-color: ${bgColor}${Math.round(bgOpacity * 255).toString(16).padStart(2, '0')};
  border: ${borderWidth}px solid ${borderColor}${Math.round(borderOpacity * 255).toString(16).padStart(2, '0')};
  border-radius: ${borderRadius}px;
  box-shadow: ${
    insetShadowOpacity > 0 
      ? `inset 0 1px 0 0 rgba(255, 255, 255, ${insetShadowOpacity}), 0 8px 32px 0 rgba(0, 0, 0, 0.15)`
      : '0 8px 32px 0 rgba(0, 0, 0, 0.15)'
  };
  color: ${textColor === 'light' ? '#ffffff' : '#111827'};
  padding: 16px;
  position: relative;
  overflow: hidden;
}

${noiseOverlay ? `/* Frosty Noise Overlay */
.bento-card::before {
  content: "";
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0.04;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
}` : ''}

/* Spanning classes */
${items.map((item, idx) => `.card-${idx + 1} {
  grid-row: span ${item.rowSpan};
}
@media (min-width: 1024px) {
  .card-${idx + 1} {
    grid-column: span ${item.colSpan};
  }
}`).join('\n\n')}`;
  };

  const generateTailwindCode = () => {
    // Generate inline configuration for glass
    const blurClass = blur > 0 ? `backdrop-blur-[${blur}px]` : '';
    const shadowClass = insetShadowOpacity > 0 ? `shadow-[inset_0_1px_0_0_rgba(255,255,255,${insetShadowOpacity})]` : '';
    const textClass = textColor === 'light' ? 'text-white' : 'text-gray-900';
    
    // RGB components
    const borderRgb = hexToRgb(borderColor);
    const bgRgb = hexToRgb(bgColor);

    const bentoCardBase = `relative overflow-hidden p-4 border rounded-[${borderRadius}px] ${blurClass} ${shadowClass} ${textClass}`;

    return `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${cols} gap-[${gap}px] p-6">
  ${items.map((item, idx) => {
    // Tailwind dynamic opacity
    const styleBg = `bg-[rgba(${bgRgb.r},${bgRgb.g},${bgRgb.b},${bgOpacity})]`;
    const styleBorder = `border-[rgba(${borderRgb.r},${borderRgb.g},${borderRgb.b},${borderOpacity})]`;

    return `<div class="lg:col-span-${item.colSpan} row-span-${item.rowSpan} ${bentoCardBase} ${styleBg} ${styleBorder}">
    ${noiseOverlay ? `<div class="absolute inset-0 opacity-[0.04] pointer-events-none bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')]"></div>` : ''}
    <div class="relative z-10">
      <h3 class="text-sm font-bold">${item.title}</h3>
      <p class="text-xs opacity-70 mt-1">Bento card content placeholder.</p>
    </div>
  </div>`;
  }).join('\n  ')}
</div>`;
  };

  const generateReactCode = () => {
    const blurClass = blur > 0 ? `backdrop-blur-[${blur}px]` : '';
    const shadowClass = insetShadowOpacity > 0 ? `shadow-[inset_0_1px_0_0_rgba(255,255,255,${insetShadowOpacity})]` : '';
    const textClass = textColor === 'light' ? 'text-white' : 'text-gray-900';
    
    const borderRgb = hexToRgb(borderColor);
    const bgRgb = hexToRgb(bgColor);

    return `import React from 'react';

export default function GlassBentoGrid() {
  const cards = [
    ${items.map((item) => `{ id: '${item.id}', title: '${item.title}', colSpan: ${item.colSpan}, rowSpan: ${item.rowSpan} }`).join(',\n    ')}
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${cols} gap-[${gap}px] p-6 w-full max-w-[1200px] mx-auto">
      {cards.map((card) => (
        <div
          key={card.id}
          style={{
            backdropFilter: 'blur(${blur}px)',
            WebkitBackdropFilter: 'blur(${blur}px)',
            backgroundColor: 'rgba(${bgRgb.r}, ${bgRgb.g}, ${bgRgb.b}, ${bgOpacity})',
            borderColor: 'rgba(${borderRgb.r}, ${borderRgb.g}, ${borderRgb.b}, ${borderOpacity})',
          }}
          className={\`relative overflow-hidden p-4 border rounded-[${borderRadius}px] lg:col-span-\${card.colSpan} row-span-\${card.rowSpan} ${shadowClass} ${textClass} transition-all hover:scale-[1.01]\`}
        >
          ${noiseOverlay ? `{/* Noise overlay */}
          <div 
            className="absolute inset-0 opacity-[0.04] pointer-events-none" 
            style={{ backgroundImage: \`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")\` }}
          />` : ''}
          
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div>
              <h3 className="text-sm font-bold">{card.title}</h3>
              <p className="text-xs opacity-75 mt-1">Premium glassmorphism card content.</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}`;
  };

  const getCodeString = () => {
    switch (exportType) {
      case 'css':
        return generateCssCode();
      case 'react':
        return generateReactCode();
      case 'tailwind':
      default:
        return generateTailwindCode();
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCodeString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col md:grid md:grid-cols-12 bg-gray-950/80 divide-y md:divide-y-0 md:divide-x divide-gray-850">
      {/* Left/Top: Accessibility & Output (5 cols) */}
      <div className="p-4 md:col-span-5 flex flex-col justify-center">
        <h3 className="text-2xs font-semibold text-indigo-400 uppercase tracking-wider mb-3 flex items-center">
          <Eye className="w-3.5 h-3.5 mr-1.5" /> Accessibility & Output
        </h3>

        {/* Real-time Contrast Score Card */}
        <div className="bg-gray-900/40 p-3 rounded-xl border border-gray-850">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-2xs font-semibold text-gray-400 block">Relative Contrast Ratio</span>
              <span className="text-xl font-black text-gray-100 mt-0.5 block font-mono">
                {a11y.ratio} : 1
              </span>
            </div>
            
            {/* Status Indicator */}
            {a11y.passAA ? (
              <div className="flex items-center space-x-1 text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-1 rounded-lg">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-2xs font-bold uppercase tracking-wider">Pass ({a11y.passAAA ? 'AAA' : 'AA'})</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1 text-yellow-500 bg-yellow-500/10 border border-yellow-500/20 px-2 py-1 rounded-lg">
                <ShieldAlert className="w-4 h-4" />
                <span className="text-2xs font-bold uppercase tracking-wider">Low Contrast</span>
              </div>
            )}
          </div>

          {/* Detailed warning messages */}
          {!a11y.passAA && (
            <p className="text-3xs text-yellow-500/80 mt-2.5 leading-normal">
              Warning: Text readability fails WCAG 2.1 AA standards. Try:
              <br />&bull; Toggle the text color scheme (White vs Dark text).
              <br />&bull; Increase "Glass Opacity" in style settings.
            </p>
          )}
          {a11y.passAA && !a11y.passAAA && (
            <p className="text-3xs text-gray-500 mt-2.5 leading-normal">
              Passes AA standard. Suitable for normal body text size.
            </p>
          )}
          {a11y.passAAA && (
            <p className="text-3xs text-green-400/80 mt-2.5 leading-normal">
              Passes AAA standard! Outstanding legibility on any device.
            </p>
          )}
        </div>
      </div>

      {/* Right/Bottom: Code Block Exporter (7 cols) */}
      <div className="md:col-span-7 flex flex-col min-h-0 divide-y divide-gray-850">
        {/* Export Tabs */}
        <div className="flex bg-gray-900/20">
          {(['tailwind', 'css', 'react'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setExportType(type)}
              className={`flex-1 py-2.5 text-2xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                exportType === type
                  ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              {type === 'css' ? 'HTML/CSS' : type}
            </button>
          ))}
        </div>

        {/* Code Area */}
        <div className="flex-1 min-h-0 flex flex-col p-4">
          <div className="flex-1 bg-gray-900/60 border border-gray-850 rounded-xl p-3 relative font-mono text-3xs text-gray-300 overflow-auto max-h-[300px] md:max-h-[320px]">
            <pre className="whitespace-pre select-all">{getCodeString()}</pre>
            
            {/* Floating Copy Button */}
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 p-1.5 rounded-lg bg-gray-950 border border-gray-800 hover:border-gray-700 text-gray-400 hover:text-white transition-all duration-200"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
