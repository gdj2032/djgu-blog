package com.gdj.blog.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.gdj.blog.entity.User;

import java.util.List;

public interface UserMapper extends BaseMapper<User> {

    User selectByUserName(String username);

    List<User> selectUserPage(IPage<User> page);
}
