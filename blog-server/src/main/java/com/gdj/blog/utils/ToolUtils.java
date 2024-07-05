package com.gdj.blog.utils;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.gdj.blog.enums.Data2interfaceEnum;
import com.gdj.blog.exception.BaseResult;
import org.apache.commons.io.FileUtils;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.concurrent.atomic.AtomicReference;

public class ToolUtils {

    private static final String filename = "demo.ts";
    private static final int common_blank = 2;

    public static String data2Interface(Data2interfaceEnum type, Object data) throws Exception {
        if (Objects.isNull(type)) throw BaseResult.NOT_FOUND.message("type不能为空").exception();
        if (Objects.isNull(data)) throw BaseResult.NOT_FOUND.message("data不能为空").exception();
        switch (type) {
            case JAVASCRIPT -> data2JsInterface(JSONObject.parseObject(data.toString()));
            case JAVA -> {
                return "待开发";
            }
        }
        return null;
    }

    private static String data2JsInterface(JSONObject obj) throws Exception {
        String currentDirectory = System.getProperty("user.dir");
        File file = new File(currentDirectory + "/src/main/java/com/gdj/blog/utils/" + filename);
        FileUtils.writeStringToFile(file, "interface IDemo {" + System.lineSeparator(), "UTF-8");
        jsObject2InterfaceFn(file, null, obj, common_blank);
        FileUtils.writeStringToFile(file, "}", "UTF-8", true);
        System.out.println(file.getAbsolutePath());
        return FileUtils.readFileToString(file, "UTF-8");
    }

    private static String data2JavaInterface(Object obj) {
        return null;
    }

    public static void main(String[] args) throws Exception {
        JSONObject obj = file2json("test.json");
        Object interfaceObj = data2JsInterface(obj);
        System.out.println(interfaceObj);
    }

    private static JSONObject file2json(String name) throws IOException {
        String currentDirectory = System.getProperty("user.dir");
        File file = new File(currentDirectory + "/src/main/java/com/gdj/blog/utils/" + name);
        if (file.exists()) {
            String text = FileUtils.readFileToString(file, "UTF-8");
            return JSON.parseObject(text);
        }
        return null;
    }

    private static void jsObject2InterfaceFn(File file, String key, JSONObject value, int blank) {
        System.out.println(value.keySet());
        System.out.println("value: " + value);
        Set<String> keys = value.keySet();
        AtomicReference<String> ctx = new AtomicReference<>(null);

        keys.forEach(e -> {
            Object obj = value.get(e);
            if ((obj instanceof String) || Objects.isNull(obj)) {
                ctx.set(getBlack(blank) + "'" + e + "': string;" + System.lineSeparator());
            } else if (obj instanceof Integer) {
                ctx.set(getBlack(blank) + "'" + e + "': number;" + System.lineSeparator());
            } else if (obj instanceof List<?>) {
                try {
                    jsArray2InterfaceFn(file, e, (List<?>) obj, blank, 1);
                } catch (Exception ex) {
                    throw new RuntimeException(ex);
                }
                return;
            } else if (obj instanceof Boolean) {
                ctx.set(getBlack(blank) + "'" + e + "': boolean;" + System.lineSeparator());
            } else {
                JSONObject jObj = JSONObject.parseObject(obj.toString());
                if (jObj.keySet().isEmpty()) {
                    ctx.set(getBlack(blank) + "'" + e + "': Object;" + System.lineSeparator());
                } else {
                    try {
                        ctx.set(getBlack(blank) + "'" + e + "': {" + System.lineSeparator());
                        FileUtils.writeStringToFile(file, ctx.get(), "UTF-8", true);
                        ctx.set(null);
                        jsObject2InterfaceFn(file, e, jObj, blank + 2);
                    } catch (Exception ex) {
                        throw new RuntimeException(ex);
                    }
                    ctx.set(getBlack(blank) + "}" + System.lineSeparator());
                }
            }
            try {
                if (Objects.nonNull(ctx.get())) {
                    FileUtils.writeStringToFile(file, ctx.get(), "UTF-8", true);
                }
            } catch (IOException ex) {
                throw new RuntimeException(ex);
            }
            ctx.set(null);
        });
    }

    private static void jsArray2InterfaceFn(File file, String key, List<?> value, int blank, int i) throws Exception {
        AtomicReference<String> ctx = new AtomicReference<>(null);
        if (value.isEmpty()) {
            ctx.set(getBlack(blank) + "'" + key + "': string" + getArray(i) + ";" + System.lineSeparator());
        } else if (value.get(0) instanceof Integer) {
            ctx.set(getBlack(blank) + "'" + key + "': number" + getArray(i) + ";" + System.lineSeparator());
        } else if (value.get(0) instanceof String) {
            ctx.set(getBlack(blank) + "'" + key + "': string" + getArray(i) + ";" + System.lineSeparator());
        } else if (value.get(0) instanceof List<?>) {
            jsArray2InterfaceFn(file, key, (List<?>) value.get(0), blank, i + 1);
        } else {
            JSONObject jObj = JSONObject.parseObject(value.get(0).toString());
            if (jObj.keySet().isEmpty()) {
                ctx.set(getBlack(blank) + "'" + key + "': Object" + getArray(i) + ";" + System.lineSeparator());
            } else {
                ctx.set(getBlack(blank) + "'" + key + "': {" + System.lineSeparator());
                FileUtils.writeStringToFile(file, ctx.get(), "UTF-8", true);
                ctx.set(null);
                jsObject2InterfaceFn(file, key, jObj, blank + 2);
                ctx.set(getBlack(blank) + "}" + getArray(i) + ";" + System.lineSeparator());
            }
        }
        try {
            if (Objects.nonNull(ctx.get())) {
                FileUtils.writeStringToFile(file, ctx.get(), "UTF-8", true);
            }
        } catch (IOException ex) {
            throw new RuntimeException(ex);
        }
    }

    private static String getBlack(int n) {
        return " ".repeat(Math.max(0, n / 2));
    }

    private static String getArray(int n) {
        return "[]".repeat(Math.max(0, n));
    }
}
