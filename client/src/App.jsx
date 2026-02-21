import { useEffect, useState } from 'react';
import './index.css';
import GoalCategory from './components/GoalCategory';
import { fetchGoals, createGoal, deleteGoal } from './api';

const CATEGORIES = [
  {
    id: '1year',
    label: '1 Year',
    title: 'This Year',
    accent: '#352a1a',
    placeholder: 'What do you want to achieve in the next 12 months?',
  },
  {
    id: '5year',
    label: '5 Years',
    title: 'Half a Decade',
    accent: '#352a1a',
    placeholder: 'Where will you be in 5 years?',
  },
  {
    id: '10year',
    label: '10 Years',
    title: 'A Decade',
    accent: '#352a1a',
    placeholder: 'Paint the picture of your life 10 years from now.',
  },
  {
    id: '20year',
    label: '20 Years',
    title: 'Two Decades',
    accent: '#352a1a',
    placeholder: 'What legacy are you building over the next 20 years?',
  },
  {
    id: 'aspiration',
    label: 'Ultimate',
    title: 'Life Aspiration',
    accent: '#352a1a',
    placeholder: 'What is the deepest aspiration of your life?',
  },
];

export default function App() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeId, setActiveId] = useState(CATEGORIES[0].id);

  const activeCategory = CATEGORIES.find((c) => c.id === activeId);

  useEffect(() => {
    fetchGoals()
      .then(setGoals)
      .catch(() => setError('Could not connect to the server. Is the backend running?'))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async (category, text) => {
    try {
      const newGoal = await createGoal(text, category);
      setGoals((prev) => [newGoal, ...prev]);
    } catch {
      alert('Failed to save goal. Check your backend connection.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteGoal(id);
      setGoals((prev) => prev.filter((g) => g._id !== id));
    } catch {
      alert('Failed to delete goal.');
    }
  };

  const goalsFor = (catId) => goals.filter((g) => g.category === catId);

  return (
    <div className="app-wrapper">
      {/* Toggle Tab Bar */}
      <nav className="tab-bar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            className={`tab-btn${activeId === cat.id ? ' tab-btn--active' : ''}`}
            style={{ '--accent': cat.accent }}
            onClick={() => setActiveId(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </nav>

      {/* Active Category Title */}
      <header className="page-header" style={{ '--accent': activeCategory.accent }}>
        <h1 className="page-title">{activeCategory.title}</h1>
      </header>

      {/* Content */}
      {loading ? (
        <div className="spinner-wrapper">
          <div className="spinner" />
          Connecting…
        </div>
      ) : error ? (
        <div className="spinner-wrapper" style={{ color: '#f87171' }}>⚠ {error}</div>
      ) : (
        <main className="single-category">
          <GoalCategory
            key={activeId}
            category={activeCategory}
            goals={goalsFor(activeId)}
            onAdd={handleAdd}
            onDelete={handleDelete}
          />
        </main>
      )}
    </div>
  );
}
