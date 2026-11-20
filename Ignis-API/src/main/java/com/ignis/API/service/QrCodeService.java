package com.ignis.API.service;

import java.io.ByteArrayOutputStream;

import org.springframework.stereotype.Service;
import com.google.zxing.WriterException;
import java.io.IOException;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;

@Service
public class QrCodeService {

    public byte[] generatePng(String text, int size) {
        ByteArrayOutputStream stream = new ByteArrayOutputStream();
        try {
            BitMatrix qrCode = new QRCodeWriter().encode(text, BarcodeFormat.QR_CODE, size, size);

            MatrixToImageWriter.writeToStream(qrCode, "PNG", stream);
        } catch (WriterException | IOException e) {
            throw new IllegalStateException("Nie udało się wygenerować kodu QR", e);
        }

        return stream.toByteArray();
    }

}
