"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ChevronRight, Ellipsis } from "lucide-react";
import { motionTransitions } from "../../lib/motion-tokens.js";
import { PRESSABLE } from "../../lib/recipes.js";
import { cn } from "../../lib/utils.js";
import { useLinkComponent } from "../link-context.js";

// ioiti-ui: the design's spring for what follows the pointer and what arrives (springSnappy), not one of its own.
const spring = motionTransitions.springSnappy;

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

export interface BreadcrumbProps extends Omit<React.ComponentProps<"nav">, "children"> {
  items: BreadcrumbItem[];
  separator?: "chevron" | "slash";
  /** Collapse the middle into "…" when there are more items than this. */
  maxItems?: number;
  /** Your router's link, e.g. next/link. ioiti-ui: the application's link (LinkProvider) by default, else <a>. */
  as?: React.ElementType;
  /**
   * ioiti-ui: false keeps the trail on one line (the top bar), each crumb cut
   * short with an ellipsis, the last one first, instead of going to a second line.
   */
  wrap?: boolean;
}

export function Breadcrumb({
  items,
  separator = "chevron",
  maxItems = 4,
  as,
  wrap = true,
  className,
  ...props
}: BreadcrumbProps) {
  // ioiti-ui: the application's link (LinkProvider) unless one is given.
  const LinkComponent = useLinkComponent(as);
  const uid = React.useId();
  const listRef = React.useRef<HTMLOListElement>(null);
  const [expanded, setExpanded] = React.useState(false);
  const [hover, setHover] = React.useState<number | null>(null);

  const canCollapse = items.length > maxItems;
  const tail = Math.max(1, maxItems - 2); // items kept at the end while collapsed
  const hiddenFrom = 1;
  const hiddenTo = items.length - tail; // exclusive
  const collapsed = canCollapse && !expanded;

  // move focus to the first revealed crumb
  React.useEffect(() => {
    if (expanded) listRef.current?.querySelector<HTMLElement>("[data-revealed]")?.focus();
  }, [expanded]);

  const entries: (number | "more")[] = [];
  items.forEach((_, i) => {
    if (collapsed && i >= hiddenFrom && i < hiddenTo) {
      if (i === hiddenFrom) entries.push("more");
    } else entries.push(i);
  });

  const sep = (
    <span aria-hidden className="text-border-hover [&>svg]:size-3.5">
      {separator === "slash" ? <span className="text-sm">/</span> : <ChevronRight />}
    </span>
  );

  const linkBase =
    // ioiti-ui: the design's focus ring alone (design.css), not one of its own beside it.
    "relative flex h-8 items-center gap-1.5 rounded-lg px-2 text-sm outline-none";

  return (
    <nav aria-label="Breadcrumb" className={className} {...props}>
      <ol
        ref={listRef}
        onMouseLeave={() => setHover(null)}
        className={cn(
          "flex items-center gap-x-0.5 gap-y-1 text-muted-foreground",
          wrap ? "flex-wrap" : "min-w-0 flex-nowrap",
        )}
      >
        {entries.map((entry, n) => {
          const first = n === 0;

          if (entry === "more") {
            return (
              <motion.li key="more" layout="position" className="flex items-center gap-0.5">
                {sep}
                <button
                  type="button"
                  aria-label="Show hidden pages"
                  onClick={() => setExpanded(true)}
                  // ioiti-ui: the design's focus ring alone (design.css), not one of its own beside it.
                  className={cn("grid size-8 place-items-center rounded-lg outline-none transition hover:bg-surface-hover hover:text-foreground", PRESSABLE)}
                >
                  <Ellipsis className="size-4" />
                </button>
              </motion.li>
            );
          }

          const item = items[entry];
          const isLast = entry === items.length - 1;
          const revealed = expanded && canCollapse && entry >= hiddenFrom && entry < hiddenTo;
          const body = (
            <span className={cn("relative flex items-center gap-1.5 [&>svg]:size-4 [&>svg]:shrink-0", !wrap && "min-w-0")}>
              {item.icon}
              {/* ioiti-ui: the name, which the top bar measures whole (TopBarTrail) */}
              <span data-crumb-name="" className={cn(!wrap && "truncate")}>{item.label}</span>
            </span>
          );

          return (
            <motion.li
              key={entry}
              layout="position"
              initial={revealed ? { opacity: 0, x: -6 } : false}
              animate={{ opacity: 1, x: 0 }}
              transition={spring}
              className={cn(
                "flex items-center gap-0.5",
                !wrap && (isLast ? "min-w-0" : "max-w-64 min-w-0 shrink-0"),
              )}
            >
              {!first && sep}
              {isLast || !item.href ? (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={cn(linkBase, isLast && "font-medium text-foreground", !wrap && "min-w-0")}
                >
                  {body}
                </span>
              ) : (
                <LinkComponent
                  href={item.href}
                  data-revealed={revealed && entry === hiddenFrom ? "" : undefined}
                  onMouseEnter={() => setHover(entry)}
                  onFocus={() => setHover(entry)}
                  onBlur={() => setHover(null)}
                  className={cn(linkBase, "transition-colors hover:text-foreground", !wrap && "min-w-0")}
                >
                  {hover === entry && (
                    <motion.span
                      layoutId={`${uid}-hover`}
                      transition={spring}
                      className="absolute inset-0 rounded-lg bg-surface-hover"
                    />
                  )}
                  {body}
                </LinkComponent>
              )}
            </motion.li>
          );
        })}
      </ol>
    </nav>
  );
}
