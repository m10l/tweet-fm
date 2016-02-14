module.exports = {
    twitter: {
        consumer_key: process.env.twitter_consumer_key || 'YOUR_CONSUMER_KEY',
        consumer_secret: process.env.twitter_consumer_secret || 'YOUR_CONSUMER_SECRET',
        access_token: process.env.twitter_access_token || 'YOUR_ACCESS_TOKEN',
        access_token_secret: process.env.twitter_access_token_secret || 'YOUR_ACCESS_TOKEN_SECRET'
    }
};
