package com.epam.indigoeln.core.service.print.itext2.utils;

import com.epam.indigoeln.core.service.print.itext2.model.image.PdfImage;
import com.epam.indigoeln.core.service.print.itext2.model.image.PngPdfImage;
import org.apache.commons.io.IOUtils;

import java.io.IOException;
import java.io.InputStream;
import java.io.UncheckedIOException;

public class LogoUtils {
    private static final String LOGO_FILE_NAME = "pdf/logo_new_blue.png";

    private LogoUtils() {
    }

    public static PdfImage loadDefaultLogo() {
        try {
            ClassLoader cl = LogoUtils.class.getClassLoader();
            InputStream resourceAsStream = cl.getResourceAsStream(LOGO_FILE_NAME);
            return new PngPdfImage(IOUtils.toByteArray(resourceAsStream));
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }
}

