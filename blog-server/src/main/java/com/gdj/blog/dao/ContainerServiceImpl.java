package com.gdj.blog.dao;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

public class ContainerServiceImpl<M extends ContainerBaseMapper<T>, T>
        extends ServiceImpl<M, T> implements IContainerBaseService<T> {
}
