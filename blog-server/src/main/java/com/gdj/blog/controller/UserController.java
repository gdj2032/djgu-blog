package com.gdj.blog.controller;

import com.gdj.blog.constant.GlobalConstant;
import com.gdj.blog.entity.PageInfo;
import com.gdj.blog.entity.UserDO;
import com.gdj.blog.entity.UserVo;
import com.gdj.blog.entity.WebResponse;
import com.gdj.blog.service.impl.UserServiceImpl;
import com.gdj.blog.utils.PageUtils;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RestController
@Slf4j
@RequestMapping("user")
public class UserController {

    @Resource
    private UserServiceImpl userService;

    @PostMapping("/login")
    public WebResponse<UserDO> login(@RequestBody UserDO user) {
        return WebResponse.ok(userService.login(user));
    }

    @DeleteMapping("/logout")
    public WebResponse<?> logout(HttpServletRequest request) {
        request.getSession().removeAttribute(GlobalConstant.SESSION);
        return WebResponse.ok("登出成功");
    }

    @GetMapping
    public WebResponse<PageInfo<UserVo>> userList(
        @RequestParam(defaultValue = "10") Integer limit,
        @RequestParam(defaultValue = "0") Integer offset
    ) {
        return WebResponse.ok(PageUtils.page2PageInfo(userService.pageData(limit, offset)));
    }

}
