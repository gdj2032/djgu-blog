package com.gdj.blog.controller;

import com.gdj.blog.entity.WebResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@Slf4j
@RequestMapping("/file")
public class FileController {

    //    @ApiOperation(value = "上传文件")
    @PostMapping("/upload")
    public WebResponse<?> upload(HttpServletRequest request) {
        MultipartFile file;
//        try {
////            file = new MultipartFile(request);
//        } catch (IOException ioEx) {
//            log.error("upload file failed,IOException:" + ioEx);
//            throw BaseResult.INTERNAL_SERVER_ERROR.message("文件上传失败").exception();
//        }
        return null;
    }
}
