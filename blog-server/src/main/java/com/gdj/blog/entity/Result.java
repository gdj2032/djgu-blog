package com.gdj.blog.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Result {
    private Integer code;
    private String message;
    private Object data;

    public static Result success(Object data) {
        return new Result(200, "success", data);
    }

    public static Result success() {
        return new Result(200, "success", null);
    }

    public static Result error(String error, Integer code) {
        return new Result(code, error, null);
    }

    public static Result error400(String error) {
        return new Result(400, error, null);
    }

    public static Result error500(String error) {
        return new Result(500, error, null);
    }
}
