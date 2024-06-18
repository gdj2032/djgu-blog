package com.gdj.blog.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.gdj.blog.entity.Tag;

public interface ITagService extends IService<Tag> {

    IPage<Tag> pages(IPage<Tag> page);

    Tag selectByName(String tagName);

    Tag insert(Tag tag);
}
