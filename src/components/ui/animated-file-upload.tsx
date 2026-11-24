'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  File as FileIcon,
  Check,
  AlertCircle,
  X,
  RotateCcw,
  FileText,
  Image as ImageIcon,
  Film,
  Music,
  Archive,
  Code
} from 'lucide-react';
import { cn } from '../../lib/utils.js';
import { motionTransitions } from '../../lib/motion-tokens.js';
import { CLOSE_SM, TONE_LINE, TONE_SOFT } from '../../lib/recipes.js';
import { useLinkComponent } from '../link-context.js';
// ioiti-ui: its words in the provider's language (useMessages), its sizes and progress in its locale (useFormat).
import { useFormat, useMessages } from '../locale-context.js';

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
  link?: { href: string; label: string };
}

/** ioiti-ui: what an upload handler may answer: where its result is opened. */
export type UploadResult = { href: string; label: string } | void;

export interface AnimatedFileUploadProps {
  /** Allow multiple files selection and upload */
  multiple?: boolean;
  /** Accepted MIME types or extensions (e.g., "image/*,application/pdf" or [".png", ".jpg"]) */
  accept?: string | string[];
  /** Maximum file size in bytes (e.g., 10 * 1024 * 1024 for 10MB) */
  maxSize?: number;
  /** Maximum number of files allowed when multiple is true */
  maxFiles?: number;
  /** Custom label for primary drop title. ioiti-ui: "Drop files here" in the provider's language by default. */
  dropTitle?: string;
  /** Custom label for secondary browse action. ioiti-ui: "or browse from your device" in the provider's language by default. */
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
  uploadHandler?: (
    file: UploadFileItem,
    onProgress: (progress: number) => void
  ) => Promise<UploadResult>;
  /** ioiti-ui: the order the files are handled in (EasyUI's: as dropped); read before they are listed. */
  arrange?: (files: File[]) => Promise<File[]>;
  /** ioiti-ui: one file after the other, each when the one before has ended (EasyUI's started them all at once). */
  sequential?: boolean;
  /** ioiti-ui: what a file on its way says: "Uploading 42%" in the provider's language by default (EasyUI's "Uploading N%"). */
  workingLabel?: string;
  /** ioiti-ui: what a file uploaded says: "Ready" in the provider's language by default. */
  doneLabel?: string;
  /** ioiti-ui: what draws a done file's link; the application's (LinkProvider) by default. */
  linkComponent?: React.ElementType;
  /** ioiti-ui: the name of its file input, what a test or a script finds it by: "Upload files" in the provider's language by default. */
  label?: string;
  /** ioiti-ui: a file taken off the list by its Remove (the application forgets what it did with it). */
  onRemove?: (file: UploadFileItem) => void;
  /** Custom class name */
  className?: string;
}

const getFileIcon = (fileName: string, mimeType: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  if (mimeType.startsWith('image/') || ['jpg', 'jpeg', 'png', 'svg', 'webp', 'gif'].includes(ext)) {
    return ImageIcon;
  }
  if (mimeType.startsWith('video/') || ['mp4', 'mov', 'webm', 'mkv'].includes(ext)) {
    return Film;
  }
  if (mimeType.startsWith('audio/') || ['mp3', 'wav', 'ogg', 'flac'].includes(ext)) {
    return Music;
  }
  if (['zip', 'rar', 'tar', 'gz', '7z'].includes(ext)) {
    return Archive;
  }
  if (['ts', 'tsx', 'js', 'jsx', 'json', 'html', 'css', 'py', 'rs', 'go'].includes(ext)) {
    return Code;
  }
  if (['pdf', 'doc', 'docx', 'txt', 'md'].includes(ext)) {
    return FileText;
  }
  return FileIcon;
};

