package com.gdj.blog.controller;

import com.gdj.blog.entity.PageInfo;
import com.gdj.blog.entity.Tag;
import com.gdj.blog.entity.TagVo;
import com.gdj.blog.entity.WebResponse;
import com.gdj.blog.exception.BaseResult;
import com.gdj.blog.service.impl.TagServiceImpl;
import com.gdj.blog.utils.PageUtils;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;

@RestController
@RequestMapping("tag")
@Slf4j
public class TagController {

    @Resource
    private TagServiceImpl tagService;

    @GetMapping("/list")
    public WebResponse<PageInfo<TagVo>> list(
            @RequestParam(defaultValue = "10") Integer limit,
            @RequestParam(defaultValue = "0") Integer offset
    ) {
        return WebResponse.ok(PageUtils.page2PageInfo(tagService.pageData(limit, offset)));
    }

    @GetMapping("/list/tier")
    public WebResponse<?> listTier() {
        return WebResponse.ok(tagService.tiers());
    }

    @PostMapping("/create")
    public WebResponse<?> create(@RequestBody @Valid Tag tag) {
        return WebResponse.ok(tagService.insert(tag));
    }

    @PutMapping("/edit/{id}")
    public WebResponse<?> edit(@PathVariable long id, @RequestBody @Valid Tag tag) {
        tag.setId(id);
        return WebResponse.ok(tagService.update(tag));
    }

    @DeleteMapping("/delete/{id}")
    public WebResponse<?> delete(@PathVariable long id) {
        Tag tag = tagService.getById(id);
        if (!Objects.isNull(tag)) {
            Boolean isCreate = tagService.removeById(id);
            return WebResponse.ok(isCreate);
        }
        throw BaseResult.NOT_FOUND.message("标签不存在").exception();
    }
}