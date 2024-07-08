package com.gdj.blog.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.gdj.blog.dao.IContainerBaseService;
import com.gdj.blog.entity.DocumentDO;
import com.gdj.blog.entity.DocumentVO;

public interface IDocumentService extends IContainerBaseService<DocumentDO> {

    IPage<DocumentVO> pageData(Integer limit, Integer offset, Long routeId, Long tagId, String name);

    DocumentDO insert(DocumentDO documentDO);
}
