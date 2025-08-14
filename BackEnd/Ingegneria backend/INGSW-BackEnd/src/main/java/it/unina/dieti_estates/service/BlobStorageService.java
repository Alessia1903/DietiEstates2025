package it.unina.dieti_estates.service;

import com.azure.storage.blob.BlobServiceClient;
import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.UUID;

@Service
public class BlobStorageService {

    @Autowired
    private BlobServiceClient blobServiceClient;

    @Value("${azure.storage.container-name}")
    private String containerName;

    public String uploadFile(MultipartFile multipartFile) throws IOException {
        // Ottieni il container
        BlobContainerClient containerClient = blobServiceClient.getBlobContainerClient(containerName);
        
        // Genera un nome univoco per il file
        String fileName = generateFileName(multipartFile);
        
        // Ottieni il blob client
        BlobClient blobClient = containerClient.getBlobClient(fileName);
        
        // Carica il file
        blobClient.upload(new ByteArrayInputStream(multipartFile.getBytes()), multipartFile.getSize(), true);
        
        // Restituisci l'URL del blob
        return blobClient.getBlobUrl();
    }

    private String generateFileName(MultipartFile multiPart) {
        return String.format("real-estates/%s-%s", 
            UUID.randomUUID().toString(),
            multiPart.getOriginalFilename().replace(" ", "_"));
    }
}
