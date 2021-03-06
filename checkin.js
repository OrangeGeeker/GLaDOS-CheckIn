const axios = require("axios");

const BOT_TOKEN = process.env.BOT_TOKEN;
const BOT_CHAT_ID = process.env.BOT_CHAT_ID;
const COOKIE_LIST = process.env.COOKIE_LIST;
const SERVER_CHAN = process.env.SERVER_CHAN;

const checkIn = async () => {
  return axios({
    method: "post",
    url: "https://glados.rocks/api/user/checkin",
    data: {
      token: "glados.network",
    },
    headers: {
      Authority: "glados.rocks",
      
      Authorization:"2955106794105734180656862944519-1040-1560",
    }
  });
};

const status = async () => {
  return axios({
    method: "get",
    url: "https://glados.rocks/api/user/status",
  });
};

const tgBotNotify = (checkInMessage, leftDays, email) => {
  return axios({
    method: "post",
    url: `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
    params: {
      chat_id: BOT_CHAT_ID,
      text: `GLADOS 签到：${email}
${leftDays}天后到期，${checkInMessage}`,
    },
  });
};

const serverchan = (checkInMessage, leftDays, email) => {
  return axios({
    method: "post",
    url: `https://sctapi.ftqq.com/${SERVER_CHAN}.send`,
    params: {
      title: `GLADOS 签到`,
      desp: `${email}
${leftDays}天后到期
${checkInMessage}`,
    },
  });
};

const GLaDOSCheckIn = async () => {
  const cookieList = JSON.parse(COOKIE_LIST);
  for (let i = 0, size = cookieList.length; i < size; i++) {
    accountCookie = cookieList[i];
    axios.defaults.headers.common.cookie = accountCookie;
    console.log("1111111111111111");
    const checkInResp = await checkIn();
    console.log("2222222222222222");
    const checkInMessage = checkInResp?.data?.message;
    const statusResp = await status();
    console.log("3333333333333333");
    const leftDays = parseInt(statusResp?.data?.data?.leftDays);
    console.log("4444444444444");
    const email = statusResp?.data?.data?.email;
    
    axios.defaults.headers.common.cookie = "";

    if (SERVER_CHAN) {
      serverchan(checkInMessage, leftDays, email);
      console.log("55555555555555555");
    } else if (BOT_TOKEN) {
      tgBotNotify(checkInMessage, leftDays, email);
    }
  } 
};

GLaDOSCheckIn().catch(error => console.log(error.message));

// const test = async () => {
  // serverchan("Please Try Tomorrow", "1000", "orange@lisa2leo.com");
// };
// test();
