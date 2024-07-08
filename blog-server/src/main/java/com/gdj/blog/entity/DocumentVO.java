package com.gdj.blog.entity;

import lombok.Data;

import java.util.List;

@Data
public class DocumentVO {
    private Long id;
    private String name;
    private String description;
    private String createTime;
    private String updateTime;
    private Long see;
    private String fileId;
    private IdName route;
    private List<IdName> tags;
}
