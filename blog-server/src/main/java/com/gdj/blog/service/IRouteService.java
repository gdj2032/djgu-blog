package com.gdj.blog.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.gdj.blog.dao.IContainerBaseService;
import com.gdj.blog.entity.RouteDO;

public interface IRouteService extends IContainerBaseService<RouteDO> {

    IPage<RouteDO> pageData(Integer limit, Integer offset);

    RouteDO getByName(String name);

    RouteDO getByPath(String path);

    RouteDO insert(RouteDO entity);

    RouteDO update(RouteDO entity);
}
