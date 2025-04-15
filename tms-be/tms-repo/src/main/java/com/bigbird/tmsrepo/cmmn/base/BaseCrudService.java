package com.bigbird.tmsrepo.cmmn.base;

import com.bigbird.tmsrepo.payload.response.MessageResponse;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public class BaseCrudService<T, ID> {

    private JpaRepository<T, ID> repository;

    protected void setRepository(JpaRepository<T, ID> repository) {
        this.repository = repository;
    }

    public ResponseEntity<?> select() {
        List<T> result = repository.findAll();
        return ResponseEntity.ok(new Response().setDataList(result).setMessage("Successfully!"));
    }

    public ResponseEntity<?> find(ID seq) {
        Optional<T> entity = repository.findById(seq);
        if (entity.isPresent()) {
            return ResponseEntity.ok(new Response().setData(entity.get()).setMessage("Found!"));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("Can't not found with ID: " + seq));
        }
    }

    public ResponseEntity<?> save(T entity) {
        try {
            T saveEntity = repository.save(entity);
            return ResponseEntity.ok(new Response().setData(saveEntity).setMessage("Saved!"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).body(new MessageResponse("Can't not save entity!"));
        }
    }

    public ResponseEntity<?> delete(ID seq) {
        Optional<T> entity = repository.findById(seq);
        if (entity.isPresent()) {
            repository.deleteById(seq);
            return ResponseEntity.ok(new MessageResponse("Deleted!"));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("Can't not found with ID: " + seq));
        }
    }

    public ResponseEntity<?> update(T entity, ID seq) {
        Optional<T> entityFind = repository.findById(seq);
        if (entityFind.isPresent()) {
            T saveEntity = repository.save(entity);
            return ResponseEntity.ok(new Response().setData(saveEntity).setMessage("Updated!"));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("Can't not found with ID: " + seq));
        }
    }

    public ResponseEntity<?> paging(T entity, Pageable pageable) {
        Page<T> result = repository.findAll(Example.of(entity), pageable);
        return ResponseEntity.ok(new Response().setDataList(result.toList()).setMessage("Successfully!"));
    }
}
