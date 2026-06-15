import React from 'react';
import { useStore } from '../store/useStore';
import { Sliders, Grid, LayoutTemplate, Palette, RefreshCw, PlusCircle, AlertCircle } from 'lucide-react';

export default function ControlPanel() {
  const {
    // Glass
    blur,
    bgOpacity,
    borderOpacity,
    borderRadius,
    borderColor,
    bgColor,
    textColor,
    insetShadowOpacity,
    noiseOverlay,
    setGlassProp,

    // Bg
    bgType,
    bgSolidColor,
    bgGradient,
    bgImage,
    setBgProp,

    // Grid
    cols,
    gap,
    items,
    selectedItemId,
    setGridProp,
    addItem,
    removeItem,
    updateItem,
    resetLayout
  } = useStore();

  const activeItem = items.find((item) => item.id === selectedItemId);

  const [activeTab, setActiveTab] = React.useState<'glass' | 'grid' | 'canvas'>('glass');

  // Backdrop Gradient presets
  const GRADIENT_PRESETS = [
    { name: 'Aurora', value: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)' },
    { name: 'Sunset Glow', value: 'linear-gradient(135deg, #f97316 0%, #d97706 30%, #e11d48 100%)' },
    { name: 'Deep Space', value: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #311042 100%)' },
    { name: 'Cyan Wave', value: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #6366f1 100%)' }
  ];

  // Backdrop Image presets
  const IMAGE_PRESETS = [
    { name: 'Abstract Art', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop' },
    { name: 'Fluid Glass', url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1000&auto=format&fit=crop' },
    { name: 'Cyberpunk Neon', url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop' },
    { name: 'Lush Forest', url: 'https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=1000&auto=format&fit=crop' }
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-950/80">
      {/* Sidebar Tabs */}
      <div className="flex border-b border-gray-850 bg-gray-900/20">
        <button
          onClick={() => setActiveTab('glass')}
          className={`flex-1 py-3 px-2 text-xs font-semibold flex items-center justify-center space-x-1.5 border-b-2 transition-all ${
            activeTab === 'glass'
              ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Glass</span>
        </button>
        <button
          onClick={() => setActiveTab('grid')}
          className={`flex-1 py-3 px-2 text-xs font-semibold flex items-center justify-center space-x-1.5 border-b-2 transition-all ${
            activeTab === 'grid'
              ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <Grid className="w-3.5 h-3.5" />
          <span>Grid</span>
        </button>
        <button
          onClick={() => setActiveTab('canvas')}
          className={`flex-1 py-3 px-2 text-xs font-semibold flex items-center justify-center space-x-1.5 border-b-2 transition-all ${
            activeTab === 'canvas'
              ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Canvas</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-6">
        {activeTab === 'glass' && (
          <div className="space-y-5">
            <div>
              <h3 className="text-2xs font-semibold text-indigo-400 uppercase tracking-wider mb-4 flex items-center">
                <Sliders className="w-3.5 h-3.5 mr-1.5" /> Glassmorphism Attributes
              </h3>
              
              {/* Blur Slider */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-gray-400">Backdrop Blur</span>
                  <span className="text-indigo-300 font-semibold">{blur}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={blur}
                  onChange={(e) => setGlassProp('blur', Number(e.target.value))}
                  className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              {/* Background Opacity */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-gray-400">Glass Opacity</span>
                  <span className="text-indigo-300 font-semibold">{Math.round(bgOpacity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={bgOpacity * 100}
                  onChange={(e) => setGlassProp('bgOpacity', Number(e.target.value) / 100)}
                  className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              {/* Border Opacity */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-gray-400">Border Opacity</span>
                  <span className="text-indigo-300 font-semibold">{Math.round(borderOpacity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={borderOpacity * 100}
                  onChange={(e) => setGlassProp('borderOpacity', Number(e.target.value) / 100)}
                  className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              {/* Inset Shadow Opacity */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-gray-400">Lighting Edge (Glow)</span>
                  <span className="text-indigo-300 font-semibold">{Math.round(insetShadowOpacity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={insetShadowOpacity * 100}
                  onChange={(e) => setGlassProp('insetShadowOpacity', Number(e.target.value) / 100)}
                  className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
            </div>

            <hr className="border-gray-850" />

            {/* Colors & Radii */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-gray-300">Styling Customization</h4>

              {/* Border Radius Selection */}
              <div className="space-y-2">
                <span className="text-xs text-gray-400 font-medium">Corner Smoothness (Aesthetic Locked)</span>
                <div className="grid grid-cols-5 gap-1.5">
                  {[8, 12, 16, 24, 32].map((r) => (
                    <button
                      key={r}
                      onClick={() => setGlassProp('borderRadius', r)}
                      className={`py-1 text-2xs font-bold rounded-lg border transition-all ${
                        borderRadius === r
                          ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                          : 'bg-gray-900 border-gray-800 hover:border-gray-700 text-gray-400'
                      }`}
                    >
                      {r}px
                    </button>
                  ))}
                </div>
              </div>

              {/* Tint Colors */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <span className="text-xs text-gray-400 font-medium">Glass Tint</span>
                  <div className="flex items-center space-x-2 bg-gray-900 border border-gray-800 rounded-lg p-1.5">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setGlassProp('bgColor', e.target.value)}
                      className="w-6 h-6 border-0 rounded cursor-pointer bg-transparent"
                    />
                    <span className="text-2xs font-mono text-gray-300 uppercase">{bgColor}</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <span className="text-xs text-gray-400 font-medium">Border Tint</span>
                  <div className="flex items-center space-x-2 bg-gray-900 border border-gray-800 rounded-lg p-1.5">
                    <input
                      type="color"
                      value={borderColor}
                      onChange={(e) => setGlassProp('borderColor', e.target.value)}
                      className="w-6 h-6 border-0 rounded cursor-pointer bg-transparent"
                    />
                    <span className="text-2xs font-mono text-gray-300 uppercase">{borderColor}</span>
                  </div>
                </div>
              </div>

              {/* Text Color Selection */}
              <div className="space-y-1.5">
                <span className="text-xs text-gray-400 font-medium">Text Color Scheme</span>
                <div className="grid grid-cols-2 gap-2">
                  {(['light', 'dark'] as const).map((theme) => (
                    <button
                      key={theme}
                      onClick={() => setGlassProp('textColor', theme)}
                      className={`py-1.5 text-xs font-semibold rounded-lg border capitalize transition-all ${
                        textColor === theme
                          ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                          : 'bg-gray-900 border-gray-800 hover:border-gray-700 text-gray-400'
                      }`}
                    >
                      {theme === 'light' ? 'White Text' : 'Dark Text'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Noise overlay */}
              <div className="flex items-center justify-between bg-gray-900/50 p-3 border border-gray-850 rounded-xl">
                <div>
                  <span className="text-xs font-semibold text-gray-300 block">Frosted Noise Texture</span>
                  <span className="text-3xs text-gray-500 block">SVG filter for realistic material</span>
                </div>
                <button
                  onClick={() => setGlassProp('noiseOverlay', !noiseOverlay)}
                  className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${
                    noiseOverlay ? 'bg-indigo-600' : 'bg-gray-800'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-200 ${
                      noiseOverlay ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'grid' && (
          <div className="space-y-5">
            <div>
              <h3 className="text-2xs font-semibold text-indigo-400 uppercase tracking-wider mb-4 flex items-center">
                <LayoutTemplate className="w-3.5 h-3.5 mr-1.5" /> Bento Grid Rules
              </h3>

              {/* Grid Gap Selection */}
              <div className="space-y-2 mb-4">
                <span className="text-xs text-gray-400 font-medium">Grid Cell Gap</span>
                <div className="grid grid-cols-5 gap-1.5">
                  {[8, 12, 16, 24, 32].map((g) => (
                    <button
                      key={g}
                      onClick={() => setGridProp('gap', g)}
                      className={`py-1 text-2xs font-bold rounded-lg border transition-all ${
                        gap === g
                          ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                          : 'bg-gray-900 border-gray-800 hover:border-gray-700 text-gray-400'
                      }`}
                    >
                      {g}px
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid Columns */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-gray-400">Desktop Columns</span>
                  <span className="text-indigo-300 font-semibold">{cols} Columns</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="12"
                  value={cols}
                  onChange={(e) => setGridProp('cols', Number(e.target.value))}
                  className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
            </div>

            <hr className="border-gray-850" />

            {activeItem && (
              <>
                <div className="bg-gray-900/50 p-4 border border-gray-850 rounded-xl space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-2xs font-bold text-indigo-400 uppercase tracking-wider">Card Settings</h4>
                    <button
                      onClick={() => removeItem(activeItem.id)}
                      className="text-3xs font-semibold text-red-400 hover:text-red-350 transition-colors"
                    >
                      Delete Card
                    </button>
                  </div>

                  {/* Title Input */}
                  <div className="space-y-1.5">
                    <span className="text-3xs text-gray-400 font-bold uppercase tracking-wider block">Card Title</span>
                    <input
                      type="text"
                      value={activeItem.title}
                      onChange={(e) => updateItem(activeItem.id, { title: e.target.value })}
                      className="w-full text-xs bg-gray-950 border border-gray-850 rounded-lg p-2 font-medium text-gray-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Template Content Type */}
                  <div className="space-y-1.5">
                    <span className="text-3xs text-gray-400 font-bold uppercase tracking-wider block">Content Layout</span>
                    <select
                      value={activeItem.content}
                      onChange={(e) => updateItem(activeItem.id, { content: e.target.value })}
                      className="w-full text-xs bg-gray-950 border border-gray-850 rounded-lg p-2 font-semibold text-gray-300 focus:outline-none focus:ring-0 cursor-pointer"
                    >
                      <option value="text">Text Layout</option>
                      <option value="profile">Profile Card</option>
                      <option value="activity">Live Activity</option>
                      <option value="socials">Social Stats</option>
                      <option value="chart">Views Chart</option>
                      <option value="actions">Quick Actions</option>
                    </select>
                  </div>

                  {/* Col Span Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-3xs font-semibold uppercase tracking-wider text-gray-400">
                      <span>Column Span</span>
                      <span className="text-indigo-400 font-bold">{activeItem.colSpan} Columns</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max={cols}
                      value={activeItem.colSpan}
                      onChange={(e) => updateItem(activeItem.id, { colSpan: Number(e.target.value) })}
                      className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                  </div>

                  {/* Row Span Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-3xs font-semibold uppercase tracking-wider text-gray-400">
                      <span>Row Span</span>
                      <span className="text-indigo-400 font-bold">{activeItem.rowSpan} Rows</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={activeItem.rowSpan}
                      onChange={(e) => updateItem(activeItem.id, { rowSpan: Number(e.target.value) })}
                      className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                  </div>
                </div>
                <hr className="border-gray-850" />
              </>
            )}

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gray-300">Component Management</h4>

              <button
                onClick={addItem}
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/10 flex items-center justify-center space-x-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Bento Card</span>
              </button>

              <button
                onClick={resetLayout}
                className="w-full py-2.5 px-4 bg-gray-900 border border-gray-800 hover:border-gray-750 hover:bg-gray-850 text-gray-300 rounded-xl text-xs font-semibold transition-all flex items-center justify-center space-x-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset to Default Layout</span>
              </button>
            </div>

            <div className="bg-gray-900/30 p-3 rounded-lg border border-gray-850 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
              <p className="text-3xs text-gray-500 leading-normal">
                Responsive layouts are handled automatically: columns adapt down to 2 columns on Tablet, and 1 column on Mobile viewports.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'canvas' && (
          <div className="space-y-5">
            <div>
              <h3 className="text-2xs font-semibold text-indigo-400 uppercase tracking-wider mb-4 flex items-center">
                <Palette className="w-3.5 h-3.5 mr-1.5" /> Backdrop Testing
              </h3>

              {/* Background Type Toggles */}
              <div className="grid grid-cols-3 gap-1 bg-gray-900 p-1 rounded-lg border border-gray-800 mb-5">
                {(['solid', 'gradient', 'image'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setBgProp('bgType', type)}
                    className={`py-1 text-2xs font-bold rounded-md capitalize transition-all ${
                      bgType === type
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {/* Background Solid Color Picker */}
              {bgType === 'solid' && (
                <div className="space-y-2">
                  <span className="text-xs text-gray-400 font-medium">Canvas Background Color</span>
                  <div className="flex items-center space-x-2 bg-gray-900 border border-gray-800 rounded-lg p-2">
                    <input
                      type="color"
                      value={bgSolidColor}
                      onChange={(e) => setBgProp('bgSolidColor', e.target.value)}
                      className="w-8 h-8 border-0 rounded cursor-pointer bg-transparent"
                    />
                    <span className="text-xs font-mono text-gray-300 uppercase">{bgSolidColor}</span>
                  </div>
                </div>
              )}

              {/* Background Gradient Presets */}
              {bgType === 'gradient' && (
                <div className="space-y-4">
                  <span className="text-xs text-gray-400 font-medium block">Gradient Presets</span>
                  <div className="grid grid-cols-2 gap-2">
                    {GRADIENT_PRESETS.map((grad) => (
                      <button
                        key={grad.name}
                        onClick={() => setBgProp('bgGradient', grad.value)}
                        className={`p-2 rounded-lg border text-left transition-all ${
                          bgGradient === grad.value
                            ? 'border-indigo-500 bg-indigo-600/5'
                            : 'border-gray-800 hover:border-gray-700 bg-gray-900'
                        }`}
                      >
                        <div
                          className="h-8 rounded mb-1.5"
                          style={{ background: grad.value }}
                        ></div>
                        <span className="text-3xs font-semibold text-gray-300 block text-center">
                          {grad.name}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-2xs text-gray-400 font-medium">Custom CSS Gradient String</span>
                    <textarea
                      value={bgGradient}
                      onChange={(e) => setBgProp('bgGradient', e.target.value)}
                      rows={3}
                      className="w-full text-xs bg-gray-900 border border-gray-800 rounded-lg p-2 font-mono text-gray-300 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              )}

              {/* Background Image Presets */}
              {bgType === 'image' && (
                <div className="space-y-4">
                  <span className="text-xs text-gray-400 font-medium block">Image Presets</span>
                  <div className="grid grid-cols-2 gap-2">
                    {IMAGE_PRESETS.map((img) => (
                      <button
                        key={img.name}
                        onClick={() => setBgProp('bgImage', img.url)}
                        className={`p-2 rounded-lg border text-left transition-all ${
                          bgImage === img.url
                            ? 'border-indigo-500 bg-indigo-600/5'
                            : 'border-gray-800 hover:border-gray-700 bg-gray-900'
                        }`}
                      >
                        <div
                          className="h-12 rounded mb-1.5 bg-cover bg-center"
                          style={{ backgroundImage: `url(${img.url})` }}
                        ></div>
                        <span className="text-3xs font-semibold text-gray-300 block text-center truncate">
                          {img.name}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-2xs text-gray-400 font-medium">Custom Unsplash Image URL</span>
                    <input
                      type="text"
                      value={bgImage}
                      onChange={(e) => setBgProp('bgImage', e.target.value)}
                      className="w-full text-xs bg-gray-900 border border-gray-800 rounded-lg p-2 font-mono text-gray-300 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
