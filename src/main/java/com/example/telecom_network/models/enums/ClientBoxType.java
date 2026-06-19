package com.example.telecom_network.models.enums;

import com.fasterxml.jackson.annotation.JsonValue;

public enum ClientBoxType {
    FO_16("16FO"),
    FO_24("24FO");

    private final String value;

    ClientBoxType(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }
}
