package com.gdj.blog.interceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Slf4j
@Component
public class LoginInterceptor implements HandlerInterceptor {

    // 目标资源方法运行前运行,返回 true,放行, false 不放行
    @Override
    public boolean preHandle(HttpServletRequest req, HttpServletResponse res, Object handler) throws Exception {
//        String url = req.getRequestURL().toString();
//        log.info("preHandle: "+ url);
//        if (url.contains("login")) {
//            return true;
//        }
//        String jwt = req.getHeader(GlobalConstant.SESSION);
//        if (!StringUtils.hasLength(jwt)) {
//            log.info("未登录");
//            throw BaseResult.NO_AUTH.message("未登录").exception();
//        }
//        try {
//            JwtUtils.parseJwt(jwt);
//        } catch (Exception e) {
//            e.printStackTrace();
//            log.info("令牌校验失败");
//            throw BaseResult.NO_AUTH.message("未登录").exception();
//        }
//        log.info("令牌校验成功");
        return true;
    }

//    // 目标资源方法运行后运行
//    @Override
//    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
//        log.info("postHandle");
//    }
//
//    // 视图渲染完成后运行,最后运行
//    @Override
//    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
//        log.info("afterCompletion");
//    }
}
