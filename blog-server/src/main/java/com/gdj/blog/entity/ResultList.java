package com.gdj.blog.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResultList {
    private Long total;
    private Integer pageSize;
    private Integer pageNumber;
    private Object list;
}
