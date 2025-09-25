-- Fix existing NULL stock values before adding NOT NULL constraint
UPDATE books SET stock = 0 WHERE stock IS NULL;

-- Add any other missing default values for new columns
UPDATE books SET genre = 'General' WHERE genre IS NULL;
UPDATE books SET original_price = price WHERE original_price IS NULL;
