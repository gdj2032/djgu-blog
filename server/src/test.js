const checkCommands = (commands) => {
  if (commands) {
    const singleQuote = commands.includes("'")
    if (singleQuote) {
      const reg = /'(.*?)'/g
      const arr = commands.match(reg)
      console.log("🚀 ~ file: CreateDistributedTrainingMirror.tsx:91 ~ checkCommands ~ arr:", arr)
      if (arr.length) {
        let commandArr = []
        let str = commands;
        for (const i of arr) {
          // const prevReg = new RegExp("^\(\S*)" + i + "$")
          // const nextReg = new RegExp("^" + i + "(\S*)$")
          const idx = str.indexOf(i)
          const prev = str.substring(0, idx)
          const next = str.substring(idx + i.length)
          str = next
          if (prev) {
            const cur = prev.split(' ').filter(e => !!e);
            commandArr = commandArr.concat(cur)
          }

          commandArr.push(i.replaceAll("'", ""))
        }

        if (str) {
          const strArr = str.split(' ').filter(e => !!e);
          commandArr = commandArr.concat(strArr)
        }

        console.info('--- commandArr --->', commandArr);

        return commandArr
      }
    }
    return commands.split(' ')
  }
  return []
}

checkCommands(`'aaa' s1 sh -c '/root/nexusnet/scripts/run_server.sh 2>&1 | tee /root/nexusnet/metric_log/stdout.log' sh1 -c1 'log1111' 222`)

// const mysql = require('mysql')

// const DATABASE_INFO = {
//   host: 'localhost',
//   user: 'root',
//   password: '12345678',
//   database: 'Blog',
//   port: 3306,
// };

// class DataBase {
//   pool = mysql.createPool(DATABASE_INFO);

//   static database = new DataBase()

//   // query('SELECT * FROM user LIMIT ?, ?', [_offset, _limit]);
//   // query('SELECT * FROM user WHERE id=?;', [id]);
//   // query('INSERT INTO user (id, username, password, role, session, createTime) VALUES(?,?,?,?,?,?);', [])
//   // query('UPDATE users SET ? WHERE UserID = ?', [{Name: name}, userId], );

//   static sql(sql, params) {
//     return new Promise((res) => {
//       this.database.pool.query(sql, params, (error, data, fields) => {
//         // console.info('--- DataBase.sql --->', error, data);
//         res({ data, fields, error })
//       })
//     })
//   }
// }

// async function test() {
//   const res = await DataBase.sql('SELECT * FROM document LIMIT ?, ?', [0, 10])
//   console.log("🚀 ~ file: test.js:26 ~ test ~ res:", res)
// }

// test()

// const arr = [
//   {
//     id: 'image-classification',
//     key: '图像分类',
//     value: `LeNet
//   AlexNet
//   VGG
//   GoogLeNet
//   ResNet-18
//   ResNet-34
//   ResNet-50
//   ResNet-101
//   ResNet-152
//   Wide ResNet
//   ResNeXt`
//   },
//   {
//     id: 'target-detection',
//     key: '目标检测',
//     value: `R-CNN
//     Fast R-CNN
//     Faster R-CNN
//     YOLOv1
//     YOLOv2 (YOLO9000)
//     YOLOv3
//     YOLOv4
//     SSD300
//     SSD512
//     EfficientDet
//     MobileNet SSD V3`
//   },
//   {
//     id: 'semantic-segmentation',
//     key: '语义分割',
//     value: `FCN
//     U-Net
//     DeepLabv1
//     DeepLabv2
//     DeepLabv3
//     DeepLabv3+`
//   },
//   {
//     id: 'image-production',
//     key: '图像生成',
//     value: `GAN
//     DCGAN
//     WGAN
//     VAE
//     StyleGAN
//     StyleGAN2`
//   },
//   {
//     id: 'natural-language-processing',
//     key: '自然语言处理',
//     value: `RNN（Recurrent Neural Network）：
//     LSTM（Long Short-Term Memory）：
//     GRU（Gated Recurrent Unit）：
//     Transformer：
//     BERT
//     GPT`
//   },
//   {
//     id: 'reinforcement-learning',
//     key: '强化学习',
//     value: `DQN
//     REINFORCE
//     PPO
//     Actor-Critic`
//   },
// ]

// function test() {
//   const data = []
//   for (const item of arr) {
//     const i = {
//       key: item.id,
//       value: item.key,
//       children: item.value.split('\n').map(e => ({ key: e, value: e }))
//     }
//     data.push(i)
//   }
//   console.info('--- info --->', JSON.stringify(data));
// }

// test()

const getGUID = () => {
  //64长度
  const len = 64;
  //16进制
  let radix = 16, i;
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  const uuid = [];
  radix = radix || chars.length;
  if (len) {
    for (i = 0; i < len; i++) {
      uuid[i] = chars[0 | Math.random() * radix];
    }
  } else {
    let r;
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16;
        uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
      }
    }
  }
  return uuid.join('');
}




const createGuid = () => {
  const guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxx'.replace(/[xy]/g, (c: string) => {
    // @ts-nocheck
    const r = Math.random() * 16 | 0;
    // @ts-nocheck
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  }).toUpperCase();
  // this.defaultGuid = guid;
  return guid;
}



