package com.gdj.blog.exception;

import com.gdj.blog.entity.WebResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.sql.SQLException;
import java.util.List;

import static com.gdj.blog.constant.CodeConstant.API_CODE_PARAM_ERROR;
import static com.gdj.blog.constant.CodeConstant.API_CODE_SERVER_ERROR;

/**
 * @explain 统一异常处理类
 */
@RestControllerAdvice
@Slf4j
public class MyExceptionHandler {
    /**
     * 是否禁用异常详情
     */
    @Value("${app.disableExceptionDetail:false}")
    private boolean disableExceptionDetail;

    /**
     * 是否总是返回200
     */
    @Value("${app.alwaysResponseOK:false}")
    private boolean alwaysResponseOK;

    @ExceptionHandler(value = AwesomeException.class)
    @ResponseBody
    public WebResponse<Object> awesomeExceptionHandler(HttpServletRequest request,
                                                       HttpServletResponse response,
                                                       AwesomeException exception) {
        log.error("异常结果 exception ============> {}", exception.getMessage());
        setResponseCode(response, exception.httpStatus);
        return buildResponse(exception.httpStatus, exception.code, exception.getMessage(),
                ExceptionHelper.getStackTrace(exception));
    }

    @ExceptionHandler(value = SQLException.class)
    @ResponseBody
    public WebResponse<Object> sqlExceptionHandler(HttpServletRequest request,
                                                   HttpServletResponse response,
                                                   SQLException sqlException) {
        log.error("异常结果 SQLException ============> {}", sqlException.getMessage());
        setResponseCode(response, HttpStatus.INTERNAL_SERVER_ERROR.value());
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                API_CODE_SERVER_ERROR,
                "数据库执行异常，请联系管理员！",
                ExceptionHelper.getStackTrace(sqlException));
    }

    @ExceptionHandler(value = Exception.class)
    @ResponseBody
    public WebResponse<Object> exceptionHandler(HttpServletRequest request,
                                                HttpServletResponse response,
                                                Exception exception) {
        log.error("异常结果 Exception ============> {}", exception.getMessage());
        setResponseCode(response, HttpStatus.INTERNAL_SERVER_ERROR.value());
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                API_CODE_SERVER_ERROR,
                "系统异常，请联系管理员！",
                ExceptionHelper.getStackTrace(exception));
    }

    @ResponseBody
    @ExceptionHandler({
            MethodArgumentNotValidException.class,
            MethodArgumentTypeMismatchException.class
    })
    public WebResponse<Object> bizBadRequest(HttpServletRequest request,
                                             HttpServletResponse response,
                                             Exception e) {
        setResponseCode(response, HttpStatus.BAD_REQUEST.value());
        if (e instanceof MethodArgumentNotValidException) {
            List<ObjectError> allErrors =
                    ((MethodArgumentNotValidException) e).getBindingResult().getAllErrors();

            ObjectError error = allErrors.stream()
                    .findFirst()
                    .orElse(new ObjectError("", "参数错误"));

            return buildResponse(HttpStatus.BAD_REQUEST.value(),
                    API_CODE_PARAM_ERROR,
                    error.getDefaultMessage(),
                    ExceptionHelper.getStackTrace(e));
        } else if (e instanceof MethodArgumentTypeMismatchException) {
            MethodArgumentTypeMismatchException exception =
                    (MethodArgumentTypeMismatchException) e;

            return buildResponse(HttpStatus.BAD_REQUEST.value(), API_CODE_PARAM_ERROR,
                    String.format("参数[%s]错误：[%s]",
                            exception.getName(),
                            exception.getValue()),
                    ExceptionHelper.getStackTrace(e));
        } else {
            return buildResponse(HttpStatus.BAD_REQUEST.value(),
                    API_CODE_PARAM_ERROR,
                    "参数错误",
                    ExceptionHelper.getStackTrace(e));
        }
    }

    /**
     * 设置响应状态码
     *
     * @param response
     * @param httpStatus
     */
    private void setResponseCode(HttpServletResponse response, Integer httpStatus) {
        if (alwaysResponseOK) {
            httpStatus = HttpStatus.OK.value();
        }
        response.setStatus(httpStatus);
    }

    private WebResponse<Object> buildResponse(int httpStatusCode,
                                              Number statusCode,
                                              String message,
                                              List<String> detailMessage) {
        WebResponse<Object> webResponse = new WebResponse<Object>();
        webResponse.setCode(statusCode);
        webResponse.setMessage(message);
        webResponse.setHttpStatusCode(httpStatusCode);
//        if (!disableExceptionDetail) {
//            webResponse.setDetailMessage(detailMessage);
//        }
        return webResponse;
    }
}
