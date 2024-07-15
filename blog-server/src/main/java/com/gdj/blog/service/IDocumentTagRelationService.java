package com.gdj.blog.service;

import com.gdj.blog.dao.IContainerBaseService;
import com.gdj.blog.entity.DocumentTagRelationDo;

import java.util.List;

public interface IDocumentTagRelationService extends IContainerBaseService<DocumentTagRelationDo> {

    void insert(DocumentTagRelationDo documentTagRelationDo);

    void insertBatch(List<DocumentTagRelationDo> documentTagRelationDos);

    void deleteByDocumentId(Long documentId);
}
