// eslint-disable-next-line import/no-extraneous-dependencies
const mockjs = require('mockjs');

const data = {
  'POST /user/login/password': mockjs.mock({
    "id": 1,
    "isLogin": true,
    "first": false,
    "username": "gdj"
  }),
}

module.exports = data;
