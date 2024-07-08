package com.gdj.blog.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.gdj.blog.dao.ContainerServiceImpl;
import com.gdj.blog.entity.DocumentDO;
import com.gdj.blog.entity.DocumentVO;
import com.gdj.blog.exception.BaseResult;
import com.gdj.blog.mapper.DocumentMapper;
import com.gdj.blog.service.IDocumentService;
import com.github.yulichang.wrapper.MPJLambdaWrapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Objects;

@Slf4j
@Service
@RequiredArgsConstructor
public class DocumentServiceImpl extends ContainerServiceImpl<DocumentMapper, DocumentDO> implements IDocumentService {

    public DocumentDO getByName(String name) {
        return baseMapper.selectOne(new MPJLambdaWrapper<>(DocumentDO.class).eq(DocumentDO::getName, name));
    }

    public IPage<DocumentVO> pageData(Integer limit, Integer offset, Long routeId, Long tagId, String nameLike) {
        int pageNumber = offset / limit + 1;
        IPage<DocumentVO> pageVOIPage = new Page<>(pageNumber, limit);
        List<DocumentVO> documentVOS = baseMapper.pageData(pageNumber, limit, routeId, tagId, nameLike);
        Long count = baseMapper.countData(routeId, tagId, nameLike);
        pageVOIPage.setTotal(count);
        pageVOIPage.setRecords(documentVOS);
        return pageVOIPage;
    }

    @Override
    public DocumentDO insert(DocumentDO entity) {
        if (Objects.nonNull(getByName(entity.getName()))) throw BaseResult.REPEAT.message("名称已存在").exception();
        entity.setSee((long) 0);
        String time = String.valueOf(LocalDateTime.now().toInstant(ZoneOffset.of("+8")).toEpochMilli());
        entity.setCreateTime(time);
        entity.setUpdateTime(time);
        baseMapper.insert(entity);
        return getByName(entity.getName());
    }

}
