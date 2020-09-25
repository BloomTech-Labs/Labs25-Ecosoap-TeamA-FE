# Eco-Soap Bank Admin Dashboard (Labs25 Team A)

You can find the deployed project at [EcoSoapBank Team A](https://a.ecosoap.dev).

## Video Demonstration

[Click Here for Video Demonstration](https://drive.google.com/file/d/1qTBycgk2-gpOBpgCR-EuNUx8g9Ko_lG5/view?usp=sharing)


## Contributors


|                                                      [Akak Almaz](https://github.com/Aakak)                                                       |                                                       [Marc Tapp](https://github.com/tippitytapp)                                                        |                                                      [Richard Wang](https://github.com/richVI)                                                       |                                                       [Rodrigo De La Mora](https://github.com/delamorarodrigo)                                                        |                                                      [Tanner Williams](https://github.com/Tannerwill756)                                                       |
| :-----------------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------: |
| [<img src="https://avatars0.githubusercontent.com/u/4251464?s=460&u=e4c1defe9f10895551fe5bc396f8270338a428c3&v=4" width = "200" />](https://github.com/aakak) | [<img src="https://avatars2.githubusercontent.com/u/60143534?s=460&u=401ca6019ff578e931950564faf99cee49012536&v=4" width = "200" />](https://github.com/tippitytapp) | [<img src="https://avatars0.githubusercontent.com/u/47126654?s=460&u=6e73f4ac70507b517c4a0ca3aa4cb7a8da66325f&v=4" width = "200" />](https://github.com/richvi) | [<img src="https://avatars2.githubusercontent.com/u/60915500?s=460&u=a03f7ecda6f8231de5ab0825a73ed3bc27590b0d&v=4" width = "200" />](https://github.com/delamorarodrigo) | [<img src="https://avatars3.githubusercontent.com/u/60625284?s=460&u=96dc747e0e37027321c7e7b1f525bd6f822d3aa3&v=4" width = "200" />](https://github.com/tannerwill756) |
|                                [<img src="https://github.com/favicon.ico" width="15"> ](https://github.com/aakak)                                |                            [<img src="https://github.com/favicon.ico" width="15"> ](https://github.com/tippitytapp)                             |                          [<img src="https://github.com/favicon.ico" width="15"> ](https://github.com/richvi)                           |                          [<img src="https://github.com/favicon.ico" width="15"> ](https://github.com/delamorarodrigo)                           |                           [<img src="https://github.com/favicon.ico" width="15"> ](https://github.com/tannerwill756)                            |
|                [ <img src="https://static.licdn.com/sc/h/al2o9zrvru7aqj8e1x2rzsrca" width="15"> ](https://www.linkedin.com/in/akak-almaz/)                |                 [ <img src="https://static.licdn.com/sc/h/al2o9zrvru7aqj8e1x2rzsrca" width="15"> ](https://www.linkedin.com/in/marctapp)                 |                [ <img src="https://static.licdn.com/sc/h/al2o9zrvru7aqj8e1x2rzsrca" width="15"> ](https://www.linkedin.com/in/richardwang1219/)                |                 [ <img src="https://static.licdn.com/sc/h/al2o9zrvru7aqj8e1x2rzsrca" width="15"> ](https://www.linkedin.com/in/rodrigo-de-la-mora/)                 |                [ <img src="https://static.licdn.com/sc/h/al2o9zrvru7aqj8e1x2rzsrca" width="15"> ](https://www.linkedin.com/in/tanner-m-williams/)                |

<br>
<br>


![MIT](https://img.shields.io/packagist/l/doctrine/orm.svg)
![React](https://img.shields.io/badge/react-v16.7.0--alpha.2-blue.svg)
![JavaScript](https://img.shields.io/badge/javascript-ES6-yellow)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

> **Disclaimer:** This application is currently in Alpha (as of September 18, 2020) and is not ready for production. Please use at your own risk as things will change almost daily.

- The following was built using [Create React App](https://reactjs.org/docs/create-a-new-react-app.html) for base boiler-plating. We will maintain the dependencies as according to their specifications as an Engineering Organization.


## Project Overview

[Trello Board](https://trello.com/b/9EmhNHnT/labs25ecosoapakak)

[Product Canvas](https://www.notion.so/Web-Roadmap-63c803c2dd234b859ac46c975f905b54)

[UX Design files](https://whimsical.com/93bqrp3wEWodfwo3PWRMdq)

## Requirements

- [Labs Engineering Standard requirements found here](https://labs.lambdaschool.com/topics/node-js/)

## Getting Started

### Enviornment variables

- `REACT_APP_CLIENT_ID` Okta client id
- `REACT_APP_OKTA_ISSUER_URI` Okta api authorization server issuer uri
- `REACT_APP_GOOGLE_MAP_API_KEY` Google Map Api key
- `REACT_APP_GEO_CODE_KEY` Mapquest Geocode Api key
- `REACT_APP_GRAPHQL_API` GraphQL Endpoint url


## Components

- Components are created and maintained following [the following documentation](./src/components/README.md)

## App Styling

- Components have been style using [`ANT Design Library`](https://ant.design/) and [LESS](http://lesscss.org/).

## Major Dependencies In Use

- [antd](https://ant.design/docs)
- [@ant-design/icons](https://ant.design/docs)
- [graphql](https://graphql.org/learn/)
- [okta/okta-react](https://www.npmjs.com/package/@okta/okta-react)
- [react-google-maps](https://react-google-maps-api-docs.netlify.app)


# Installation Instructions

When installing this repository, run npm install before attempting to run.

# Known Issues
1️⃣ When adding a new Type, you can currently add 2 fields with the same name. This should not be allowed to happen. Need field validation to be updated to not allow this.

 ![Known Issue Field Types](/src/assets/FieldTypeKI.PNG)

2️⃣ When adding a new User, you cannot add a user with the same email, but the valiation is not rendering on the form, though you can see the error in the console.

 ![Known Issue Add User](/src/assets/adduserKI.PNG)

## Other Scripts

    * build - creates a build of the application
    * start - starts the production server after a build is created
    * test - runs tests in **tests** directory \* eject - copy the configuration files and dependencies into the project so you have full control over them

# Contributing

When contributing to this repository, please first discuss the change you wish to make via issue, email, or any other method with the owners of this repository before making a change.

Please note we have a [code of conduct](./CODE_OF_CONDUCT.md). Please follow it in all your interactions with the project.

## Issue/Bug Request

**If you are having an issue with the existing project code, please submit a bug report under the following guidelines:**

- Check first to see if your issue has already been reported.
- Check to see if the issue has recently been fixed by attempting to reproduce the issue using the latest master branch in the repository.
- Create a live example of the problem.
- Submit a detailed bug report including your environment & browser, steps to reproduce the issue, actual and expected outcomes, where you believe the issue is originating from, and any potential solutions you have considered.

### Feature Requests

We would love to hear from you about new features which would improve this app and further the aims of our project. Please provide as much detail and information as possible to show us why you think your new feature should be implemented.

### Pull Requests

If you have developed a patch, bug fix, or new feature that would improve this app, please submit a pull request. It is best to communicate your ideas with the developers first before investing a great deal of time into a pull request to ensure that it will mesh smoothly with the project.

Remember that this project is licensed under the MIT license, and by submitting a pull request, you agree that your work will be, too.

#### Pull Request Guidelines

- Ensure any install or build dependencies are removed before the end of the layer when doing a build.
- Update the README.md with details of changes to the interface, including new plist variables, exposed ports, useful file locations and container parameters.
- Ensure that your code conforms to our existing code conventions and test coverage.
- Include the relevant issue number, if applicable.
- You may merge the Pull Request in once you have the sign-off of two other developers, or if you do not have permission to do that, you may request the second reviewer to merge it for you.

### Attribution

These contribution guidelines have been adapted from [this good-Contributing.md-template](https://gist.github.com/PurpleBooth/b24679402957c63ec426).


