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
      <div className='text-white d-flex flex-column align-items-center'>
        <h1 className='title mt-5'>HALL OF LENS</h1>

        <div className='input-container w-50 my-3'>
          <Form onSubmit={handleSubmit}>
            <Form.Control 
              type='search'
              placeholder='Search image here...'
              className='input-search'
              ref={searchInput}
            />
          </Form>
        </div>

        <div className="filters d-flex gap-2">
          <Button variant='secondary' onClick={() => handleSelection("Cat")}>Cat</Button>
          <Button variant='secondary' onClick={() => handleSelection("Acura")}>Acura</Button>
          <Button variant='secondary' onClick={() => handleSelection("Aurora")}>Aurora</Button>
          <Button variant='secondary' onClick={() => handleSelection("Chocolate")}>Chocolate</Button>
          <Button variant='secondary' onClick={() => handleSelection("JDM")}>JDM</Button>
        </div>

        {loading ? (
          <p className='mt-5'>Loading...</p>
        ) : (
          <>
            {errorMessage ? ( <p className='mt-5'>No images found!</p> ) : ( '' ) }

            <div className='mt-5 mb-3 images'>
              {images.map((image) => (
                <img className="image" key={image.id} src={image.urls.small} alt={image.alt_description} />
              ))}
            </div>
            
            <div className='pagination gap-3 me-4 mb-3 d-flex justify-content-center'>
              {page > 1 && (
                <Button variant='danger' className='fw-bold text-white' onClick={() => setPage(page - 1)}>Previous</Button>
              )}

              {page > 1 && page < totalPages && (
                <div className='align-self-center fw-bold '>{page}</div>
              )}

              {page < totalPages && (
                <Button variant='danger' className='fw-bold text-white' onClick={() => setPage(page + 1)}>Next</Button>
              )}
            </div>
          </>
        )}

      </div>
    </>
  )
}

export default App
