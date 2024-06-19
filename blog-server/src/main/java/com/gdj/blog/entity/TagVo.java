package com.gdj.blog.entity;

import lombok.Data;

@Data
public class TagVo {
    private Long id;
    private String name;
    private String description;
    private String createTime;
    private String updateTime;
    private IdName route;
    private IdName parentTag;
    private IdName user;
}
