package com.libraLink.springbootlibrary.utils;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

public class ExtractJWT {

    public static String payloadJWTExtraction(String token, String extraction){
        // Just want token
        token.replace("Bearer ", "");

        // getting 3 parts -> header, payload, signature
        String[] chunks = token.split("\\.");

        Base64.Decoder decoder = Base64.getUrlDecoder();

        // Decode just payload of JWT
        String payload = new String(decoder.decode(chunks[1]));

        // Splitting payload entries so we get each information at payload
        String[] entries = payload.split(",");

        Map<String,String> map = new HashMap<String,String>();
        for (String entry: entries) {
            String[] keyValue = entry.split(":");
            // Get "sub" -> which include userEmail
            if (keyValue[0].equals(extraction)) {

                // Removing all the extras, we just want email
                int remove = 1;

                if (keyValue[1].endsWith("}")) {
                    remove = 2;
                }

                keyValue[1] = keyValue[1].substring(0, keyValue[1].length() - remove);
                keyValue[1] = keyValue[1].substring(1);

                map.put(keyValue[0], keyValue[1]);
            }
        }

        if (map.containsKey(extraction)){
            // Return user email
            return map.get(extraction);
        }

        return null;
    }
}
