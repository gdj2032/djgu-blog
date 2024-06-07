package com.gdj.blog;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.gdj.blog.mapper")
public class BlogServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(BlogServerApplication.class, args);
    }

}
