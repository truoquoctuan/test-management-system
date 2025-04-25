package com.bzcom.bzc_be.repository;

import com.bzcom.bzc_be.entity.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WorkspaceRepository extends JpaRepository<Workspace, String> {

    Workspace findWorkspaceByName(String name);
}
