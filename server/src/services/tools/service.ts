import { RESPONSE_TYPE } from "@/utils";
import data2Interface from "./data2Interface"

class ToolsService {
  data2Interface(...args) {
    const [req, res] = args;
    const { data } = req.body as any;
    console.log("🚀 ~ file: service.ts:8 ~ ToolsService ~ data2Interface ~ data:", data)
    const v = data2Interface(data)
    console.info('--- info --->', v);
    return RESPONSE_TYPE.commonSuccess({
      res,
      data: v
    })
  }
}

const toolsService = new ToolsService()

export default toolsService
