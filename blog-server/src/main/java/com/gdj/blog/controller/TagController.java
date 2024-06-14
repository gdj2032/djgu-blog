package com.gdj.blog.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.gdj.blog.entity.Result;
import com.gdj.blog.entity.Tag;
import com.gdj.blog.service.impl.TagServiceImpl;
import com.gdj.blog.utils.CurrentLoginInfo;
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
    public Result list(
            @RequestParam(defaultValue = "10") Integer limit,
            @RequestParam(defaultValue = "0") Integer offset
    ) {
        Page<Tag> page = new Page<>(offset + 1, limit);
        IPage<Tag> pages = tagService.pages(page);
        return Result.success(PageUtils.page2PageInfo(pages));
    }

    @PostMapping("/create")
    public Result create(@RequestBody @Valid Tag tag) {
        String time = String.valueOf(LocalDateTime.now().toInstant(ZoneOffset.of("+8")).toEpochMilli());
        tag.setCreateTime(time);
        tag.setUpdateTime(time);
        tag.setUserId(Objects.requireNonNull(CurrentLoginInfo.getUserInfo()).getId());
        Boolean isCreate = tagService.save(tag);
        return Result.success(isCreate);
    }

    @PutMapping("/edit/{id}")
    public Result edit(@PathVariable String id, @RequestBody @Valid Tag tag) {
        Tag tag2 = tagService.getById(id);
        if (!Objects.isNull(tag2)) {
            String time = String.valueOf(LocalDateTime.now().toInstant(ZoneOffset.of("+8")).toEpochMilli());
            tag.setId(id);
            tag.setUpdateTime(time);
            Boolean isEdit = tagService.updateById(tag);
            return Result.success(isEdit);
        }
        return Result.error400("标签不存在");
    }

    @DeleteMapping("/delete/{id}")
    public Result delete(@PathVariable String id) {
        Tag tag = tagService.getById(id);
        if (!Objects.isNull(tag)) {
            Boolean isCreate = tagService.removeById(id);
            return Result.success(isCreate);
        }
        return Result.error400("标签不存在");
    }
}