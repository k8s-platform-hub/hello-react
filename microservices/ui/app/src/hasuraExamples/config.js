var clusterName = "anonymity22"//window.location.href.split(".")[1];

var projectConfig = {
  url: {
    uiKit: "https://auth." + clusterName + ".hasura-app.io/ui/login/username?redirect_url=https://ui." +  clusterName + ".hasura-app.io/user-info",
    data: "https://data." + clusterName + ".hasura-app.io/v1/query",
    auth: "https://auth." + clusterName + ".hasura-app.io/v1",
    filestore: "https://filestore." + clusterName + ".hasura-app.io/v1/file"
  }
}

const saveOffline = (authToken) => {
  window.localStorage.setItem('authToken', authToken);
}

const getSavedToken = () => {
  return window.localStorage.getItem('authToken');
}

module.exports = {
  projectConfig,
  saveOffline,
  getSavedToken
};
