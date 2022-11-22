import React from 'react';
import { useState, useEffect, useRef } from 'react';
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

export const SearchResult = () => {
  const defaultImages = [];
  const defaultSearchQuerry = '';
  const defaultPage = 1;
  const defaultStatus = Status.IDLE;

  const getFromLocalStorage = (key, defaultValue) => {
    return JSON.parse(window.localStorage.getItem(key)) ?? defaultValue;
  };

  const getFirstStatus = () => {
    return JSON.parse(window.localStorage.getItem('Images')).length > 0
      ? Status.RESOLVED
      : defaultStatus;
  };

  const changeLocalStorage = (key, state) => {
    window.localStorage.setItem(key, JSON.stringify(state));
  };

  const [searchQuerry, setSearchQuerry] = useState(
    getFromLocalStorage('SearchQuerry', defaultSearchQuerry)
  );
  const [images, setImages] = useState(
    getFromLocalStorage('Images', defaultImages)
  );
  const [error, setError] = useState(null);
  const [page, setPage] = useState(getFromLocalStorage('Page', defaultPage));
  const [status, setStatus] = useState(getFirstStatus());

  const [largeImage, setLargeImage] = useState('');
  const previousNameRef = useRef();

  useEffect(() => {
    if (!searchQuerry) {
      return;
    }

    // Сравнение на новое поисковое слово, если да - то page = 1
    if (searchQuerry !== previousNameRef.current) {
      setPage(1);
    }

    async function getRequestImages() {
      try {
        setStatus(Status.PENDING);

        const response = await fetchImages(searchQuerry, page);
        const responseImages = response.pictures;
        const totalImages = response.totalImages;
        changeLocalStorage('SearchQuerry', searchQuerry);
        changeLocalStorage('Page', page);

        if (page === 1 && responseImages.length === 0) {
          toast.info('No images found for your request');
          setStatus(Status.IDLE);
          return;
        }

        if (page === 1 && responseImages.length !== 0) {
          toast.success(
            `${responseImages.length} images have been uploaded according to your request. 
            Total search results - ${totalImages} images.`
          );
          setImages(responseImages);
          setStatus(Status.RESOLVED);
          changeLocalStorage('Images', responseImages);
          return;
        }

        if (page !== 1 && responseImages.length === 0) {
          toast.info(
            `Sorry, no more images found. 
            Total search results - ${totalImages} images`
          );
          setStatus(Status.RESOLVED);
          return;
        }

        if (page !== 1 && responseImages.length !== 0) {
          toast.success(
            `New ${responseImages.length} images have been uploaded according to your request. 
            Total search results - ${totalImages} images.`
          );
          setImages(prevImages => [...prevImages, ...responseImages]);
          setStatus(Status.RESOLVED);
          changeLocalStorage('Images', images);
          return;
        }
      } catch (error) {
        setError(error);
        setStatus(Status.REJECTED);
      }
    }
    getRequestImages();

    // запись поискового слова
    previousNameRef.current = searchQuerry;
  }, [page, searchQuerry, images]);

  const handleSearchbarSubmit = newSearchName => {
    if (newSearchName === searchQuerry) {
      toast.info('🦄 You entered the previous search word!');
      return;
    }
    setSearchQuerry(newSearchName);
    setPage(1);
    setStatus(Status.PENDING);
  };

  const loadMore = () => {
    setPage(page + 1);
  };

  const handleClickFromItem = largeImage => {
    setLargeImage(largeImage);
  };

  const onModalClose = () => {
    this.setState({ largeImage: '' });
  };

  return (
    <>
      <Searchbar handleSearchbarSubmit={handleSearchbarSubmit} />

      {status === Status.IDLE && <IdleText>Search images and photos</IdleText>}
      {status === Status.PENDING && (
        <Loader images={images} onClick={handleClickFromItem} />
      )}
      {status === Status.REJECTED && <RequestError message={error.message} />}
      {status === Status.RESOLVED && (
        <>
          <ImageGallery images={images} onClick={handleClickFromItem} />
          <Button loadMore={loadMore} />
          {this.state.largeImage.length > 0 && (
            <Modal src={largeImage} onClose={onModalClose} />
          )}
        </>
      )}
    </>
  );
};
