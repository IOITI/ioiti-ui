"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CircleAlert, CircleCheck, Info, TriangleAlert, X, type LucideIcon } from "lucide-react";
import { motionTransitions } from "../../lib/motion-tokens.js";
import { CLOSE_MD, TONE_LINE, TONE_SOFT, TONE_TEXT, type Tone } from "../../lib/recipes.js";
// ioiti-ui: its tone, the package's word for a status (StatusTone, docs/conventions.md).
import type { StatusTone } from "../../lib/tones.js";
import { cn } from "../../lib/utils.js";
// ioiti-ui: its × button's name in the provider's language (`status`).
import { useMessages } from "../locale-context.js";

/** ioiti-ui: a StatusTone, the tones of a state (Badge's too): `neutral`, `info`, `success`, `warning`, `danger`. */
export type AlertTone = StatusTone;

// ioiti-ui: the design's tones (recipes.ts): an alert's box is the tone's faint ground and line, its icon the tone.
const TONE: Record<AlertTone, Tone> = { neutral: "neutral", info: "info", success: "positive", warning: "warning", danger: "negative" };

const tone = (alert: AlertTone, Icon: LucideIcon) => ({
  box: cn(TONE_SOFT[TONE[alert]], TONE_LINE[TONE[alert]]),
  icon: TONE_TEXT[TONE[alert]],
  Icon,
});

const tones: Record<AlertTone, { box: string; icon: string; Icon: LucideIcon }> = {
  neutral: tone("neutral", Info),
  info: tone("info", Info),
  success: tone("success", CircleCheck),
  warning: tone("warning", TriangleAlert),
  danger: tone("danger", CircleAlert),
};

export interface AlertProps extends Omit<React.ComponentProps<"div">, "title"> {
  tone?: AlertTone;
  /** Custom icon, or `false` for none. */
  icon?: React.ReactNode | false;
  dismissible?: boolean;
  /** Fires after the collapse animation finishes. */
  onDismiss?: () => void;
  /** Right-side slot, e.g. a button. */
  action?: React.ReactNode;
}

export function Alert({
  tone = "neutral",
  icon,
  dismissible,
  onDismiss,
  action,
  className,
  children,
  ...props
}: AlertProps) {
  const [visible, setVisible] = React.useState(true);
  const t = tones[tone];
  const words = useMessages().status;

  return (
    <AnimatePresence initial={false} onExitComplete={onDismiss}>
      {visible && (
        <motion.div
          key="alert"
          initial={false}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          // ioiti-ui: it only leaves (initial={false}), with the design's exit, quicker than an entrance.
          transition={motionTransitions.easeExit}
          className="overflow-hidden"
        >
          <div
            role={tone === "danger" || tone === "warning" ? "alert" : "status"}
            className={cn("flex items-start gap-3 rounded-xl border p-4 text-sm", t.box, className)}
            {...props}
          >
            {icon !== false && (
              <span className={cn("mt-0.5 shrink-0 [&>svg]:size-4", t.icon)}>{icon ?? <t.Icon />}</span>
            )}
            <div className="min-w-0 flex-1">{children}</div>
            {action && <div className="-my-1 shrink-0">{action}</div>}
            {dismissible && (
              <button
                type="button"
                aria-label={words.dismiss}
                onClick={() => setVisible(false)}
                // ioiti-ui: the design's focus ring alone (design.css), not one of its own beside it.
                className={cn(CLOSE_MD, "-mr-1.5 -mt-1.5 outline-none")}
              >
                <X />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function AlertTitle({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("font-medium text-foreground text-balance", className)} {...props} />;
}

// ioiti-ui: a div, not a p: a description may hold a list, paragraphs, a Disclosure (in a p, invalid HTML).
export function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("mt-0.5 text-muted-foreground text-pretty", className)} {...props} />;
}
