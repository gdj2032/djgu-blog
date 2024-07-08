package com.gdj.blog.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@TableName("document_tag_relation")
public class DocumentTagRelationDo implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;
    /**
     * 标签id
     */
    private Long tagId;
    /**
     * 文档id
     */
    private Long documentId;
}
