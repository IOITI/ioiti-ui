'use client';

import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils.js';
import { motionTransitions } from '../../lib/motion-tokens.js';
import { CLOSE_MD, DIALOG, SCRIM } from '../../lib/recipes.js';
// ioiti-ui: held by its caller or by itself, as every layer (useControllableState); a former name said once, in
// development (deprecated).
import { useControllableState } from '../../lib/controllable.js';
import { deprecated } from '../../lib/deprecated.js';
// ioiti-ui: EasyUI's name kept until 1.0, drawing this one (renamed).
import { renamed } from '../../lib/renamed.js';
// ioiti-ui: the focus kept as every layer over the page keeps it; a dialog without a name said to its developer.
import { devWarn } from '../../lib/dev.js';
import { useFocusScope } from '../../lib/focus-scope.js';
// ioiti-ui: its close button named in the provider's language.
import { useMessages } from '../locale-context.js';

// ioiti-ui: named after its role, `Dialog` (EasyUI's `SettleModal`, its former name: at the end of the file).
export interface DialogProps {
  /** ioiti-ui: open, held by the page (told of each change by `onOpenChange`, of its closing by `onClose`). */
  open?: boolean;
  /** ioiti-ui: open at first, the dialog holding it then (it closes itself); closed by default. */
  defaultOpen?: boolean;
  /** ioiti-ui: told of every change, whoever holds it: `false` when Escape, its backdrop or its × closes it. */
  onOpenChange?: (open: boolean) => void;
  /** Told when Escape, its backdrop or its × closes it. */
  onClose?: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  /** Footer area (typically action buttons) */
  footer?: React.ReactNode;
  /** ioiti-ui: its close (×) button, in the top-right (true), as every layer names it. */
  showCloseButton?: boolean;
  /** @deprecated Use `showCloseButton`. Removed in 1.0. The other way round: `hideCloseButton` is `showCloseButton={false}`. */
  hideCloseButton?: boolean;
  /**
   * ioiti-ui: its name, for a dialog without a `title`: a screen reader says "dialog" and nothing else without one. In
   * development, a dialog with neither says so in the console.
   */
  'aria-label'?: string;
  /** ioiti-ui: the id of what names it, where that is not its `title` (a heading of its own in `children`). */
  'aria-labelledby'?: string;
  /** Click on backdrop closes the modal (default true) */
  closeOnBackdrop?: boolean;
  /**
   * Maximum width of the modal (Tailwind class). ioiti-ui: `xl` for a form with rows of fields, `full` for
   * what is read side by side (two versions of a script).
   */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}


const sizeMap: Record<NonNullable<DialogProps['size']>, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
  full: 'max-w-[110rem]',
};

/**
 * Dialog — Content has a tiny scale + settle instead of a generic fade.
 *
 * ioiti-ui: EasyUI's SettleModal, named after its role.
 *
 * ioiti-ui: one calm entrance, the design's: the panel grows from what opened
 * it (0.96 to 1, 6 px of travel, springGentle), without EasyUI's overshoot
 * (0.94 -> 1.02 -> 1), and its content with it rather than a layer after it.
 * It leaves quicker than it came (easeExit).
 *
 * ioiti-ui: rendered in document.body, so that it takes nothing from the element
 * that opens it (a table cell passes its alignment and wrapping on to what is
 * inside it). Keyboard focus moves into the dialog when it opens, stays in it,
 * and goes back to where it was when it closes.
 */
