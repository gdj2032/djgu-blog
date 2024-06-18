package com.gdj.blog.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.gdj.blog.entity.Tag;
import com.gdj.blog.entity.TagTier;
import com.gdj.blog.exception.BaseResult;
import com.gdj.blog.mapper.TagMapper;
import com.gdj.blog.service.ITagService;
import com.gdj.blog.utils.CurrentLoginInfo;
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
public class TagServiceImpl extends ServiceImpl<TagMapper, Tag> implements ITagService {
    @Override
    public IPage<Tag> pages(IPage<Tag> page) {
        return page.setRecords(baseMapper.pages(page));
    }

    public Tag selectByName(String tagName) {
        return baseMapper.selectByName(tagName);
    }

    public Tag insert(Tag entity) {
        Tag tag2 = selectByName(entity.getName());
        if (tag2 != null) {
            throw BaseResult.REPEAT.message("名称已存在").exception();
        }
        String time = String.valueOf(LocalDateTime.now().toInstant(ZoneOffset.of("+8")).toEpochMilli());
        entity.setCreateTime(time);
        entity.setUpdateTime(time);
        entity.setUserId(Objects.requireNonNull(CurrentLoginInfo.getUserInfo()).getId());
        baseMapper.insert(entity);
        return baseMapper.selectByName(entity.getName());
    }

    public List<TagTier> tiers() {
        List<Tag> tags = baseMapper.selectList(null);
        List<TagTier> tagTiers = tags.stream().map(e -> {
            TagTier tagTier = new TagTier();
            tagTier.setId(e.getId());
            tagTier.setName(e.getName());
            tagTier.setParentTagId(e.getParentTagId());
            tagTier.setDescription(e.getDescription());
            tagTier.setCreateTime(e.getCreateTime());
            tagTier.setUpdateTime(e.getUpdateTime());
            tagTier.setUserId(e.getUserId());
            return tagTier;
        }).toList();
//        log.info("tagTiers: " + String.valueOf(tagTiers));
        return handleTagTiers(tagTiers);
    }

    private List<TagTier> handleTagTiers(List<TagTier> tagTiers) {
        List<TagTier> tagTierList = new ArrayList<>();
        HashMap<String, List<TagTier>> map = new HashMap<>();
        for (TagTier tagTier : tagTiers) {
            if (tagTier.getParentTagId() != null) {
                if (map.containsKey(tagTier.getParentTagId())) {
                    map.get(tagTier.getParentTagId()).add(tagTier);
                } else {
                    List<TagTier> list = new ArrayList<>();
                    list.add(tagTier);
                    map.put(tagTier.getParentTagId(), list);
                }
            } else {
                tagTierList.add(tagTier);
            }
        }
        log.info("map: " + map.size());
        return dfTagTiers(tagTierList, map);
    }

    private List<TagTier> dfTagTiers(List<TagTier> tagTiers, HashMap<String, List<TagTier>> map) {
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
