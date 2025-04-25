package com.bzcom.bzc_be.repository;

import com.bzcom.bzc_be.entity.UserGroupMembership;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserGroupMembershipRepository extends JpaRepository<UserGroupMembership, String> {

    UserGroupMembership findUserGroupMembershipByGroupIdAndUserId(String groupId, String userId);
}
