import React, { useRef, useState, useEffect } from 'react';
import Icon from '@/components/atoms/icon';

export interface ChatInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSend?: () => void;
  disabled?: boolean;
}

const MAX_HEIGHT = 176; // px, as per design spec
const MIN_WIDTH = 256; // px, as per design spec

const ChatInput: React.FC<ChatInputProps> = ({
  placeholder = 'Placeholder',
  value = '',
  onChange = () => {},
  onSend,
  disabled = false,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isOverflow, setIsOverflow] = useState(false);

  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight, MAX_HEIGHT) + 'px';
      setIsOverflow(el.scrollHeight > MAX_HEIGHT);
    }
  }, [value]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleSend = () => {
    if (onSend && value.trim()) onSend();
  };

  return (
    <div
      style={{
        minWidth: MIN_WIDTH,
        maxWidth: '100%',
        maxHeight: isOverflow ? MAX_HEIGHT + 48 : MAX_HEIGHT, // 48px for button height+margin
        display: 'flex',
        flexDirection: isOverflow ? 'column' : 'row',
        alignItems: isOverflow ? 'stretch' : 'center',
        gap: 8,
        background: disabled ? '#f5f5f5' : '#fff',
        borderRadius: 6,
        border: '1px solid #d6d6e7',
        padding: 8,
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleInput}
        placeholder={placeholder}
        disabled={disabled}
        rows={2}
        style={{
          resize: 'none',
          flex: 1,
          minWidth: 0,
          maxHeight: MAX_HEIGHT,
          overflowY: 'auto',
          fontSize: 16,
          lineHeight: 1.5,
          border: 'none',
          outline: 'none',
          background: 'transparent',
          color: '#222',
        }}
      />
      <button
        type="button"
        onClick={handleSend}
        disabled={disabled || !value.trim()}
        style={{
          marginTop: isOverflow ? 8 : 0,
          alignSelf: isOverflow ? 'flex-end' : 'center',
          background: '#1976d2',
          border: 'none',
          borderRadius: 4,
          padding: 8,
          cursor: disabled ? 'not-allowed' : 'pointer',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        aria-label="Send"
      >
        <Icon name="arrow_upward" size={20} />
      </button>
    </div>
  );
};

export default ChatInput;
