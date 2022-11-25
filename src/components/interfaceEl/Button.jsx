import PropTypes from 'prop-types';

import { BtnLoadMore } from '../SearchResult.styled';

export const Button = ({ loadMore }) => {
  return (
    <BtnLoadMore type="button" className="Button" onClick={loadMore}>
      Load more
    </BtnLoadMore>
  );
};

Button.propTypes = {
  loadMore: PropTypes.func.isRequired,
};
