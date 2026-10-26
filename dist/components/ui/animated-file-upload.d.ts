import React from 'react';
export type FileUploadStatus = 'queued' | 'uploading' | 'processing' | 'complete' | 'error';
export interface UploadFileItem {
    id: string;
    name: string;
    size: number;
    type: string;
    progress: number;
    status: FileUploadStatus;
    errorMessage?: string;
    rawFile?: File;
    /** ioiti-ui: where what the file became is opened, once done (the handler's answer). */
    link?: {
        href: string;
        label: string;
    };
}
/** ioiti-ui: what an upload handler may answer: where its result is opened. */
export type UploadResult = {
    href: string;
    label: string;
} | void;
export interface AnimatedFileUploadProps {
    /** Allow multiple files selection and upload */
    multiple?: boolean;
    /** Accepted MIME types or extensions (e.g., "image/*,application/pdf" or [".png", ".jpg"]) */
    accept?: string | string[];
    /** Maximum file size in bytes (e.g., 10 * 1024 * 1024 for 10MB) */
    maxSize?: number;
    /** Maximum number of files allowed when multiple is true */
    maxFiles?: number;
    /** Custom label for primary drop title */
    dropTitle?: string;
    /** Custom label for secondary browse action */
    dropSubtitle?: string;
    /** Layout mode: standard full-size or compact inline */
    variant?: 'standard' | 'compact';
    /** Disabled state */
    disabled?: boolean;
    /** Initial files list for controlled or default showcase */
    initialFiles?: UploadFileItem[];
    /** Callback fired when files are dropped or selected */
    onFilesSelected?: (files: File[]) => void;
    /** Callback fired when a file upload completes */
    onUploadComplete?: (file: UploadFileItem) => void;
    /** Custom upload simulation or upload handler returning a promise. ioiti-ui: it may answer with a link. */
    uploadHandler?: (file: UploadFileItem, onProgress: (progress: number) => void) => Promise<UploadResult>;
    /** ioiti-ui: the order the files are handled in (EasyUI's: as dropped); read before they are listed. */
    arrange?: (files: File[]) => Promise<File[]>;
    /** ioiti-ui: one file after the other, each when the one before has ended (EasyUI's started them all at once). */
    sequential?: boolean;
    /** ioiti-ui: the words of a file's states (EasyUI's "Uploading N%" and "Ready"). */
    workingLabel?: string;
    doneLabel?: string;
    /** ioiti-ui: what draws a done file's link; the application's (LinkProvider) by default. */
    linkComponent?: React.ElementType;
    /** Custom class name */
    className?: string;
}
export declare const AnimatedFileUpload: React.FC<AnimatedFileUploadProps>;
