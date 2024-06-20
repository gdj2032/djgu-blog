package com.gdj.blog.mapper;

import com.gdj.blog.dao.ContainerBaseMapper;
import com.gdj.blog.entity.Tag;
import com.gdj.blog.entity.TagDo;

import java.util.List;

public interface TagMapper extends ContainerBaseMapper<Tag> {

    List<TagDo> pageData(Integer pageNumber, Integer pageSize);
}
