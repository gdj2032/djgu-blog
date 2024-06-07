package com.gdj.blog.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Result {
    private String statusCode;
    private String message;
    private Object result;

    public static Result success(Object data) {
        return new Result("200", "success", data);
    }

    public static Result success() {
        return new Result("200", "success", null);
    }

    public static Result error(String error, String statusCode) {
        return new Result(statusCode, error, null);
    }
}
