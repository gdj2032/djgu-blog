package com.gdj.blog.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.gdj.blog.entity.Tag;
import com.gdj.blog.mapper.TagMapper;
import com.gdj.blog.service.ITagService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class TagServiceImpl extends ServiceImpl<TagMapper, Tag> implements ITagService {
    @Override
    public IPage<Tag> pages(IPage<Tag> page) {
        return page.setRecords(baseMapper.pages(page));
    }
}
