package com.agriconnect.agriconnect_backend.dto;

import com.agriconnect.agriconnect_backend.entity.Crop;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Getter
@Setter
public class WateringReminderResponse {

    private Long cropId;
    private String cropName;
    private Long farmId;
    private String farmName;
    private Integer wateringIntervalDays;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate lastWateredDate;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate nextWateringDate;

    private long daysOverdue;
    private String status;

    public static WateringReminderResponse from(Crop crop, LocalDate today) {
        return from(crop, today, 3);
    }

    public static WateringReminderResponse from(Crop crop, LocalDate today, int defaultInterval) {
        if (crop == null) {
            return null;
        }

        WateringReminderResponse r = new WateringReminderResponse();
        r.setCropId(crop.getId());
        r.setCropName(crop.getCropName());
        r.setFarmId(crop.getFarm() != null ? crop.getFarm().getId() : null);
        r.setFarmName(crop.getFarm() != null ? crop.getFarm().getFarmName() : null);

        int interval = crop.getWateringIntervalDays() != null ? crop.getWateringIntervalDays() : defaultInterval;
        r.setWateringIntervalDays(interval);

        LocalDate lastWatered = crop.getLastWateredDate();
        r.setLastWateredDate(lastWatered);

        if (lastWatered == null) {
            r.setStatus("NOT_RECORDED");
            r.setNextWateringDate(null);
            r.setDaysOverdue(0);
        } else {
            LocalDate next = lastWatered.plusDays(interval);
            r.setNextWateringDate(next);

            if (next.isBefore(today)) {
                r.setStatus("OVERDUE");
                r.setDaysOverdue(ChronoUnit.DAYS.between(next, today));
            } else if (next.isEqual(today)) {
                r.setStatus("DUE_TODAY");
                r.setDaysOverdue(0);
            } else {
                r.setStatus("UPCOMING");
                r.setDaysOverdue(0);
            }
        }

        return r;
    }
}

