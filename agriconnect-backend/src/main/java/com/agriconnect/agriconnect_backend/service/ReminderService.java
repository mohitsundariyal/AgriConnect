package com.agriconnect.agriconnect_backend.service;

import com.agriconnect.agriconnect_backend.Repository.CropRepository;
import com.agriconnect.agriconnect_backend.Repository.FarmerRepository;
import com.agriconnect.agriconnect_backend.dto.WateringReminderResponse;
import com.agriconnect.agriconnect_backend.entity.Crop;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class ReminderService {

    // placeholder default, the farmer can set an interval per crop, not agronomic advice.
    private static final int DEFAULT_WATERING_INTERVAL_DAYS = 3;

    private final CropRepository cropRepository;
    private final FarmerRepository farmerRepository;

    public ReminderService(CropRepository cropRepository, FarmerRepository farmerRepository) {
        this.cropRepository = cropRepository;
        this.farmerRepository = farmerRepository;
    }

    public List<WateringReminderResponse> getWateringReminders(Long farmerId) {
        if (!farmerRepository.existsById(farmerId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Farmer not found");
        }

        List<Crop> crops = cropRepository.findByFarm_Farmer_Id(farmerId);
        LocalDate today = LocalDate.now();

        List<WateringReminderResponse> reminders = new ArrayList<>();
        for (Crop crop : crops) {
            reminders.add(WateringReminderResponse.from(crop, today, DEFAULT_WATERING_INTERVAL_DAYS));
        }

        reminders.sort(this::compareReminders);
        return reminders;
    }

    public WateringReminderResponse markWatered(Long cropId) {
        Crop crop = cropRepository.findById(cropId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Crop not found"));

        LocalDate today = LocalDate.now();
        crop.setLastWateredDate(today);
        Crop saved = cropRepository.save(crop);

        return WateringReminderResponse.from(saved, today, DEFAULT_WATERING_INTERVAL_DAYS);
    }

    private int compareReminders(WateringReminderResponse a, WateringReminderResponse b) {
        int rankA = statusRank(a.getStatus());
        int rankB = statusRank(b.getStatus());
        if (rankA != rankB) {
            return Integer.compare(rankA, rankB);
        }

        if ("OVERDUE".equals(a.getStatus())) {
            // most days overdue first
            int cmp = Long.compare(b.getDaysOverdue(), a.getDaysOverdue());
            if (cmp != 0) {
                return cmp;
            }
        } else if ("UPCOMING".equals(a.getStatus())) {
            // earliest next date first
            if (a.getNextWateringDate() != null && b.getNextWateringDate() != null) {
                int cmp = a.getNextWateringDate().compareTo(b.getNextWateringDate());
                if (cmp != 0) {
                    return cmp;
                }
            }
        }

        // ties by cropName
        String nameA = a.getCropName() != null ? a.getCropName() : "";
        String nameB = b.getCropName() != null ? b.getCropName() : "";
        int cmp = nameA.compareToIgnoreCase(nameB);
        if (cmp != 0) {
            return cmp;
        }
        return nameA.compareTo(nameB);
    }

    private int statusRank(String status) {
        if ("OVERDUE".equals(status)) return 1;
        if ("DUE_TODAY".equals(status)) return 2;
        if ("NOT_RECORDED".equals(status)) return 3;
        if ("UPCOMING".equals(status)) return 4;
        return 5;
    }
}

