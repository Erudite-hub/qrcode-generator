import { create } from 'zustand';
import { QRContentType, QRDesignConfig } from '../types/qr';

export const defaultDesignConfig: QRDesignConfig = {
  foreground: '#000000',
  background: '#ffffff',
  dotStyle: 'square',
  cornerSquareStyle: 'square',
  cornerDotStyle: 'square',
  errorCorrection: 'M',
  width: 300,
  height: 300,
  margin: 10,
};

interface QRState {
  // Current generation state
  contentType: QRContentType;
  content: string;
  design: QRDesignConfig;
  
  // History state
  pastDesigns: QRDesignConfig[];
  futureDesigns: QRDesignConfig[];
  
  // Actions
  setContentType: (type: QRContentType) => void;
  setContent: (content: string) => void;
  setDesign: (design: Partial<QRDesignConfig>) => void;
  resetDesign: () => void;
  undo: () => void;
  redo: () => void;
}

export const useQRStore = create<QRState>((set) => ({
  contentType: 'url',
  content: 'https://example.com',
  design: { ...defaultDesignConfig },
  pastDesigns: [],
  futureDesigns: [],
  
  setContentType: (type) => set({ contentType: type }),
  setContent: (content) => set({ content }),
  setDesign: (newDesign) => set((state) => {
    // Only save to history if there is an actual change (basic check)
    const updatedDesign = { ...state.design, ...newDesign };
    if (JSON.stringify(state.design) === JSON.stringify(updatedDesign)) {
      return {};
    }
    return { 
      pastDesigns: [...state.pastDesigns, state.design],
      futureDesigns: [],
      design: updatedDesign 
    };
  }),
  resetDesign: () => set((state) => ({ 
    pastDesigns: [...state.pastDesigns, state.design],
    futureDesigns: [],
    design: { ...defaultDesignConfig } 
  })),
  undo: () => set((state) => {
    if (state.pastDesigns.length === 0) return {};
    const previous = state.pastDesigns[state.pastDesigns.length - 1];
    const newPast = state.pastDesigns.slice(0, -1);
    return {
      pastDesigns: newPast,
      futureDesigns: [state.design, ...state.futureDesigns],
      design: previous,
    };
  }),
  redo: () => set((state) => {
    if (state.futureDesigns.length === 0) return {};
    const next = state.futureDesigns[0];
    const newFuture = state.futureDesigns.slice(1);
    return {
      pastDesigns: [...state.pastDesigns, state.design],
      futureDesigns: newFuture,
      design: next,
    };
  }),
}));
