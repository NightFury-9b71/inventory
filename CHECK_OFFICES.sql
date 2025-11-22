-- Quick check to see offices in the database

-- 1. Check if office table exists and has data
SELECT COUNT(*) as total_offices FROM office;

-- 2. Check active vs inactive offices
SELECT 
    is_active,
    COUNT(*) as count
FROM office
GROUP BY is_active;

-- 3. View all offices with their status
SELECT 
    id,
    name,
    code,
    type,
    parent_id,
    is_active,
    created_at
FROM office
ORDER BY is_active DESC, id;

-- 4. Check if there are any active offices
SELECT 
    id,
    name,
    code,
    type,
    is_active
FROM office
WHERE is_active = TRUE;

-- 5. If no offices exist, here's sample data to insert
/*
INSERT INTO office (name, name_bn, code, type, description, parent_id, order_index, is_active, created_at, updated_at)
VALUES 
('Main Office', 'প্রধান কার্যালয়', 'MAIN', 'INSTITUTE', 'Main Office', NULL, 1, TRUE, NOW(), NOW()),
('Faculty of Engineering', 'প্রকৌশল অনুষদ', 'FE', 'FACULTY', 'Faculty of Engineering', 1, 2, TRUE, NOW(), NOW()),
('Computer Science Department', 'কম্পিউটার বিজ্ঞান বিভাগ', 'CSE', 'DEPARTMENT', 'Computer Science Department', 2, 3, TRUE, NOW(), NOW()),
('Electrical Engineering Department', 'ইলেকট্রিক্যাল প্রকৌশল বিভাগ', 'EEE', 'DEPARTMENT', 'Electrical Engineering Department', 2, 4, TRUE, NOW(), NOW());
*/
