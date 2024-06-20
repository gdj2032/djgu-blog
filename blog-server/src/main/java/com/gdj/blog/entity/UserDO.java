package com.gdj.blog.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@TableName("user")
//将这个注解写在类上之后，就会忽略类中不存在的字段。这个注解还可以指定要忽略的字段
@JsonIgnoreProperties(allowSetters = true, value = {"password"})
//该注解也是放在类名上面，作用是：忽略类中字段值为null的对象属性
//@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserDO implements Serializable {
    private Long id;

    @NotEmpty(message = "用户名不能为空")
    private String username;

    @NotEmpty(message = "密码不能为空")
    private String password;

    private String role;

    private String createTime;

    private String loginTime;

    private Boolean first;

    private String session;
}
