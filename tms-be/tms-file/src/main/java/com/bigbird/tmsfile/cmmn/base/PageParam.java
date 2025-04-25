package com.tms_file.cmmn.base;

import org.apache.commons.lang.StringUtils;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public final class PageParam implements Serializable {
    private int page = 1;
    private int size = 10;
    private Sort.Direction direction = Sort.Direction.DESC;
    private String sort;
    private String orders;
    private List<Sort.Order> orderList;

    public void setPage(int page) {
        this.page = page <= 0 ? 1 : page;
    }

    public void setSize(int size) {
        int defaultSize = 10;
        int maxSize = 100;
        this.size = size > maxSize ? defaultSize : size;
    }

    public void setDirection(Sort.Direction direction) {
        this.direction = direction;
    }

    public void setSort(String property) {
        this.sort = property;
    }

    public void setOrders(String orders) {
        this.orders = orders;
        if (StringUtils.isNotEmpty(orders)) {
            String[] arrOrder = StringUtils.split(orders, ",");
            orderList = new ArrayList<>();
            for (String order : arrOrder) {
                String[] arrO = StringUtils.split(StringUtils.trim(order), " ");
                if (StringUtils.equals(arrO[1], "desc")) {
                    orderList.add(Sort.Order.desc(arrO[0]));
                } else {
                    orderList.add(Sort.Order.asc(arrO[0]));
                }
            }
        }
    }

    public PageRequest of() {
        if (StringUtils.isNotEmpty(orders)) {
            return PageRequest.of(page - 1, size, Sort.by(orderList));
        }
        if (StringUtils.isNotEmpty(sort)) {
            return PageRequest.of(page - 1, size, direction, sort);
        }
        return PageRequest.of(page - 1, size);
    }

    public Sort by() {
        if (StringUtils.isNotEmpty(orders)) {
            return Sort.by(orderList);
        }
        if (StringUtils.isNotEmpty(sort)) {
            return Sort.by(direction, sort);
        }
        return null;
    }
}
