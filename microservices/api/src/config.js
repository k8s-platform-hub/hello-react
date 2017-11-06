let projectConfig = {
    url: {
        data: 'http://data.hasura/v1/query',
    }
}

if (process.env.ENVIRONMENT === 'dev') {
  projectConfig.url.data = 'http://127.0.0.1:6432/v1/query';
}

module.exports = {
  projectConfig
};
