package com.gdj.blog.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@TableName("route")
public class Route {
    private String id;
    @NotEmpty(message = "路由不能为空")
    private String name;
    private String description;
    @NotEmpty(message = "路径不能为空")
    private String path;
    private String role;
}
