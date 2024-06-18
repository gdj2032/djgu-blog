package com.gdj.blog.exception;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.List;

public class ExceptionHelper {
    public static List<String> getStackTrace(Exception ex) {
        StringWriter writer = new StringWriter();
        ex.printStackTrace(new PrintWriter(writer));
        String[] lines = writer.toString().split("\n");
        List<String> results = new ArrayList<>();
        boolean hitFlag = false;
        for (String line : lines) {
            if (line.contains("com.gdj")) {
                results.add(line);
                hitFlag = true;
            } else if (!hitFlag) {
                results.add(line);
            }
        }
        return results;
    }
}
