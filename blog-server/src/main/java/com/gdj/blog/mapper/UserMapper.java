package com.gdj.blog.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.gdj.blog.entity.User;

public interface UserMapper extends BaseMapper<User> {

    User selectByUserName(String username);
}
