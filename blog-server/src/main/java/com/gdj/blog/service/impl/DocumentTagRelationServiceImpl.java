package com.gdj.blog.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.gdj.blog.dao.ContainerServiceImpl;
import com.gdj.blog.entity.DocumentTagRelationDo;
import com.gdj.blog.mapper.DocumentTagRelationMapper;
import com.gdj.blog.service.IDocumentTagRelationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class DocumentTagRelationServiceImpl extends ContainerServiceImpl<DocumentTagRelationMapper, DocumentTagRelationDo> implements IDocumentTagRelationService {

    public void insert(DocumentTagRelationDo documentTagRelationDo) {
        baseMapper.insert(documentTagRelationDo);
    }

    @Override
    public void insertBatch(List<DocumentTagRelationDo> documentTagRelationDos) {
        documentTagRelationDos.forEach(this::insert);
    }

    @Override
    public void deleteByDocumentId(Long documentId) {
        baseMapper.delete(new QueryWrapper<DocumentTagRelationDo>().eq("document_id", documentId));
    }

}
