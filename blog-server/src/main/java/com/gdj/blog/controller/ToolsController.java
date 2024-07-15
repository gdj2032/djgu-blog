package com.gdj.blog.controller;

import com.alibaba.fastjson.JSON;
import com.gdj.blog.entity.ToolsData2interfaceVO;
import com.gdj.blog.entity.WebResponse;
import com.gdj.blog.enums.Data2interfaceEnum;
import com.gdj.blog.utils.ToolUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("tools")
@Slf4j
public class ToolsController {

    @PostMapping("/data2Interface")
    public Object data2Interface(
            @RequestBody ToolsData2interfaceVO vo
    ) throws Exception {
        log.info(vo.toString());
        return WebResponse.ok(ToolUtil.data2Interface(Data2interfaceEnum.valueOf(vo.getType()), JSON.parseObject(vo.getData())));
    }
}
