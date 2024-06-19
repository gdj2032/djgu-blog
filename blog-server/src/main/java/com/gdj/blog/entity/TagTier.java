package com.gdj.blog.entity;

import lombok.Data;

import java.util.List;

@Data
public class TagTier extends TagVo {
    List<TagTier> children;
}
