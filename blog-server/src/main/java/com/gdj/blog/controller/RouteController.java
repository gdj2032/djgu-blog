package com.gdj.blog.controller;

import com.gdj.blog.entity.PageInfo;
import com.gdj.blog.entity.Route;
import com.gdj.blog.entity.WebResponse;
import com.gdj.blog.exception.BaseResult;
import com.gdj.blog.service.impl.RouteServiceImpl;
import com.gdj.blog.utils.PageUtils;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;

@RestController
@RequestMapping("route")
@Slf4j
public class RouteController {

    @Resource
    private RouteServiceImpl routeService;

    @GetMapping("/list")
    public WebResponse<PageInfo<Route>> list(
        @RequestParam(defaultValue = "10") Integer limit,
        @RequestParam(defaultValue = "0") Integer offset
    ) {
        return WebResponse.ok(PageUtils.page2PageInfo(routeService.pageData(limit, offset)));
    }

    @PostMapping("/create")
    public WebResponse<?> create(@RequestBody @Valid Route route) {
        return WebResponse.ok(routeService.insert(route));
    }

    @PutMapping("/edit/{id}")
    public WebResponse<?> edit(@PathVariable long id, @RequestBody @Valid Route route) {
        Route route2 = routeService.getById(id);
        if (!Objects.isNull(route2)) {
            route.setId(id);
            Boolean isEdit = routeService.updateById(route);
            return WebResponse.ok(isEdit);
        }
        throw BaseResult.NOT_FOUND.message("路由不存在").exception();
    }

    @DeleteMapping("/delete/{id}")
    public WebResponse<?> delete(@PathVariable long id) {
        Route route = routeService.getById(id);
        if (!Objects.isNull(route)) {
            Boolean isCreate = routeService.removeById(id);
            return WebResponse.ok(isCreate);
        }
        throw BaseResult.NOT_FOUND.message("路由不存在").exception();
    }
}
