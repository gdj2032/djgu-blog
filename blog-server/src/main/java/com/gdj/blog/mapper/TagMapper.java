package com.gdj.blog.mapper;

import com.gdj.blog.dao.ContainerBaseMapper;
import com.gdj.blog.entity.Tag;

import java.util.List;

public interface TagMapper extends ContainerBaseMapper<Tag> {

    List<Tag> all();
}
