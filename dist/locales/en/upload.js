/** AnimatedFileUpload. */
export const upload = {
    /** "Drop files here": the drop zone's title, where the application gives none. */
    dropTitle: 'Drop files here',
    /** "or browse from your device": the line under it. */
    dropSubtitle: 'or browse from your device',
    /** "(up to 25.0 MB)": the largest file taken, after that line. */
    upTo: (size) => `(up to ${size})`,
    /** "Upload files": the name of the file input, where the application gives none. */
    label: 'Upload files',
    /** "Ready": a file uploaded, where the application says nothing. */
    ready: 'Ready',
    /** "Processing…": a file uploaded, being processed. */
    processing: 'Processing…',
    /** "Uploading 42%": a file on its way, its progress written. */
    uploading: (progress) => `Uploading ${progress}`,
    /** "Files (3)": the heading of the list of files, with how many. */
    files: (count, { number }) => `Files (${number(count)})`,
    /** "Clear completed": the button that takes the files uploaded off the list. */
    clearCompleted: 'Clear completed',
    /** "File exceeds maximum allowed size (25.0 MB)": a file too large, the largest taken written. */
    tooLarge: (size) => `File exceeds maximum allowed size (${size})`,
    /** "Upload failed": a file that could not be uploaded, where its error says nothing. */
    failed: 'Upload failed',
    /** "Retry uploading export.csv": the button that uploads it again. */
    retry: (name) => `Retry uploading ${name}`,
    /** "Remove export.csv": the button that takes it off the list. */
    remove: (name) => `Remove ${name}`,
};
