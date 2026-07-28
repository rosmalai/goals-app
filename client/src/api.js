import axios from 'axios';

const apiRoot = import.meta.env.VITE_API_URL?.replace(/\/$/, '') ?? '';
const BASE = apiRoot ? `${apiRoot}/api/goals` : '/api/goals';

export const fetchGoals = () => axios.get(BASE).then((r) => r.data);
export const createGoal = (text, category) =>
    axios.post(BASE, { text, category }).then((r) => r.data);
export const deleteGoal = (id) => axios.delete(`${BASE}/${id}`).then((r) => r.data);
