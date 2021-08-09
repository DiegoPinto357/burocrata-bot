const axios = require('axios');
const poll = require('promise-poller').default;
const { sites, services } = require('../../data');

const googlekey = '6LeVYrUUAAAAAM7ZsAaZS5tpZOD6AwG8-1Nm6Iep';
const pageurl = 'https://sso.acesso.gov.br/login';

const timeout = millis => new Promise(resolve => setTimeout(resolve, millis));

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

const requestCaptchaResult = (apiKey, requestId) => {
  return async function () {
    return new Promise(async function (resolve, reject) {
      const params = {
        key: apiKey,
        action: 'get',
        id: requestId,
        json: 1,
      };

      const response = await axios.get('http://2captcha.com/res.php', {
        params,
      });

      if (response.data.status === 0) {
        const { request } = response.data;
        console.log(request);
        return reject(request);
      }
      resolve(response.data.request);
    });
  };
};

const pollForCaptchaResult = async (
  key,
  id,
  retries = 30,
  interval = 1500,
  delay = 15000
) => {
  await timeout(delay);
  return poll({
    taskFn: requestCaptchaResult(key, id),
    interval,
    retries,
  });
};

const login = async page => {
  const { apiKey } = services['2captcha'];

  const requestId = await getCaptchaRequestId(apiKey);
  console.log({ requestId });

  await page.waitForSelector('#accountId');
  await page.type('#accountId', sites['gov.br'].username);
  await page.click('.button-ok');

  await page.waitForSelector('#password');
  await page.type('#password', sites['gov.br'].password);

  const captchaResponse = await pollForCaptchaResult(apiKey, requestId);
  console.log({ captchaResponse });

  await page.evaluate(
    `document.querySelector('[title="desafio reCAPTCHA"]').contentWindow.document.getElementById("recaptcha-token").innerHTML="${captchaResponse}";`
  );

  await page.click('.button-ok');
};

module.exports = {
  login,
};
