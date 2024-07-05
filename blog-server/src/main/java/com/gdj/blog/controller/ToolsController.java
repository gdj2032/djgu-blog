package com.gdj.blog.controller;

import com.gdj.blog.enums.Data2interfaceEnum;
import com.gdj.blog.utils.ToolUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("tools")
@Slf4j
public class ToolsController {

    @PostMapping("/data2interface")
    public Object data2Interface(
            @RequestBody Data2interfaceEnum type,
            @RequestBody Object data
    ) throws Exception {
        log.info(data.toString());
        return ToolUtils.data2Interface(type, data);
    }
}
