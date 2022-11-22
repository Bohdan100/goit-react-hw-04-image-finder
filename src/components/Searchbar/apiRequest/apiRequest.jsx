import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api';
const API_key = '29959892-dbc4da226a3c63fb0b6c6ac05';
const image_type = 'image_type=photo';
const orientation = 'orientation=horizontal';
const safesearch = 'safesearch=true';
const perPage = 12;

export async function fetchImages(name, page) {
  const url = `${BASE_URL}/?key=${API_key}&q=${name}&${image_type}&${orientation}&${safesearch}&page=${page}&per_page=${perPage}`;

  const responseObject = await axios.get(url);
  const pictures = await responseObject.data.hits;
  const totalImages = await responseObject.data.total;

  return { pictures, totalImages };
}
