'use client';

import { IWidget } from '@/types/widget.types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WidgetStore {
  widgets: IWidget[];
  uiState: {
    id: string | null;
    isEditMode: boolean;
  };

  addWidget: (widget: IWidget) => void;
  setWidgets: (widgets: IWidget[]) => void;
  updateWidget: (id: string, widget: Partial<IWidget>) => void;
  deleteWidget: (id: string) => void;
  setEditMode: (id: string | null) => void;
}

export const useWidgetStore = create<WidgetStore>()(
  persist(
    (set) => ({
      widgets: [],
      uiState: { id: null, isEditMode: false },

      setWidgets: (widgets) => set({ widgets }),

      addWidget: (widget) =>
        set((s) => ({
          widgets: [...s.widgets, widget],
        })),

      updateWidget: (id, widget) =>
        set((s) => ({
          widgets: s.widgets.map((w) =>
            w.id === id ? { ...w, ...widget } : w
          ),
        })),

      deleteWidget: (id) =>
        set((s) => ({
          widgets: s.widgets.filter((w) => w.id !== id),
        })),

      setEditMode: (id) =>
        set({
          uiState: {
            id,
            isEditMode: Boolean(id),
          },
        }),
    }),
    {
      name: 'widget-storage',
      partialize: (state) => ({
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        widgets: state.widgets.map(({ ...rest }) => rest),
      }),
    }
  )
);
