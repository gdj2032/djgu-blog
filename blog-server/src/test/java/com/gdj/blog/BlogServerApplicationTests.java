package com.gdj.blog;

import com.gdj.blog.entity.Tag;
import com.gdj.blog.entity.User;
import com.gdj.blog.mapper.TagMapper;
import com.gdj.blog.mapper.UserMapper;
import com.gdj.blog.service.impl.UserServiceImpl;
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
        List<Tag> tags = tagMapper.all();
        tags.forEach(System.out::println);
    }

}
