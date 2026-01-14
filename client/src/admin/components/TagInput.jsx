import { useState } from 'react';
import { X } from 'lucide-react';

export default function TagInput({ value = [], onChange, placeholder = 'Type and press Enter' }) {
  const [draft, setDraft] = useState('');

  const add = () => {
    const tag = draft.trim();
    if (tag && !value.includes(tag)) onChange([...value, tag]);
    setDraft('');
  };

  const remove = (tag) => onChange(value.filter((t) => t !== tag));

  const onKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(); }
    if (e.key === 'Backspace' && !draft && value.length) remove(value[value.length - 1]);
  };

  return (
    <div className="flex flex-wrap gap-2 p-2.5 border border-border rounded-xl min-h-[44px] focus-within:border-blue focus-within:ring-2 focus-within:ring-blue/10 bg-white transition-all">
      {value.map((tag) => (
        <span key={tag} className="inline-flex items-center gap-1 bg-blue-bg text-blue text-xs font-mono px-2.5 py-1 rounded-full">
          {tag}
          <button type="button" onClick={() => remove(tag)} className="hover:text-blue/60" aria-label={`Remove ${tag}`}>
            <X size={10} />
          </button>
        </span>
      ))}
      <input
        type="text"
        className="flex-1 min-w-[120px] outline-none bg-transparent font-body text-sm text-ink placeholder-muted"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={add}
        placeholder={value.length === 0 ? placeholder : ''}
      />
    </div>
  );
}
