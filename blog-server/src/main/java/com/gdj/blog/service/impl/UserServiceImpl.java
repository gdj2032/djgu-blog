package com.gdj.blog.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.gdj.blog.entity.User;
import com.gdj.blog.exception.BaseResult;
import com.gdj.blog.mapper.UserMapper;
import com.gdj.blog.service.IUserService;
import com.gdj.blog.utils.CurrentLoginInfo;
import jakarta.annotation.Resource;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements IUserService {

    @Resource
    private UserMapper userMapper;

    public User login(User user) {
        User u = baseMapper.login(user);
        if (u != null) {
            CurrentLoginInfo.setUserInfo(u);
            log.info(String.valueOf(u));
            return u;
        }
        throw BaseResult.USERNAME_PASSWORD_ERROR.message("用户名密码错误").exception();
    }

    @Override
    public IPage<User> selectUserPage(IPage<User> page) {
        return page.setRecords(baseMapper.pages(page));
    }
}
