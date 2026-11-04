import { jsx as _jsx } from "react/jsx-runtime";
import { DirectionalTooltip } from './ui/directional-tooltip.js';
/**
 * What a `title` said, shown on hover, on keyboard focus and on a tap, and read by screen readers:
 * a title shows on none of a phone, a keyboard or a disabled control. EasyUI's tooltip.
 */
export function Hint({ content, children, side = 'top', wrap = false, className }) {
    // A wrapper with nothing to say would be a stop of the keyboard for nothing. It gives way where the hint is
    // let to (`className="min-w-0"`): a text cut short in it (CopyChip's `truncate="end"`) was never cut, its
    // chip as wide as the whole value, past a phone's screen.
    const said = content !== null && content !== undefined && content !== false && content !== '';
    return (_jsx(DirectionalTooltip, { content: content, side: side, wrapperClassName: className, children: wrap && said ? (_jsx("span", { tabIndex: 0, className: "inline-flex min-w-0 rounded-md [&>:disabled]:pointer-events-none", children: children })) : (children) }));
}
