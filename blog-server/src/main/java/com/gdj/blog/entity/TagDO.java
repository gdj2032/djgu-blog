package com.gdj.blog.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@TableName("tag")
public class TagDO implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO, value = "id")
    private Long id;
    @NotEmpty(message = "标签名称不能为空")
    private String name;
    private String description;
    private String createTime;
    private String updateTime;
    private Long userId;
    private Long routeId;
    private Long parentTagId;
}
