import React from 'react';
import PropTypes from 'prop-types';

import { ImageGalleryCard, Image } from '../SearchResult.styled';

export const ImageGalleryItem = ({ onClick, largeImageURL, tags }) => {
  const handleClick = event => {
    event.preventDefault();

    const largeImageURL = event.target.name;
    onClick(largeImageURL);
  };

  return (
    <ImageGalleryCard>
      <Image
        src={largeImageURL}
        alt={tags}
        onClick={handleClick}
        name={largeImageURL}
      />
    </ImageGalleryCard>
  );
};

ImageGalleryItem.propTypes = {
  onClick: PropTypes.func.isRequired,
  largeImageURL: PropTypes.string.isRequired,
  tags: PropTypes.string.isRequired,
};
