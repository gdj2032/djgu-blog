package com.gdj.blog.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.gdj.blog.dao.ContainerServiceImpl;
import com.gdj.blog.entity.DocumentDO;
import com.gdj.blog.entity.DocumentVO;
import com.gdj.blog.entity.IdName;
import com.gdj.blog.entity.TagDO;
import com.gdj.blog.mapper.DocumentMapper;
import com.gdj.blog.mapper.RouteMapper;
import com.gdj.blog.mapper.TagMapper;
import com.gdj.blog.service.IDocumentService;
import com.gdj.blog.utils.SmartBeanUtil;
import com.github.yulichang.wrapper.MPJLambdaWrapper;
import jakarta.annotation.Resource;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class DocumentServiceImpl extends ContainerServiceImpl<DocumentMapper, DocumentDO> implements IDocumentService {

    @Resource
    private RouteMapper routeMapper;

    @Resource
    private TagMapper tagMapper;

    public IPage<DocumentVO> pageData(Integer limit, Integer offset, String name, String routeId, String tagId) {
        int pageNumber = offset / limit + 1;
        IPage<DocumentDO> pages = baseMapper.selectJoinPage(
                new Page<>(pageNumber, limit),
                DocumentDO.class,
                new MPJLambdaWrapper<>(DocumentDO.class)
                        .selectAll(DocumentDO.class)
                        .likeIfExists(DocumentDO::getName, name)
                        .eqIfExists(DocumentDO::getRouteId, routeId)
                        .likeIfExists(DocumentDO::getTagIds, tagId)
        );
        IPage<DocumentVO> pageVOIPage = new Page<>(pageNumber, limit);
        SmartBeanUtil.copyProperties(pages, pageVOIPage);
        pageVOIPage.setRecords(documentDOs2VOs(pages.getRecords()));
        return pageVOIPage;
    }

    private List<DocumentVO> documentDOs2VOs(List<DocumentDO> documents) {
        List<DocumentVO> documentVOs = new ArrayList<>();
        for (DocumentDO documentDO : documents) {
            documentVOs.add(documentDO2Vo(documentDO));
        }
        return documentVOs;
    }

    private DocumentVO documentDO2Vo(DocumentDO documentDO) {
        DocumentVO documentVO = new DocumentVO();
        SmartBeanUtil.copyProperties(documentDO, documentVO);
        documentVO.setRoute(routeMapper.selectById(documentDO.getRouteId()));
        String[] tagIds = documentDO.getTagIds().split(",");
        List<IdName> tags = new ArrayList<>();
        Arrays.stream(tagIds).toList().forEach(e -> {
            TagDO tagDO = tagMapper.selectById(e);
            IdName tagVO = new IdName();
            tagVO.setId(tagDO.getId());
            tagVO.setName(tagDO.getName());
            tags.add(tagVO);
        });
        documentVO.setTags(tags);
        return documentVO;
    }
}
