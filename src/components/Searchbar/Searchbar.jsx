import { useState } from 'react';
import PropTypes from 'prop-types';
import { ImSearch } from 'react-icons/im';

import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  SearchbarContainer,
  SearchForm,
  SearchFormBtn,
  SearchFormBtnLabel,
  SearchFormInput,
} from '../SearchResult.styled';

export const Searchbar = ({ handleSearchbarSubmit }) => {
  const [searchName, setSearchName] = useState('');

  const handleNameChange = e => {
    e.preventDefault();

    const { value } = e.target;
    setSearchName(value);
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (searchName.trim() === '') {
      toast.error('🦄 Please enter a valid search term!');
      return;
    }

    handleSearchbarSubmit(searchName);
    setSearchName('');
  };

  return (
    <>
      <SearchbarContainer>
        <SearchForm onSubmit={handleSubmit}>
          <SearchFormBtn type="submit">
            <ImSearch size="18px" />
            <SearchFormBtnLabel>Search</SearchFormBtnLabel>
          </SearchFormBtn>

          <SearchFormInput
            type="text"
            autoComplete="off"
            autoFocus
            placeholder="Search images and photos"
            name="searchName"
            value={searchName}
            onChange={handleNameChange}
          />
        </SearchForm>
      </SearchbarContainer>

      <ToastContainer autoClose={2000} position="top-center" theme="colored" />
    </>
  );
};

Searchbar.propTypes = { handleSearchbarSubmit: PropTypes.func.isRequired };
