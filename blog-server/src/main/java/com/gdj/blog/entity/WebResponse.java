package com.gdj.blog.entity;

import com.gdj.blog.constant.CodeConstant;
import com.gdj.blog.exception.HttpStatus;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

@Data
public class WebResponse<T> implements Serializable {

    @Serial
    private static final long serialVersionUID = 5789253841287207361L;

    /**
     * 状态码
     */
    // @ApiModelProperty(name = "statusCode", value = "状态码")
    private Number code;

    /**
     * HTTP状态码
     */
    // @ApiModelProperty(name = "httpStatusCode", value = "HTTP状态码")
    private Integer httpStatusCode;

    /**
     * 描述
     */
    // @ApiModelProperty(name = "message", value = "描述")
    private String message;

    /**
     * 详细描述
     */
    // @ApiModelProperty(name = "detailMessage", value = "详细描述")
//    private List<String> detailMessage;

    /**
     * 结果
     */
    // @ApiModelProperty(name = "result", value = "结果")
    private T data;

    /**
     * 备注
     */
    // @ApiModelProperty(name = "remarks", value = "备注")
//    private String remarks;

    /**
     * 版本
     */
    // @ApiModelProperty(name = "version", value = "版本")
//    private String version;

    /**
     * 日志级别
     */
    // @ApiModelProperty(name = "logLevel", value = "日志级别")
//    private String logLevel;

    /**
     * 系统时间
     */
    // @ApiModelProperty(name = "serverSysTime", value = "系统时间")
    private Long serverSysTime = Long.valueOf(System.currentTimeMillis());

    public WebResponse() {

    }

    public WebResponse(Integer httpStatusCode, Number code, String message, T result) {
        this.httpStatusCode = httpStatusCode;
        this.code = code;
        this.message = message;
        this.data = result;
    }

    /**
     * 正常
     */
    public static WebResponse<?> ok() {
        return ok(null);
    }

    /**
     * 正常
     *
     * @param result 正常返回的数据
     */
    public static <D> WebResponse<D> ok(D result) {
        return new WebResponse<>(HttpStatus.OK.value(), CodeConstant.API_CODE_CALL_SUCCESS, "", result);
    }

    /**
     * 正常
     *
     * @param result 正常返回的数据
     */
    public static <D> WebResponse<D> ok(D result, String message) {
        return new WebResponse<>(HttpStatus.OK.value(), CodeConstant.API_CODE_CALL_SUCCESS, message, result);
    }

    /**
     * 是否成功
     */
    public boolean isSuccess() {
        return CodeConstant.API_CODE_CALL_SUCCESS.equals(code);
    }
}