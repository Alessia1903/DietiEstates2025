package it.unina.dieti_estates.tests.service;

import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobServiceClient;
import it.unina.dieti_estates.service.BlobStorageService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class BlobStorageServiceTest {

    private static final String TEST_CONTAINER = "test-container";

    @Mock
    private BlobServiceClient blobServiceClient;
    @Mock
    private BlobContainerClient blobContainerClient;
    @Mock
    private BlobClient blobClient;
    @Mock
    private MultipartFile multipartFile;

    @InjectMocks
    private BlobStorageService blobStorageService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        ReflectionTestUtils.setField(blobStorageService, "containerName", TEST_CONTAINER);
    }

    @Test
    void uploadFileSuccess() throws IOException {
        byte[] fileBytes = "test".getBytes();
        when(blobServiceClient.getBlobContainerClient(TEST_CONTAINER)).thenReturn(blobContainerClient);
        when(multipartFile.getOriginalFilename()).thenReturn("file.txt");
        when(multipartFile.getBytes()).thenReturn(fileBytes);
        when(multipartFile.getSize()).thenReturn((long) fileBytes.length);
        when(blobContainerClient.getBlobClient(anyString())).thenReturn(blobClient);
        when(blobClient.getBlobUrl()).thenReturn("https://fakeurl/blob/file.txt");

        String url = blobStorageService.uploadFile(multipartFile);

        verify(blobClient).upload(any(ByteArrayInputStream.class), eq((long) fileBytes.length), eq(true));
        assertTrue(url.contains("https://fakeurl/blob/"));
    }

    @Test
    void uploadFileThrowsIOException() throws IOException {
        when(blobServiceClient.getBlobContainerClient(TEST_CONTAINER)).thenReturn(blobContainerClient);
        when(multipartFile.getOriginalFilename()).thenReturn("file.txt");
        when(multipartFile.getBytes()).thenThrow(new IOException("IO error"));

        assertThrows(IOException.class, () -> blobStorageService.uploadFile(multipartFile));
    }

    @Test
    void generateFileNameFormat() {
        when(multipartFile.getOriginalFilename()).thenReturn("file with space.txt");
        String fileName = ReflectionTestUtils.invokeMethod(blobStorageService, "generateFileName", multipartFile);
        assertTrue(fileName.startsWith("real-estates/"));
        assertTrue(fileName.endsWith("file_with_space.txt"));
    }

    @Test
    void generateFileNameThrowsIfNoOriginalName() {
        when(multipartFile.getOriginalFilename()).thenReturn(null);
        assertThrows(IllegalArgumentException.class, () ->
            ReflectionTestUtils.invokeMethod(blobStorageService, "generateFileName", multipartFile)
        );
    }
}
