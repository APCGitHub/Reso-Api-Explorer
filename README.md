#Reso-Api-Explorer
This tool serves as a simple and intuitive interface for developers allowing them to interact with the new RESO Web API

##Installation
 
 1. Install node dependencies
 
 ```shell
 $ npm install
 ```
 
 2. Install bower
 
 ```shell
 $ bower install
 ```
 
 ##Environment Setup
 This app expects there to be an `env.js` file in the root of the project.
 For your convenience there is an example env file called `env.example.js.`
 Feel free to modify and use this for your own `env.js`.
 
 The `env.js` file consists of two main objects:
 1. ENV
 ..* APP_NAME: Is the name of the app
 ..* APP_URL: This is the domain that is hosting the app, and will be used when generating the redirect_uri for servers.
 ..* API_URL: Not actually sure if this one is necessary.
 2. servers
 ..* This will be an array of default servers you would like to offer to any users of the app.
 
 ##Build the App

 1. Run webpack: builds the src Vue files into browser compatible JS
 
 ```shell
 $ npm run prod
 ```
 
 2. Run gulp: builds all of the static assets
 
 ```
 $ gulp
 ```