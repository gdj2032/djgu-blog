package com.gdj.blog.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.gdj.blog.entity.User;
import com.gdj.blog.mapper.UserMapper;
import com.gdj.blog.service.IUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements IUserService {

    @Autowired
    private UserMapper userMapper;

    public User login(User user) {
        return userMapper.selectByUserName(user.getUsername());
    }

    @Override
    public IPage<User> selectUserPage(IPage<User> page) {
        return page.setRecords(baseMapper.selectUserPage(page));
    }
}
