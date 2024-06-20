package com.gdj.blog.mapper;

import com.gdj.blog.dao.ContainerBaseMapper;
import com.gdj.blog.entity.UserDO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper extends ContainerBaseMapper<UserDO> {
}
