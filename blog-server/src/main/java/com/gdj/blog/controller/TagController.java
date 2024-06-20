package com.gdj.blog.controller;

import com.gdj.blog.entity.PageInfo;
import com.gdj.blog.entity.TagDO;
import com.gdj.blog.entity.TagVO;
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
    public WebResponse<PageInfo<TagVO>> list(
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
    public WebResponse<?> create(@RequestBody @Valid TagDO tagDo) {
        return WebResponse.ok(tagService.insert(tagDo));
    }

    @PutMapping("/edit/{id}")
    public WebResponse<?> edit(@PathVariable long id, @RequestBody @Valid TagDO tagDo) {
        tagDo.setId(id);
        return WebResponse.ok(tagService.update(tagDo));
    }

    @DeleteMapping("/delete/{id}")
    public WebResponse<?> delete(@PathVariable long id) {
        TagDO tagDo = tagService.getById(id);
        if (!Objects.isNull(tagDo)) {
            Boolean isCreate = tagService.removeById(id);
            return WebResponse.ok(isCreate);
        }
        throw BaseResult.NOT_FOUND.message("标签不存在").exception();
    }
}