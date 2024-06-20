package com.gdj.blog.utils;

import com.gdj.blog.constant.GlobalConstant;
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
        return request.getHeader(GlobalConstant.SESSION);
    }

    public static void setUserInfo(User user) {
        if (user != null) {
            Map<String, Object> m = new HashMap<>();
            m.put(GlobalConstant.SESSION_ID, user.getId());
            m.put(GlobalConstant.SESSION_USERNAME, user.getUsername());
            m.put(GlobalConstant.SESSION, user.getSession());
            String jwt = JwtUtils.generateJwt(m);
            user.setSession(jwt);
        }
    }

    public static User getUserInfo() {
        String session = getSession();
        if (session == null) return null;
        try {
            Claims claims = JwtUtils.parseJwt(session);
            User user = new User();
            user.setId(Long.parseLong(claims.get(GlobalConstant.SESSION_ID).toString()));
            user.setUsername((String) claims.get(GlobalConstant.SESSION_USERNAME));
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
