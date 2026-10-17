package com.klef.soa.exam.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class BusTripEntity {
        @Id
        @GeneratedValue(strategy=GenerationType.IDENTITY)
        private long id;
        private String routeName;
        private String travelDate;
        private int passengerCount;
        private boolean delayed;
        
        public long getId() {
            return id;
        }

        public String getTravelDate() {
			return travelDate;
		}

		public void setTravelDate(String travelDate) {
			this.travelDate = travelDate;
		}

		public int getPassengerCount() {
			return passengerCount;
		}

		public void setPassengerCount(int passengerCount) {
			this.passengerCount = passengerCount;
		}

		public boolean isDelayed() {
			return delayed;
		}

		public void setDelayed(boolean delayed) {
			this.delayed = delayed;
		}

		public void setId(long id) {
            this.id = id;
        }

        public String getRouteName() {
            return routeName;
        }

        public void setRouteName(String routeName) {
            this.routeName = routeName;
        }
}

