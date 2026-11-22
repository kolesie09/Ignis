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

import com.lowagie.text.Image;

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
    public byte[] generatePoster(String token, String adminLogin, boolean isSuperAdmin) {

        StationInvitation invitation = stationInvitationRepository.findByToken(token)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Nie znaleziono zaproszenia"));

        if (!isSuperAdmin) {
            Firefighter firefighter = firefighterRepository.findByUserLogin(adminLogin).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Nie znaleziono jednostki dla tego strażaka"));

            if (!invitation.getFireStation().getId().equals(firefighter.getFireStation().getId())) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Nie znaleziono zaproszenia");
            }
        }

        String url = frontendUrl + "/register?token=" + token;

        byte[] qr = qrCodeService.generatePng(url, 600);

        ByteArrayOutputStream stream = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, stream);
        try {
            document.open();

            BaseFont baseFont = BaseFont.createFont("fonts/DejaVuSans.ttf", BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
            Font titleFont = new Font(baseFont, 30);

            Image logo = Image.getInstance(getClass().getResource("/images/Ignis.png"));

            logo.scaleToFit(120, 120);

            logo.setAlignment(Element.ALIGN_CENTER);
            document.add(logo);

            Paragraph title = new Paragraph("Zeskanuj kod QR i zarejestruj się! ", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingBefore(10);
            title.setSpacingAfter(10);
            document.add(title);

            Image qrCode = Image.getInstance(qr);
            qrCode.setAlignment(Element.ALIGN_CENTER);
            qrCode.scaleAbsolute(250, 250);
            document.add(qrCode);

            Paragraph fireStationParagraph = new Paragraph("Jednostka " + invitation.getFireStation().getName(), new Font(baseFont, 18));
            fireStationParagraph.setAlignment(Element.ALIGN_CENTER);
            fireStationParagraph.setSpacingBefore(20);

            document.add(fireStationParagraph);
            document.close();

        } catch (IOException e) {
            throw new IllegalStateException("Nie udało się wygenerować pliku PDF", e);
        }

        return stream.toByteArray();

    }

}
