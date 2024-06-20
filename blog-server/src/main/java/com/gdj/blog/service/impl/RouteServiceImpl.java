package com.gdj.blog.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.gdj.blog.dao.ContainerServiceImpl;
import com.gdj.blog.entity.RouteDO;
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
public class RouteServiceImpl extends ContainerServiceImpl<RouteMapper, RouteDO> implements IRouteService {

    @Resource
    private final UserMapper userMapper;

    @Override
    public RouteDO getByName(String name) {
        return baseMapper.selectOne(new MPJLambdaWrapper<>(RouteDO.class).eq(RouteDO::getName, name));
    }

    @Override
    public RouteDO getByPath(String path) {
        return baseMapper.selectOne(new MPJLambdaWrapper<>(RouteDO.class).eq(RouteDO::getPath, path));
    }

    public RouteDO insert(RouteDO entity) {
        if (Objects.nonNull(getByName(entity.getName()))) throw BaseResult.REPEAT.message("名称已存在").exception();
        if (Objects.nonNull(getByPath(entity.getPath()))) throw BaseResult.REPEAT.message("路径已存在").exception();
        entity.setRole(userMapper.selectById(Objects.requireNonNull(CurrentLoginInfo.getUserInfo()).getId()).getRole());
        baseMapper.insert(entity);
        return getByName(entity.getName());
    }

    @Override
    public RouteDO update(RouteDO entity) {
        if (Objects.isNull(getById(entity.getId()))) throw BaseResult.NOT_FOUND.message("路由不存在").exception();
        long n1 = baseMapper.selectCount(new MPJLambdaWrapper<>(RouteDO.class).eq(RouteDO::getName, entity.getName()).ne(RouteDO::getId, entity.getId()));
        if (n1 >= 1) throw BaseResult.REPEAT.message("名称已存在").exception();
        long n2 = baseMapper.selectCount(new MPJLambdaWrapper<>(RouteDO.class).eq(RouteDO::getPath, entity.getPath()).ne(RouteDO::getId, entity.getId()));
        if (n2 >= 1) throw BaseResult.REPEAT.message("路由已存在").exception();
        boolean suc = updateById(entity);
        if (suc) {
            return entity;
        }
        throw BaseResult.SERVER_TOO_BUSY.message("路由更新失败").exception();
    }

    @Override
    public IPage<RouteDO> pageData(Integer limit, Integer offset) {
        int pageNumber = offset / limit + 1;
        return baseMapper.selectJoinPage(new Page<>(pageNumber, limit), RouteDO.class, new MPJLambdaWrapper<>(RouteDO.class).selectAll(RouteDO.class));
    }
}
