const axios = require('axios');
const { sites, services } = require('../../data');

const googlekey = '6LeVYrUUAAAAAM7ZsAaZS5tpZOD6AwG8-1Nm6Iep';
const pageurl = 'https://sso.acesso.gov.br/login';

const getCaptchaRequestId = async apiKey => {
  const params = {
    method: 'userrecaptcha',
    key: apiKey,
    googlekey,
    pageurl,
    json: 1,
  };

  const response = await axios.post(`http://2captcha.com/in.php`, null, {
    params,
  });

  return response.data.request;
};

const login = async page => {
  // const requestId = await getCaptchaRequestId(services['2captcha'].apiKey);
  // console.log({ requestId });

  await page.waitForSelector('#accountId');
  await page.type('#accountId', sites['gov.br'].username);
  await page.click('.button-ok');

  await page.waitForSelector('#password');
  await page.type('#password', sites['gov.br'].password);
  await page.click('.button-ok', { delay: 5000 });
};

module.exports = {
  login,
};
