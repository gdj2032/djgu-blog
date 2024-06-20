package com.gdj.blog.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.gdj.blog.dao.IContainerBaseService;
import com.gdj.blog.entity.Route;

public interface IRouteService extends IContainerBaseService<Route> {
    
    Route selectByName(String name);

    Route selectByPath(String path);

    Route insert(Route entity);

    IPage<Route> pageData(Integer limit, Integer offset);
}
