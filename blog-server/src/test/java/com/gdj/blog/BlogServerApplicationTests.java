package com.gdj.blog;

import com.gdj.blog.entity.Route;
import com.gdj.blog.entity.TagDo;
import com.gdj.blog.entity.User;
import com.gdj.blog.mapper.RouteMapper;
import com.gdj.blog.mapper.TagMapper;
import com.gdj.blog.mapper.UserMapper;
import com.gdj.blog.service.impl.UserServiceImpl;
import com.github.yulichang.wrapper.MPJLambdaWrapper;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
@Slf4j
class BlogServerApplicationTests {

    @Autowired
    private UserMapper userMapper;
    @Autowired
    private TagMapper tagMapper;
    @Autowired
    private RouteMapper routeMapper;

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
        List<TagDo> tags = tagMapper.pageData(0, 10);
        tags.forEach(System.out::println);
    }

    @Test
    void getRouteNameCount() {
        long n1 = routeMapper.selectCount(new MPJLambdaWrapper<>(Route.class).eq(Route::getName, "test2"));
        log.info("getRouteNameCount: {}", n1);
    }

}
