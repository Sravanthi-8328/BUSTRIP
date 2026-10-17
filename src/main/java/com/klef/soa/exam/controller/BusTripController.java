
package com.klef.soa.exam.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.klef.soa.exam.entity.BusTripEntity;
import com.klef.soa.exam.service.BusTripService;

@RestController
public class BusTripController {

    private final BusTripService service;

    public BusTripController(BusTripService service) {
        this.service = service;
    }

    @GetMapping("/")
    public String bustrip() {
        return "Bus trip is confirmed successfully";
    }

    @PostMapping("/add")
    public ResponseEntity<BusTripEntity> addbustrip(
            @RequestBody BusTripEntity bustrip) {

        BusTripEntity p = service.addbustrip(bustrip);
        return ResponseEntity.status(201).body(p);
    }

    @GetMapping("/displayall")
    public ResponseEntity<List<BusTripEntity>> displayAllbustrip() {

        List<BusTripEntity> patients = service.displayAllbustrip();
        return ResponseEntity.status(200).body(patients);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deletebustripById(
            @PathVariable Long id) {

        String message = service.deletebustripById(id);
        return new ResponseEntity<>(message, HttpStatus.OK);
    }
}
