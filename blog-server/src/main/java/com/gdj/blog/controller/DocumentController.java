package com.gdj.blog.controller;

import com.gdj.blog.entity.DocumentVO;
import com.gdj.blog.entity.PageInfo;
import com.gdj.blog.entity.WebResponse;
import com.gdj.blog.service.impl.DocumentServiceImpl;
import com.gdj.blog.utils.PageUtils;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("document")
@Slf4j
public class DocumentController {
    @Resource
    private DocumentServiceImpl documentService;

    @GetMapping("/list")
    public WebResponse<PageInfo<DocumentVO>> list(
            @RequestParam(defaultValue = "10") Integer limit,
            @RequestParam(defaultValue = "0") Integer offset,
            @RequestParam(defaultValue = "", required = false) String name,
            @RequestParam(defaultValue = "", required = false) String routeId,
            @RequestParam(defaultValue = "", required = false) String tagId
    ) {
        return WebResponse.ok(PageUtils.page2PageInfo(documentService.pageData(limit, offset, name, routeId, tagId)));
    }
}
