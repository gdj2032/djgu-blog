package com.gdj.blog.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.gdj.blog.dao.IContainerBaseService;
import com.gdj.blog.entity.Route;

public interface IRouteService extends IContainerBaseService<Route> {

    IPage<Route> pageData(Integer limit, Integer offset);

    Route getByName(String name);

    Route getByPath(String path);

    Route insert(Route entity);

    Route update(Route entity);
}
