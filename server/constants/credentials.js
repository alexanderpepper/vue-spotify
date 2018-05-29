const isProd = process.env.NODE_ENV === 'production'
module.exports = {
  clientSecret: '2e04a89751e34159b4e5184efe907f6c',
  clientId: '293aaf8004794514bfe540de4cbe0b54',
  redirectUri: isProd ? 'https://spotify.alexpepper.us/callback' : 'http://localhost:8080/callback'
}
