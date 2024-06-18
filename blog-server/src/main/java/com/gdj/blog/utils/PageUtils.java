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

//    public static <T> PageInfo<T> getPageInfo(Integer offset, Integer limit, Function<Page<T>, T> fn) {
//        Page<T> page = new Page<>(offset + 1, limit);
//        IPage<T> pages = (IPage<T>) fn.ex(page);
//        return page2PageInfo(pages);
//    }
}
