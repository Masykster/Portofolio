import { create } from 'zustand';

export interface BentoItem {
  id: string;
  colSpan: number;
  rowSpan: number;
  title: string;
  content: string;
}

export type BgType = 'solid' | 'gradient' | 'image';
export type Breakpoint = 'mobile' | 'tablet' | 'desktop';
export type ExportType = 'css' | 'tailwind' | 'react';

interface GlassBentoState {
  // Glassmorphism controls
  blur: number;
  bgOpacity: number;
  borderOpacity: number;
  borderRadius: number;
  borderWidth: number;
  borderColor: string;
  bgColor: string;
  textColor: 'light' | 'dark';
  insetShadowOpacity: number;
  noiseOverlay: boolean;

  // Preview canvas background controls
  bgType: BgType;
  bgSolidColor: string;
  bgGradient: string;
  bgImage: string;

  // Bento grid controls
  cols: number;
  gap: number;
  items: BentoItem[];
  selectedItemId: string | null;

  // App settings
  breakpoint: Breakpoint;
  exportType: ExportType;

  // Actions
  setGlassProp: (key: 'blur' | 'bgOpacity' | 'borderOpacity' | 'borderRadius' | 'borderWidth' | 'borderColor' | 'bgColor' | 'textColor' | 'insetShadowOpacity' | 'noiseOverlay', value: any) => void;
  setBgProp: (key: 'bgType' | 'bgSolidColor' | 'bgGradient' | 'bgImage', value: any) => void;
  setGridProp: (key: 'cols' | 'gap', value: number) => void;
  setBreakpoint: (breakpoint: Breakpoint) => void;
  setExportType: (exportType: ExportType) => void;

  // Grid item actions
  addItem: () => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, updates: Partial<BentoItem>) => void;
  selectItem: (id: string | null) => void;
  resetLayout: () => void;
  reorderItems: (newItems: BentoItem[]) => void;
}

const DEFAULT_ITEMS: BentoItem[] = [
  { id: '1', colSpan: 4, rowSpan: 2, title: 'Hero Profile', content: 'profile' },
  { id: '2', colSpan: 2, rowSpan: 2, title: 'Live Activity', content: 'activity' },
  { id: '3', colSpan: 2, rowSpan: 4, title: 'Social Stats', content: 'socials' },
  { id: '4', colSpan: 4, rowSpan: 2, title: 'Performance Chart', content: 'chart' },
  { id: '5', colSpan: 4, rowSpan: 2, title: 'Quick Actions', content: 'actions' }
];

export const useStore = create<GlassBentoState>((set) => ({
  // Glassmorphism defaults
  blur: 16,
  bgOpacity: 0.15,
  borderOpacity: 0.2,
  borderRadius: 16,
  borderWidth: 1,
  borderColor: '#ffffff',
  bgColor: '#ffffff',
  textColor: 'light',
  insetShadowOpacity: 0.35,
  noiseOverlay: true,

  // Preview background defaults
  bgType: 'gradient',
  bgSolidColor: '#0f172a',
  bgGradient: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
  bgImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop',

  // Bento grid defaults
  cols: 6,
  gap: 16,
  items: DEFAULT_ITEMS,
  selectedItemId: null,

  // App settings defaults
  breakpoint: 'desktop',
  exportType: 'tailwind',

  // Actions implementations
  setGlassProp: (key, value) => set((state) => ({ ...state, [key]: value })),
  setBgProp: (key, value) => set((state) => ({ ...state, [key]: value })),
  setGridProp: (key, value) => set((state) => ({ ...state, [key]: value })),
  setBreakpoint: (breakpoint) => set({ breakpoint }),
  setExportType: (exportType) => set({ exportType }),

  addItem: () => set((state) => {
    // Generate new unique ID
    const newId = String(Date.now());
    const newItem: BentoItem = {
      id: newId,
      colSpan: 2,
      rowSpan: 2,
      title: `Item ${state.items.length + 1}`,
      content: 'text'
    };
    return {
      items: [...state.items, newItem],
      selectedItemId: newId
    };
  }),

  removeItem: (id) => set((state) => ({
    items: state.items.filter((item) => item.id !== id),
    selectedItemId: state.selectedItemId === id ? null : state.selectedItemId
  })),

  updateItem: (id, updates) => set((state) => ({
    items: state.items.map((item) => (item.id === id ? { ...item, ...updates } : item))
  })),

  selectItem: (id) => set({ selectedItemId: id }),

  resetLayout: () => set({
    cols: 6,
    gap: 16,
    items: DEFAULT_ITEMS,
    selectedItemId: null
  }),

  reorderItems: (newItems) => set({ items: newItems })
}));
