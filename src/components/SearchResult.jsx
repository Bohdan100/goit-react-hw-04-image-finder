import { useReducer, useState, useEffect } from 'react';

import { fetchImages } from 'apiRequest';
import {
  renderSuccesNotification,
  notFoundNotification,
  informativeNotification,
} from 'toastNotification';
import { Searchbar } from './Searchbar';
import { ImageGallery } from './ImageGallery';
import { RequestError } from './interfaceEl/RequestError';
import { Loader } from './interfaceEl/Loader';
import { Button } from './interfaceEl/Button';
import { Modal } from './interfaceEl/Modal';

import { IdleText } from './SearchResult.styled';

const Status = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};

const countReducer = (state, action) => {
  switch (action.type) {
    case 'searchQuerry':
      return { ...state, searchQuerry: action.payload };

    case 'page':
      return { ...state, page: state.page + action.payload };

    // case 'images':
    //   return { ...state, images: action.payload };

    case 'status':
      return { ...state, status: action.payload };

    case 'largeImage':
      return { ...state, largeImage: action.payload };

    case 'error':
      return { ...state, error: action.payload };

    default:
      throw new Error(`Unsuported action type ${action.type}`);
  }
};

// Main function
export const SearchResult = () => {
  const [state, dispatch] = useReducer(countReducer, {
    searchQuerry: '',
    page: 1,
    // images: [],
    status: Status.IDLE,
    largeImage: '',
    error: null,
  });

  const [images, setImages] = useState([]);

  useEffect(() => {
    if (!state.searchQuerry) {
      return;
    }

    dispatch({ type: 'status', payload: Status.PENDING });

    async function getRequestImages() {
      try {
        const response = await fetchImages(state.searchQuerry, state.page);
        const { renderImages, totalImages } = response;

        if (renderImages.length === 0) {
          notFoundNotification();
          dispatch({ type: 'status', payload: Status.IDLE });
        } else {
          renderSuccesNotification(renderImages, totalImages, state.page);

          setImages(prevImages => [...prevImages, ...renderImages]);

          dispatch({ type: 'status', payload: Status.RESOLVED });
        }
      } catch (error) {
        dispatch({ type: 'error', payload: error });
        dispatch({ type: 'status', payload: Status.REJECTED });
      }
    }
    getRequestImages();
  }, [state.page, state.searchQuerry]);

  const handleSearchbarSubmit = newSearchName => {
    if (newSearchName === state.searchQuerry) {
      informativeNotification();
      return;
    }

    dispatch({ type: 'searchQuerry', payload: newSearchName });
    dispatch({ type: 'page', payload: 1 - state.page });
    dispatch({ type: 'status', payload: Status.PENDING });
    setImages([]);
  };

  const loadMore = () => {
    dispatch({ type: 'page', payload: 1 });

    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  const handleClickFromItem = newLargeImage => {
    dispatch({ type: 'largeImage', payload: newLargeImage });
  };

  const onModalClose = () => {
    dispatch({ type: 'largeImage', payload: '' });
  };

  return (
    <>
      <Searchbar handleSearchbarSubmit={handleSearchbarSubmit} />

      {state.status === Status.IDLE && (
        <IdleText>Search images and photos</IdleText>
      )}
      {state.status === Status.PENDING && <Loader />}
      {state.status === Status.REJECTED && (
        <RequestError message={state.error.message} />
      )}
      {state.status === Status.RESOLVED && (
        <>
          <ImageGallery images={images} onClick={handleClickFromItem} />
          <Button loadMore={loadMore} />
          {state.largeImage.length > 0 && (
            <Modal src={state.largeImage} onClose={onModalClose} />
          )}
        </>
      )}
    </>
  );
};
