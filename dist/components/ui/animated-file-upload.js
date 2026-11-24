'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, File as FileIcon, Check, AlertCircle, X, RotateCcw, FileText, Image as ImageIcon, Film, Music, Archive, Code } from 'lucide-react';
import { cn } from '../../lib/utils.js';
import { formatBytes } from '../../lib/format.js';
import { motionTransitions } from '../../lib/motion-tokens.js';
import { CLOSE_SM, TONE_LINE, TONE_SOFT } from '../../lib/recipes.js';
import { useLinkComponent } from '../link-context.js';
// ioiti-ui: sizes written as the package writes them everywhere (formatBytes: kB of 1000 bytes), not KB of 1024.
const formatFileSize = (bytes) => formatBytes(bytes);
const getFileIcon = (fileName, mimeType) => {
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
export const AnimatedFileUpload = ({ multiple = true, accept, maxSize = 25 * 1024 * 1024, // 25MB default
maxFiles = 10, dropTitle = 'Drop files here', dropSubtitle = 'or browse from your device', variant = 'standard', disabled = false, initialFiles, onFilesSelected, onUploadComplete, uploadHandler, arrange, sequential = false, workingLabel, doneLabel = 'Ready', linkComponent, label = 'Upload files', onRemove, className, }) => {
    // ioiti-ui: the application's link (LinkProvider) unless one is given.
    const LinkComponent = useLinkComponent(linkComponent);
    const [isDragOver, setIsDragOver] = useState(false);
    const [files, setFiles] = useState(initialFiles || []);
    const inputRef = useRef(null);
    const acceptString = Array.isArray(accept) ? accept.join(',') : accept;
    const simulateUpload = useCallback((fileItem) => {
        let currentProgress = 0;
        const interval = setInterval(() => {
            currentProgress += Math.floor(Math.random() * 18) + 12;
            if (currentProgress >= 90 && currentProgress < 100) {
                setFiles((prev) => prev.map((f) => f.id === fileItem.id
                    ? { ...f, progress: 92, status: 'processing' }
                    : f));
            }
            else if (currentProgress >= 100) {
                clearInterval(interval);
                setFiles((prev) => prev.map((f) => {
                    if (f.id === fileItem.id) {
                        const updated = { ...f, progress: 100, status: 'complete' };
                        onUploadComplete?.(updated);
                        return updated;
                    }
                    return f;
                }));
            }
            else {
                setFiles((prev) => prev.map((f) => f.id === fileItem.id
                    ? { ...f, progress: currentProgress, status: 'uploading' }
                    : f));
            }
        }, 180);
    }, [onUploadComplete]);
    const processIncomingFiles = useCallback(async (dropped) => {
        if (disabled)
            return;
        const incoming = arrange ? await arrange(dropped) : dropped;
        const validFiles = [];
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
                    errorMessage: `File exceeds maximum allowed size (${formatFileSize(maxSize)})`,
                    rawFile: file,
                });
            }
            else {
                const item = {
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
        let previous = Promise.resolve();
        validFiles.forEach((fileItem) => {
            if (fileItem.status !== 'error') {
                if (uploadHandler) {
                    const run = () => uploadHandler(fileItem, (progress) => {
                        setFiles((prev) => prev.map((f) => f.id === fileItem.id ? { ...f, progress } : f));
                    })
                        .then((result) => {
                        setFiles((prev) => prev.map((f) => f.id === fileItem.id
                            ? { ...f, progress: 100, status: 'complete', link: result || undefined }
                            : f));
                        onUploadComplete?.(fileItem);
                    })
                        .catch((err) => {
                        setFiles((prev) => prev.map((f) => f.id === fileItem.id
                            ? {
                                ...f,
                                status: 'error',
                                errorMessage: err?.message || 'Upload failed',
                            }
                            : f));
                    });
                    previous = sequential ? previous.then(run) : run();
                }
                else {
                    simulateUpload(fileItem);
                }
            }
        });
    }, [disabled, arrange, maxSize, multiple, maxFiles, onFilesSelected, onUploadComplete, uploadHandler, simulateUpload, sequential]);
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!disabled && !isDragOver) {
            setIsDragOver(true);
        }
    };
    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    };
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
        if (disabled)
            return;
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const droppedFiles = Array.from(e.dataTransfer.files);
            void processIncomingFiles(multiple ? droppedFiles : [droppedFiles[0]]);
        }
    };
    const handleFileInputChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const selected = Array.from(e.target.files);
            void processIncomingFiles(multiple ? selected : [selected[0]]);
            if (inputRef.current) {
                inputRef.current.value = '';
            }
        }
    };
    const handleRemoveFile = (id) => {
        // ioiti-ui: the application hears of it (onRemove).
        const removed = files.find((f) => f.id === id);
        setFiles((prev) => prev.filter((f) => f.id !== id));
        if (removed)
            onRemove?.(removed);
    };
    const handleRetryFile = (fileItem) => {
        setFiles((prev) => prev.map((f) => f.id === fileItem.id
            ? { ...f, progress: 0, status: 'uploading', errorMessage: undefined }
            : f));
        if (uploadHandler) {
            uploadHandler(fileItem, (progress) => {
                setFiles((prev) => prev.map((f) => (f.id === fileItem.id ? { ...f, progress } : f)));
            })
                .then((result) => {
                setFiles((prev) => prev.map((f) => f.id === fileItem.id
                    ? { ...f, progress: 100, status: 'complete', link: result || undefined }
                    : f));
            })
                .catch((err) => {
                setFiles((prev) => prev.map((f) => f.id === fileItem.id
                    ? { ...f, status: 'error', errorMessage: err?.message || 'Upload failed' }
                    : f));
            });
        }
        else {
            simulateUpload(fileItem);
        }
    };
    const isCompact = variant === 'compact';
    return (_jsxs("div", { className: cn('w-full select-none font-sans', className), children: [_jsx("input", { ref: inputRef, type: "file", multiple: multiple, accept: acceptString, onChange: handleFileInputChange, disabled: disabled, className: "hidden", "aria-label": label }), _jsxs(motion.div, { onDragOver: handleDragOver, onDragLeave: handleDragLeave, onDrop: handleDrop, onClick: () => !disabled && inputRef.current?.click(), onKeyDown: (e) => {
                    if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
                        e.preventDefault();
                        inputRef.current?.click();
                    }
                }, tabIndex: disabled ? -1 : 0, role: "button", "aria-disabled": disabled, "aria-label": `${dropTitle}, ${dropSubtitle}`, animate: {
                    scale: isDragOver ? 1.01 : 1,
                }, transition: motionTransitions.springSnappy, 
                // ioiti-ui: its colours by classes, a light value in front of EasyUI's, which framer animated as dark ones only.
                className: cn('relative flex flex-col items-center justify-center text-center cursor-pointer border border-dashed rounded-xl transition-colors focus-ring', isDragOver
                    ? // ioiti-ui: a file over it, and the progress below, in the accent where the theme has one (accent:).
                        'border-border-hover bg-surface-hover accent:border-brand accent:bg-brand-soft'
                    : 'border-border bg-surface hover:border-border-hover', isCompact ? 'p-5 sm:p-6 min-h-[120px]' : 'p-8 sm:p-10 min-h-[180px]', disabled && 'opacity-50 cursor-not-allowed border-solid'), children: [_jsx(motion.div, { animate: {
                            y: isDragOver ? -3 : 0,
                            scale: isDragOver ? 1.08 : 1,
                        }, transition: motionTransitions.springSnappy, className: "size-10 rounded-lg bg-surface-raised border border-border flex items-center justify-center text-muted-foreground mb-3", children: _jsx(Upload, { className: cn('size-5 transition-colors', isDragOver ? 'text-foreground' : 'text-muted-foreground') }) }), _jsxs("div", { className: "space-y-1", children: [_jsx("p", { className: "text-sm font-medium text-foreground", children: dropTitle }), _jsxs("p", { className: "text-xs text-muted-foreground", children: [dropSubtitle, ' ', maxSize && (_jsxs("span", { className: "text-muted-foreground", children: ["(up to ", formatFileSize(maxSize), ")"] }))] })] })] }), _jsx(AnimatePresence, { mode: "popLayout", children: files.length > 0 && (_jsxs(motion.div, { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 8 }, transition: motionTransitions.springGentle, className: "mt-4 space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between px-1 text-xs font-medium text-muted-foreground", children: [_jsxs("span", { className: "tabular-nums", children: ["Files (", files.length, ")"] }), files.some((f) => f.status === 'complete') && (_jsx("button", { type: "button", onClick: () => setFiles((prev) => prev.filter((f) => f.status !== 'complete')), className: "hover:text-foreground transition-colors focus-ring rounded-sm cursor-pointer", children: "Clear completed" }))] }), _jsx("div", { className: "space-y-2", children: files.map((file) => {
                                const IconComponent = getFileIcon(file.name, file.type);
                                const isComplete = file.status === 'complete';
                                const isError = file.status === 'error';
                                const isProcessing = file.status === 'processing';
                                const isUploading = file.status === 'uploading';
                                return (_jsxs(motion.div, { layout: true, initial: { opacity: 0, y: 10, scale: 0.98 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, scale: 0.95, transition: motionTransitions.easeExit }, transition: motionTransitions.springGentle, className: cn('relative overflow-hidden rounded-xl border p-3 sm:p-3.5 bg-surface transition-colors', isError
                                        ? cn(TONE_LINE.negative, 'bg-negative/5 dark:bg-negative/10')
                                        : isComplete
                                            ? cn(TONE_LINE.positive, 'bg-positive/5 dark:bg-positive/10')
                                            : 'border-border'), children: [_jsxs("div", { className: "flex items-center gap-3 relative z-10", children: [_jsx("div", { className: cn('size-8 rounded-lg flex items-center justify-center shrink-0 border', isError
                                                        ? cn(TONE_SOFT.negative, TONE_LINE.negative)
                                                        : isComplete
                                                            ? cn(TONE_SOFT.positive, TONE_LINE.positive)
                                                            : 'bg-surface-raised border-border text-muted-foreground'), children: _jsx(IconComponent, { className: "size-4" }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center justify-between gap-2", children: [_jsx("p", { className: "text-sm font-medium text-foreground truncate", children: file.name }), _jsx("span", { className: "text-xs font-mono text-muted-foreground shrink-0", children: formatFileSize(file.size) })] }), _jsx("div", { className: "flex items-center justify-between text-xs mt-1", children: isError ? (_jsxs("span", { role: "alert", className: "text-negative flex items-start gap-1", children: [_jsx(AlertCircle, { className: "size-3 shrink-0 mt-0.5" }), _jsx("span", { className: "break-words", children: file.errorMessage || 'Upload failed' })] })) : isComplete ? (_jsxs("span", { className: "text-positive flex items-center gap-2", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Check, { className: "size-3 shrink-0" }), _jsx("span", { children: doneLabel })] }), file.link && (_jsx(LinkComponent, { href: file.link.href, className: "font-medium text-foreground underline underline-offset-2", children: file.link.label }))] })) : isProcessing ? (_jsxs("span", { className: "text-muted-foreground flex items-center gap-1.5 font-mono text-xs", children: [_jsx("span", { className: "size-1.5 rounded-full bg-muted-foreground animate-pulse" }), "Processing\u2026"] })) : (_jsx("span", { className: "text-muted-foreground font-mono text-xs tabular-nums", children: workingLabel ?? `Uploading ${file.progress}%` })) })] }), _jsxs("div", { className: "flex items-center gap-1 shrink-0", children: [isError && (_jsx("button", { type: "button", onClick: () => handleRetryFile(file), className: CLOSE_SM, "aria-label": `Retry uploading ${file.name}`, children: _jsx(RotateCcw, {}) })), _jsx("button", { type: "button", onClick: () => handleRemoveFile(file.id), className: CLOSE_SM, "aria-label": `Remove ${file.name}`, children: _jsx(X, {}) })] })] }), (isUploading || isProcessing) && (_jsx("div", { className: "absolute bottom-0 left-0 right-0 h-0.5 bg-surface-raised", children: _jsx(motion.div, { className: "h-full bg-foreground accent:bg-brand", initial: { width: '0%' }, animate: { width: `${file.progress}%` }, transition: motionTransitions.easeFast }) }))] }, file.id));
                            }) })] })) })] }));
};
