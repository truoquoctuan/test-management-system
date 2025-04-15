package com.tms_run.service.Impl;

import com.tms_run.cmmn.base.BaseCrudService;
import com.tms_run.cmmn.base.PageInfo;
import com.tms_run.cmmn.exception.ResourceNotFoundException;
import com.tms_run.cmmn.util.Constant;
import com.tms_run.dto.CommentDTO;
import com.tms_run.dto.CommentNode;
import com.tms_run.dto.CommentPage;
import com.tms_run.entity.Comment;
import com.tms_run.entity.Users;
import com.tms_run.repository.CommentRepository;
import com.tms_run.repository.IssuesRepository;
import com.tms_run.repository.MemberSettingRepository;
import com.tms_run.repository.TestCaseRepository;
import com.tms_run.service.CommentService;
import com.tms_run.service.MailService;
import com.tms_run.service.UsersService;
import com.tms_run.socket.NotificationService;
import com.tms_run.socket.Notify;
import com.tms_run.socket.NotifyRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.concurrent.Executor;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl extends BaseCrudService<Comment, Long> implements CommentService {
    private final SimpMessagingTemplate messagingTemplate;
    private final CommentRepository commentRepository;
    private final UsersService usersService;
    private final ModelMapper modelMapper;
    private final TestCaseRepository testCaseRepository;
    private final IssuesRepository issuesRepository;
    private final MemberSettingRepository memberSettingRepository;
    private final NotificationService notificationService;
    private final MailService mailService;
    private final NotifyRepository notifyRepository;

    @Override
    public CommentPage getAllComment(Long commentEntityId, Byte type, Integer page, Integer size) {
        Pageable pageable = PageRequest.of(page, size);

        Page<Comment> commentPage = commentRepository.getAllComment(commentEntityId, type, pageable);
        List<CommentDTO> commentDTOList = new ArrayList<>();

        PageInfo pageInfo = new PageInfo(commentPage.getTotalPages(), (int) commentPage.getTotalElements(), commentPage.getNumber(), commentPage.getSize());

        for (Comment comment : commentPage.getContent()) {
            CommentDTO commentDTO = mapCommentToDTO(comment);
            commentDTO.setTotalReplies(commentRepository.getTotalReplies(comment.getCommentId()));
            List<String> userIdRepliedList = commentRepository.getUserRepliedList(comment.getCommentId());
            List<Users> userRepliedList = userIdRepliedList.stream()
                    .map(userId -> usersService.findUserDisabledById(userId))
                    .filter(Objects::nonNull)
                    .toList();
            commentDTO.setUserRepliedList(userRepliedList);
            commentDTOList.add(commentDTO);
        }

        return new CommentPage(commentDTOList, pageInfo);
    }

    private void handleSaveAndSendNotiBasedOnFirstComment(
            Users userCreated, Long testPlanId, Long entityId, String assignIds, Byte commentType) {
        if (assignIds != null && !assignIds.isEmpty()) {
            if (assignIds.contains(",")) {
                List<String> assignIdList = Arrays.stream(assignIds.split(","))
                        .map(id -> id.trim())
                        .collect(Collectors.toList());
                for (String assignId : assignIdList) {
                    saveAndSendNoti(userCreated, testPlanId, assignId, commentType, entityId);
                }
            } else {
                String assignId = assignIds.trim();
                saveAndSendNoti(userCreated, testPlanId, assignId, commentType, entityId);
            }
        }
    }

    private void handleSaveAndSendNotiBasedOnLowerCommentForIssue(
            Users userCreated, Long upperId, Long testPlanId, Long entityId, String assignIds) {
        if (assignIds != null && !assignIds.isEmpty()) {
            if (assignIds.contains(",")) {
                List<String> assignIdList = Arrays.stream(assignIds.split(","))
                        .map(String::trim)
                        .toList();
                for (String assignId : assignIdList) {
                    saveAndSendNoti(userCreated, testPlanId, assignId, (byte) 2, entityId);
                }
            } else {
                String assignId = assignIds.trim();
                if (assignId.equals(commentRepository.getCommentByCommentId(upperId).getUserId())) {
                    saveAndSendNoti(userCreated, testPlanId, assignId, (byte) 2, entityId);
                } else {
                    saveAndSendNoti(userCreated, testPlanId, assignId, (byte) 2, entityId);
                    saveAndSendNotiReply(userCreated, upperId, testPlanId, entityId);
                }
            }
        } else {
            saveAndSendNotiReply(userCreated, upperId, testPlanId, entityId);
        }
    }

    @Override
    public CommentDTO createComment(CommentDTO commentDTO) {
        try {
            Comment comment = modelMapper.map(commentDTO, Comment.class);
            commentRepository.save(comment);
            CommentDTO dto = modelMapper.map(comment, CommentDTO.class);
            Users users = usersService.findUserById(comment.getUserId());
            dto.setUsers(users);
            Long upperId = commentDTO.getCommentUpperId();
            // websocket
            messagingTemplate.convertAndSend("/topic/comment", dto);
            String assignIds = commentDTO.getUserListId();
            Users userCreated = usersService.findUserById(comment.getUserId());
            Long testPlanId;
            if (commentDTO.getCommentType() == 2) {
                testPlanId = issuesRepository.getTestPlanIdByIssuesId(comment.getCommentEntityId());
                if (upperId > 0) {
                    handleSaveAndSendNotiBasedOnLowerCommentForIssue(
                            userCreated, upperId, testPlanId, commentDTO.getCommentEntityId(), assignIds);
                } else {
                    handleSaveAndSendNotiBasedOnFirstComment(
                            userCreated, testPlanId, comment.getCommentEntityId(), assignIds, (byte) 2);
                }
            } else {
                testPlanId = testCaseRepository.getTestPlanIdByTestCaseId(comment.getCommentEntityId());
                handleSaveAndSendNotiBasedOnFirstComment(
                        userCreated, testPlanId, comment.getCommentEntityId(), assignIds, (byte) 1);
            }
            return dto;
        } catch (Exception e) {
            throw new ResourceNotFoundException(e.toString(), "Fail to create comment", commentDTO);
        }
    }

    private void saveAndSendNotiReply(Users creator, Long upperId, Long testPlanId, Long entityId) {
        Comment comment = commentRepository.getCommentByCommentId(upperId);
        String issuesName = issuesRepository.findIssuesByIssuesId(entityId).getIssuesName();
        String creatorOldComment = comment.getUserId();
        if (!Objects.equals(creator.getUserID(), creatorOldComment)) {
            Notify notify = new Notify();
            notify.setUserId(creatorOldComment);
            notify.setSenderId(creator.getUserID());
            notify.setLink("/test-plan/issues/" + testPlanId + "/detail-issues/" + entityId);
            notify.setNotifyContent(String.format(Constant.commentReplyEN, creator.getFullName(), issuesName));
            notifyRepository.save(notify);
            notificationService.sendPrivateNotification(creatorOldComment.toString(), notify.getNotifyContent());
        }
    }

    private void saveAndSendNoti(Users userCreated, Long testPlanId, String assignId, Byte type, Long entityId) {
        String entityName, link, typeOfEntity;
        if (type == 1) {
            entityName = testCaseRepository.findTestCaseById(entityId).getTestCaseName();
            link = "/test-plan/run-result/" + testPlanId;
            typeOfEntity = "test case";
        } else {
            entityName = issuesRepository.findIssuesByIssuesId(entityId).getIssuesName();
            link = "/test-plan/issues/" + testPlanId + "/detail-issues/" + entityId;
            typeOfEntity = "issue";
        }
        Notify notify = new Notify();
        notify.setUserId(assignId);
        notify.setSenderId(userCreated.getUserID());
        notify.setLink(link);
        notify.setNotifyContent(String.format(
                Constant.commentTagEN, userCreated.getFullName(), typeOfEntity, entityName));
        if (!Objects.equals(notify.getUserId(), notify.getSenderId())) {
            String notifySetting = memberSettingRepository.getNotifySettingByUserIdAndTestPlanId(assignId, testPlanId);
            String mailSetting = memberSettingRepository.getMailSettingByUserIdAndTestPlanId(assignId, testPlanId);
            if (notifySetting != null && notifySetting.contains("4")) {
                notify = notifyRepository.save(notify);
                notificationService.sendPrivateNotification(assignId, notify.getNotifyContent());
            }
            if (mailSetting != null && mailSetting.contains("4")) {
                sendMail(assignId, notify.getNotifyContent(), notify.getLink());
            }
        }
    }

    @Override
    public CommentDTO updateComment(CommentDTO commentDTO) {
        try {
            if (!commentRepository.existsById(commentDTO.getCommentId())) {
                throw new ResourceNotFoundException("Comment", "ID", commentDTO.getCommentId());
            }

            Comment comment = commentRepository.findById(commentDTO.getCommentId()).get();

            if (commentDTO.getContent() != null) {
                comment.setContent(commentDTO.getContent());
            }
            if (commentDTO.getUserListId() != null) {
                comment.setUserListId(commentDTO.getUserListId());
            }

            commentRepository.save(comment);
            CommentDTO dto = modelMapper.map(comment, CommentDTO.class);
            // websocket
            messagingTemplate.convertAndSend("/topic/comment", dto);
            return dto;
        } catch (Exception e) {
            throw new ResourceNotFoundException(e.toString(), "Fail to update comment", commentDTO);
        }
    }

    private void sendMail(String userId, String content, String link) {
        ExecutorService executor = Executors.newSingleThreadExecutor();
        try {
            executor.execute(() -> {
                mailService.sendMail(userId, content, link);
            });
        } finally {
            executor.shutdown();
            try {
                if (!executor.awaitTermination(60, TimeUnit.SECONDS)) {
                    executor.shutdownNow();
                }
            } catch (InterruptedException e) {
                executor.shutdownNow();
                Thread.currentThread().interrupt();
            }
        }
    }

    @Override
    public CommentNode getCommentTree(Long parentId, Byte commentType, Integer page, Integer size) {
        Set<Long> visitedCommentIds = new HashSet<>();
        return buildCommentTree(parentId, commentType, visitedCommentIds, page, size);
    }

    @Override
    public void deleteAllCommentsByEntityIdAndType(Long entityId, Integer type) {
        commentRepository.removeCommentsByEntityIdAndType(entityId, type);
    }

    private CommentNode buildCommentTree(Long parentId, Byte commentType, Set<Long> visitedCommentIds, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Comment> replyPage = commentRepository.findRepliesByParentId(parentId, commentType, pageable);

        CommentNode root = new CommentNode(mapCommentToDTO(commentRepository.findById(parentId).get()));
        root.setPageInfo(new PageInfo(replyPage.getTotalPages(), (int) replyPage.getTotalElements(), replyPage.getNumber(), replyPage.getSize()));

        for (Comment reply : replyPage.getContent()) {
            if (!visitedCommentIds.contains(reply.getCommentId())) {
                CommentDTO commentDTO = mapCommentToDTO(reply);
                commentDTO.setTotalReplies(commentRepository.getTotalReplies(commentDTO.getCommentId()));
                CommentNode replyNode = new CommentNode(commentDTO);
                visitedCommentIds.add(reply.getCommentId());
                replyNode.setReplies(buildReplies(reply.getCommentId(), commentType, visitedCommentIds, page, size));
                root.addReply(replyNode);
            }
        }
        return root;
    }

    private List<CommentNode> buildReplies(Long parentId, Byte commentType, Set<Long> visitedCommentIds, int page, int size) {
        List<CommentNode> repliesNodes = new ArrayList<>();
        Pageable pageable = PageRequest.of(page, size);
        Page<Comment> replyPage = commentRepository.findRepliesByParentId(parentId, commentType, pageable);

        for (Comment reply : replyPage.getContent()) {
            if (!visitedCommentIds.contains(reply.getCommentId())) {
                CommentDTO commentDTO = mapCommentToDTO(reply);
                commentDTO.setTotalReplies(commentRepository.getTotalReplies(commentDTO.getCommentId()));
                CommentNode replyNode = new CommentNode(commentDTO);
                visitedCommentIds.add(reply.getCommentId());
                replyNode.setReplies(buildReplies(reply.getCommentId(), commentType, visitedCommentIds, page, size));
                repliesNodes.add(replyNode);
            }
        }
        return repliesNodes;
    }

    private CommentDTO mapCommentToDTO(Comment comment) {
        CommentDTO commentDTO = modelMapper.map(comment, CommentDTO.class);

        // người tạo
        Users user = usersService.findUserDisabledById(comment.getUserId());
        commentDTO.setUsers(user);

        // list người được tag
        List<Users> userListTagInfo = new ArrayList<>();
        if (comment.getUserListId() != null && !comment.getUserListId().isEmpty()) {
            String[] userIdTag = comment.getUserListId().split(",");
            for (String id : userIdTag) {
                Users userTag = usersService.findUserDisabledById(id.trim());
                userListTagInfo.add(userTag);
            }
        }
        commentDTO.setUserListIdInfo(userListTagInfo);

        return commentDTO;
    }
}