export const AnimatedFileUpload: React.FC<AnimatedFileUploadProps> = ({
  multiple = true,
  accept,
  maxSize = 25 * 1024 * 1024, // 25MB default
  maxFiles = 10,
  dropTitle,
  dropSubtitle,
  variant = 'standard',
  disabled = false,
  initialFiles,
  onFilesSelected,
  onUploadComplete,
  uploadHandler,
  arrange,
  sequential = false,
  workingLabel,
  doneLabel,
  linkComponent,
  label,
  onRemove,
  className,
}) => {
  // ioiti-ui: the application's link (LinkProvider) unless one is given.
  const LinkComponent = useLinkComponent(linkComponent);
  // ioiti-ui: sizes written as the package writes them everywhere (formatBytes: kB of 1000 bytes), not KB of 1024, and
  // a progress as a percentage, both as the provider's locale writes them ("2.0 kB", "42%"; "2,0 ko", "42 %" in French).
  const { formatBytes: formatFileSize, formatPercent } = useFormat();
  // ioiti-ui: its words in the provider's language, the ones given over them.
  const words = useMessages().upload;
  const formatProgress = (progress: number) =>
    formatPercent(progress, false, Math.min(20, String(progress).split('.')[1]?.length ?? 0));
  const [isDragOver, setIsDragOver] = useState(false);
  const [files, setFiles] = useState<UploadFileItem[]>(initialFiles || []);
  const inputRef = useRef<HTMLInputElement>(null);

  const acceptString = Array.isArray(accept) ? accept.join(',') : accept;

  const simulateUpload = useCallback(
    (fileItem: UploadFileItem) => {
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += Math.floor(Math.random() * 18) + 12;
        if (currentProgress >= 90 && currentProgress < 100) {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileItem.id
                ? { ...f, progress: 92, status: 'processing' }
                : f
            )
          );
        } else if (currentProgress >= 100) {
          clearInterval(interval);
          setFiles((prev) =>
            prev.map((f) => {
              if (f.id === fileItem.id) {
                const updated = { ...f, progress: 100, status: 'complete' as const };
                onUploadComplete?.(updated);
                return updated;
              }
              return f;
            })
          );
        } else {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileItem.id
                ? { ...f, progress: currentProgress, status: 'uploading' }
                : f
            )
          );
        }
      }, 180);
    },
    [onUploadComplete]
  );

  const processIncomingFiles = useCallback(
    async (dropped: File[]) => {
      if (disabled) return;
      const incoming = arrange ? await arrange(dropped) : dropped;
      const validFiles: UploadFileItem[] = [];

      incoming.forEach((file) => {
        const id = `${file.name}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        const isOverSize = maxSize && file.size > maxSize;

        if (isOverSize) {
          validFiles.push({
            id,
            name: file.name,
            size: file.size,
            type: file.type,
            progress: 0,
            status: 'error',
            errorMessage: words.tooLarge(formatFileSize(maxSize)),
            rawFile: file,
          });
        } else {
          const item: UploadFileItem = {
            id,
            name: file.name,
            size: file.size,
            type: file.type,
            progress: 0,
            status: 'uploading',
            rawFile: file,
          };
          validFiles.push(item);
        }
      });

      setFiles((prev) => {
        const combined = multiple ? [...validFiles, ...prev] : validFiles;
        return combined.slice(0, maxFiles);
      });

      onFilesSelected?.(incoming);

      // Start processing/uploading valid files. ioiti-ui: one after the other when `sequential`.
      let previous: Promise<unknown> = Promise.resolve();
      validFiles.forEach((fileItem) => {
        if (fileItem.status !== 'error') {
          if (uploadHandler) {
            const run = () =>
              uploadHandler(fileItem, (progress) => {
                setFiles((prev) =>
                  prev.map((f) =>
                    f.id === fileItem.id ? { ...f, progress } : f
                  )
                );
              })
                .then((result) => {
                  setFiles((prev) =>
                    prev.map((f) =>
                      f.id === fileItem.id
                        ? { ...f, progress: 100, status: 'complete', link: result || undefined }
                        : f
                    )
                  );
                  onUploadComplete?.(fileItem);
                })
                .catch((err) => {
                  setFiles((prev) =>
                    prev.map((f) =>
                      f.id === fileItem.id
                        ? {
                            ...f,
                            status: 'error',
                            // ioiti-ui: without a message of its own, said when it is drawn (words.failed).
                            errorMessage: err?.message || undefined,
                          }
                        : f
                    )
                  );
                });
            previous = sequential ? previous.then(run) : run();
          } else {
            simulateUpload(fileItem);
          }
        }
      });
    },
    // ioiti-ui: the locale's sizes (formatFileSize) and words too.
    [disabled, arrange, maxSize, multiple, maxFiles, onFilesSelected, onUploadComplete, uploadHandler, simulateUpload, sequential, formatFileSize, words]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && !isDragOver) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      void processIncomingFiles(multiple ? droppedFiles : [droppedFiles[0]]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = Array.from(e.target.files);
      void processIncomingFiles(multiple ? selected : [selected[0]]);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  const handleRemoveFile = (id: string) => {
    // ioiti-ui: the application hears of it (onRemove).
    const removed = files.find((f) => f.id === id);
    setFiles((prev) => prev.filter((f) => f.id !== id));
    if (removed) onRemove?.(removed);
  };

  const handleRetryFile = (fileItem: UploadFileItem) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === fileItem.id
          ? { ...f, progress: 0, status: 'uploading', errorMessage: undefined }
          : f
      )
    );
    if (uploadHandler) {
      uploadHandler(fileItem, (progress) => {
        setFiles((prev) =>
          prev.map((f) => (f.id === fileItem.id ? { ...f, progress } : f))
        );
      })
        .then((result) => {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileItem.id
                ? { ...f, progress: 100, status: 'complete', link: result || undefined }
                : f
            )
          );
        })
        .catch((err) => {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileItem.id
                ? // ioiti-ui: without a message of its own, said when it is drawn (words.failed).
                  { ...f, status: 'error', errorMessage: err?.message || undefined }
                : f
            )
          );
        });
    } else {
      simulateUpload(fileItem);
    }
  };

  const isCompact = variant === 'compact';

  return (
    <div className={cn('w-full select-none font-sans', className)}>
      <input
        ref={inputRef}
        type="file"
        multiple={multiple}
        accept={acceptString}
        onChange={handleFileInputChange}
        disabled={disabled}
        className="hidden"
        aria-label={label ?? words.label}
      />

      {/* Drop Zone Box */}
      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        tabIndex={disabled ? -1 : 0}
        role="button"
        aria-disabled={disabled}
        // ioiti-ui: named by the words it shows, its limit included (WCAG 2.5.3, label in name): a name given over them,
        // its title and subtitle, left out the size.
        animate={{
          scale: isDragOver ? 1.01 : 1,
        }}
        transition={motionTransitions.springSnappy}
        // ioiti-ui: its colours by classes, a light value in front of EasyUI's, which framer animated as dark ones only.
        className={cn(
          'relative flex flex-col items-center justify-center text-center cursor-pointer border border-dashed rounded-xl transition-colors focus-ring',
          isDragOver
            ? // ioiti-ui: a file over it, and the progress below, in the accent where the theme has one (accent:).
              'border-border-hover bg-surface-hover accent:border-brand accent:bg-brand-soft'
            : 'border-border bg-surface hover:border-border-hover',
          isCompact ? 'p-5 sm:p-6 min-h-[120px]' : 'p-8 sm:p-10 min-h-[180px]',
          disabled && 'opacity-50 cursor-not-allowed border-solid'
        )}
      >
        <motion.div
          animate={{
            y: isDragOver ? -3 : 0,
            scale: isDragOver ? 1.08 : 1,
          }}
          transition={motionTransitions.springSnappy}
          className="size-10 rounded-lg bg-surface-raised border border-border flex items-center justify-center text-muted-foreground mb-3"
        >
          <Upload className={cn('size-5 transition-colors', isDragOver ? 'text-foreground' : 'text-muted-foreground')} />
        </motion.div>

        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">{dropTitle ?? words.dropTitle}</p>
          <p className="text-xs text-muted-foreground">
            {dropSubtitle ?? words.dropSubtitle}{' '}
            {maxSize && (
              <span className="text-muted-foreground">
                {words.upTo(formatFileSize(maxSize))}
              </span>
            )}
          </p>
        </div>
      </motion.div>

      {/* Uploading / Uploaded Files List */}
      <AnimatePresence mode="popLayout">
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={motionTransitions.springGentle}
            className="mt-4 space-y-2"
          >
            <div className="flex items-center justify-between px-1 text-xs font-medium text-muted-foreground">
              <span className="tabular-nums">{words.files(files.length)}</span>
              {files.some((f) => f.status === 'complete') && (
                <button
                  type="button"
                  onClick={() => setFiles((prev) => prev.filter((f) => f.status !== 'complete'))}
                  className="hover:text-foreground transition-colors focus-ring rounded-sm cursor-pointer"
                >
                  {words.clearCompleted}
                </button>
              )}
            </div>

            <div className="space-y-2">
              {files.map((file) => {
                const IconComponent = getFileIcon(file.name, file.type);
                const isComplete = file.status === 'complete';
                const isError = file.status === 'error';
                const isProcessing = file.status === 'processing';
                const isUploading = file.status === 'uploading';

                return (
                  <motion.div
                    key={file.id}
                    layout
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, transition: motionTransitions.easeExit }}
                    transition={motionTransitions.springGentle}
                    className={cn(
                      'relative overflow-hidden rounded-xl border p-3 sm:p-3.5 bg-surface transition-colors',
                      isError
                        ? cn(TONE_LINE.negative, 'bg-negative/5 dark:bg-negative/10')
                        : isComplete
                        ? cn(TONE_LINE.positive, 'bg-positive/5 dark:bg-positive/10')
                        : 'border-border'
                    )}
                  >
                    <div className="flex items-center gap-3 relative z-10">
                      {/* File Type Icon */}
                      <div
                        className={cn(
                          'size-8 rounded-lg flex items-center justify-center shrink-0 border',
                          isError
                            ? cn(TONE_SOFT.negative, TONE_LINE.negative)
                            : isComplete
                            ? cn(TONE_SOFT.positive, TONE_LINE.positive)
                            : 'bg-surface-raised border-border text-muted-foreground'
                        )}
                      >
                        <IconComponent className="size-4" />
                      </div>

                      {/* File Metadata */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-medium text-foreground truncate">
                            {file.name}
                          </p>
                          <span className="text-xs font-mono text-muted-foreground shrink-0">
                            {formatFileSize(file.size)}
                          </span>
                        </div>

                        {/* Status line */}
                        <div className="flex items-center justify-between text-xs mt-1">
                          {isError ? (
                            // ioiti-ui: the whole error, wrapped (a script's refusal is a sentence).
                            <span role="alert" className="text-negative flex items-start gap-1">
                              <AlertCircle className="size-3 shrink-0 mt-0.5" />
                              <span className="break-words">{file.errorMessage || words.failed}</span>
                            </span>
                          ) : isComplete ? (
                            <span className="text-positive flex items-center gap-2">
                              <span className="flex items-center gap-1">
                                <Check className="size-3 shrink-0" />
                                <span>{doneLabel ?? words.ready}</span>
                              </span>
                              {file.link && (
                                <LinkComponent href={file.link.href} className="font-medium text-foreground underline underline-offset-2">
                                  {file.link.label}
                                </LinkComponent>
                              )}
                            </span>
                          ) : isProcessing ? (
                            <span className="text-muted-foreground flex items-center gap-1.5 font-mono text-xs">
                              <span className="size-1.5 rounded-full bg-muted-foreground animate-pulse" />
                              {words.processing}
                            </span>
                          ) : (
                            <span className="text-muted-foreground font-mono text-xs tabular-nums">
                              {/* ioiti-ui: its percentage as the locale writes one (formatProgress), in its words. */}
                              {workingLabel ?? words.uploading(formatProgress(file.progress))}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1 shrink-0">
                        {isError && (
                          <button
                            type="button"
                            onClick={() => handleRetryFile(file)}
                            className={CLOSE_SM}
                            aria-label={words.retry(file.name)}
                          >
                            <RotateCcw />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(file.id)}
                          className={CLOSE_SM}
                          aria-label={words.remove(file.name)}
                        >
                          <X />
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar (at the bottom) */}
                    {(isUploading || isProcessing) && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-surface-raised">
                        <motion.div
                          className="h-full bg-foreground accent:bg-brand"
                          initial={{ width: '0%' }}
                          animate={{ width: `${file.progress}%` }}
                          transition={motionTransitions.easeFast}
                        />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
