package com.gdj.blog.service.impl;

import com.gdj.blog.constant.GlobalConstant;
import com.gdj.blog.dao.ContainerServiceImpl;
import com.gdj.blog.entity.FileDO;
import com.gdj.blog.mapper.FileMapper;
import com.gdj.blog.service.IFileService;
import com.gdj.blog.utils.DateUtil;
import com.gdj.blog.utils.MathUtil;
import com.github.yulichang.wrapper.MPJLambdaWrapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FileUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.Objects;

@Slf4j
@Service
@RequiredArgsConstructor
public class FileServiceImpl extends ContainerServiceImpl<FileMapper, FileDO> implements IFileService {

    public FileDO getByUrl(String url) {
        return baseMapper.selectOne(new MPJLambdaWrapper<>(FileDO.class).eq(FileDO::getUrl, url));
    }

    @Override
    public FileDO upload(MultipartFile file) {
        String fileName = rename(Objects.requireNonNull(file.getOriginalFilename()));
        String date = DateUtil.formatDate(LocalDate.now(), DateUtil.YMD);
        String folderPath = GlobalConstant.ROOT_PATH + GlobalConstant.FILE_PATH + "/" + date;
        createDir(folderPath);
        String sqlUrl = GlobalConstant.FILE_PATH + "/" + date + "/" + fileName;
        String localUrl = GlobalConstant.ROOT_PATH + sqlUrl;
        saveFile(file, localUrl);
        baseMapper.insert(new FileDO(null, 0, sqlUrl, new Timestamp(System.currentTimeMillis())));
        return getByUrl(sqlUrl);
    }

    @Override
    public FileDO uploadByType(String filename, String type, String content) {
        String fileName = rename(filename);
        String date = DateUtil.formatDate(LocalDate.now(), DateUtil.YMD);
        String folderPath = GlobalConstant.ROOT_PATH + GlobalConstant.FILE_PATH + "/" + date;
        createDir(folderPath);
        String sqlUrl = GlobalConstant.FILE_PATH + "/" + date + "/" + fileName;
        String localUrl = GlobalConstant.ROOT_PATH + sqlUrl;
        try {
            File file = new File(localUrl);
            FileUtils.writeStringToFile(file, content, "UTF-8");
        } catch (Exception e) {
            e.printStackTrace();
        }
        baseMapper.insert(new FileDO(null, 0, sqlUrl, new Timestamp(System.currentTimeMillis())));
        return getByUrl(sqlUrl);
    }

    @Override
    public void changeFile(String oldFileId, String newFileId) {
        // 更新文件
        FileDO fileDO = getById(newFileId);
        fileDO.setUsed(1);
        updateById(fileDO);
        // 删除旧的文件路径
        FileDO oldFile = getById(oldFileId);
        try {
            FileUtils.delete(new File(GlobalConstant.ROOT_PATH + oldFile.getUrl()));
        } catch (IOException e) {
            e.printStackTrace();
        }
        // 删除旧的文件sql
        removeById(oldFileId);
    }

    // 重命名文件
    private String rename(String filename) {
        String[] arr = filename.split("\\.");
        if (arr.length <= 1) return filename;
        String last = arr[arr.length - 1];
        return System.currentTimeMillis() + "" + MathUtil.random(4) + "." + last;
    }

    // 创建文件夹
    private void createDir(String pathname) {
        File file = new File(pathname);
        if (!file.exists()) file.mkdir();
    }

    // 保存文件到本地
    private void saveFile(MultipartFile file, String pathname) {
        try {
            // 将文件保存到磁盘或执行其他操作，这里只是简单地将文件保存到静态资源目录下
            file.transferTo(new File(pathname));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // 根据url获取文件名
    public String getFileNameByUrl(String url) {
        String[] arr = url.split("/");
        if (arr.length <= 1) return url;
        return arr[arr.length - 1];
    }
}
