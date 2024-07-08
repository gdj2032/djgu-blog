package com.gdj.blog.utils;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.bean.copier.CopyOptions;

public class MergeUtils {
    private static final CopyOptions options = CopyOptions.create().setIgnoreNullValue(true).setOverride(false);
    private static final CopyOptions optionsAllowOverride = CopyOptions.create().setIgnoreNullValue(true).setOverride(true);

    //将sourceBean中的属性合并到targetBean，忽略Null值，非Null值不允许覆盖
    public static Object merge(Object sourceBean, Object targetBean) {
        BeanUtil.copyProperties(sourceBean, targetBean, options);
        return targetBean;
    }

    //将sourceBean中的属性合并到targetBean，忽略Null值，非Null值允许覆盖
    public static Object mergeAllowOverride(Object sourceBean, Object targetBean) {
        BeanUtil.copyProperties(sourceBean, targetBean, optionsAllowOverride);
        return targetBean;
    }
}
