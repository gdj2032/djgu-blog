package com.gdj.blog.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.gdj.blog.dao.IContainerBaseService;
import com.gdj.blog.entity.UserDO;
import com.gdj.blog.entity.UserVo;

public interface IUserService extends IContainerBaseService<UserDO> {

    UserDO login(UserDO user);

    IPage<UserVo> pageData(Integer limit, Integer offset);
}
