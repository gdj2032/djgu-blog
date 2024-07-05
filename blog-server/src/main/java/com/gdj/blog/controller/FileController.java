package com.gdj.blog.controller;

import com.gdj.blog.constant.GlobalConstant;
import com.gdj.blog.entity.WebResponse;
import com.gdj.blog.exception.BaseResult;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.OutputStream;
import java.net.URLEncoder;

@RestController
@Slf4j
@RequestMapping("/file")
public class FileController {

    //    @ApiOperation(value = "上传文件")
    @PostMapping("/upload")
    public WebResponse<?> upload(@RequestParam("file") MultipartFile file) {
        try {
            // 获取上传文件的文件名
            String fileName = file.getOriginalFilename();
            // 将文件保存到磁盘或执行其他操作，这里只是简单地将文件保存到静态资源目录下
            file.transferTo(new File(GlobalConstant.FILE_PATH + fileName));
            return WebResponse.ok("上传成功");
        } catch (Exception e) {
            throw BaseResult.BAD_PARAM.message("文件上传失败").exception();
        }
    }

    //    @ApiOperation(value = "下载文件")
    @GetMapping("/download")
    public void download(@RequestParam("fileName") String fileName, HttpServletResponse response) {
        //  新建文件流，从磁盘读取文件流
        try (FileInputStream fis = new FileInputStream(GlobalConstant.FILE_PATH + fileName);
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
            response.setHeader("Content-disposition", "attachment;filename=" + URLEncoder.encode(fileName, "UTF-8"));  // 注意，这里要设置文件名的编码，否则中文的文件名下载后不显示
            // 写出字节数组到输出流
            os.write(bytes);
            // 刷新输出流
            os.flush();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


}
