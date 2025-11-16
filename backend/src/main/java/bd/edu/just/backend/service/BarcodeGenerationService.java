package bd.edu.just.backend.service;

import bd.edu.just.backend.repository.ItemInstanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashSet;
import java.util.Set;

@Service
public class BarcodeGenerationService {

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("yyyyMMdd");
    
    @Autowired
    private ItemInstanceRepository itemInstanceRepository;

    /**
     * Generate a unique barcode for an item instance
     * Format: {DATE}-{ITEMCODE}-{ITEMCOUNT}
     * Example: 20241111-ITM001-000001
     */
    public synchronized String generateBarcode(String itemCode) {
        String barcode;
        int attempts = 0;
        final int MAX_ATTEMPTS = 1000;

        do {
            barcode = createBarcode(itemCode);
            attempts++;

            if (attempts > MAX_ATTEMPTS) {
                throw new RuntimeException("Failed to generate unique barcode after " + MAX_ATTEMPTS + " attempts");
            }
        } while (itemInstanceRepository.existsByBarcode(barcode));

        return barcode;
    }

    private String createBarcode(String itemCode) {
        // Get current date in YYYYMMDD format
        String datePart = LocalDate.now().format(DATE_FORMAT);

        // Get item code (clean and uppercase)
        String cleanItemCode = itemCode.replaceAll("[^A-Za-z0-9]", "").toUpperCase();

        // Count existing barcodes for this item code today
        String barcodePrefix = String.format("%s-%s-", datePart, cleanItemCode);
        long count = itemInstanceRepository.countByBarcodeStartingWith(barcodePrefix);
        
        // Get next item count for today (6 digits, zero-padded)
        String countPart = String.format("%06d", count + 1);

        // Combine parts
        return String.format("%s-%s-%s",
            datePart,
            cleanItemCode,
            countPart);
    }

    /**
     * Generate multiple unique barcodes for a quantity
     */
    public Set<String> generateBarcodes(String itemCode, int quantity) {
        Set<String> barcodes = new HashSet<>();
        
        for (int i = 0; i < quantity; i++) {
            String barcode = generateBarcode(itemCode);
            barcodes.add(barcode);
        }
        
        return barcodes;
    }

    /**
     * Deprecated: No longer needed with database-backed barcode generation
     */
    @Deprecated
    public void clearCache() {
        // No-op: no cache to clear
    }

    /**
     * Deprecated: No longer needed with database-backed barcode generation
     */
    @Deprecated
    public void resetDailyCounter() {
        // No-op: no counter to reset
    }
}
