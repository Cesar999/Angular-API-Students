"use strict";
//--LOCALHOST

// exports.url_be_noty = 'http://localhost:3001';
// exports.url_be_auth = 'http://localhost:3000';

// exports.url_mongo_notify = 'mongodb://localhost';
// exports.url_mongo_auth = 'mongodb://localhost';

// exports.url_fe_noty = 'http://localhost:3001';
// exports.url_fe_auth = 'http://localhost:3000';

//----------------------------------------------

//--DOCKER COMPOSE
// exports.url_be_noty = 'http://notify:3001';
// exports.url_be_auth = 'http://auth:3000';

// exports.url_mongo_notify = 'mongodb://database-notify';
// exports.url_mongo_auth = 'mongodb://database-auth';

// exports.url_fe_noty = '/notify';
// exports.url_fe_auth = '/auth';

//----------------------------------------------


//--KUBERNETES
//name of the services
exports.url_be_noty = 'http://notify-service:3001';
exports.url_be_auth = 'http://auth-service:3000';

exports.url_mongo_notify = 'mongodb://localhost';
exports.url_mongo_auth = 'mongodb://localhost';

//Proxy
exports.url_fe_noty = '/notify';
exports.url_fe_auth = '/auth';

//----------------------------------------------