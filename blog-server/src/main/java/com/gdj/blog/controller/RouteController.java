package com.gdj.blog.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.gdj.blog.entity.Result;
import com.gdj.blog.entity.Route;
import com.gdj.blog.service.impl.RouteServiceImpl;
import com.gdj.blog.utils.PageUtils;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping("/create")
    public Result createRoute(@RequestBody @Valid Route route) {
        Boolean isCreate = routeService.save(route);
        return Result.success(isCreate);
    }

    @PutMapping("/edit/{id}")
    public Result editRoute(@PathVariable String id, @RequestBody @Valid Route route) {
        route.setId(id);
        Boolean isEdit = routeService.updateById(route);
        return Result.success(isEdit);
    }

    @DeleteMapping("/delete/{id}")
    public Result deleteRoute(@PathVariable String id) {
        Boolean isCreate = routeService.removeById(id);
        return Result.success(isCreate);
    }
}
