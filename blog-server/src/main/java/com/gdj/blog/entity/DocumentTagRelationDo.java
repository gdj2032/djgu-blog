package com.gdj.blog.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@TableName("document_tag_relation")
public class DocumentTagRelationDo extends BaseEntity {

    /**
     * 标签id
     */
    private Long tagId;
    /**
     * 文档id
     */
    private Long documentId;

    public DocumentTagRelationDo(Long id, Long tagId, Long documentId, Timestamp createTime, Timestamp updateTime) {
        super(id, createTime, updateTime);
        this.setTagId(tagId);
        this.setDocumentId(documentId);
        this.setCreateTime(createTime);
        this.setUpdateTime(updateTime);
    }
}
