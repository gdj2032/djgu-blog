package com.gdj.blog.utils;

import com.gdj.blog.common.GlobalCommon;
import com.gdj.blog.entity.User;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.HashMap;
import java.util.Map;

@Slf4j
public class CurrentLoginInfo {

    public static String getSession() {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        return request.getHeader(GlobalCommon.SESSION);
    }

    public static void setUserInfo(User user) {
        if (user != null) {
            Map<String, Object> m = new HashMap<>();
            m.put("id", user.getId());
            m.put("username", user.getUsername());
            m.put("session", user.getSession());
            String jwt = JwtUtils.generateJwt(m);
            user.setSession(jwt);
        }
    }

    public static User getUserInfo() {
        String session = getSession();
        if (session == null) return null;
        try {
            Claims claims = JwtUtils.parseJwt(session);
            log.info(String.valueOf(claims));
            User user = new User();
            user.setId((String) claims.get("id"));
            user.setUsername((String) claims.get("username"));
            log.info(String.valueOf(user));
            return user;
        } catch (Exception e) {
            e.printStackTrace();
            log.info("无用户信息或令牌校验失败");
        }
        return null;
    }

    public static boolean isLogin() {
        return getUserInfo() != null;
    }
}
