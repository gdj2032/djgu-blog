package com.gdj.blog.exception;


import com.gdj.blog.constant.CodeConstant;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

@Data
public class BaseResult implements Serializable {

    @Serial
    private static final long serialVersionUID = 2587609271047191784L;

    /**
     * 用户名密码错误
     */
    public static final BaseResult USERNAME_PASSWORD_ERROR = new BaseResult(CodeConstant.API_CODE_CALL_SUCCESS,
            "用户名密码错误", HttpStatus.BAD_REQUEST);

    /**
     * 未认证
     */
    public static final BaseResult NO_AUTH = new BaseResult(CodeConstant.API_CODE_TOKEN_ERROR,
            "未认证", HttpStatus.UNAUTHORIZED);

    /**
     * 未授权
     */
    public static final BaseResult ACCESS_DENY = new BaseResult(CodeConstant.API_CODE_USER_NOT_HAS_PERM,
            "没有权限", HttpStatus.FORBIDDEN);

    /**
     * 未预料的错误
     */
    public static final BaseResult INTERNAL_SERVER_ERROR = new BaseResult(CodeConstant.API_CODE_SERVER_ERROR,
            "未预料的错误", HttpStatus.INTERNAL_SERVER_ERROR);

    /**
     * 参数错误
     */
    public static final BaseResult BAD_PARAM = new BaseResult(CodeConstant.API_CODE_PARAM_ERROR,
            "非法的请求参数", HttpStatus.BAD_REQUEST);

    /**
     * 三方依赖错误
     */
    public static final BaseResult THIRD_DEPENDENT_ERROR = new BaseResult(CodeConstant.THIRD_DEPENDENT_ERROR,
            "三方依赖错误", HttpStatus.BAD_REQUEST);

    /**
     * 服务器繁忙
     */
    public static final BaseResult SERVER_TOO_BUSY = new BaseResult(CodeConstant.API_SERVER_TOO_BUSY,
            "服务器繁忙,请稍后重试", HttpStatus.BAD_REQUEST);

    /**
     * 资源不存在
     */
    public static final BaseResult NOT_FOUND = new BaseResult(CodeConstant.API_CODE_NOT_FOUND,
            "资源不存在", HttpStatus.NOT_FOUND);

    /**
     * 接口限流
     */
    public static final BaseResult API_RATE_LIMIT = new BaseResult(CodeConstant.API_CODE_CALL_FAIL,
            "流量限制", HttpStatus.TOO_MANY_REQUESTS);

    /**
     * 资源重复
     */
    public static final BaseResult REPEAT = new BaseResult(CodeConstant.API_CODE_REPEAT,
            "资源重复", HttpStatus.BAD_REQUEST);
    /**
     * 错误状态码
     */
    private Number code;

    /**
     * http状态码
     */
    private HttpStatus httpStatus;

    /**
     * 错误信息
     */
    private String message;

    /**
     * @return 返回新的message
     */
    public BaseResult message(String message) {
        return new BaseResult(code, message, httpStatus);
    }

    /**
     * @return 返回新的message
     */
    public BaseResult message(String message, Object... args) {
        return new BaseResult(code, String.format(message, args), httpStatus);
    }

    public BaseResult(Number code, String message, HttpStatus httpStatus) {
        this.code = code;
        this.message = message;
        this.httpStatus = httpStatus;
    }

    public BaseResult() {
    }

    public AwesomeException exception() {
        return new AwesomeException(this);
    }
}
