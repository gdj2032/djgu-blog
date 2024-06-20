package com.gdj.blog.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.gdj.blog.dao.ContainerServiceImpl;
import com.gdj.blog.entity.IdName;
import com.gdj.blog.entity.Tag;
import com.gdj.blog.entity.TagTier;
import com.gdj.blog.entity.TagVo;
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
public class TagServiceImpl extends ContainerServiceImpl<TagMapper, Tag> implements ITagService {

    @Resource
    private RouteMapper routeMapper;
    @Resource
    private UserMapper userMapper;

    @Override
    public Tag selectByName(String tagName) {
        return baseMapper.selectOne(new MPJLambdaWrapper<>(Tag.class).eq(Tag::getName, tagName));
    }

    @Override
    public Tag insert(Tag entity) {
        Tag tag2 = selectByName(entity.getName());
        if (Objects.isNull(tag2)) {
            throw BaseResult.REPEAT.message("名称已存在").exception();
        }
        String time = String.valueOf(LocalDateTime.now().toInstant(ZoneOffset.of("+8")).toEpochMilli());
        entity.setCreateTime(time);
        entity.setUpdateTime(time);
        entity.setUserId(Objects.requireNonNull(CurrentLoginInfo.getUserInfo()).getId());
        baseMapper.insert(entity);
        return selectByName(entity.getName());
    }

    @Override
    public IPage<TagVo> pageData(Integer limit, Integer offset) {
        int pageNumber = offset / limit + 1;
        IPage<Tag> pages = baseMapper.selectJoinPage(new Page<>(pageNumber, limit), Tag.class,
                new MPJLambdaWrapper<Tag>()
                        .selectAll(Tag.class)
        );
        IPage<TagVo> pages2 = new Page<>(pageNumber, limit);
        SmartBeanUtil.copyProperties(pages, pages2);
        pages2.setRecords(changeTags2TagVos(pages.getRecords()));
        return pages2;
    }

    public List<TagVo> changeTags2TagVos(List<Tag> tags) {
        List<TagVo> tagVos = new ArrayList<>();
        tags.forEach(e -> {
            TagVo tagVo = changeTag2TagVo(e);
            tagVos.add(tagVo);
        });
        return tagVos;
    }

    public TagVo changeTag2TagVo(Tag e) {
        TagVo tagVo = new TagVo();
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
        List<TagVo> tagVos = changeTags2TagVos(all());
        List<TagTier> tagTiers = new ArrayList<>();
        tagVos.forEach(e -> {
            TagTier tagTier = new TagTier();
            SmartBeanUtil.copyProperties(e, tagTier);
            tagTiers.add(tagTier);
        });
        return handleTagTiers(tagTiers);
    }

    @Override
    public List<Tag> all() {
        return baseMapper.all();
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
