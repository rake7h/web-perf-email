require('dotenv').config()

const express = require('express')
const lighthouseRun = require('./lighthouse.js');
const {getTemplate} = require('./template/js-assets');
const {sendMail} = require('./sendgrid.js');
const cron = require('node-cron');
const herokuSelfPing = require('./helpers/heroku')
const app = express()

herokuSelfPing();

async function getLighthouseData() {
  const report = await lighthouseRun(process.env.SITE_URL)
  return report;
}

async function getResoureceFromLighthouseData(data) {
  const report = await getLighthouseData();
  const allNetworkResource = report.audits['network-requests'];
  const allThirdPartyResource = report.audits['third-party-summary'];

  // allNetworkResource.details.items.forEach((item)=>{
  //   console.log('allNetworkResource',item.url);
  // })

  allThirdPartyResource.details.items.forEach((item)=>{
    console.log('allThirdPartyResource',item.entity.url);
  })

  const headData = {
    reqUrl: report.finalUrl,
    Performance: Math.round(report.categories.performance.score * 100),
    fcp: report.audits['first-contentful-paint'].displayValue,
    lcp: report.audits['largest-contentful-paint'].displayValue,
    cls: report.audits['cumulative-layout-shift'].displayValue,
  }

  sendMailToSubscriber({
    email: process.env.EMAIL_TO,
    allNetworkResource,
    headData
  })
}

async function sendMailToSubscriber({allNetworkResource, headData, email}) {
  const html = getTemplate({allNetworkResource, headData});
  sendMail(html, email);
}

getResoureceFromLighthouseData();

cron.schedule('30 10 * * *', () => {
  console.log('run at 10:30 AM every day');
  getResoureceFromLighthouseData();
}, {
  scheduled: true,
  timezone: "Asia/Kolkata"
});

app.get('/', (req, res) => {
  res.send('Howdy!')
})

app.get('/ping', (req, res) => {
  res.send('pong')
})

let serverPort = process.env.PORT || 3000;
let serverHost =  '0.0.0.0';

app.listen(serverPort, serverHost, () => {
  console.log(`Server listening at http://${serverHost}:${serverPort}`)
})
