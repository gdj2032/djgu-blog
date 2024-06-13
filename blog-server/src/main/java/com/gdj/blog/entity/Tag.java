package com.gdj.blog.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@TableName("tag")
public class Tag {
    private String id;
    @NotEmpty(message = "标签名称不能为空")
    private String name;
    private String description;
    private String userId;
    private String createTime;
    private String updateTime;
    private String routeId;
    private String prentTagId;
}
