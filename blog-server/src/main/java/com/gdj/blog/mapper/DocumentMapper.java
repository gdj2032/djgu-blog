package com.gdj.blog.mapper;

import com.gdj.blog.dao.ContainerBaseMapper;
import com.gdj.blog.entity.DocumentDO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface DocumentMapper extends ContainerBaseMapper<DocumentDO> {
//    List<DocumentVO> pageData(Integer pageNumber, Integer pageSize);
}
