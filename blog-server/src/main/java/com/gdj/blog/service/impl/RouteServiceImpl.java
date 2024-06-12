package com.gdj.blog.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.gdj.blog.entity.Route;
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
    public IPage<Route> selectRoutePage(IPage<Route> page) {
        return page.setRecords(baseMapper.selectRoutePage(page));
    }
}
