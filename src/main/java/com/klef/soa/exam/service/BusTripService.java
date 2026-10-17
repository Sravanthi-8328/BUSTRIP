package com.klef.soa.exam.service;

import java.util.List;
import com.klef.soa.exam.entity.BusTripEntity;

public interface BusTripService {

    BusTripEntity addbustrip(BusTripEntity bustrip);

    List<BusTripEntity> displayAllbustrip();

    String deletebustripById(long id);
}