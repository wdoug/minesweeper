# Minesweeper

## Setup
1. Clone this repo and cd into the root directory
2. Install [nodejs](https://nodejs.org/en/) version 10.13.0
    - NOTE: with [nvm](https://github.com/creationix/nvm) this can be done by running `nvm install` in the root directory of the repo
3. Run `npm install` to install dependencies [*](#npm-over-yarn)

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Architectural Decisions

### npm over yarn
Even though [Yarn](https://yarnpkg.com/en/) has some benefits over npm for package management this project is currently using npm. This project is unlikely to run into the cases where yarn would either be necessary or make a significant improvement and since npm comes bundled with node it is therefore simpler to get up and running quickly. This could also easily be changed in the future.
