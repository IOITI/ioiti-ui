import { jsx as _jsx } from "react/jsx-runtime";
import { DirectionalTooltip } from './ui/directional-tooltip.js';
/**
 * What a `title` said, shown on hover, on keyboard focus and on a tap, and read by screen readers:
 * a title shows on none of a phone, a keyboard or a disabled control. EasyUI's tooltip.
 */
export function Hint({ content, children, side = 'top', wrap = false, className }) {
    // A wrapper with nothing to say would be a stop of the keyboard for nothing.
    const said = content !== null && content !== undefined && content !== false && content !== '';
    return (_jsx(DirectionalTooltip, { content: content, side: side, wrapperClassName: className, children: wrap && said ? (_jsx("span", { tabIndex: 0, className: "inline-flex rounded-md [&>:disabled]:pointer-events-none", children: children })) : (children) }));
}
