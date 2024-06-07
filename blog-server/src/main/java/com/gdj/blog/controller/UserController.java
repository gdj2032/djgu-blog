package com.gdj.blog.controller;

import com.gdj.blog.entity.Result;
import com.gdj.blog.entity.User;
import com.gdj.blog.service.impl.UserServiceImpl;
import com.gdj.blog.utils.JwtUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@Slf4j
@RequestMapping("user")
public class UserController {

    @Autowired
    private UserServiceImpl userService;

    @PostMapping("/login")
    public Result login(@RequestBody User user) {
        User u = userService.login(user);
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
        return Result.error("用户名密码错误", "400");
    }

    @GetMapping("/list")
    public Result userList() {
        List<User> users = userService.list();
        return Result.success(users);
    }

}
