package com.gdj.blog.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.gdj.blog.entity.Route;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public interface RouteMapper extends BaseMapper<Route> {
    List<Route> pages(IPage<Route> page);

    Route selectByName(String name);

    Route selectByPath(String path);
}
