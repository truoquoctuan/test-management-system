package com.bigbird.tmsrepo.socket;

import com.bigbird.tmsrepo.cmmn.base.PageInfo;
import com.bigbird.tmsrepo.cmmn.exception.ResourceNotFoundException;
import com.bigbird.tmsrepo.dto.NotifyDTO;
import com.bigbird.tmsrepo.dto.NotifyPage;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotifyServiceImpl implements NotifyService {
    private final NotifyRepository notifyRepository;
    private final ModelMapper modelMapper;

    @Override
    public void deleteAllPer30Days() {
        try {
            LocalDateTime expireDate = LocalDateTime.now().minus(30, ChronoUnit.DAYS);
            List<Notify> notifies = notifyRepository.findRecentNotifies(expireDate);
            notifyRepository.deleteAll(notifies);
        } catch (Exception e) {
            throw new ResourceNotFoundException("", "Can not delete notify recent", e);
        }
    }

    @Override
    public NotifyPage findAll(String userId, Integer page, Integer size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Notify> notifies = notifyRepository.getAllNotifyByUserId(userId, pageable);
            System.out.println("notify: " + notifies);
            List<NotifyDTO> notifyDTOS = notifies.stream().map(notify -> modelMapper.map(notify, NotifyDTO.class)).collect(Collectors.toList());
            PageInfo pageInfo = new PageInfo(notifies.getTotalPages(), (int) notifies.getTotalElements(), notifies.getNumber(), notifies.getSize());
            return new NotifyPage(notifyDTOS, pageInfo);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public NotifyDTO save(Notify notify) {
        try {
            notify = notifyRepository.save(notify);
            return modelMapper.map(notify, NotifyDTO.class);
        } catch (Exception e) {
            throw new ResourceNotFoundException(e.getMessage(), "Can not save notify: ", notify);
        }
    }

    @Override
    public NotifyDTO findById(Long notifyId) {
        try {
            Notify notify = notifyRepository.findByNotifyId(notifyId);
            return modelMapper.map(notify, NotifyDTO.class);
        } catch (Exception e) {
            throw new ResourceNotFoundException(e.getMessage(), "Can not found notify by notifyId: ", notifyId);
        }
    }

    @Override
    public void markAllRead(String userId) {
        try {
            notifyRepository.markAllRead(userId);
        } catch (Exception e) {
            throw new ResourceNotFoundException(e.getMessage(), "Can not mark all read by userId: ", userId);
        }
    }

    @Override
    public void disableNotify(Long notifyId, Boolean disable) {
        try {
            notifyRepository.disableNotify(notifyId, disable);
        } catch (Exception e) {
            throw new ResourceNotFoundException(e.getMessage(), "Can not disable notify by notifyId: ", notifyId);
        }
    }

    @Override
    public void markAsRead(Long notifyId, Boolean status) {
        try {
            notifyRepository.markAsRead(notifyId, status);
        } catch (Exception e) {
            throw new ResourceNotFoundException(e.getMessage(), "Can not mark as read notify by notifyId: ", notifyId);
        }
    }

    @Override
    public void disableAllNotify(String userId) {
        try {
            notifyRepository.disableAllNotify(userId);
        } catch (Exception e) {
            throw new ResourceNotFoundException(e.getMessage(), "Can not disable all notify by userId: ", userId);
        }
    }

    @Override
    public Integer countNotifyByUserId(String userId) {
        try {
            return notifyRepository.countNotifyByUserId(userId);
        } catch (Exception e) {
            throw new ResourceNotFoundException(e.getMessage(), "Can not count notify by userId: ", userId);
        }
    }

    @Override
    public void checkAllNotifyByUserId(String userId) {
        try {
            notifyRepository.checkAllNotifyByUserId(userId);
        } catch (Exception e) {
            throw new ResourceNotFoundException(e.getMessage(), "Can not checked all notify by userId: ", userId);
        }
    }

}
