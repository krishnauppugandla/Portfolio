import { useState, useRef } from 'react';
import { Upload, Image, X } from 'lucide-react';

export default function ImageUpload({ currentUrl, onFileSelect }) {
  const [preview, setPreview] = useState(currentUrl || null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setPreview(URL.createObjectURL(file));
    onFileSelect(file);
  };

  return (
    <div className="space-y-2">
      {preview ? (
        <div className="relative rounded-xl overflow-hidden border border-border group">
          <img src={preview} alt="Project preview" className="w-full h-48 object-cover" />
          <button
            type="button"
            onClick={() => { setPreview(null); onFileSelect(null); }}
            className="absolute top-2 right-2 w-7 h-7 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Remove image"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer transition-colors
            ${dragging ? 'border-blue bg-blue-bg' : 'border-border hover:border-blue/50 hover:bg-background-alt'}`}
        >
          <div className="w-10 h-10 bg-background-alt rounded-xl flex items-center justify-center">
            <Upload size={18} className="text-muted" />
          </div>
          <p className="font-body text-sm text-muted text-center">
            Drag & drop or <span className="text-blue">click to upload</span>
          </p>
          <p className="font-mono text-xs text-light">PNG, JPG, WebP up to 5MB</p>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files[0])}
        aria-label="Upload project screenshot"
      />
    </div>
  );
}
