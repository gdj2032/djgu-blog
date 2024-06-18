package com.gdj.blog.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.gdj.blog.entity.Route;

public interface IRouteService extends IService<Route> {

    /**
     * 路由列表分页查询
     * @param page
     * @return
     */
    IPage<Route> pages(IPage<Route> page);

    Route selectByName(String name);

    Route selectByPath(String path);

    Route insert(Route entity);
}
