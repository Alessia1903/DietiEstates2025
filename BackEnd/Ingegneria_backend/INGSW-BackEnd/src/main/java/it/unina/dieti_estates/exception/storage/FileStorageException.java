package it.unina.dieti_estates.exception.storage;

import it.unina.dieti_estates.exception.base.DietiEstatesException;

public class FileStorageException extends DietiEstatesException {
    public FileStorageException(String message) {
        super(message, "FILE_STORAGE_ERROR");
    }

    public static FileStorageException uploadFailed(String fileName, String reason) {
        return new FileStorageException(
            String.format("Failed to store file %s: %s", fileName, reason)
        );
    }
}
