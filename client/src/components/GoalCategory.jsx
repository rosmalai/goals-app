import AddGoalModal from './AddGoalModal';
import { useState } from 'react';

export default function GoalCategory({ category, goals, onAdd, onDelete }) {
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    return (
        <>
            <div
                className="category-card"
                style={{ '--accent': category.accent }}
            >
                <div className="card-header">
                    <div className="header-actions">
                        {isEditing && (
                            <button className="add-inline-btn" onClick={() => setShowModal(true)}>
                                ＋ Add Goal
                            </button>
                        )}
                        <button
                            className={`edit-toggle-btn ${isEditing ? 'active' : ''}`}
                            onClick={() => setIsEditing(!isEditing)}
                        >
                            {isEditing ? 'Done' : 'Edit'}
                        </button>
                    </div>
                </div>

                <ul className="goal-list">
                    {goals.length === 0 ? (
                        <li className="goal-empty">No goals yet — add your first one ✦</li>
                    ) : (
                        goals.map((g) => (
                            <li key={g._id} className="goal-item">
                                <span className="goal-dot" />
                                <span className="goal-text">{g.text}</span>
                                {isEditing && (
                                    <button
                                        className="goal-delete"
                                        onClick={() => onDelete(g._id)}
                                        aria-label="Delete goal"
                                        title="Remove"
                                    >
                                        ×
                                    </button>
                                )}
                            </li>
                        ))
                    )}
                </ul>
            </div>

            {showModal && (
                <AddGoalModal
                    category={category}
                    onClose={() => setShowModal(false)}
                    onSave={(text) => {
                        onAdd(category.id, text);
                        setShowModal(false);
                    }}
                />
            )}
        </>
    );
}
