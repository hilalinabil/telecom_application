package com.example.telecom_network.models.enums;

import com.fasterxml.jackson.annotation.JsonValue;

public enum SplitterRatio {
    R_1_8("1:8"),
    R_1_16("1:16"),
    R_1_32("1:32");

    private final String value;

    SplitterRatio(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }
}
