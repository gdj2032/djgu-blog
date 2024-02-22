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
    const existFolder = folders1.includes(this.folderName);
    if (!existFolder) {
      fs.mkdirSync(this.folderPath)
    }
  }

  setFile = (data: { filename: string, content: string }) => {
    const { filename, content } = data;
    if (filename && content) {
      const filepath = `${this.folderPath}/${filename}`
      fs.writeFileSync(filepath, content, 'utf8');
      return { filepath, error: '' };
    }
    return { filepath: '', error: '上传文件失败' };
  }

  getFile = (filename: string) => {
    if (filename) {
      const filepath = `${this.folderPath}/${filename}`
      const content = fs.readFileSync(filepath, 'utf8').toString()
      return { content, error: '' };
    }
    return { content: '', error: '获取文件失败' };
  }
}

export default BookUtil;
