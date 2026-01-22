'use client';

import { Widget } from '@/lib/types/widgets';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WidgetStore {
  widgets: Widget[];
  uiState: {
    id: string | null;
    isEditMode?: boolean;
  };

  setWidgets: (widgets: Widget[]) => void;
  addWidget: (widget: Widget) => void;
  deleteWidget: (id: string) => void;
  setEditMode: (id: string | null) => void;
}

export const useWidgetStore = create<WidgetStore>()(
  persist(
    (set) => ({
      widgets: [],

      uiState: {
        id: null,
        isEditMode: false,
      },

      setWidgets: (widgets) => set({ widgets }),

      addWidget: (widget) =>
        set((state) => ({
          widgets: [...state.widgets, widget],
        })),

      deleteWidget: (id) =>
        set((state) => ({
          widgets: state.widgets.filter((w) => w.id !== id),
        })),

      setEditMode: (id: string | null) =>
        set((state) => ({
          uiState: {
            ...state.uiState,
            id,
            isEditMode: true,
          },
        })),
    }),
    {
      name: 'widget-storage',
      partialize: (state) => ({
        widgets: state.widgets,
      }),
    }
  )
);
