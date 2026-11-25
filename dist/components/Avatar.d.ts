type AvatarSize = 'xs' | 'sm' | 'md' | 'lg';
/** The props of `Avatar`. */
export interface AvatarProps {
    /** Whose it is: its initials are drawn from it, and a screen reader hears it. */
    name: string;
    /** A picture, from the application's own origin; the initials where there is none, or it fails. */
    src?: string;
    size?: AvatarSize;
    /** The name in a hint, the avatar a stop of the keyboard to show it. */
    hint?: boolean;
    className?: string;
}
/** A person, as their picture or their initials. */
export declare function Avatar({ name, src, size, hint, className }: AvatarProps): import("react").JSX.Element;
/** The props of `AvatarGroup`. */
export interface AvatarGroupProps {
    people: {
        name: string;
        src?: string;
    }[];
    /** The avatars shown before "+N" says how many more. */
    max?: number;
    size?: AvatarSize;
    /** The group's name for a screen reader: "Who works on it"; the provider's language's "People" by default. */
    label?: string;
    className?: string;
}
/**
 * People together, their avatars overlapping: each named in a hint, "+N" naming the rest, in the provider's language.
 * An avatar lifts a little under the pointer; not where motion is reduced.
 */
export declare function AvatarGroup({ people, max, size, label, className }: AvatarGroupProps): import("react").JSX.Element;
export {};
