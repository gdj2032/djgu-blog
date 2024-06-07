package com.gdj.blog.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@TableName("user")
public class User {
    private Integer id;
    private String username;
    private String password;
    private String role;
    private String createTime;
    private String session;
    private String loginTime;
    private Boolean first;
}
