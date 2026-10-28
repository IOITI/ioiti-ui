import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion, useReducedMotionConfig } from 'framer-motion';
import { useState } from 'react';
import { motionTransitions } from '../lib/motion-tokens.js';
import { cn } from '../lib/utils.js';
import { Hint } from './Hint.js';
const SIZE = {
    xs: 'size-5 text-[9px]',
    sm: 'size-6 text-[10px]',
    md: 'size-8 text-xs',
    lg: 'size-10 text-sm',
};
/** The initials of a name: the first letter of its first two words ("Ana María Ortiz": AM). */
function initialsOf(name) {
    const words = name.trim().split(/\s+/).filter(Boolean);
    return words
        .slice(0, 2)
        .map((word) => Array.from(word)[0] ?? '')
        .join('')
        .toUpperCase();
}
/** A person, as their picture or their initials. */
export function Avatar({ name, src, size = 'md', hint = false, className }) {
    const [failed, setFailed] = useState(false);
    const picture = src && !failed;
    const drawn = (_jsx("span", { role: "img", "aria-label": name, tabIndex: hint ? 0 : undefined, className: cn('inline-grid shrink-0 select-none place-items-center overflow-hidden rounded-full bg-surface-raised font-medium text-text-secondary', SIZE[size], className), children: picture ? (_jsx("img", { src: src, alt: "", className: "size-full object-cover", onError: () => setFailed(true) })) : (_jsx("span", { "aria-hidden": true, children: initialsOf(name) })) }));
    return hint ? _jsx(Hint, { content: name, children: drawn }) : drawn;
}
/**
 * People together, their avatars overlapping: each named in a hint, "+N" naming the rest. An avatar lifts
 * a little under the pointer; not where motion is reduced.
 */
export function AvatarGroup({ people, max = 4, size = 'md', label = 'People', className }) {
    const reduce = useReducedMotionConfig();
    const shown = people.slice(0, max);
    const rest = people.slice(shown.length);
    return (_jsxs("div", { role: "group", "aria-label": label, className: cn('flex items-center -space-x-2', className), children: [shown.map((person, index) => (_jsx(motion.span, { className: "relative inline-flex rounded-full ring-2 ring-background", whileHover: reduce ? undefined : { y: -2 }, transition: motionTransitions.springSnappy, children: _jsx(Avatar, { name: person.name, src: person.src, size: size, hint: true }) }, `${person.name}-${index}`))), rest.length > 0 && (_jsx("span", { className: "relative inline-flex rounded-full ring-2 ring-background", children: _jsx(Hint, { content: rest.map((person) => person.name).join(', '), children: _jsx("span", { role: "img", tabIndex: 0, "aria-label": `${rest.length} more: ${rest.map((person) => person.name).join(', ')}`, className: cn('inline-grid place-items-center rounded-full bg-surface-raised font-medium text-text-secondary', SIZE[size]), children: _jsxs("span", { "aria-hidden": true, children: ["+", rest.length] }) }) }) }))] }));
}
