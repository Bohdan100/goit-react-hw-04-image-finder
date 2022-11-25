import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import { HiXMark } from 'react-icons/hi2';

import {
  Overlay,
  ModalWindow,
  ModalFormBtn,
  ModalFormBtnLabel,
} from '../SearchResult.styled';

const modalRoot = document.querySelector('#modal-root');

export const Modal = ({ src, onClose }) => {
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleKeyDown = e => {
    if (e.code === 'Escape') {
      onClose();
    }
  };

  const handleBackdropClick = event => {
    if (event.currentTarget === event.target) {
      onClose();
    }
  };

  return createPortal(
    <Overlay onClick={handleBackdropClick}>
      <ModalWindow>
        <img src={src} alt="" />
        <ModalFormBtn type="submit" onClick={onClose}>
          <HiXMark size="36px" />
          <ModalFormBtnLabel>Search</ModalFormBtnLabel>
        </ModalFormBtn>
      </ModalWindow>
    </Overlay>,
    modalRoot
  );
};

Modal.propTypes = {
  src: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};
