# Minesweeper

## Setup
1. Clone this repo and cd into the root directory
2. Install [nodejs](https://nodejs.org/en/) version 10.13.0
    - NOTE: with [nvm](https://github.com/creationix/nvm) this can be done by running `nvm install` in the root directory of the repo
3. Run `npm install` to install dependencies [*](#npm-over-yarn)

## Running
To start the app in development mode run:
```sh
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if edits are made and show lint errors in the console.

## Testing
Tests can run with:
```sh
npm test
```

This launches the test runner in the interactive watch mode.<br>
See [this section](https://facebook.github.io/create-react-app/docs/running-tests) in the create-react-app docs for more information.

## Architectural Decisions

### `npm` vs `yarn`
Even though [Yarn](https://yarnpkg.com/en/) has some benefits over npm for package management this project is currently using npm. This project is unlikely to run into the cases where yarn would either be necessary or make a significant improvement and since npm comes bundled with node it is therefore simpler to get up and running quickly. This could also easily be changed in the future.
