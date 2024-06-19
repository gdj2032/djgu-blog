package com.gdj.blog.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.gdj.blog.dao.IContainerBaseService;
import com.gdj.blog.entity.Tag;
import com.gdj.blog.entity.TagTier;
import com.gdj.blog.entity.TagVo;

import java.util.List;

public interface ITagService extends IContainerBaseService<Tag> {

    Tag selectByName(String name);

    Tag insert(Tag tag);

    IPage<TagVo> pageData(Integer limit, Integer offset);

    List<TagTier> tiers();
}
