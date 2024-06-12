package com.gdj.blog.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.gdj.blog.entity.Route;
import com.gdj.blog.entity.User;

public interface IRouteService extends IService<Route> {

    /**
     * 路由列表分页查询
     * @param route
     * @return
     */
    IPage<Route> selectRoutePage(IPage<Route> page);
}
