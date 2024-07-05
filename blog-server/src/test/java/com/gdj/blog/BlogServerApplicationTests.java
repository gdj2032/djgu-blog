package com.gdj.blog;

import com.gdj.blog.entity.RouteDO;
import com.gdj.blog.entity.TagVO;
import com.gdj.blog.entity.UserDO;
import com.gdj.blog.mapper.DocumentMapper;
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
    @Autowired
    private DocumentMapper documentMapper;

    @Test
    void contextLoads() {
//        List<User> users = userMapper.selectList(null);
//        users.forEach(System.out::println);
        List<UserDO> users = userService.list();
        users.forEach(System.out::println);
    }

    @Test
    void testTags() {
        List<TagVO> tags = tagMapper.pageData(0, 10);
        tags.forEach(System.out::println);
    }

    @Test
    void getRouteNameCount() {
        long n1 = routeMapper.selectCount(new MPJLambdaWrapper<>(RouteDO.class).eq(RouteDO::getName, "test2"));
        log.info("getRouteNameCount: {}", n1);
    }

//    @Test
//    void addDTByDoc() {
//        List<DocumentDO> docs = documentMapper.selectList(new MPJLambdaWrapper<>(DocumentDO.class));
//        docs.forEach(e -> {
//            String[] tagIds = e.getTagIds().split(",");
//            for (int i = 0; i < tagIds.length; i++) {
//                Long tagId = Long.valueOf(tagIds[i]);
//                DocumentTagDo documentTagDo = new DocumentTagDo();
//                documentTagDo.setTagId(tagId);
//                documentTagDo.setDocumentId(e.getId());
//                documentTagMapper.insert(documentTagDo);
//            }
//        });
//    }

    @Test
    void getDocs() {
//        List<DocumentVO> documentVO = documentMapper.pageData(1, 10);
//        documentVO.forEach(System.out::println);
    }

}
