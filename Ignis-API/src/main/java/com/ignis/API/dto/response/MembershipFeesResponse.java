package com.ignis.API.dto.response;

public class MembershipFeesResponse {

    private Long firefighterId;
    private Integer year;
    private Integer price;
    private java.time.LocalDate dateOfPayment;
    private Boolean statusPayment;

    public MembershipFeesResponse(Long firefighterId, Integer year, Integer price, java.time.LocalDate dateOfPayment, Boolean statusPayment) {
        this.firefighterId = firefighterId;
        this.year = year;
        this.price = price;
        this.dateOfPayment = dateOfPayment;
        this.statusPayment = statusPayment;
    }

    public Long getFirefighterId() {
        return firefighterId;
    }

    public Integer getYear() {
        return year;
    }

    public Integer getPrice() {
        return price;
    }

    public java.time.LocalDate getDateOfPayment() {
        return dateOfPayment;
    }

    public Boolean getStatusPayment() {
        return statusPayment;
    }

}
