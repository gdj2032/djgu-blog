package com.gdj.blog.utils;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.gdj.blog.entity.PageInfo;

public class PageUtils<T> {

    public static <T> PageInfo<T> page2PageInfo(IPage<T> pages) {
        PageInfo<T> pi = new PageInfo<>();
        pi.setData(pages.getRecords());
        pi.setTotal(pages.getTotal());
        pi.setSize(pages.getSize());
        pi.setCurrent(pages.getCurrent() - 1);
        return pi;
    }
}
