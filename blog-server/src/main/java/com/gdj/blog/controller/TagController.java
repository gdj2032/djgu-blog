package com.gdj.blog.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.gdj.blog.entity.PageInfo;
import com.gdj.blog.entity.Tag;
import com.gdj.blog.entity.WebResponse;
import com.gdj.blog.exception.BaseResult;
import com.gdj.blog.service.impl.TagServiceImpl;
import com.gdj.blog.utils.PageUtils;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Objects;

@RestController
@RequestMapping("tag")
@Slf4j
public class TagController {

    @Resource
    private TagServiceImpl tagService;

    @GetMapping("/list")
    public WebResponse<PageInfo<Tag>> list(
            @RequestParam(defaultValue = "10") Integer limit,
            @RequestParam(defaultValue = "0") Integer offset
    ) {
        int pageNumber = offset / limit + 1;
        Page<Tag> page = new Page<>(pageNumber, limit);
        IPage<Tag> pages = tagService.pages(page);
        return WebResponse.ok(PageUtils.page2PageInfo(pages));
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
        Tag tag2 = tagService.getById(id);
        if (!Objects.isNull(tag2)) {
            String time = String.valueOf(LocalDateTime.now().toInstant(ZoneOffset.of("+8")).toEpochMilli());
            tag.setId(id);
            tag.setUpdateTime(time);
            Boolean isEdit = tagService.updateById(tag);
            return WebResponse.ok(isEdit);
        }
        throw BaseResult.NOT_FOUND.message("标签不存在").exception();
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