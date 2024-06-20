package com.gdj.blog.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.gdj.blog.dao.ContainerServiceImpl;
import com.gdj.blog.entity.Route;
import com.gdj.blog.exception.BaseResult;
import com.gdj.blog.mapper.RouteMapper;
import com.gdj.blog.service.IRouteService;
import com.github.yulichang.wrapper.MPJLambdaWrapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class RouteServiceImpl extends ContainerServiceImpl<RouteMapper, Route> implements IRouteService {

    @Override
    public Route selectByName(String name) {
        return baseMapper.selectOne(new MPJLambdaWrapper<>(Route.class).eq(Route::getName, name));
    }

    @Override
    public Route selectByPath(String path) {
        return baseMapper.selectOne(new MPJLambdaWrapper<>(Route.class).eq(Route::getPath, path));
    }

    public Route insert(Route entity) {
        Route r1 = selectByName(entity.getName());
        if (r1 != null) {
            throw BaseResult.REPEAT.message("名称已存在").exception();
        }
        Route r2 = selectByPath(entity.getName());
        if (r2 != null) {
            throw BaseResult.REPEAT.message("路径已存在").exception();
        }
        baseMapper.insert(entity);
        return selectByName(entity.getName());
    }

    @Override
    public IPage<Route> pageData(Integer limit, Integer offset) {
        int pageNumber = offset / limit + 1;
        return baseMapper.selectJoinPage(new Page<>(pageNumber, limit), Route.class, new MPJLambdaWrapper<>(Route.class).selectAll(Route.class));
    }
}
