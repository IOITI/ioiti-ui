import { createContext, useContext } from 'react'

import type { VelocityToastVariant } from './ui/velocity-toast.js'

export interface ToastMessage {
  title: string
  description?: string
  variant?: VelocityToastVariant
}

export type ShowToast = (message: ToastMessage) => void

export const ToastContext = createContext<ShowToast | null>(null)

export function useToast(): ShowToast {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used inside <ToastProvider>')
  return context
}

/**
 * Lifts the toasts above what sits at the bottom of the page (a SaveBar), by its height: each gives its own
 * under its key, 0 once it is gone; the toasts clear the highest.
 */
export const ToastInsetContext = createContext<((key: string, inset: number) => void) | null>(null)
