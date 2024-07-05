package com.gdj.blog.enums;

public enum Data2interfaceEnum {

    /**
     * JS
     */
    JAVASCRIPT("JS"),

    /**
     * JAVA
     */
    JAVA("JAVA");


    private final String value;

    Data2interfaceEnum(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
