package com.gdj.blog.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.gdj.blog.dao.ContainerServiceImpl;
import com.gdj.blog.entity.UserDO;
import com.gdj.blog.entity.UserVo;
import com.gdj.blog.exception.BaseResult;
import com.gdj.blog.mapper.UserMapper;
import com.gdj.blog.service.IUserService;
import com.gdj.blog.utils.CurrentLoginInfo;
import com.github.yulichang.wrapper.MPJLambdaWrapper;
import jakarta.annotation.Resource;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl extends ContainerServiceImpl<UserMapper, UserDO> implements IUserService {

    @Resource
    private UserMapper userMapper;

    public UserDO login(UserDO user) {
        UserDO u = baseMapper.selectJoinOne(UserDO.class,
                new MPJLambdaWrapper<UserDO>()
                        .eq(UserDO::getUsername, user.getUsername())
                        .eq(UserDO::getPassword, user.getPassword())
        );
        if (u != null) {
            CurrentLoginInfo.setUserInfo(u);
            log.info(String.valueOf(u));
            return u;
        }
        throw BaseResult.USERNAME_PASSWORD_ERROR.message("用户名密码错误").exception();
    }

    @Override
    public IPage<UserVo> pageData(
            Integer limit,
            Integer offset
    ) {
        int pageNumber = offset / limit + 1;
        return baseMapper.selectJoinPage(new Page<>(pageNumber, limit), UserVo.class,
                new MPJLambdaWrapper<UserDO>()
                        .selectAll(UserDO.class)
        );
    }
}
