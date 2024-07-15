package com.gdj.blog.utils;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.Date;

public class DateUtil {
    public static final String YYYY = "yyyy";
    public static final String MM = "MM";
    public static final String DD = "dd";
    public static final String YMD = "yyyy-MM-dd";
    public static final String YMD_HMS = "yyyy-MM-dd HH:mm:ss";
    public static final String YMD_000 = "yyyy-MM-dd 00:00:00";
    public static final String YMD_end = "yyyy-MM-dd 23:59:59";

    public static Long currentTime() {
        return System.currentTimeMillis();
    }

    public static Long currentTimeZone() {
        return LocalDateTime.now().toInstant(ZoneOffset.of("+8")).toEpochMilli();
    }

    public static String formatDate(LocalDate date, String pattern) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(pattern);
        return date.format(formatter);
    }

    public static String formatDateTime(LocalDateTime time, String pattern) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(pattern);
        return time.format(formatter);
    }

    public static String formatCurrentTime(String pattern) {
        return formatDate(LocalDate.now(), pattern);
    }

    public static Date localDateToDate(LocalDate localDate) {
        return Date.from(localDate.atStartOfDay().atZone(ZoneId.systemDefault()).toInstant());
    }

    public static Date localDateTimeToDate(LocalDateTime localDateTime) {
        return Date.from(localDateTime.atZone(ZoneId.systemDefault()).toInstant());
    }

    public static LocalDate stringToLocalDate(String date) {
        return LocalDate.parse(date);
    }

    public static LocalDateTime stringToLocalDateTime(String date) {
        return LocalDateTime.parse(date);
    }

    public static LocalDate longToLocalDate(long time) {
        return LocalDate.ofInstant(new Date(time).toInstant(), ZoneId.systemDefault());
    }

    public static LocalDateTime longToLocalDateTime(long time) {
        return LocalDateTime.ofInstant(new Date(time).toInstant(), ZoneId.systemDefault());
    }

    public static Long localDateToLong(LocalDate localDate) {
        return Timestamp.valueOf(localDate.atStartOfDay()).getTime();
    }

    public static String localDateToString(LocalDate localDate, String pattern) {
        return localDate.format(DateTimeFormatter.ofPattern(pattern));
    }

    public static Long localDateTimeToLong(LocalDateTime time) {
        return time.toInstant(ZoneOffset.of("+8")).toEpochMilli();
    }

}
