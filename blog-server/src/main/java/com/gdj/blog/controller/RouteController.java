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

import java.util.List;

@RestController
@RequestMapping("route")
@Slf4j
public class RouteController {

    @Resource
    private RouteServiceImpl routeService;

    @GetMapping("/list")
    public Result list(
        @RequestParam(defaultValue = "10") Integer limit,
        @RequestParam(defaultValue = "0") Integer offset
    ) {
        Page<Route> page = new Page<>(offset + 1, limit);
        IPage<Route> pages = routeService.pages(page);
        return Result.success(PageUtils.page2PageInfo(pages));
    }

    @GetMapping("/list/tier")
    public Result listTier() {
        List<Route> routes = routeService.list();
        return Result.success(routes);
    }

    @PostMapping("/create")
    public Result create(@RequestBody @Valid Route route) {
        Boolean isCreate = routeService.save(route);
        return Result.success(isCreate);
    }

    @PutMapping("/edit/{id}")
    public Result edit(@PathVariable String id, @RequestBody @Valid Route route) {
        route.setId(id);
        Boolean isEdit = routeService.updateById(route);
        return Result.success(isEdit);
    }

    @DeleteMapping("/delete/{id}")
    public Result delete(@PathVariable String id) {
        Boolean isCreate = routeService.removeById(id);
        return Result.success(isCreate);
    }
}
