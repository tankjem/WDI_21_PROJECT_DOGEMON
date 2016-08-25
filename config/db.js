dbURIs = {
  test: "mongodb://localhost/doge-api--test",
  development: "mongodb://localhost/doge-api",
  production: process.env.MONGODB_URI || "mongodb://localhost/doge-api"
}

module.exports = function(env) {
  return dbURIs[env];
}