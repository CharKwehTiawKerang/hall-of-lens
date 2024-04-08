import { useState, useEffect, useCallback, useRef } from 'react'
import { Form, Button } from 'react-bootstrap'
import axios from 'axios';

import './App.css'

function App() {
  const [images, setImages] = useState([]);
  const searchInput = useRef(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [errorMessage, setErrorMessage] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  const IMAGES_PER_PAGE = 20;
  const baseUrl = "https://api.unsplash.com/search/photos";

  const handleSubmit = (event) => {
    event.preventDefault();

    if (searchInput.current.value !== '') {
      resetImage();
      console.log(searchInput.current.value);
    } else {
      resetImage();
      setErrorMessage(true);
    }
  }

  const handleSelection = (selection) => {
    searchInput.current.value = selection;
    resetImage();
  }

  const resetImage = () => {
    fetchImages();
    setPage(1);
    setErrorMessage(false);
  }

  const fetchImages = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${baseUrl}?query=${searchInput.current.value}&page=${page}&per_page=${IMAGES_PER_PAGE}&client_id=${import.meta.env.VITE_UNSPLASH_ACCESS}`);
      
      console.log(data);
      setImages(data.results);
      setTotalPages(data.total_pages);
      setLoading(false);

    } catch (err) {
      console.error(err);
    }
  }, [page])

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  return (
    <>
      <div>
        <h1>Hall of Lens</h1>

        <div className='input-container'>
          <Form onSubmit={handleSubmit}>
            <Form.Control 
              type='search'
              placeholder='Search image here...'
              className='input-search'
              ref={searchInput}
            />
          </Form>
        </div>

        <div className="filters">
          <div onClick={() => handleSelection("Cat")}>Cat</div>
          <div onClick={() => handleSelection("Acura")}>Acura</div>
          <div onClick={() => handleSelection("Aurora")}>Aurora</div>
          <div onClick={() => handleSelection("Chocolate")}>Chocolate</div>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {errorMessage ? ( <p>No images found!</p> ) : ( '' ) }

            <div className='image-container'>
              {images.map((image) => (
                <img key={image.id} src={image.urls.small} alt={image.alt_description} />
              ))}
            </div>
            
            <div className='pagination'>
              {page > 1 && (
                <Button onClick={() => setPage(page - 1)}>Previous</Button>
              )}

              {page > 1 && page < totalPages && (
                <p>{page}</p>
              )}

              {page < totalPages && (
                <Button onClick={() => setPage(page + 1)}>Next</Button>
              )}
            </div>
          </>
        )}

      </div>
    </>
  )
}

export default App
