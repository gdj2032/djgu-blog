package com.gdj.blog.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import java.util.Date;
import java.util.Map;

public class JwtUtils {
    private static final String signKey = "ggg23333";
    private static final Long expire = Long.valueOf((3600 * 1000));

    /**
     * 生成jwt
     * @param claims
     * @return
     */
    public static String generateJwt(Map<String, Object> claims) {
        final String jwt = Jwts.builder()
                .signWith(SignatureAlgorithm.HS256, signKey) // 签名算法
                .setClaims(claims) // 自定义内容(载荷)
                .setExpiration(new Date(System.currentTimeMillis() + expire)) // 设置过期时间
                .compact();
        return jwt;
    }

    /**
     * 解析jwt
     * @param jwt
     * @return
     */
    public static Claims parseJwt(String jwt) {
        final Claims claims = Jwts.parser()
                .setSigningKey(signKey)
                .parseClaimsJws(jwt)
                .getBody();
        return claims;
    }
}

