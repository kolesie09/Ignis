package com.ignis.API.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.io.ByteArrayOutputStream;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;

import com.google.zxing.WriterException;
import com.ignis.API.entity.Firefighter;
import com.ignis.API.entity.StationInvitation;
import com.ignis.API.repository.FirefighterRepository;
import com.ignis.API.repository.StationInvitationRepository;
import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.BaseFont;
import com.lowagie.text.pdf.PdfWriter;

import com.google.zxing.WriterException;
import java.io.IOException;

@Service
public class InvitationPosterService {

    private final String frontendUrl;
    private final StationInvitationRepository stationInvitationRepository;
    private final QrCodeService qrCodeService;
    private final FirefighterRepository firefighterRepository;

    public InvitationPosterService(@Value("${app.frontend-url}") String frontendUrl, StationInvitationRepository stationInvitationRepository, QrCodeService qrCodeService, FirefighterRepository firefighterRepository) {
        this.frontendUrl = frontendUrl;
        this.stationInvitationRepository = stationInvitationRepository;
        this.qrCodeService = qrCodeService;
        this.firefighterRepository = firefighterRepository;
    }

    @Transactional
    public byte[] generatePoster(String token, String adminLogin) {

        StationInvitation invitation = stationInvitationRepository.findByToken(token)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Nie znaleziono zaproszenia"));

        Firefighter firefighter = firefighterRepository.findByUserLogin(adminLogin).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Nie znaleziono jednostki dla tego strażaka"));

        if (!invitation.getFireStation().getId().equals(firefighter.getFireStation().getId())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Nie znaleziono zaproszenia");
        }

        String url = frontendUrl + "/register?token=" + token;

        byte[] qr = qrCodeService.generatePng(url, 600);

        ByteArrayOutputStream stream = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, stream);
        try {
            document.open();

            BaseFont baseFont = BaseFont.createFont("fonts/DejaVuSans-Bold.ttf", BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
            Font titleFont = new Font(baseFont, 36);

            Paragraph title = new Paragraph("IGNIS", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.close();

        } catch (IOException e) {
            throw new IllegalStateException("Nie udało się wygenerować pliku PDF", e);
        }

        return stream.toByteArray();

    }

}
