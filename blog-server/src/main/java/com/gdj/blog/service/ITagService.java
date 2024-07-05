package com.gdj.blog.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.gdj.blog.dao.IContainerBaseService;
import com.gdj.blog.entity.TagDO;
import com.gdj.blog.entity.TagTier;
import com.gdj.blog.entity.TagVO;

import java.util.List;

public interface ITagService extends IContainerBaseService<TagDO> {

    TagDO getByName(String name);

    TagDO insert(TagDO tagDo);

    IPage<TagVO> pageData(Integer limit, Integer offset);

    List<TagTier> tiers();

    List<TagVO> all();

    TagDO update(TagDO entity);
}
