package com.gdj.blog.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.gdj.blog.entity.Route;
import com.gdj.blog.exception.BaseResult;
import com.gdj.blog.mapper.RouteMapper;
import com.gdj.blog.service.IRouteService;
import jakarta.annotation.Resource;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class RouteServiceImpl extends ServiceImpl<RouteMapper, Route> implements IRouteService {

    @Resource
    private RouteMapper routeMapper;

    @Override
    public IPage<Route> pages(IPage<Route> page) {
        return page.setRecords(baseMapper.pages(page));
    }

    @Override
    public Route selectByName(String name) {
        return baseMapper.selectByName(name);
    }

    @Override
    public Route selectByPath(String path) {
        return baseMapper.selectByPath(path);
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
        return baseMapper.selectByName(entity.getName());
    }
}
