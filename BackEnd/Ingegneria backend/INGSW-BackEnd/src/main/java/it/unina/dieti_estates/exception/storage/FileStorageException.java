package it.unina.dieti_estates.exception.storage;

import it.unina.dieti_estates.exception.base.DietiEstatesException;

public class FileStorageException extends DietiEstatesException {
    public FileStorageException(String message) {
        super(message, "FILE_STORAGE_ERROR");
    }

    public FileStorageException(String message, Throwable cause) {
        super(message, "FILE_STORAGE_ERROR", cause);
    }

    public static FileStorageException uploadFailed(String fileName, String reason) {
        return new FileStorageException(
            String.format("Failed to store file %s: %s", fileName, reason)
        );
    }

    public static FileStorageException downloadFailed(String fileName, String reason) {
        return new FileStorageException(
            String.format("Failed to download file %s: %s", fileName, reason)
        );
    }

    public static FileStorageException invalidFileName(String fileName) {
        return new FileStorageException(
            String.format("Invalid file name: %s", fileName)
        );
    }
}
