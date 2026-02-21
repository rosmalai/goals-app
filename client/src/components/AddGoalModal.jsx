import { useState, useEffect, useRef } from 'react';

export default function AddGoalModal({ category, onClose, onSave }) {
    const [text, setText] = useState('');
    const textareaRef = useRef(null);

    useEffect(() => {
        textareaRef.current?.focus();

        const handleKey = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [onClose]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        onSave(text.trim());
    };

    return (
        <div
            className="modal-overlay"
            style={{ '--accent': category.accent }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
                <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>

                <div className="modal-tag">{category.label}</div>
                <div className="modal-title" id="modal-title">Add to {category.title}</div>

                <form onSubmit={handleSubmit}>
                    <textarea
                        ref={textareaRef}
                        className="modal-textarea"
                        placeholder={category.placeholder}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-save" disabled={!text.trim()}>
                            Save Goal
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
