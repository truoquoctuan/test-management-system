package com.bigbird.tmsrepo.cmmn.base;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

public class BaseCrudController<T, ID> {

    private BaseCrudService<T, ID> service;

    protected void setService(BaseCrudService<T, ID> service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<?> select() {
        return service.select();
    }

    @GetMapping("/{seq}")
    public ResponseEntity<?> find(@PathVariable(value = "seq") ID seq) {
        return service.find(seq);
    }

    @GetMapping("/paging")
    public ResponseEntity<?> paging(T entity, PageParam pageParam) {
        return service.paging(entity, pageParam.of());
    }

    @PostMapping
    public ResponseEntity<?> save(@Valid @RequestBody T entity) {
        return service.save(entity);
    }

    @PutMapping("/{seq}")
    public ResponseEntity<?> update(@PathVariable(value = "seq") ID seq, @Valid @RequestBody T entity) {
        return service.update(entity, seq);
    }

    @DeleteMapping("/{seq}")
    public ResponseEntity<?> delete(@PathVariable(value = "seq") ID seq) {
        return service.delete(seq);
    }

}

