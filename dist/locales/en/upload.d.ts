import type { MessageKit } from '../../lib/messages.js';
/** FileUpload. */
export declare const upload: {
    /** "Drop files here": the drop zone's title, where the application gives none. */
    dropTitle: string;
    /** "or browse from your device": the line under it. */
    dropSubtitle: string;
    /** "(up to 25.0 MB)": the largest file taken, after that line. */
    upTo: (size: string) => string;
    /** "Upload files": the name of the file input, where the application gives none. */
    label: string;
    /** "Ready": a file uploaded, where the application says nothing. */
    ready: string;
    /** "Processing…": a file uploaded, being processed. */
    processing: string;
    /** "Uploading 42%": a file on its way, its progress written. */
    uploading: (progress: string) => string;
    /** "Files (3)": the heading of the list of files, with how many. */
    files: (count: number, { number }: MessageKit) => string;
    /** "Clear completed": the button that takes the files uploaded off the list. */
    clearCompleted: string;
    /** "File exceeds maximum allowed size (25.0 MB)": a file too large, the largest taken written. */
    tooLarge: (size: string) => string;
    /** "Upload failed": a file that could not be uploaded, where its error says nothing. */
    failed: string;
    /** "Retry uploading export.csv": the button that uploads it again. */
    retry: (name: string) => string;
    /** "Remove export.csv": the button that takes it off the list. */
    remove: (name: string) => string;
};
