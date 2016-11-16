# Reso-Api-Explorer
This tool serves as a simple and intuitive interface for developers allowing them to interact with the new RESO Web API

##Installation
1. Install node dependencies

    ```shell
    $ npm install
    ```
2. Install bower libraries

    ```shell
    $ bower install
    ```
 
##Environment Setup
 This app expects there to be an `env.js` file in the root of the project.
 For your convenience there is an example env file called `env.example.js.`
 Feel free to modify and use this for your own `env.js`.
 
 The `env.js` file consists of two main objects:
 1. ENV
    * APP_NAME: Is the name of the app
    * APP_URL: This is the domain that is hosting the app, and will be used when generating the redirect_uri for servers.
    * API_URL: Not actually sure if this one is necessary.
 2. servers: This will be an array of default servers
    * id: The static id of the server (used internally)
    * name: Name of the server
    * token_endpoint: URL to fetch a new access_token
    * auth_endpoint: OpenID Connect url to grab an authorization code
    * data_endpoint: URL of the datasystem holding all the listing data
    * client_id: The registered Client ID which has access to this server
    * client_secret: The registered Client Secret which has access to this server
 
##Build the App
1. Run gulp: builds all of the static assets
 
    ```
    $ gulp
    ```
2. Local Build

    ```shell
    //In local development, webpack will start up a local dev server
    $ npm run dev
    ```
3. Production Build

    ```shell
    //For production builds, webpack will build a standalone bundle
    $ npm run prod
    ```