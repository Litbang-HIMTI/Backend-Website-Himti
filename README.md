<p align="center">
  <img src="https://avatars.githubusercontent.com/u/106340941">
</p>

<h1 align="center">Backend Website Himti</h1>
<p align="center">
  <a href="https://github.com/Litbang-HIMTI/Backend-Website-Himti/issues"><img alt="GitHub issues" src="https://img.shields.io/github/issues/Litbang-HIMTI/Backend-Website-Himti"></a>
  <a href="https://github.com/Litbang-HIMTI/Backend-Website-Himti/pulls"><img alt="GitHub pull requests" src="https://img.shields.io/github/issues-pr/Litbang-HIMTI/Backend-Website-Himti"></a>
  <a href="https://github.com/Litbang-HIMTI/Backend-Website-Himti/releases/latest"><img alt="github downloads"  src="https://img.shields.io/github/downloads/Litbang-HIMTI/Backend-Website-Himti/total?label=downloads (github)"></a>
  <br />
  <a href="https://github.com/Litbang-HIMTI/Backend-Website-Himti/stargazers"><img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/Litbang-HIMTI/Backend-Website-Himti?style=social"></a>
  <a href="https://github.com/Litbang-HIMTI/Backend-Website-Himti/network/members"><img alt="GitHub forks" src="https://img.shields.io/github/forks/Litbang-HIMTI/Backend-Website-Himti?style=social"></a>
</p>

**Currently in development.**

Backend tech stack:
Express.js + Node.js (typescript) + MongoDB

# Table Of Content

- [Table Of Content](#table-of-content)
- [Getting started](#getting-started)
  - [Set up your .env](#set-up-your-env)
  - [Available Scripts](#available-scripts)
    - [`npm start`](#npm-start)
    - [`npm run dev:ts`](#npm-run-devts)
    - [`npm run watch`](#npm-run-watch)
    - [`npm run build`](#npm-run-build)
  - [Run in ease while developing](#run-in-ease-while-developing)

# Getting started

Before contributing please consider reading some of the [docs](docs):

- [CONTRIBUTING.md](docs/CONTRIBUTING.md)
- [resources.md](docs/resources.md)

To start developing, first make sure that you have node installed. After that do `npm install` or `npm ci` to install all the dependencies.

## Set up your .env

Don't forget to set up your .env file located in root folder. You can follow the template in the [.env.example](.env.example) file.

## Available Scripts

In the api directory, you can run:

### `npm start`

Runs the API in the production mode (Compiled).

### `npm run dev:ts`

Runs the API in the development mode (Not compiled).

### `npm run watch`

Watches and re-compiles on every changes made to the codebase.

### `npm run build`

Builds the API for production to the `dist` folder.

## Run in ease while developing

- open a new terminal and run `npm run watch`
- then open another terminal and run `npm run dev`

**_this will get faster as it automatically re-compiles on the background_**
