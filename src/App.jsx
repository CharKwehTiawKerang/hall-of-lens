import { useState, useEffect, useCallback, useRef } from 'react'
import axios from 'axios';

import './App.css'

function App() {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const baseUrl = "https://api.unsplash.com/search/photos";
  const ITEM_PER_PAGE = 20;

  const fetchImages = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${baseUrl}?query=acura&page=${page}&per_page=${ITEM_PER_PAGE}&client_id=${import.meta.env.VITE_UNSPLASH_ACCESS}`);
      console.log(data.results);

      setImages(data.results);
      setTotalPages(data.total_pages);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);


  return (
    <>
      <div>
        <h1>Hall of Lens</h1>

        {loading ? 
          <p>Loading...</p> : 
          images.map((image) => (
              <img key={image.id} src={image.urls.small} alt={image.alt_description} />
          ))}
      </div>
    </>
  )
}

export default App
