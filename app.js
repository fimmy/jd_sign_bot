// version v0.0.2
// create by ruicky
// detail url: https://github.com/ruicky/jd_sign_bot

const exec = require("child_process").execSync;
const fs = require("fs");
const rp = require("request-promise");
const download = require("download");

// 公共变量
const KEY = process.env.KKMH_COOKIE;
const serverJ = process.env.PUSH_KEY;

async function downFile() {
  // const url = 'https://cdn.jsdelivr.net/gh/NobyDa/Script@master/JD-DailyBonus/JD_DailyBonus.js'
  const url =
    "https://raw.githubusercontent.com/NobyDa/Script/master/KuaiKan-DailyBonus/KKMH.js";
  await download(url, "./");
}

async function changeFile() {
  let content = await fs.readFileSync("./KKMH.js", "utf8");
  content = content.replace(/var cookie = ''/, `var cookie = '${KEY}'`);
  await fs.writeFileSync("./KKMH.js", content, "utf8");
}

async function sendNotify(text, desp) {
  const options = {
    uri: `https://sc.ftqq.com/${serverJ}.send`,
    form: { text, desp },
    json: true,
    method: "POST",
  };
  await rp
    .post(options)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
}

async function start() {
  if (!KEY) {
    console.log("请填写 key 后在继续");
    return;
  }
  // 下载最新代码
  await downFile();
  console.log("下载代码完毕");
  // 替换变量
  await changeFile();
  console.log("替换变量完毕");
  // 执行
  await exec("node KKMH.js >> result.txt");
  console.log("执行完毕");

  if (serverJ) {
    const path = "./result.txt";
    let content = "";
    if (fs.existsSync(path)) {
      content = fs.readFileSync(path, "utf8");
    }
    await sendNotify(
      "快看漫画签到-" + new Date().toLocaleDateString(),
      content
    );
    console.log(content);
    console.log("发送结果完毕");
  }
}

start();
