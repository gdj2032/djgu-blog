package com.gdj.blog.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.*;
import lombok.experimental.Accessors;

import java.sql.Timestamp;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Accessors(chain = true)
@ToString(callSuper = true)
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

    public DocumentTagRelationDo(Long id, Timestamp createTime, Timestamp updateTime, Long tagId, Long documentId) {
        super(id, createTime, updateTime);
        this.tagId = tagId;
        this.documentId = documentId;
    }
}
