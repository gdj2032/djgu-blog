package com.gdj.blog.entity;

import lombok.Data;

@Data
public class TagDo extends Tag {
    private String userName;
    private String routeName;
    private String parentTagName;
}