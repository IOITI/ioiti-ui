import { createContext, useContext } from 'react'

import type { VelocityToastVariant } from './ui/velocity-toast.js'

/**
 * The one thing a toast leads on to: where its news is dealt with (`href`, a link drawn by the application's,
 * LinkProvider) or what is done about it (`onClick`, a button). Using it closes the toast.
 */
export interface ToastAction {
  /** Its words: where it leads or what it does ("Open the job", "Retry"). */
  label: string
  /** Where it leads: the toast draws a link. */
  href?: string
  /** What it does: the toast draws a button (with `href`, it runs as the link is followed). */
  onClick?: () => void
}

export interface ToastMessage {
  title: string
  description?: string
  variant?: VelocityToastVariant
  /** One thing to do from the toast: a link or a button, beside its words. Such a toast stays longer (6 s). */
  action?: ToastAction
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
