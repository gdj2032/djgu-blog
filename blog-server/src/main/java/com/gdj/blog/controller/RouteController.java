package com.gdj.blog.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.gdj.blog.entity.Result;
import com.gdj.blog.entity.Route;
import com.gdj.blog.service.impl.RouteServiceImpl;
import com.gdj.blog.utils.PageUtils;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("route")
@Slf4j
public class RouteController {

    @Resource
    private RouteServiceImpl routeService;

    @GetMapping("/list")
    public Result routeList(
        @RequestParam(defaultValue = "10") Integer limit,
        @RequestParam(defaultValue = "0") Integer offset
    ) {
        Page<Route> page = new Page<>(offset + 1, limit);
        IPage<Route> pages = routeService.selectRoutePage(page);
        return Result.success(PageUtils.page2PageInfo(pages));
    }
}
