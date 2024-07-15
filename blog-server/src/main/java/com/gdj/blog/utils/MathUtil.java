package com.gdj.blog.utils;

public class MathUtil {

    /**
     * 随机数num位
     *
     * @param num
     * @return
     */
    public static Long random(int num) {
        long n = (long) Math.pow(10, num);
        return (long) (n + Math.random() * n);
    }

}
