import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, Image as ImageIcon, Video, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { MediaFile } from '@/types';
import { formatFileSize } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface MediaUploadProps {
  files: MediaFile[];
  onChange: (files: MediaFile[]) => void;
}

export function MediaUpload({ files, onChange }: MediaUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFiles = (uploadedFiles: FileList | null) => {
    if (!uploadedFiles || uploadedFiles.length === 0) return;

    const newMedia: MediaFile[] = [];

    Array.from(uploadedFiles).forEach((file) => {
      // Basic size limit: 50MB
      if (file.size > 50 * 1024 * 1024) {
        alert(`File ${file.name} is too large (> 50MB)`);
        return;
      }

      const mediaItem: MediaFile = {
        id: `media-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file),
        uploadProgress: 100, // Instant local simulation
      };
      newMedia.push(mediaItem);
    });

    onChange([...files, ...newMedia]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const handleRemove = (id: string) => {
    const fileToRemove = files.find((f) => f.id === id);
    if (fileToRemove?.url && fileToRemove.url.startsWith('blob:')) {
      URL.revokeObjectURL(fileToRemove.url);
    }
    onChange(files.filter((f) => f.id !== id));
  };

  return (
    <div className="space-y-3">
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors ${
          isDragging
            ? 'border-[#003366] bg-blue-50'
            : 'border-slate-300 hover:border-[#003366] bg-slate-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) => processFiles(e.target.files)}
        />
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 border border-blue-200 text-[#003366]">
            <UploadCloud className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-slate-800">
              Attach incident photographs or video evidence, or{' '}
              <span className="text-[#003366] underline">browse local files</span>
            </p>
            <p className="text-xs text-slate-500">
              Supported Formats: JPG, PNG, MP4, WEBM (Max 50MB). Files are securely cached on device when offline.
            </p>
          </div>
        </div>
      </div>

      {/* Uploaded File Previews */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2"
          >
            {files.map((file) => {
              const isVideo = file.type.startsWith('video');

              return (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="relative group rounded-md border border-slate-200 bg-white overflow-hidden flex flex-col shadow-xs"
                >
                  <div className="relative aspect-video bg-slate-100 overflow-hidden flex items-center justify-center border-b border-slate-200">
                    {isVideo ? (
                      <video
                        src={file.url}
                        className="w-full h-full object-cover"
                        controls={false}
                      />
                    ) : (
                      <img
                        src={file.url}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    )}

                    <div className="absolute top-1 left-1 bg-slate-900/80 px-1.5 py-0.5 rounded text-[10px] font-mono text-white flex items-center gap-1">
                      {isVideo ? <Video className="h-3 w-3" /> : <ImageIcon className="h-3 w-3" />}
                      <span>{isVideo ? 'VIDEO' : 'IMAGE'}</span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(file.id);
                      }}
                      className="absolute top-1 right-1 h-6 w-6 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-xs transition-opacity cursor-pointer"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="p-2 space-y-1">
                    <p className="text-xs text-slate-800 truncate font-medium" title={file.name}>
                      {file.name}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span>{formatFileSize(file.size)}</span>
                      <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                        <CheckCircle2 className="h-3 w-3" /> READY
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
