package com.gdj.blog.mapper;

import com.gdj.blog.dao.ContainerBaseMapper;
import com.gdj.blog.entity.DocumentDO;
import com.gdj.blog.entity.DocumentVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface DocumentMapper extends ContainerBaseMapper<DocumentDO> {
    List<DocumentVO> pageData(
            Integer pageNumber,
            Integer pageSize,
            Long routeId,
            Long tagId,
            String nameLike
    );

    Long countData(Long routeId, Long tagId, String nameLike);

    DocumentVO findById(Long id);
}
