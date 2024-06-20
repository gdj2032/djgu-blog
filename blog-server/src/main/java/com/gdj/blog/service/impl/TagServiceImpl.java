package com.gdj.blog.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.gdj.blog.dao.ContainerServiceImpl;
import com.gdj.blog.entity.*;
import com.gdj.blog.exception.BaseResult;
import com.gdj.blog.mapper.RouteMapper;
import com.gdj.blog.mapper.TagMapper;
import com.gdj.blog.mapper.UserMapper;
import com.gdj.blog.service.ITagService;
import com.gdj.blog.utils.CurrentLoginInfo;
import com.gdj.blog.utils.SmartBeanUtil;
import com.github.yulichang.wrapper.MPJLambdaWrapper;
import jakarta.annotation.Resource;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Objects;

@Slf4j
@Service
@RequiredArgsConstructor
public class TagServiceImpl extends ContainerServiceImpl<TagMapper, TagDO> implements ITagService {

    @Resource
    private RouteMapper routeMapper;
    @Resource
    private UserMapper userMapper;

    @Override
    public TagDO getByName(String tagName) {
        return baseMapper.selectOne(new MPJLambdaWrapper<>(TagDO.class).eq(TagDO::getName, tagName));
    }

    @Override
    public TagDO insert(TagDO entity) {
        TagDO tagDO2 = getByName(entity.getName());
        if (Objects.nonNull(tagDO2)) throw BaseResult.REPEAT.message("名称已存在").exception();
        String time = String.valueOf(LocalDateTime.now().toInstant(ZoneOffset.of("+8")).toEpochMilli());
        entity.setCreateTime(time);
        entity.setUpdateTime(time);
        entity.setUserId(Objects.requireNonNull(CurrentLoginInfo.getUserInfo()).getId());
        baseMapper.insert(entity);
        return getByName(entity.getName());
    }

    @Override
    public IPage<TagVO> pageData(Integer limit, Integer offset) {
        int pageNumber = offset / limit;
        long total = baseMapper.selectCount(new MPJLambdaWrapper<>());
        List<TagDTO> tags = baseMapper.pageData(pageNumber, limit);
        log.info(String.valueOf(tags.size()));
        List<TagVO> tagVos = changeTags2TagVos(tags);
        IPage<TagVO> tagVoPages = new Page<>(pageNumber, limit);
        tagVoPages.setRecords(tagVos);
        tagVoPages.setTotal(total);
        return tagVoPages;
    }

    @Override
    public TagDO update(TagDO entity) {
        if (Objects.isNull(getById(entity.getId()))) throw BaseResult.NOT_FOUND.message("标签不存在").exception();
        long n1 = baseMapper.selectCount(new MPJLambdaWrapper<>(TagDO.class).eq(TagDO::getName, entity.getName()).ne(RouteDO::getId, entity.getId()));
        if (n1 >= 1) throw BaseResult.REPEAT.message("名称已存在").exception();
        boolean suc = updateById(entity);
        if (suc) {
            return entity;
        }
        throw BaseResult.SERVER_TOO_BUSY.message("标签更新失败").exception();
    }

    public List<TagVO> changeTags2TagVos(List<TagDTO> tags) {
        List<TagVO> tagVos = new ArrayList<>();
        tags.forEach(e -> {
            TagVO tagVo = changeTag2TagVo(e);
            tagVos.add(tagVo);
        });
        return tagVos;
    }

    public TagVO changeTag2TagVo(TagDTO e) {
        TagVO tagVo = new TagVO();
        SmartBeanUtil.copyProperties(e, tagVo);
        if (Objects.nonNull(e.getRouteId())) {
            tagVo.setRoute(new IdName(e.getRouteId(), e.getRouteName()));
        }
        if (Objects.nonNull(e.getUserId())) {
            tagVo.setUser(new IdName(e.getUserId(), e.getUserName()));
        }
        if (Objects.nonNull(e.getParentTagId())) {
            tagVo.setParentTag(new IdName(e.getParentTagId(), e.getParentTagName()));
        }
        return tagVo;
    }

    @Override
    public List<TagTier> tiers() {
        List<TagVO> tagVos = changeTags2TagVos(all());
        List<TagTier> tagTiers = new ArrayList<>();
        tagVos.forEach(e -> {
            TagTier tagTier = new TagTier();
            SmartBeanUtil.copyProperties(e, tagTier);
            tagTiers.add(tagTier);
        });
        return handleTagTiers(tagTiers);
    }

    @Override
    public List<TagDTO> all() {
        return baseMapper.pageData(null, null);
    }

    private List<TagTier> handleTagTiers(List<TagTier> tagTiers) {
        List<TagTier> tagTierList = new ArrayList<>();
        HashMap<Long, List<TagTier>> map = new HashMap<>();
        for (TagTier tagTier : tagTiers) {
            if (Objects.nonNull(tagTier.getParentTag())) {
                if (map.containsKey(tagTier.getParentTag().getId())) {
                    map.get(tagTier.getParentTag().getId()).add(tagTier);
                } else {
                    List<TagTier> list = new ArrayList<>();
                    list.add(tagTier);
                    map.put(tagTier.getParentTag().getId(), list);
                }
            } else {
                tagTierList.add(tagTier);
            }
        }
        log.info("map: " + map.size());
        return dfTagTiers(tagTierList, map);
    }

    private List<TagTier> dfTagTiers(List<TagTier> tagTiers, HashMap<Long, List<TagTier>> map) {
        if (tagTiers != null) {
            for (TagTier tagTier : tagTiers) {
                List<TagTier> children = map.get(tagTier.getId());
                tagTier.setChildren(dfTagTiers(children, map));
            }
            return tagTiers;
        }
        return new ArrayList<>();
    }
}
