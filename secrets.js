module.exports = {
    twitter: {
        consumer_key: process.env.TWITTER_CONSUMER_KEY || 'YOUR_CONSUMER_KEY',
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET || 'YOUR_CONSUMER_SECRET',
        access_token: process.env.TWITTER_ACCESS_TOKEN || 'YOUR_ACCESS_TOKEN',
        access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET || 'YOUR_ACCESS_TOKEN_SECRET'
    }
};
