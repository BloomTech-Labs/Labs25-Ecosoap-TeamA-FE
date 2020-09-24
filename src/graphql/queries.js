import gql from 'graphql-tag';

export const FETCH_TYPES = gql`
  {
    types {
      id
      name
      icon
      fields {
        id
        name
        value
      }
    }
  }
`;

export const FETCH_USERS = gql`
  {
    users {
      id
      email
      password
    }
  }
`;
