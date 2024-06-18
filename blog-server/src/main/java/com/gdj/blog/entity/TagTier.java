package com.gdj.blog.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Data
public class TagTier extends Tag {
    List<TagTier> children;
}
