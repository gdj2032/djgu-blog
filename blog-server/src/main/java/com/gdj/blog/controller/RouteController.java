package com.gdj.blog.controller;

import com.gdj.blog.entity.PageInfo;
import com.gdj.blog.entity.RouteDO;
import com.gdj.blog.entity.WebResponse;
import com.gdj.blog.exception.BaseResult;
import com.gdj.blog.service.impl.RouteServiceImpl;
import com.gdj.blog.utils.PageUtil;
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
    public WebResponse<PageInfo<RouteDO>> list(
        @RequestParam(defaultValue = "10") Integer limit,
        @RequestParam(defaultValue = "0") Integer offset
    ) {
        return WebResponse.ok(PageUtil.page2PageInfo(routeService.pageData(limit, offset)));
    }

    @PostMapping("/create")
    public WebResponse<RouteDO> create(@RequestBody @Valid RouteDO routeDo) {
        return WebResponse.ok(routeService.insert(routeDo));
    }

    @PutMapping("/edit/{id}")
    public WebResponse<?> update(@PathVariable long id, @RequestBody @Valid RouteDO routeDo) {
        routeDo.setId(id);
        return WebResponse.ok(routeService.update(routeDo));
    }

    @DeleteMapping("/delete/{id}")
    public WebResponse<?> delete(@PathVariable long id) {
        RouteDO routeDo = routeService.getById(id);
        if (!Objects.isNull(routeDo)) {
            Boolean isCreate = routeService.removeById(id);
            return WebResponse.ok(isCreate);
        }
        throw BaseResult.NOT_FOUND.message("路由不存在").exception();
    }
}
