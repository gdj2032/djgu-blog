package com.gdj.blog.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PageInfo<T> {
    private List<T> data;
    protected long total;
    protected long size;
    protected long current;

//    public PageInfo(long current, long limit) {
//        this.current = current;
//        this.maxLimit = limit;
//    }
}