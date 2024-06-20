package com.gdj.blog.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@TableName("file")
public class FileDO {
    private Long id;
    private Boolean used;
    private String url;
    private String createTime;
}
