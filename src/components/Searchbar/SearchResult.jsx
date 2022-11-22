import { useReducer, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Searchbar } from './Searchbar';
import { fetchImages } from './apiRequest/apiRequest';
import { ImageGallery } from './ImageGallery/ImageGallery';
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

function countReducer(state, action) {
  switch (action.type) {
    case 'searchQuerry':
      return { ...state, searchQuerry: action.payload };

    case 'page':
      return { ...state, page: state.page + action.payload };

    case 'images':
      return { ...state, images: action.payload };

    case 'status':
      return { ...state, status: action.payload };

    case 'largeImage':
      return { ...state, largeImage: action.payload };

    case 'error':
      return { ...state, error: action.payload };

    default:
      throw new Error(`Unsuported action type ${action.type}`);
  }
}

// Function
export const SearchResult = () => {
  const [state, dispatch] = useReducer(countReducer, {
    searchQuerry: '',
    page: 1,
    images: [],
    status: Status.IDLE,
    largeImage: '',
    error: null,
  });
  useEffect(() => {
    if (!state.searchQuerry) {
      return;
    }

    async function getRequestImages() {
      try {
        dispatch({ type: 'status', payload: Status.PENDING });

        const response = await fetchImages(state.searchQuerry, state.page);
        const responseImages = response.pictures;
        const totalImages = response.totalImages;

        if (state.page === 1 && responseImages.length === 0) {
          toast.info('No images found for your request');
          dispatch({ type: 'status', payload: Status.IDLE });
          return;
        }

        if (state.page === 1 && responseImages.length !== 0) {
          toast.success(
            `${responseImages.length} images have been uploaded according to your request. 
            Total search results - ${totalImages} images.`
          );
          dispatch({ type: 'images', payload: responseImages });
          dispatch({ type: 'status', payload: Status.RESOLVED });
          return;
        }

        if (state.page !== 1 && responseImages.length === 0) {
          toast.info(
            `Sorry, no more images found. 
            Total search results - ${totalImages} images`
          );
          dispatch({ type: 'status', payload: Status.RESOLVED });
          return;
        }

        if (state.page !== 1 && responseImages.length !== 0) {
          toast.success(
            `New ${responseImages.length} images have been uploaded according to your request. 
            Total search results - ${totalImages} images.`
          );
          dispatch({
            type: 'images',
            payload: [...state.images, ...responseImages],
          });
          dispatch({ type: 'status', payload: Status.RESOLVED });
          return;
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
      toast.info('🦄 You entered the previous search word!');
      return;
    }

    dispatch({ type: 'searchQuerry', payload: newSearchName });
    dispatch({ type: 'page', payload: 1 - state.page });
    dispatch({ type: 'status', payload: Status.PENDING });
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
          <ImageGallery images={state.images} onClick={handleClickFromItem} />
          <Button loadMore={loadMore} />
          {state.largeImage.length > 0 && (
            <Modal src={state.largeImage} onClose={onModalClose} />
          )}
        </>
      )}
    </>
  );
};
