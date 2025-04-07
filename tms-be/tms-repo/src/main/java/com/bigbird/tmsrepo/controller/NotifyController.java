package com.bigbird.tmsrepo.controller;

import com.bigbird.tmsrepo.dto.NotifyPage;
import com.bigbird.tmsrepo.service.MemberSettingService;
import com.bigbird.tmsrepo.socket.NotificationService;
import com.bigbird.tmsrepo.socket.NotifyService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Slf4j
public class NotifyController {
    private final NotifyService notifyService;
    private final NotificationService notificationService;
    private final MemberSettingService memberSettingService;

    /*Lập lịch xóa thông báo cũ sau 30 ngày*/
    @Scheduled(fixedRate = 86400000)
    public void deleteAllNotifyPer30Day() {
        notifyService.deleteAllPer30Days();
        log.info("Delete notify");
    }

//    @MessageMapping("/private-messages")
//    @SendToUser("/topic/private-notify")
//    public ResponseNotify getPrivateMessage(final Notify notify,
//                                            final Principal principal) {
//        notificationService.sendPrivateNotification(principal.getName());
//        return new ResponseNotify(HtmlUtils.htmlEscape(
//                "Sending private message to user " + principal.getName() + ": "
//                        + notify.getNotifyContent())
//        );
//    }

    @SchemaMapping(typeName = "Query", field = "getAllNotifyByUserId")
    public NotifyPage getAllNotifyByUserId(@Argument String userId, @Argument Integer page, @Argument Integer size) {
        log.info("Get notify by userId");
        NotifyPage notifyPage = notifyService.findAll(userId, page, size);
        return notifyPage;
    }

    @SchemaMapping(typeName = "Mutation", field = "markAsRead")
    public String markAsRead(@Argument Long notifyId, @Argument Boolean status) {
        log.info("Mark read notify");
        notifyService.markAsRead(notifyId, status);
        return "Mark read notify successfully";
    }

    @SchemaMapping(typeName = "Mutation", field = "markAllRead")
    public String markAllRead(@Argument String userId) {
        log.info("Mark all read notify");
        notifyService.markAllRead(userId);
        return "Mark read all notify successfully";
    }

    @SchemaMapping(typeName = "Mutation", field = "disableNotify")
    public String disableNotify(@Argument Long notifyId, @Argument Boolean disable) {
        log.info("Disable notify");
        notifyService.disableNotify(notifyId, disable);
        return "Mark read notify successfully";
    }

    @SchemaMapping(typeName = "Mutation", field = "disableAllNotify")
    public String disableAllNotify(@Argument String userId) {
        log.info("Disable all notify");
        notifyService.disableAllNotify(userId);
        return "Mark read all notify successfully";
    }

    @SchemaMapping(typeName = "Query", field = "countNotifyByUserId")
    public Integer countNotifyByUserId(@Argument String userId) {
        log.info("Count notify");
        return notifyService.countNotifyByUserId(userId);
    }

    @SchemaMapping(typeName = "Mutation", field = "checkedAllNotify")
    public String checkedAllNotify(@Argument String userId) {
        log.info("Checked all notify");
        notifyService.checkAllNotifyByUserId(userId);
        return "Checked all notify successfully";
    }

    @SchemaMapping(typeName = "Query", field = "getNotifySetting")
    public String getNotifySetting(@Argument String userId, @Argument Long testPlanId) {
        log.info("Get notify setting");
        return memberSettingService.getNotifySetting(userId, testPlanId);
    }

    @SchemaMapping(typeName = "Query", field = "getMailSetting")
    public String getMailSetting(@Argument String userId, @Argument Long testPlanId) {
        log.info("Get mail setting");
        return memberSettingService.getMailSetting(userId, testPlanId);
    }

    @SchemaMapping(typeName = "Mutation", field = "setNotifySetting")
    public String setNotifySetting(@Argument String userId, @Argument Long testPlanId, @Argument String notifySetting) {
        log.info("Set notify setting");
        return memberSettingService.setNotifySetting(userId, testPlanId, notifySetting);
    }

    @SchemaMapping(typeName = "Mutation", field = "setMailSetting")
    public String setMailSetting(@Argument String userId, @Argument Long testPlanId, @Argument String mailSetting) {
        log.info("Set mail setting");
        return memberSettingService.setMailSetting(userId, testPlanId, mailSetting);
    }
}
