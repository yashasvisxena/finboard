'use client';

import { Widget } from '@/types/widgets/widgetTypes';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WidgetStore {
  widgets: Widget[];
  uiState: {
    id: string | null;
    isEditMode: boolean;
  };

  addWidget: (widget: Widget) => void;
  setWidgets: (widgets: Widget[]) => void;
  updateWidget: (id: string, widget: Partial<Widget>) => void;
  deleteWidget: (id: string) => void;
  setEditMode: (id: string | null) => void;
}

export const useWidgetStore = create<WidgetStore>()(
  persist(
    (set) => ({
      widgets: [],
      uiState: { id: null, isEditMode: false },

      setWidgets: (widgets: Widget[]) => set({ widgets }),

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
        widgets: state.widgets.map(({ data: _data, ...rest }) => rest),
      }),
    }
  )
);
