package com.gdj.blog.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.gdj.blog.dao.ContainerServiceImpl;
import com.gdj.blog.entity.DocumentDO;
import com.gdj.blog.entity.DocumentTagRelationDo;
import com.gdj.blog.entity.DocumentVO;
import com.gdj.blog.entity.FileDO;
import com.gdj.blog.exception.BaseResult;
import com.gdj.blog.mapper.DocumentMapper;
import com.gdj.blog.service.IDocumentService;
import com.github.yulichang.wrapper.MPJLambdaWrapper;
import jakarta.annotation.Resource;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

@Slf4j
@Service
@RequiredArgsConstructor
public class DocumentServiceImpl extends ContainerServiceImpl<DocumentMapper, DocumentDO> implements IDocumentService {

    @Resource
    private DocumentTagRelationServiceImpl documentTagRelationService;

    @Resource
    private FileServiceImpl fileService;

    public DocumentDO getByName(String name) {
        return baseMapper.selectOne(new MPJLambdaWrapper<>(DocumentDO.class).eq(DocumentDO::getName, name));
    }

    public IPage<DocumentVO> pageData(Integer limit, Integer offset, Long routeId, Long tagId, String nameLike) {
        IPage<DocumentVO> pageVOIPage = new Page<>(offset, limit);
        List<DocumentVO> documentVOS = baseMapper.pageData(offset, limit, routeId, tagId, nameLike);
        Long count = baseMapper.countData(routeId, tagId, nameLike);
        pageVOIPage.setTotal(count);
        pageVOIPage.setRecords(documentVOS);
        return pageVOIPage;
    }

    @Transactional(rollbackFor = Exception.class)
    @Override
    public DocumentDO insert(DocumentDO entity) {
        if (Objects.nonNull(getByName(entity.getName()))) throw BaseResult.REPEAT.message("名称已存在").exception();
        entity.setSee(0L);
        Timestamp time = new Timestamp(System.currentTimeMillis());
        entity.setCreateTime(time);
        entity.setUpdateTime(time);
        baseMapper.insert(entity);
        DocumentDO documentDO = getByName(entity.getName());
        Long documentDOId = documentDO.getId();
        // 关联文档标签
        String[] tagIds = documentDO.getTagIds().split(",");
        Arrays.stream(tagIds).forEach(e -> documentTagRelationService.insert(new DocumentTagRelationDo(null, Long.valueOf(e), documentDOId, time, time)));
        // 文件生效
        FileDO fileDO = fileService.getById(entity.getFileId());
        fileDO.setUsed(1);
        fileService.updateById(fileDO);
        return documentDO;
    }

    @Override
    public DocumentVO detail(Long id) {
        if (Objects.isNull(id)) throw BaseResult.NOT_FOUND.exception();
        return baseMapper.findById(id);
    }

    @Override
    public Boolean addSee(Long id) {
        DocumentDO documentDO = getById(id);
        documentDO.setSee(documentDO.getSee() + 1);
        updateById(documentDO);
        return true;
    }

    @Transactional(rollbackFor = Exception.class)
    @Override
    public DocumentVO edit(DocumentDO documentDO) {
        DocumentDO old = getById(documentDO.getId());
        String oldFileId = old.getFileId();
        old.setName(documentDO.getName());
        old.setFileId(documentDO.getFileId());
        old.setRouteId(documentDO.getRouteId());
        old.setTagIds(documentDO.getTagIds());
        old.setDescription(documentDO.getDescription());
        Timestamp time = new Timestamp(System.currentTimeMillis());
        old.setUpdateTime(time);
        baseMapper.updateById(old);
        // 重置文档标签表的绑定
        documentTagRelationService.deleteByDocumentId(documentDO.getId());
        String[] newTagIds = documentDO.getTagIds().split(",");
        List<DocumentTagRelationDo> documentTagRelationDos = Arrays.stream(newTagIds).map(e -> new DocumentTagRelationDo(null, Long.valueOf(e), old.getId(), time, time)).toList();
        documentTagRelationService.insertBatch(documentTagRelationDos);
        // 更新文件 删除旧文件和sql
        fileService.changeFile(oldFileId, documentDO.getFileId());
        return baseMapper.findById(documentDO.getId());
    }

}
