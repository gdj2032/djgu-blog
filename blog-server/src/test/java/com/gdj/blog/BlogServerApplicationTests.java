package com.gdj.blog;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.gdj.blog.entity.Tag;
import com.gdj.blog.entity.TagVo;
import com.gdj.blog.entity.User;
import com.gdj.blog.mapper.TagMapper;
import com.gdj.blog.mapper.UserMapper;
import com.gdj.blog.service.impl.UserServiceImpl;
import com.github.yulichang.wrapper.MPJLambdaWrapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
class BlogServerApplicationTests {

    @Autowired
    private UserMapper userMapper;
    @Autowired
    private TagMapper tagMapper;

    @Autowired
    private UserServiceImpl userService;

    @Test
    void contextLoads() {
//        List<User> users = userMapper.selectList(null);
//        users.forEach(System.out::println);
        List<User> users = userService.list();
        users.forEach(System.out::println);
    }

    @Test
    void testTags() {
        MPJLambdaWrapper<Tag> wrapper = new MPJLambdaWrapper<Tag>()
                .selectAll(Tag.class)
                .leftJoin(User.class, on -> on.eq(User::getId, TagVo::getUser));
        IPage<TagVo> page = tagMapper.selectJoinPage(new Page<>(1, 2), TagVo.class, wrapper);
        page.getRecords().forEach(System.out::println);
    }

}
