import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Make sure the URL is correct

// Fetch votes for a specific question
export const fetchVotes = async (question) => {
  try {
    const response = await axios.get(`${API_URL}/votes`, { params: { question } });
    return response.data;
  } catch (error) {
    console.error('Error fetching votes:', error);
    return null;
  }
};

// Update vote count
export const updateVote = async (question, optionIndex) => {
  try {
    const response = await axios.post(`${API_URL}/votes`, { question, index: optionIndex });
    return response.data;
  } catch (error) {
    console.error('Error updating vote:', error);
    return null;
  }
};
