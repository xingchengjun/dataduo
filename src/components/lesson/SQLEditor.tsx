import { useState, useRef, useEffect } from 'react';

interface SQLEditorProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export default function SQLEditor({
  value,
  onChange,
  onSubmit,
  disabled = false,
  loading = false,
}: SQLEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ctrl/Cmd + Enter to submit
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!disabled && !loading) onSubmit();
    }
    // Tab to insert spaces
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newVal = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newVal);
      // Restore cursor position
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      });
    }
  };

  return (
    <div className="w-full">
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="在这里输入你的 SQL 查询..."
          className="
            sql-editor w-full min-h-[120px] p-4 pr-12
            bg-[#1e1e2e] text-[#cdd6f4]
            border-2 border-[#313244] rounded-2xl
            placeholder:text-[#585b70]
            resize-y focus:border-duo-blue
            transition-colors duration-200
          "
          spellCheck={false}
        />
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <span className="text-[10px] text-[#585b70] font-mono hidden sm:inline">
            Ctrl+Enter
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-2 text-xs text-duo-text-secondary">
          <span className="px-2 py-0.5 bg-duo-surface rounded-md font-mono">
            SQL
          </span>
          <span>支持 SQLite 语法</span>
        </div>
        <button
          onClick={onSubmit}
          disabled={disabled || loading || !value.trim()}
          className="
            px-5 py-2 bg-duo-blue text-white font-bold rounded-xl
            shadow-[0_3px_0_#1899D6] btn-press
            disabled:opacity-50 disabled:cursor-not-allowed
            hover:bg-blue-500 transition-colors
            cursor-pointer
          "
        >
          {loading ? (
            <span className="flex items-center gap-1.5">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              运行中
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              ▶ 运行
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
