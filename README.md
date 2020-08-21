# EcoSoapBank TeamA Front-End

[![Maintainability](https://api.codeclimate.com/v1/badges/5e37932c610a83213715/maintainability)](https://codeclimate.com/github/Lambda-School-Labs/labs-spa-starter/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/5e37932c610a83213715/test_coverage)](https://codeclimate.com/github/Lambda-School-Labs/labs-spa-starter/test_coverage)

> **Disclaimer:** This application is currently in Alpha (as of June 08, 2020) and is not ready for production. Please use at your own risk as things will change almost daily.

- The following was built using [Create React App](https://reactjs.org/docs/create-a-new-react-app.html) for base boiler-plating. We will maintain the dependencies as according to their specifications as an Engineering Organization.

## StoryBook

- All of the reusable components for this repository can be [found here using a Storybook](https://lambda-school-labs.github.io/labs-spa-starter/?path=/story/form-button--basic-usage).
- For more information on contributing to our Storybook for this application [you can see here](./src/stories/README.md).

## Requirements

- [Labs Engineering Standard requirements found here](https://labs.lambdaschool.com/topics/node-js/)

## Getting Started

### Enviornment variables

- `REACT_APP_CLIENT_ID` Okta client id
- `REACT_APP_OKTA_ISSUER_URI` Okta api authorization server issuer uri
- `REACT_APP_GEO_CODE_KEY` Mapquest Geocode Api key


## App Deployment

- This Application has been deployed with AWS Amplify. and can be found [here](https://a.ecosoap.dev)

## Components

- Components are created and maintained following [the following documentation](./src/components/README.md)

## App Styling

- Components have been style using [`ANT Design Library`](https://ant.design/) and [LESS](http://lesscss.org/).

## Major Dependencies In Use

- [antd](https://ant.design/docs)
- [@ant-design/icons](https://ant.design/docs)
- [graphql](https://graphql.org/learn/)
- [okta/okta-react](https://www.npmjs.com/package/@okta/okta-react)
- [google-map-react](https://github.com/google-map-react/google-map-react)

## Testing your App.

- In accordance with our [Labs Engineering Standards](https://labs.lambdaschool.com/) this app uses common practices for Unit/Integration Testing using:
  [React Testing Library](https://github.com/testing-library/react-testing-library)
  [Jest](https://jestjs.io/)
- For examples on how to test your application and more information please see [the following documentation](./src/__tests__/README.md).

## Contributing

- As this repository is a Work In Progress (WIP) we'd love to hear more about what is working for you and what could be improved. [Please use the `Issues` tab in Github](https://github.com/Lambda-School-Labs/labs-spa-starter/issues) to submit and file any issues that come up during your development cycle. Issues should be related to things like, documentation, bugs that come up with the existing flow, architectural discussion, suggestions for improvements, and anything that you find cumbersome about getting started and working through a product cycle using these tools.
- **Please use `Labels` when filing issues** try and include screenshots of bugs and steps to reproduce.
