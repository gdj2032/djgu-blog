package com.gdj.blog.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.gdj.blog.common.GlobalCommon;
import com.gdj.blog.entity.Result;
import com.gdj.blog.entity.User;
import com.gdj.blog.service.impl.UserServiceImpl;
import com.gdj.blog.utils.JwtUtils;
import com.gdj.blog.utils.PageUtils;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@Slf4j
@RequestMapping("user")
public class UserController {

    @Resource
    private UserServiceImpl userService;

    @PostMapping("/login")
    public Result login(@RequestBody User user) {
        User u = userService.login(user);
        log.info("login: " + String.valueOf(u));
        if (u != null) {
            Map<String, Object> m = new HashMap<>();
            m.put("id", u.getId());
            m.put("username", u.getUsername());
            m.put("session", u.getSession());
            String jwt = JwtUtils.generateJwt(m);
            u.setSession(jwt);
            u.setPassword("");
            return Result.success(u);
        }
        return Result.error400("用户名密码错误");
    }

    @DeleteMapping("/logout")
    public Result logout(HttpServletRequest request) {
        request.getSession().removeAttribute(GlobalCommon.SESSION);
        return Result.success("登出成功");
    }

    @GetMapping
    public Result userList(
        @RequestParam(defaultValue = "10") Integer limit,
        @RequestParam(defaultValue = "0") Integer offset
    ) {
        Page<User> page = new Page<>(offset + 1, limit);
        IPage<User> pages = userService.selectUserPage(page);
        return Result.success(PageUtils.page2PageInfo(pages));
    }

}
