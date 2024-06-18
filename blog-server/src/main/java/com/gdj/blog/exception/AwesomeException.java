package com.gdj.blog.exception;

public class AwesomeException extends RuntimeException {
    public final int httpStatus;
    public final Number code;

    public AwesomeException(int httpStatus, Number code, String message) {
        super(message);
        this.httpStatus = httpStatus;
        this.code = code;
    }

    public AwesomeException(BaseResult baseResult) {
        super(baseResult.getMessage());
        this.httpStatus = baseResult.getHttpStatus().value();
        this.code = baseResult.getCode();
    }

    public String toString() {
        return "statusCode: " + httpStatus + "\ncode: " + this.code + "\n" + super.toString();
    }
}