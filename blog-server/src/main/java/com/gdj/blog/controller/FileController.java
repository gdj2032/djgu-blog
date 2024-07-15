package com.gdj.blog.controller;

import com.gdj.blog.constant.GlobalConstant;
import com.gdj.blog.entity.FileDO;
import com.gdj.blog.entity.WebResponse;
import com.gdj.blog.exception.BaseResult;
import com.gdj.blog.service.impl.FileServiceImpl;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedInputStream;
import java.io.FileInputStream;
import java.io.OutputStream;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Objects;

@RestController
@Slf4j
@RequestMapping("/file")
public class FileController {

    @Resource
    private FileServiceImpl fileService;

    //    @ApiOperation(value = "上传文件")
    @PostMapping("/upload")
    public WebResponse<?> upload(@RequestParam(value = "file", required = false) MultipartFile file,
                                 @RequestParam(value = "filename", required = false) String filename,
                                 @RequestParam(value = "type", required = false) String type,
                                 @RequestParam(value = "content", required = false) String content) {
        if (Objects.nonNull(type)) {
            return WebResponse.ok(fileService.uploadByType(filename, type, content));
        }
        if (file.isEmpty()) throw BaseResult.NOT_FOUND.exception();
        return WebResponse.ok(fileService.upload(file));
    }

    //    @ApiOperation(value = "下载文件")
    @GetMapping("/{fileId}")
    public void download(@PathVariable("fileId") String fileId, HttpServletResponse response) {
        if (Objects.isNull(fileId)) throw BaseResult.NOT_FOUND.exception();
        //  新建文件流，从磁盘读取文件流
        FileDO fileDO = fileService.getById(fileId);
        if (Objects.isNull(fileDO)) throw BaseResult.NOT_FOUND.exception();
        try (
                FileInputStream fis = new FileInputStream(GlobalConstant.ROOT_PATH + fileDO.getUrl());
             BufferedInputStream bis = new BufferedInputStream(fis);
             OutputStream os = response.getOutputStream()) {    //  OutputStream 是文件写出流，讲文件下载到浏览器客户端
            // 新建字节数组，长度是文件的大小，比如文件 6kb, bis.available() = 1024 * 6
            byte[] bytes = new byte[bis.available()];
            // 从文件流读取字节到字节数组中
            bis.read(bytes);
            // 重置 response
            response.reset();
            // 设置 response 的下载响应头
            response.setContentType("application/octet-stream");
            response.setHeader("Content-disposition", "attachment;filename=" + URLEncoder.encode(fileService.getFileNameByUrl(fileDO.getUrl()), StandardCharsets.UTF_8));  // 注意，这里要设置文件名的编码，否则中文的文件名下载后不显示
            // 写出字节数组到输出流
            os.write(bytes);
            // 刷新输出流
            os.flush();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


}
