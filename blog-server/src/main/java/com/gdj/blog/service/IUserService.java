package com.gdj.blog.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.gdj.blog.entity.User;

public interface IUserService extends IService<User> {

    /**
     * 用户列表分页查询
     * @param page
     * @return
     */
    IPage<User> selectUserPage(IPage<User> page, User user);
}
