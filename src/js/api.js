import axios from 'axios';
import { BASE_URL, API_KEY } from './const';

const fetchData = async ({ query, page }) => {
  const params = new URLSearchParams({
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    page: page,
    per_page: 40,
  });
  const response = await axios.get(`${BASE_URL}?${params}`);
  return response.data;
};

export default fetchData;
