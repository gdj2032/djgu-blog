package com.gdj.blog.service;

import com.gdj.blog.dao.IContainerBaseService;
import com.gdj.blog.entity.FileDO;
import org.springframework.web.multipart.MultipartFile;

public interface IFileService extends IContainerBaseService<FileDO> {

    FileDO upload(MultipartFile file);

    FileDO uploadByType(String filename, String type, String content);

    void changeFile(String oldFileId, String newFileId);
}
