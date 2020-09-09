import gql from 'graphql-tag';

export const FETCH_TYPES = gql`
  {
    types {
      id
      name
      fields {
        id
        name
        value
      }
    }
  }
`;
