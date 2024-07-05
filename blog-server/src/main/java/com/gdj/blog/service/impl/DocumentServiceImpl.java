package com.gdj.blog.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.gdj.blog.dao.ContainerServiceImpl;
import com.gdj.blog.entity.DocumentDO;
import com.gdj.blog.entity.DocumentVO;
import com.gdj.blog.entity.IdName;
import com.gdj.blog.entity.TagDO;
import com.gdj.blog.exception.BaseResult;
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

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

@Slf4j
@Service
@RequiredArgsConstructor
public class DocumentServiceImpl extends ContainerServiceImpl<DocumentMapper, DocumentDO> implements IDocumentService {

    @Resource
    private RouteMapper routeMapper;

    @Resource
    private TagMapper tagMapper;

    public DocumentDO getByName(String name) {
        return baseMapper.selectOne(new MPJLambdaWrapper<>(DocumentDO.class).eq(DocumentDO::getName, name));
    }

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

    @Override
    public DocumentVO insert(DocumentDO entity) {
        if (Objects.nonNull(getByName(entity.getName()))) throw BaseResult.REPEAT.message("名称已存在").exception();
        entity.setSee((long) 0);
        String time = String.valueOf(LocalDateTime.now().toInstant(ZoneOffset.of("+8")).toEpochMilli());
        entity.setCreateTime(time);
        entity.setUpdateTime(time);
        baseMapper.insert(entity);
        return documentDO2Vo(getByName(entity.getName()));
    }

    private List<DocumentVO> documentDOs2VOs(List<DocumentDO> documents) {
        List<DocumentVO> documentVOs = new ArrayList<>();
        for (DocumentDO documentDO : documents) {
            documentVOs.add(documentDO2Vo(documentDO));
        }
        return documentVOs;
    }

    private DocumentVO documentDO2Vo(DocumentDO documentDO) {
        if (Objects.isNull(documentDO)) return null;
        DocumentVO documentVO = new DocumentVO();
        SmartBeanUtil.copyProperties(documentDO, documentVO);
        documentVO.setRoute(routeMapper.selectById(documentDO.getRouteId()));
        String[] tagIds = documentDO.getTagIds().split(",");
        List<IdName> tags = new ArrayList<>();
        Arrays.stream(tagIds).toList().forEach(e -> {
            TagDO tagDO = tagMapper.selectById(e);
            if (Objects.nonNull(tagDO)) {
                IdName tagVO = new IdName();
                tags.add(new IdName(tagVO.getId(), tagVO.getName()));
            }
        });
        documentVO.setTags(tags);
        return documentVO;
    }
}
