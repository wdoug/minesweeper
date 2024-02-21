![](https://travis-ci.com/wdoug/minesweeper.svg?branch=master)
# Minesweeper

> ## NOTE: This example project is currently outdated.
> It was originally written at the end of 2018 when the ecosystem was quite different. I haven't gotten around to updating it yet, but here are a few notes on what I would change if I had time:
> - Rewrite React class components as functional components with [React hooks](https://react.dev/reference/react/hooks) (these weren't released until February 2019)
> - Replace Create React App with [Vite](https://vitejs.dev/) or another alternative if backend features might be wanted (for context, see [this comment](https://github.com/reactjs/react.dev/pull/5487#issuecomment-1409720741))
> - Upgrade all libraries and tools
> - Integrate [typescript-eslint](https://typescript-eslint.io/) with the [strict-type-checked](https://typescript-eslint.io/users/configs#strict-type-checked) config

> The deployed version of this project can be found [here](https://wdoug-minesweeper.netlify.com/)

## Setup
1. Clone this repo and cd into the root directory
2. Install [nodejs](https://nodejs.org/en/) version 10.13.0
    - NOTE: with [nvm](https://github.com/creationix/nvm) this can be done by running `nvm install` in the root directory of the repo
3. Run `npm install` to install dependencies [*](#package-management-=>-npm)

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

## Linting
Linting static analysis can be run with:
```sh
npm run lint
```

## Type checking
This project uses typescript types. The typescript checker can be run directly with:
```sh
npm run typecheck
```

## Architectural Decisions Overview

### Framework => React
React is the most popular web framework today with a huge community and strong investment from Facebook. It has some very nice properties that helped simplify and improve the way that complex UIs are built. This project definitely doesn't need React or any framework for that matter, however, it does help set the groundwork for a maintainable app if additional features are added.

#### Setup => Create React App
While React can be used by [just adding a few script tags to an html page](https://reactjs.org/docs/add-react-to-a-website.html#add-react-in-one-minute), most developers opt to use tools such as [webpack](https://webpack.js.org/) for bundling assets together and [babel](https://babeljs.io/) for compiling new javascript features and special syntax like [JSX](https://reactjs.org/docs/introducing-jsx.html) to earlier supported versions of javascript. These tools provide several benefits including an improved developer experience. Configuring and maintaining the setup for these and other tools can be a hassle. As a result, there are several projects that help simplify and abstract this setup. Facebook has one such project called [Create React App](https://facebook.github.io/create-react-app/) that is great for single page apps. This project was bootstrapped with this tool to take advantage of the excellent abstraction of the numerous features that it provides.
> NOTE: As shared at the top of this readme, Create React App is [no longer a recommended choice](https://github.com/reactjs/react.dev/pull/5487#issuecomment-1409720741)

### Package Management => npm
There are several tools for managing node packages. The two most popular competing options today are [npm](https://www.npmjs.com/) and [yarn](https://yarnpkg.com/en/). The functionality of these two tools is quite similar at this point in time and since this project is unlikely to run into the cases where yarn would either be necessary or make a significant improvement this project currently uses npm as it is the default package manager that is already installed with node, which means a simpler setup overall. This could also easily be changed in the future.

### Automated Testing Framework => Jest
Writing automated tests is an important method for describing and validating software functionality is correct and doesn't break over time. There are tons of different tools for writing and running javascript and browser tests.

For unit and integration tests [jest](https://jestjs.io/) may have [just taken the lead](https://www.npmtrends.com/jest-vs-jasmine-core-vs-mocha-vs-ava-vs-cucumber-vs-karma) as the most popular javascript test runner after Facebook made [significant investments in improving it](https://jestjs.io/blog/2016/09/01/jest-15.html#other-improvements). Between the great features and developer experience it provides and the fact that it is pre-configured in create-react-app[*](#setup-=>-create-react-app) made it a natural choice to use for tests.

At this point there doesn't appear to be a reason to include other testing types such as UI/end-to-end testing tools, load testing, generative testing, etc, although future feature development could change that.

### React testing => react-testing-library

Although enzyme is currently the most popular library for testing React, its APIs encourage testing internal library implementation details. As a response to frustrations with these APIs and the common ways that Enzyme is used, a new library, [react-testing-library](https://youtu.be/2HnNo4t8534?t=404) has been developed. This library encourages much more useful automated tests as pointed out [in this talk](https://youtu.be/2HnNo4t8534?t=404), which is why it is used in this project.

### Typing => Typescript

Static type analysis can provide some powerful insights into data flow in code. Javascript is dynamically typed, however, Microsoft and Facebook have both created tools, [Typescript](https://www.typescriptlang.org/) and [Flow](https://flow.org/) respectively, that provide the ability to optionally add static types to javascript.

Static type checking, in addition to helping catch certain categories of bugs, provides other benefits that are possibly best explained by [Flow's website landing page](https://flow.org/): It can help developers code _faster_, _smarter_, _confidently_, and _bigger_.

While adding static type checking is certainly not necessary for a small project like this, it already provides value by enforcing interfaces between components and data flow between functions.

Flow has a bit better integration with React as they are both developed by Facebook as well as has some enhanced type inference, but Typescript is more mature, more stable, has a much bigger community, and has a higher usage than Flow, which ultimately was strong enough to tip the decision scale to use Typescript for static types.

> NOTE: Typescript provides a few additional features on top of just static types, but those have not been used in this project

### Styling => CSS

It used to be considered best practice to maintain styles in CSS stylesheets where the styling could be independent from the HTML markup and javascript. This ended up having some limitations for large applications and people created CSS preprocessors that provided additional features and would compile to CSS.

With the rise of complex single page apps this became still more difficult to manage without rigid rules for how to namespace and use CSS. Then in 2014, Christopher "vjeux" Chedeau [pointed out](https://speakerdeck.com/vjeux/react-css-in-js?slide=2) that Facebook was running into some fundamental issues with CSS that they were struggling to work around with preprocessors at their scale and flipped the best practice on its head by suggesting writing "CSS in JS".

Since then, there has been a huge amount of innovation and exploration around how to best manage styles going forward. In the React ecosystem, [styled-components](https://www.styled-components.com/) is currently the [most popular](https://www.npmtrends.com/styled-components-vs-radium-vs-css-modules-loader-core-vs-aphrodite-vs-@emotion/core-vs-glamor-vs-fela-vs-styletron-vs-jss) library, but [emotion](https://emotion.sh/) is rapidly gaining popularity and usage.

Despite all this, however, this project only uses CSS currently (technically it [uses PostCSS](https://facebook.github.io/create-react-app/docs/post-processing-css) but currently only for prefixing and polyfilling CSS APIs and not any of the more sophisticated [plugins](https://github.com/postcss/postcss#plugins)). This is because the CSS in JS ecosystem still feels very young and experimental and this project is currently small and simple with minimal styling. The original best practice benefits of keeping separate CSS stylesheets currently still apply as long as the CSS is well structured and follows namespacing conventions.

This is definitely an area that would potentially be reevaluated with further styling development.

### Implementation notes
The minesweeper game logic has been implemented in a mostly functional inspired format where data is passed around and transformed (generally in an immutable fashion) by functions.

The bomb placements and adjacent bomb counts are pre-calculated when starting a new game.

Cascading card reveals for cards with no adjacent bombs are implemented with with recursive asynchronous reveals to create a ripple effect.

#### Data structures
Currently the bomb placements and adjacent bomb counts are stored in an array of arrays separately from the revealed cards data structure. This was done to have a more flat data structure with independently updateable data (revealing cards doesn't affect bomb placements). It could definitely be worthwhile to refactor this into one combined data structure if certain additional features are added (for example adding the ability to flag potential bombs, or having the first revealed card never be a bomb). If this happens it might be worth pulling in a library for immutably updating nested data structures and/or making a custom class for that data structure.