package com.gdj.blog.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.gdj.blog.entity.Tag;

import java.util.List;

public interface TagMapper extends BaseMapper<Tag> {

    List<Tag> pages(IPage<Tag> page);
}
