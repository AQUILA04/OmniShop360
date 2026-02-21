CREATE SEQUENCE IF NOT EXISTS revision_info_seq;

SELECT setval('revision_info_seq', (SELECT COALESCE(MAX(id), 1) FROM revision_info));

ALTER TABLE revision_info ALTER COLUMN id SET DEFAULT nextval('revision_info_seq');
