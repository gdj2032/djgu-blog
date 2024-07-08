package com.gdj.blog.enums;

import lombok.Getter;

@Getter
public enum Data2interfaceEnum {

    /**
     * TYPESCRIPT
     */
    TYPESCRIPT("TYPESCRIPT"),

    /**
     * JAVA
     */
    JAVA("JAVA");


    private final String value;

    Data2interfaceEnum(String value) {
        this.value = value;
    }

}
