package com.gdj.blog.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.gdj.blog.dao.ContainerServiceImpl;
import com.gdj.blog.entity.Route;
import com.gdj.blog.exception.BaseResult;
import com.gdj.blog.mapper.RouteMapper;
import com.gdj.blog.mapper.UserMapper;
import com.gdj.blog.service.IRouteService;
import com.gdj.blog.utils.CurrentLoginInfo;
import com.github.yulichang.wrapper.MPJLambdaWrapper;
import jakarta.annotation.Resource;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Slf4j
@Service
@RequiredArgsConstructor
public class RouteServiceImpl extends ContainerServiceImpl<RouteMapper, Route> implements IRouteService {

    @Resource
    private final UserMapper userMapper;

    @Override
    public Route getByName(String name) {
        return baseMapper.selectOne(new MPJLambdaWrapper<>(Route.class).eq(Route::getName, name));
    }

    @Override
    public Route getByPath(String path) {
        return baseMapper.selectOne(new MPJLambdaWrapper<>(Route.class).eq(Route::getPath, path));
    }

    public Route insert(Route entity) {
        if (Objects.nonNull(getByName(entity.getName()))) throw BaseResult.REPEAT.message("名称已存在").exception();
        if (Objects.nonNull(getByPath(entity.getPath()))) throw BaseResult.REPEAT.message("路径已存在").exception();
        entity.setRole(userMapper.selectById(Objects.requireNonNull(CurrentLoginInfo.getUserInfo()).getId()).getRole());
        baseMapper.insert(entity);
        return getByName(entity.getName());
    }

    @Override
    public Route update(Route entity) {
        if (Objects.isNull(getById(entity.getId()))) throw BaseResult.NOT_FOUND.message("路由不存在").exception();
        long n1 = baseMapper.selectCount(new MPJLambdaWrapper<>(Route.class).eq(Route::getName, entity.getName()).ne(Route::getId, entity.getId()));
        if (n1 >= 1) throw BaseResult.REPEAT.message("名称已存在").exception();
        long n2 = baseMapper.selectCount(new MPJLambdaWrapper<>(Route.class).eq(Route::getPath, entity.getPath()).ne(Route::getId, entity.getId()));
        if (n2 >= 1) throw BaseResult.REPEAT.message("路由已存在").exception();
        boolean suc = updateById(entity);
        if (suc) {
            return entity;
        }
        throw BaseResult.SERVER_TOO_BUSY.message("路由更新失败").exception();
    }

    @Override
    public IPage<Route> pageData(Integer limit, Integer offset) {
        int pageNumber = offset / limit + 1;
        return baseMapper.selectJoinPage(new Page<>(pageNumber, limit), Route.class, new MPJLambdaWrapper<>(Route.class).selectAll(Route.class));
    }
}
