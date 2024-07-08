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
@TableName("document")
public class DocumentDO implements Serializable {
    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO, value = "id")
    private Long id;
    @NotEmpty(message = "文档名称不能为空")
    private String name;
    private String description;
    private String createTime;
    private String updateTime;
    @NotEmpty(message = "路由id不能为空")
    private String routeId;
    private Long see;
    @NotEmpty(message = "文件id不能为空")
    private String fileId;
    private String tagIds;
}
