# Spotify Utils

* Back-end is [LoopBack](http://loopback.io)
* Front-end is [Vue](http://vuejs.org)/[Vuetify](http://vuetifyjs.com)
* Uses [spotify-web-api-node](https://github.com/thelinmichael/spotify-web-api-node)
### Installation
1. Run `npm install` from the base folder
1. Run `npm install` from the `client` folder

### Development
* To run the Loopback server, run `node .` from the base folder
  * This runs the server on http://localhost:3000
  * View the Swagger documentation at http://localhost:3000/explorer
  * Loopback will compile the front-end for production, but no front-end updates will register until the server is re-run
* To run the Vue client in development, run `npm run dev` from the `client` folder
  * This runs the client on http://localhost:3000

### Configuration
* Admin account is created on first run. Credentials are 
  * Username: admin@admin.com
  * Password: admin1234
