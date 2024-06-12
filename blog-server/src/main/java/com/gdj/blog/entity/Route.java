package com.gdj.blog.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@TableName("route")
public class Route {
    private String id;
    private String name;
    private String description;
    private String path;
    private String role;
}
