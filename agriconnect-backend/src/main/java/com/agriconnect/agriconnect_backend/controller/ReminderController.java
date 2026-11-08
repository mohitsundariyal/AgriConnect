package com.agriconnect.agriconnect_backend.controller;

import com.agriconnect.agriconnect_backend.dto.WateringReminderResponse;
import com.agriconnect.agriconnect_backend.service.ReminderService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reminders")
public class ReminderController {

    private final ReminderService reminderService;

    public ReminderController(ReminderService reminderService) {
        this.reminderService = reminderService;
    }

    @GetMapping("/watering/farmer/{farmerId}")
    public List<WateringReminderResponse> getWateringReminders(@PathVariable Long farmerId) {
        return reminderService.getWateringReminders(farmerId);
    }

    @PostMapping("/watering/crop/{cropId}/done")
    public WateringReminderResponse markWatered(@PathVariable Long cropId) {
        return reminderService.markWatered(cropId);
    }
}

