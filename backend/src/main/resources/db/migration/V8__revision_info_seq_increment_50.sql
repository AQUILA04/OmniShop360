-- Align sequence with Hibernate's default allocation size (50)
ALTER SEQUENCE revision_info_seq INCREMENT 50;

-- Set sequence so next nextval() >= MAX(id)+1 (sequence min value is 1, so use GREATEST)
SELECT setval('revision_info_seq', GREATEST(1, (SELECT COALESCE(MAX(id), 0) FROM revision_info) - 49));
