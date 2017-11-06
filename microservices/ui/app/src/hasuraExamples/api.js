import fetch from 'isomorphic-fetch';
import { projectConfig } from './config';

//Fetches all the articles from the article table
const getArticleList = () => {
  var requestOptions = {
      "method": "POST",
      "headers": {
          "Content-Type": "application/json"
      }
  };
  var body = {
      "type": "select",
      "args": {
          "table": "article",
          "columns": [
              "content",
              "id",
              "author_id",
              "title"
          ]
      }
  };
  requestOptions["body"] = JSON.stringify(body);
  return fetch(projectConfig.url.data, requestOptions)
  .then(function(response) {
    return response.json();
  })
  .catch(function(error) {
    console.log('Request Failed:' + error);
  });
};

//Fetches an article with a specific id
const getArticle = (id) => {

  var requestOptions = {
      "method": "POST",
      "headers": {
          "Content-Type": "application/json"
      }
  };

  var body = {
      "type": "select",
      "args": {
          "table": "article",
          "columns": [
              "content",
              "id",
              "title",
              {
                "name": "author",
                "columns":[
                  "name"
                ]
              }
          ],
          "where": {
              "id": {
                  "$eq": id
              }
          }
      }
  };

  requestOptions["body"] = JSON.stringify(body);

  return fetch(projectConfig.url.data, requestOptions)
  .then(function(response) {
    return response.json();
  })
  .catch(function(error) {
    console.log('Request Failed:' + error);
  });
};

const authenticateUser = (username, password, shouldSignUp) => {
  var path = shouldSignUp ? '/signup' : '/login';
  var requestOptions = {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({
        provider: "username",
        data: {
          "username": username,
          "password": password
        }
      })
  };

  return fetch(projectConfig.url.auth + path, requestOptions)
  .then(function(response) {
    return response.json();
  })
  .catch(function(error) {
    console.log('Request Failed:' + error);
  });
}

const uploadFile = (file, authToken) => {
  const uuidv4 = require('uuid/v4');
  var fileId = uuidv4();
  const options = {
      method: 'POST',
      body: file,
      headers: {
        'Content-Type': file.type,
        'AUthorization': 'Bearer ' + authToken
      }
    };
  return fetch(projectConfig.url.filestore + "/" + fileId, options)
  .then(function(response) {
    return response.json();
  })
  .catch(function(error) {
    return Promise.reject('File upload failed: ' + error);
  })
}

export {
  getArticle,
  getArticleList,
  authenticateUser,
  uploadFile
}
