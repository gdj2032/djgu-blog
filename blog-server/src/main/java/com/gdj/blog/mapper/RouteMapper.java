package com.gdj.blog.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.gdj.blog.entity.Route;

import java.util.List;

public interface RouteMapper extends BaseMapper<Route> {
    List<Route> selectRoutePage(IPage<Route> page);
}
