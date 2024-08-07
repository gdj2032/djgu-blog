package com.gdj.blog.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.sql.Timestamp;

@Data
@NoArgsConstructor
@AllArgsConstructor
@TableName("file")
public class FileDO implements Serializable {
    private static final long serialVersionUID = 1L;
    private Long id;
    private int used;
    private String url;
    private Timestamp createTime;
}
