package com.gdj.blog.mapper;

import com.gdj.blog.dao.ContainerBaseMapper;
import com.gdj.blog.entity.TagDO;
import com.gdj.blog.entity.TagDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface TagMapper extends ContainerBaseMapper<TagDO> {

    List<TagDTO> pageData(Integer pageNumber, Integer pageSize);
}
