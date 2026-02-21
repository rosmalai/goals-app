import axios from 'axios';

const BASE = 'http://localhost:5000/api/goals';

export const fetchGoals = () => axios.get(BASE).then((r) => r.data);
export const createGoal = (text, category) =>
    axios.post(BASE, { text, category }).then((r) => r.data);
export const deleteGoal = (id) => axios.delete(`${BASE}/${id}`).then((r) => r.data);
