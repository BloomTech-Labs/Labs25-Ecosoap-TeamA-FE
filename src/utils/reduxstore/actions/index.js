import { client } from '../../../index.js';
import { FETCH_TYPES } from '../../../graphql/queries.js';

export const getTypes = () => {
  return dispatch => {
    dispatch({ type: 'FETCH_TYPES_START' });
    client
      .query({ query: FETCH_TYPES })
      .then(res => {
        dispatch({ type: 'FETCH_TYPES_SUC', payload: res.data.types });
      })
      .catch(error => {
        dispatch({ type: 'FETCH_TYPES_ERR', payload: error.message });
      });
  };
};
