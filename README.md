# Reso-Api-Explorer
This tool serves as a simple and intuitive interface for developers allowing them to interact with the new RESO Web API

## Installation
 
 1. Install node dependencies
 
 ```shell
 $ npm install
 ```
 
 2. Install bower
 
 ```shell
 $ bower install
 ```
 
 ## Environment Setup
 This app expects there to be an env.js file in the root of the project.
 For your convenience there is an example env file called env.example.js.
 Feel free to modify and use this for your own env.js.
 
 ## Build the App

 1. Run webpack: builds the src Vue files into browser compatible JS
 
 ```shell
 $ npm run prod
 ```
 
 2. Run gulp: builds all of the static assets
 
 ```
 $ gulp
 ```