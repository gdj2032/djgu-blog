const path = require('path')
const fs = require('fs')
const os = require('os')
const HOME_PATH = os.homedir();

class BookUtil {

  documentPath = `${HOME_PATH}/Documents`
  folderName = 'gdjReadBook'
  folderPath = `${this.documentPath}/${this.folderName}`

  constructor() {
    this.init()
  }

  init = () => {
    const folders1 = fs.readdirSync(this.documentPath)
    console.log("🚀 ~ BookUtil ~ folders1:", folders1)
    const existFolder = folders1.includes(this.folderName);
    console.log("🚀 ~ BookUtil ~ existFolder:", existFolder)
    // if (!existFolder) {
    //   fs.mkdirSync(this.folderPath)
    // }
  }
}

const bu = new BookUtil()

// export default BookUtil;
