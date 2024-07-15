package com.gdj.blog.controller;

import com.gdj.blog.entity.DocumentDO;
import com.gdj.blog.entity.DocumentVO;
import com.gdj.blog.entity.PageInfo;
import com.gdj.blog.entity.WebResponse;
import com.gdj.blog.service.impl.DocumentServiceImpl;
import com.gdj.blog.utils.PageUtil;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

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
            @RequestParam(defaultValue = "", required = false) String nameLike,
            @RequestParam(defaultValue = "", required = false) Long routeId,
            @RequestParam(defaultValue = "", required = false) Long tagId
    ) {
        return WebResponse.ok(PageUtil.page2PageInfo(documentService.pageData(limit, offset, routeId, tagId, nameLike)));
    }

    @PostMapping("/create")
    public WebResponse<DocumentDO> create(@RequestBody @Valid DocumentDO documentDO) {
        return WebResponse.ok(documentService.insert(documentDO));
    }

    @GetMapping("/detail/{id}")
    public WebResponse<DocumentVO> detail(@PathVariable Long id) {
        return WebResponse.ok(documentService.detail(id));
    }

    @PutMapping("/edit/{id}")
    public WebResponse<DocumentVO> edit(@PathVariable Long id, @RequestBody @Valid DocumentDO documentDO) {
        documentDO.setId(id);
        return WebResponse.ok(documentService.edit(documentDO));
    }

    @PostMapping("/see/{id}")
    public WebResponse<Boolean> addSee(@PathVariable Long id) {
        return WebResponse.ok(documentService.addSee(id));
    }
}
