package com.gdj.blog.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.gdj.blog.entity.Result;
import com.gdj.blog.entity.Tag;
import com.gdj.blog.service.impl.TagServiceImpl;
import com.gdj.blog.utils.PageUtils;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("tag")
@Slf4j
public class TagController {

    @Resource
    private TagServiceImpl tagService;

    @GetMapping("/list")
    public Result list(
            @RequestParam(defaultValue = "10") Integer limit,
            @RequestParam(defaultValue = "0") Integer offset
    ) {
        Page<Tag> page = new Page<>(offset + 1, limit);
        IPage<Tag> pages = tagService.pages(page);
        return Result.success(PageUtils.page2PageInfo(pages));
    }

    @PostMapping("/create")
    public Result create(@RequestBody @Valid Tag Tag) {
        Boolean isCreate = tagService.save(Tag);
        return Result.success(isCreate);
    }

    @PutMapping("/edit/{id}")
    public Result edit(@PathVariable String id, @RequestBody @Valid Tag Tag) {
        Tag.setId(id);
        Boolean isEdit = tagService.updateById(Tag);
        return Result.success(isEdit);
    }

    @DeleteMapping("/delete/{id}")
    public Result delete(@PathVariable String id) {
        Boolean isCreate = tagService.removeById(id);
        return Result.success(isCreate);
    }
}