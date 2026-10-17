
package com.klef.soa.exam.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.klef.soa.exam.entity.BusTripEntity;
import com.klef.soa.exam.repository.BusTripRepository;

@Service
public class BusTripServiceImpl implements BusTripService {

    @Autowired
    private BusTripRepository repo;

    @Override
    public BusTripEntity addbustrip(BusTripEntity bustrip) {
        return repo.save(bustrip);
    }

    @Override
    public List<BusTripEntity> displayAllbustrip() {
        return repo.findAll();
    }

  

    @Override
     public String deletebustripById(long id) {
    if (repo.existsById(id)) {
        repo.deleteById(id);
        return "Bus trip deleted successfully";
    }

    return "Bus trip not found";
}

}
