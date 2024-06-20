package com.gdj.blog.entity;

import lombok.Data;

@Data
public class TagDTO extends TagDO {
    private String userName;
    private String routeName;
    private String parentTagName;
}