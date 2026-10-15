package com.agriconnect.agriconnect_backend.dto;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterFarmer {

    @NotBlank(message = "Name cannot be empty" )
    private String name;

    @NotBlank(message = "email cannot be empty")
    @Email(message = "enter a valid email")
    private String email;

    @NotBlank(message = "password cannot be empty")
    @Size(min=6,message = "Password must be at least 6 character long")
    private String password;
    @NotBlank(message = "phone no cannot be empty")
    private String phone;
    @NotBlank(message = "village cannot be empty")
    private String village;




}
