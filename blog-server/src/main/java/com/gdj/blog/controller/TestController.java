package com.gdj.blog.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.concurrent.TimeUnit;

@RestController
@Slf4j
public class TestController {

    @PostMapping("/itemData/getInitTable")
    public HashMap<?, ?> list() throws InterruptedException {
        TimeUnit.SECONDS.sleep(1);
        HashMap<String, Object> map1 = new HashMap<>();
        HashMap<String, Object> map2 = new HashMap<>();
        map2.put("tableList", new ArrayList<>());
        map1.put("result", map2);
        return map1;
    }
}
