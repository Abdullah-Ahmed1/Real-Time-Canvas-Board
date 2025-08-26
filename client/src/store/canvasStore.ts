import { create } from "zustand";

type Rect = { 
  id: string; 
  x: number; 
  y: number; 
  width: number; 
  height: number; 
  color: string 
};

interface CanvasState {
  rectangles: Rect[];
  addRectangle: (rect: Rect) => void;
  moveRectangle: (rect: Rect) => void;
  setRectangles: (rects: Rect[]) => void;
  deleteRectangle: (id: string) => void;
}

export const useCanvasStore = create<CanvasState>((set) => ({
  rectangles: [],
  addRectangle: (rect) => set((s) => ({ rectangles: [...s.rectangles, rect] })),
  moveRectangle: (rect) =>
    set((s) => ({
      rectangles: s.rectangles.map((r) => (r.id === rect.id ? rect : r)),
    })),
  setRectangles: (rects) => set({ rectangles: rects }),
  deleteRectangle: (id) =>
    set((s) => ({
      rectangles: s.rectangles.filter((r) => r.id !== id),
    })),
}));
