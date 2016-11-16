export default {
    ENV: {
        APP_NAME: 'Example Name',           //Name of the site
        APP_URL: 'http://app.com/',         //The site's url
        API_URL: 'http://api.com/api',      //RR api
    },
    servers: [
        {
            name: 'First Demo',
            token_endpoint: 'http://api.app/api/oauth/access_token',
            auth_endpoint: 'http://api.app/api/oauth/authorize',
            data_endpoint: 'http://api.app/api/v1',
            client_id: 'secret',
            client_secret: 'secret'
        }
    ]
}