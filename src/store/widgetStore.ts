'use client';

import { mockLayouts, mockWidgets } from '@/constants/mock';
import { Widget, WidgetLayout } from '@/types/widgets/widgetTypes';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WidgetStore {
  widgets: Widget[];
  layouts: WidgetLayout[];
  uiState: {
    id: string | null;
    isEditMode: boolean;
  };

  addWidget: (widget: Widget, layout: WidgetLayout) => void;
  updateWidget: (id: string, widget: Partial<Widget>) => void;
  deleteWidget: (id: string) => void;
  setEditMode: (id: string | null) => void;
  updateLayouts: (layouts: readonly WidgetLayout[]) => void;
}

export const useWidgetStore = create<WidgetStore>()(
  persist(
    (set) => ({
      widgets: mockWidgets,
      layouts: mockLayouts,
      uiState: { id: null, isEditMode: false },

      addWidget: (widget, layout) =>
        set((s) => ({
          widgets: [...s.widgets, widget],
          layouts: [...s.layouts, layout],
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
          layouts: s.layouts.filter((l) => l.i !== id),
        })),

      setEditMode: (id) =>
        set({
          uiState: {
            id,
            isEditMode: Boolean(id),
          },
        }),

      updateLayouts: (layouts) => set({ layouts: [...layouts] }),
    }),
    {
      name: 'widget-storage',
      partialize: (state) => ({
        widgets: state.widgets.map(({ data, ...rest }) => rest),
        layouts: state.layouts,
      }),
    }
  )
);
