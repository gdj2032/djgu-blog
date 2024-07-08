package com.gdj.blog.service.impl;

import com.gdj.blog.dao.ContainerServiceImpl;
import com.gdj.blog.entity.DocumentTagRelationDo;
import com.gdj.blog.mapper.DocumentTagRelationMapper;
import com.gdj.blog.service.IDocumentTagRelationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class DocumentTagRelationServiceImpl extends ContainerServiceImpl<DocumentTagRelationMapper, DocumentTagRelationDo> implements IDocumentTagRelationService {
}
