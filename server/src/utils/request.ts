import request from "request"

export const fetchRequest = (url: string) => {
  return new Promise((resolve) => {
    request(url, (err, res) => {
      console.log("🚀 ~ file: request.ts:6 ~ request ~ res:", res)
      resolve(res.body)
    })
  })
}