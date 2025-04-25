package com.bzcom.bzc_be.repository;

import com.bzcom.bzc_be.entity.UserAttribute;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserAttributeRepository extends JpaRepository<UserAttribute, String> {

    List<UserAttribute> findUserAttributesByUserId(String userId);


}
