package com.gdj.blog.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.gdj.blog.dao.IContainerBaseService;
import com.gdj.blog.entity.User;
import com.gdj.blog.entity.UserVo;

public interface IUserService extends IContainerBaseService<User> {

    User login(User user);

    IPage<UserVo> pageData(Integer limit, Integer offset);
}