export const Dialog: React.FC<DialogProps> = ({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  onClose: onClosed,
  title,
  description,
  children,
  footer,
  showCloseButton,
  hideCloseButton,
  closeOnBackdrop = true,
  size = 'md',
  className,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}) => {
  // ioiti-ui: open, held by the page or by the dialog (useControllableState); what closes it tells `onOpenChange` and
  // `onClose`. `showCloseButton`, as every layer names it; `hideCloseButton`, its former name the other way round, read
  // where it alone is given.
  const [open, setOpen] = useControllableState(openProp, defaultOpen, onOpenChange);
  const onClose = () => {
    setOpen(false);
    onClosed?.();
  };
  if (hideCloseButton !== undefined) deprecated('hide-close-button', 'Dialog');
  const withCloseButton = showCloseButton ?? !hideCloseButton;
  const titleId = useId();
  const words = useMessages().dialog;
  const dialogRef = useRef<HTMLDivElement>(null);
  // ioiti-ui: the dialog grows from what opened it: the middle of the control the focus is on when it
  // opens (the effect below moves it into the dialog), as the panel's transform origin; from its centre
  // when nothing did.
  const panelRef = useRef<HTMLDivElement>(null);
  const [origin, setOrigin] = useState<string | undefined>(undefined);
  useLayoutEffect(() => {
    if (!open) return;
    const opener = document.activeElement;
    const panel = panelRef.current;
    if (!panel || !(opener instanceof HTMLElement) || opener === document.body) {
      setOrigin(undefined);
      return;
    }
    // Its place on the screen, which a transform does not move (the layer is the whole window).
    const from = opener.getBoundingClientRect();
    setOrigin(`${from.left + from.width / 2 - panel.offsetLeft}px ${from.top + from.height / 2 - panel.offsetTop}px`);
  }, [open]);
  // Callers pass a new function at every render: read through a ref, so that
  // the effect below runs when the dialog opens and closes, not at each render.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  // ioiti-ui: the focus as every layer over the page keeps it (useFocusScope): moved in, kept in by Tab, given back to
  // what opened it, the latest layer opened keeping it (what floats beside a control in it keeps its own keys). It goes
  // to the dialog itself, not a control in it: Enter does nothing until the user has moved to the control they mean.
  useFocusScope(dialogRef, {
    active: open,
    initialFocus: () => dialogRef.current,
    onEscape: () => onCloseRef.current(),
  });

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  // ioiti-ui: a dialog without a name said to its developer, once (in development only).
  const unnamed = !title && !ariaLabel && !ariaLabelledBy;
  useEffect(() => {
    if (open && unnamed) devWarn('dialog-unnamed');
  }, [open, unnamed]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <div
          ref={dialogRef}
          tabIndex={-1}
          // ioiti-ui: kept above the page while a page changes, as every layer over it (over-page, motion.css).
          className="fixed inset-0 z-50 flex items-center justify-center p-4 text-left outline-none over-page"
          // ioiti-ui: named by its title, or by what the caller says names it.
          aria-labelledby={ariaLabelledBy ?? (title ? titleId : undefined)}
          aria-label={ariaLabel}
          // ioiti-ui: its description is read with its title.
          aria-describedby={description ? `${titleId}-description` : undefined}
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop fades in softly. ioiti-ui: lighter under the glass material, and the panel glass (glass-float). */}
          <motion.div
            className={cn('absolute inset-0', SCRIM)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            // ioiti-ui: the scrims' motion: easeFast arriving, easeExit leaving.
            exit={{ opacity: 0, transition: motionTransitions.easeExit }}
            transition={motionTransitions.easeFast}
            onClick={() => closeOnBackdrop && onClose()}
          />

          {/* Panel: scale + slight travel for the "settle" feel. ioiti-ui: from what opened it, no overshoot. */}
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, scale: 0.96, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, transition: motionTransitions.easeExit }}
            transition={motionTransitions.springGentle}
            style={{ transformOrigin: origin }}
            className={cn(
              // ioiti-ui: no taller than the screen; what does not fit scrolls inside it (a phone, a long form).
              DIALOG,
              'relative w-full max-h-[calc(100dvh-2rem)] overflow-y-auto p-6 sm:p-8 focus:outline-none',
              sizeMap[size],
              className
            )}
          >
            {withCloseButton && (
              <button
                type="button"
                aria-label={words.close}
                onClick={onClose}
                className={cn(CLOSE_MD, 'absolute top-3 right-3 focus-ring')}
              >
                <X />
              </button>
            )}

            {/* ioiti-ui: the content arrives with the panel, not a layer after it. */}
            <div>
              {title && (
                <h2
                  id={titleId}
                  className="text-lg sm:text-xl font-semibold tracking-tight text-foreground text-balance pr-8"
                >
                  {title}
                </h2>
              )}
              {description && (
                <p id={`${titleId}-description`} className="text-sm text-muted-foreground mt-1.5 leading-relaxed text-pretty">{description}</p>
              )}

              {children && <div className="mt-5">{children}</div>}

              {footer && <div className="mt-6 flex justify-end gap-2">{footer}</div>}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

// ioiti-ui: EasyUI's names, until 1.0: the former name draws the dialog, and says once, in development, that it is
// deprecated (renamed).
/** @deprecated Use `Dialog`. Removed in 1.0. */
export const SettleModal = renamed(Dialog, 'SettleModal');
/** @deprecated Use `DialogProps`. Removed in 1.0. */
export type SettleModalProps = DialogProps;
