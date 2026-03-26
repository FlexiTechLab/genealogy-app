-- ROLLBACK;
-- ==================================================
-- SAMPLE DATA - GENEALOGY APPLICATION
-- Nguyen Van Clan - 6 Generations (1850 - 2024)
-- Using UUID v7 (Time-ordered)
-- ==================================================
BEGIN;

-- ==================================================
-- 1. FAMILY TREES
-- ==================================================
INSERT INTO public.trees (id, name, description, owner_id, is_public) VALUES
  ('019d2848-5228-7551-934d-934dae4131fa', 'Gia Phả Dòng Họ Nguyễn Văn',
   'Dòng họ Nguyễn Văn gốc làng Phú Thịnh, Hà Nam, khởi từ đời cụ Nguyễn Văn Đức sinh năm 1850.',
   '019d2848-521b-70e8-91a6-51a6071bfb1a', true),
  ('019d2848-522a-714d-823d-c23dab5f8428', 'Gia Phả Dòng Họ Trần Thị',
   'Dòng họ Trần Thị gốc Nam Định, 4 đời tính từ cụ Trần Văn Minh.',
   '019d2848-521d-7be4-bbae-7baef2ce257b', false);


-- ==================================================
-- 2. BRANCHES (Lineage Sub-divisions)
-- ==================================================
INSERT INTO public.branches (id, tree_id, parent_id, name, description) VALUES
  ('019d2848-522c-7f0f-968d-968d48929b0c', '019d2848-5228-7551-934d-934dae4131fa', NULL,        'Chi Trưởng', 'Con trưởng của cụ Nguyễn Văn Đức, nối dõi tông đường'),
  ('019d2848-522e-7649-983b-d83b18263a19', '019d2848-5228-7551-934d-934dae4131fa', NULL,        'Chi Thứ',    'Con thứ của cụ Nguyễn Văn Đức, lập nghiệp tại Hà Nội'),
  ('019d2848-5230-75e0-b811-781181c3008b', '019d2848-5228-7551-934d-934dae4131fa', NULL,        'Chi Ba',     'Con thứ ba, di cư vào miền Nam năm 1954'),
  ('019d2848-5233-7777-bf44-bf4445f611af', '019d2848-5228-7551-934d-934dae4131fa', '019d2848-522c-7f0f-968d-968d48929b0c','Chi Trưởng - Nhánh Trưởng', 'Con trưởng của Chi Trưởng'),
  ('019d2848-5235-70c6-9ca4-5ca41f31a896', '019d2848-5228-7551-934d-934dae4131fa', '019d2848-522c-7f0f-968d-968d48929b0c','Chi Trưởng - Nhánh Thứ',   'Con thứ của Chi Trưởng');


-- ==================================================
-- 3. PERSONS (Family Members)
-- ==================================================
INSERT INTO public.persons (
  id, tree_id, branch_id,
  full_name, nick_name, gender,
  generation_number, birth_order,
  date_of_birth, date_of_death, is_alive,
  longevity_info, father_id, mother_id, child_type, metadata
) VALUES

-- GENERATION 1 (Ancestors)
('019d2848-5237-7110-9fd0-9fd04dc460b9',  '019d2848-5228-7551-934d-934dae4131fa', '019d2848-522c-7f0f-968d-968d48929b0c', 'Nguyễn Văn Đức', 'Cụ Đức', 1, 1, 1,
 '1850-03-15', '1920-11-02', false,
 'Sống thọ 70 tuổi, mất vào giờ Tý ngày Rằm tháng 10 năm Canh Thân.',
 NULL, NULL, 'biological', '{"hometown":"Làng Phú Thịnh, Hà Nam","occupation":"Làm ruộng"}'),

('019d2848-5239-7c18-9c16-5c1651d42f60',  '019d2848-5228-7551-934d-934dae4131fa', '019d2848-522c-7f0f-968d-968d48929b0c', 'Lê Thị Hoa', 'Cụ Hoa', 0, 1, 1,
 '1855-07-20', '1925-04-10', false,
 'Người phụ nữ đảm đang, tần tảo nuôi dưỡng 5 người con.',
 NULL, NULL, 'biological', '{"hometown":"Làng An Phú, Hà Nam"}'),

-- GENERATION 2
('019d2848-523b-7336-8307-0307990fb436',  '019d2848-5228-7551-934d-934dae4131fa', '019d2848-522c-7f0f-968d-968d48929b0c', 'Nguyễn Văn Tài', 'Ông Tài', 1, 2, 1,
 '1878-01-10', '1950-08-20', false,
 'Con trưởng, nối nghiệp cha, giữ hương hỏa dòng họ.',
 '019d2848-5237-7110-9fd0-9fd04dc460b9', '019d2848-5239-7c18-9c16-5c1651d42f60', 'biological', '{"occupation":"Địa chủ nhỏ","note":"Từng làm lý trưởng"}'),

('019d2848-523d-7141-8530-8530ba59d806',  '019d2848-5228-7551-934d-934dae4131fa', '019d2848-522c-7f0f-968d-968d48929b0c', 'Phạm Thị Lan', 'Bà Lan', 0, 2, 1,
 '1882-05-03', '1955-12-01', false, NULL,
 NULL, NULL, 'biological', '{"hometown":"Làng Yên Bình, Nam Định"}'),

('019d2848-5240-7b6f-a440-a4409ffd9e08',  '019d2848-5228-7551-934d-934dae4131fa', '019d2848-522e-7649-983b-d83b18263a19', 'Nguyễn Văn Lộc', 'Chú Lộc', 1, 2, 2,
 '1882-09-14', '1960-03-22', false,
 'Con thứ, lên Hà Nội lập nghiệp, làm thợ in.',
 '019d2848-5237-7110-9fd0-9fd04dc460b9', '019d2848-5239-7c18-9c16-5c1651d42f60', 'biological', '{"occupation":"Thợ in","note":"Sống ở phố Hàng Bồ, Hà Nội"}'),

('019d2848-5242-7638-8ccb-4ccb980dddae',  '019d2848-5228-7551-934d-934dae4131fa', '019d2848-522e-7649-983b-d83b18263a19', 'Vũ Thị Mai', 'Bà Mai', 0, 2, 1,
 '1885-02-28', '1965-07-15', false, NULL,
 NULL, NULL, 'biological', '{"hometown":"Hà Nội"}'),

('019d2848-5244-7fc6-91af-d1afd454e8a5', '019d2848-5228-7551-934d-934dae4131fa', '019d2848-5230-75e0-b811-781181c3008b', 'Nguyễn Văn Bình', 'Chú Bình', 1, 2, 3,
 '1888-11-05', '1975-01-30', false,
 'Di cư vào Sài Gòn năm 1954, lập nghiệp ở Quận 3.',
 '019d2848-5237-7110-9fd0-9fd04dc460b9', '019d2848-5239-7c18-9c16-5c1651d42f60', 'biological', '{"occupation":"Buôn bán","note":"Sống ở Quận 3, Sài Gòn"}'),

-- GENERATION 3
('019d2848-5246-7342-9b30-5b305755e6e8',  '019d2848-5228-7551-934d-934dae4131fa', '019d2848-5233-7777-bf44-bf4445f611af', 'Nguyễn Văn Hùng', 'Bác Hùng', 1, 3, 1,
 '1910-04-12', '1985-06-30', false,
 'Con trưởng của Chi Trưởng, từng tham gia kháng chiến.',
 '019d2848-523b-7336-8307-0307990fb436', '019d2848-523d-7141-8530-8530ba59d806', 'biological', '{"occupation":"Bộ đội, sau là giáo viên"}'),

('019d2848-5248-7ab3-979d-579ddd52e7fc',  '019d2848-5228-7551-934d-934dae4131fa', '019d2848-5233-7777-bf44-bf4445f611af', 'Đinh Thị Ngọc', 'Bác Ngọc', 0, 3, 1,
 '1915-08-25', '1990-02-14', false, NULL,
 NULL, NULL, 'biological', '{"hometown":"Ninh Bình"}'),

('019d2848-524a-7265-abc0-2bc0681f8c81', '019d2848-5228-7551-934d-934dae4131fa', '019d2848-5235-70c6-9ca4-5ca41f31a896', 'Nguyễn Văn Thịnh', 'Chú Thịnh', 1, 3, 2,
 '1913-12-01', '1980-09-10', false, 'Con thứ của Chi Trưởng.',
 '019d2848-523b-7336-8307-0307990fb436', '019d2848-523d-7141-8530-8530ba59d806', 'biological', '{"occupation":"Nông dân"}'),

('019d2848-524d-7823-8b8d-8b8d7c502881',    '019d2848-5228-7551-934d-934dae4131fa', '019d2848-5235-70c6-9ca4-5ca41f31a896', 'Hoàng Thị Bé', 'Thím Bé', 0, 3, 1,
 '1918-03-07', '1995-11-20', false, NULL,
 NULL, NULL, 'biological', '{}'),

('019d2848-524f-7474-a74d-e74dd6282223',  '019d2848-5228-7551-934d-934dae4131fa', '019d2848-522e-7649-983b-d83b18263a19', 'Nguyễn Văn Dũng', 'Chú Dũng', 1, 3, 1,
 '1915-06-18', '1999-04-05', false, 'Sống ở Hà Nội, làm kế toán.',
 '019d2848-5240-7b6f-a440-a4409ffd9e08', '019d2848-5242-7638-8ccb-4ccb980dddae', 'biological', '{"occupation":"Kế toán"}'),

('019d2848-5251-72d0-8800-c800ce6a3752',   '019d2848-5228-7551-934d-934dae4131fa', '019d2848-522e-7649-983b-d83b18263a19', 'Trần Thị Thu', 'Thím Thu', 0, 3, 1,
 '1920-10-30', NULL, true, NULL,
 NULL, NULL, 'biological', '{"hometown":"Hải Phòng"}'),

-- GENERATION 4
('019d2848-5253-7650-8af7-8af750a721b1',   '019d2848-5228-7551-934d-934dae4131fa', '019d2848-5233-7777-bf44-bf4445f611af', 'Nguyễn Văn Khoa', NULL, 1, 4, 1,
 '1940-02-20', NULL, true, NULL,
 '019d2848-5246-7342-9b30-5b305755e6e8', '019d2848-5248-7ab3-979d-579ddd52e7fc', 'biological', '{"occupation":"Kỹ sư xây dựng","address":"Hà Nội"}'),

('019d2848-5255-7936-b638-763826b32ec9',   '019d2848-5228-7551-934d-934dae4131fa', '019d2848-5233-7777-bf44-bf4445f611af', 'Nguyễn Thị Loan', NULL, 0, 4, 2,
 '1943-07-11', NULL, true, NULL,
 '019d2848-5246-7342-9b30-5b305755e6e8', '019d2848-5248-7ab3-979d-579ddd52e7fc', 'biological', '{"occupation":"Giáo viên","address":"Hà Nam"}'),

('019d2848-5257-7d1c-b8ec-f8ec90ca5ad1',    '019d2848-5228-7551-934d-934dae4131fa', '019d2848-5233-7777-bf44-bf4445f611af', 'Nguyễn Văn Sơn', NULL, 1, 4, 3,
 '1947-09-02', '2010-03-15', false, 'Mất vì bệnh tim.',
 '019d2848-5246-7342-9b30-5b305755e6e8', '019d2848-5248-7ab3-979d-579ddd52e7fc', 'biological', '{"occupation":"Lái xe"}'),

('019d2848-525a-7d86-8fc8-8fc892fbf075',    '019d2848-5228-7551-934d-934dae4131fa', '019d2848-5235-70c6-9ca4-5ca41f31a896', 'Nguyễn Văn Hải', NULL, 1, 4, 1,
 '1942-05-08', NULL, true, NULL,
 '019d2848-524a-7265-abc0-2bc0681f8c81', '019d2848-524d-7823-8b8d-8b8d7c502881', 'biological', '{"occupation":"Nông dân, trồng lúa"}'),

('019d2848-525c-753d-9fe4-9fe43ad42575',   '019d2848-5228-7551-934d-934dae4131fa', '019d2848-5235-70c6-9ca4-5ca41f31a896', 'Nguyễn Thị Hằng', NULL, 0, 4, 2,
 '1945-12-19', NULL, true, NULL,
 '019d2848-524a-7265-abc0-2bc0681f8c81', '019d2848-524d-7823-8b8d-8b8d7c502881', 'biological', '{"occupation":"Buôn bán"}'),

('019d2848-525e-78ed-91c1-91c1f32597f8', '019d2848-5228-7551-934d-934dae4131fa', '019d2848-522e-7649-983b-d83b18263a19', 'Nguyễn Thị Phương', NULL, 0, 4, 1,
 '1948-04-22', NULL, true, NULL,
 '019d2848-524f-7474-a74d-e74dd6282223', '019d2848-5251-72d0-8800-c800ce6a3752', 'biological', '{"occupation":"Bác sĩ","address":"TP. Hồ Chí Minh"}'),

('019d2848-5260-7464-9a73-9a73f504bc1b',   '019d2848-5228-7551-934d-934dae4131fa', '019d2848-522e-7649-983b-d83b18263a19', 'Nguyễn Văn Minh', NULL, 1, 4, 2,
 '1952-08-30', NULL, true, NULL,
 '019d2848-524f-7474-a74d-e74dd6282223', '019d2848-5251-72d0-8800-c800ce6a3752', 'biological', '{"occupation":"Doanh nhân","address":"Hà Nội"}'),

-- Spouses Gen 4 (In-laws)
('019d2848-5262-7cf9-abf2-6bf218ef00fe',   '019d2848-5228-7551-934d-934dae4131fa', NULL, 'Lê Thị Bích', NULL, 0, 4, 1,
 '1942-06-15', NULL, true, NULL,
 NULL, NULL, 'biological', '{"hometown":"Hưng Yên"}'),

('019d2848-5264-7415-9d9a-9d9aa732b32a',   '019d2848-5228-7551-934d-934dae4131fa', NULL, 'Cao Văn Toàn', NULL, 1, 4, 1,
 '1940-01-25', '2005-07-18', false, NULL,
 NULL, NULL, 'biological', '{"hometown":"Nam Định"}'),

('019d2848-5267-7456-800d-000d9067c2e8',  '019d2848-5228-7551-934d-934dae4131fa', NULL, 'Bùi Thị Hương', NULL, 0, 4, 1,
 '1955-03-12', NULL, true, NULL,
 NULL, NULL, 'biological', '{"hometown":"Thái Bình"}'),

-- GENERATION 5
('019d2848-5269-7b1c-9fdc-dfdc58df375c',  '019d2848-5228-7551-934d-934dae4131fa', '019d2848-5233-7777-bf44-bf4445f611af', 'Nguyễn Văn Tuấn', 'Anh Tuấn', 1, 5, 1,
 '1968-11-15', NULL, true, NULL,
 '019d2848-5253-7650-8af7-8af750a721b1', '019d2848-5262-7cf9-abf2-6bf218ef00fe', 'biological', '{"occupation":"Lập trình viên","address":"Hà Nội"}'),

('019d2848-526b-72e5-842d-042d9de5b969',  '019d2848-5228-7551-934d-934dae4131fa', '019d2848-5233-7777-bf44-bf4445f611af', 'Nguyễn Thị Linh', 'Chị Linh', 0, 5, 2,
 '1971-03-08', NULL, true, NULL,
 '019d2848-5253-7650-8af7-8af750a721b1', '019d2848-5262-7cf9-abf2-6bf218ef00fe', 'biological', '{"occupation":"Kế toán","address":"Hà Nội"}'),

('019d2848-526d-7446-9578-d578e5a15fd0',  '019d2848-5228-7551-934d-934dae4131fa', '019d2848-5233-7777-bf44-bf4445f611af', 'Nguyễn Văn Long', 'Anh Long', 1, 5, 3,
 '1975-07-22', NULL, true, NULL,
 '019d2848-5253-7650-8af7-8af750a721b1', '019d2848-5262-7cf9-abf2-6bf218ef00fe', 'biological', '{"occupation":"Giáo viên","address":"Hà Nam"}'),

('019d2848-526f-76bc-9613-d6135a6b7a1a',  '019d2848-5228-7551-934d-934dae4131fa', '019d2848-5233-7777-bf44-bf4445f611af', 'Cao Thị Thùy', NULL, 0, 5, 1,
 '1966-09-30', NULL, true, NULL,
 '019d2848-5264-7415-9d9a-9d9aa732b32a', '019d2848-5255-7936-b638-763826b32ec9', 'biological', '{"occupation":"Y tá","address":"Hà Nam"}'),

('019d2848-5272-7853-bf7c-7f7ce99a0399',  '019d2848-5228-7551-934d-934dae4131fa', '019d2848-522e-7649-983b-d83b18263a19', 'Nguyễn Văn Phúc', 'Phúc', 1, 5, 1,
 '1980-12-01', NULL, true, NULL,
 '019d2848-5260-7464-9a73-9a73f504bc1b', '019d2848-5267-7456-800d-000d9067c2e8', 'biological', '{"occupation":"Backend Developer","address":"TP. Hồ Chí Minh"}'),

('019d2848-5274-758d-bb75-bb75e6238053', '019d2848-5228-7551-934d-934dae4131fa', '019d2848-522e-7649-983b-d83b18263a19', 'Nguyễn Thị Quỳnh', 'Quỳnh', 0, 5, 2,
 '1983-05-17', NULL, true, NULL,
 '019d2848-5260-7464-9a73-9a73f504bc1b', '019d2848-5267-7456-800d-000d9067c2e8', 'biological', '{"occupation":"Bác sĩ","address":"TP. Hồ Chí Minh"}'),

-- Spouses Gen 5/6 (In-laws)
('019d2848-5276-7f61-8d4a-cd4ab295bc90',    '019d2848-5228-7551-934d-934dae4131fa', NULL, 'Trần Thị Hà', NULL, 0, 5, 1,
 '1970-04-18', NULL, true, NULL,
 NULL, NULL, 'biological', '{"hometown":"Hà Nội"}'),

('019d2848-5278-71e3-907a-507a7569af45',  '019d2848-5228-7551-934d-934dae4131fa', NULL, 'Lý Thị Thảo', 'Thảo', 0, 5, 1,
 '1982-02-14', NULL, true, NULL,
 NULL, NULL, 'biological', '{"hometown":"Cần Thơ"}'),

-- GENERATION 6
('019d2848-527a-748b-838b-838b37af4fe6',     '019d2848-5228-7551-934d-934dae4131fa', '019d2848-5233-7777-bf44-bf4445f611af', 'Nguyễn Văn An', 'An', 1, 6, 1,
 '1998-06-10', NULL, true, NULL,
 '019d2848-5269-7b1c-9fdc-dfdc58df375c', '019d2848-5276-7f61-8d4a-cd4ab295bc90', 'biological', '{"occupation":"Sinh viên","university":"ĐH Bách Khoa HN"}'),

('019d2848-527c-737a-9769-17696d7c29e3', '019d2848-5228-7551-934d-934dae4131fa', '019d2848-5233-7777-bf44-bf4445f611af', 'Nguyễn Thị Mai Anh', 'Mai Anh', 0, 6, 2,
 '2002-09-25', NULL, true, NULL,
 '019d2848-5269-7b1c-9fdc-dfdc58df375c', '019d2848-5276-7f61-8d4a-cd4ab295bc90', 'biological', '{"occupation":"Học sinh THPT"}'),

('019d2848-527f-7549-9165-91657d4725eb',    '019d2848-5228-7551-934d-934dae4131fa', '019d2848-522e-7649-983b-d83b18263a19', 'Nguyễn Gia Bảo', 'Bảo', 1, 6, 1,
 '2008-03-20', NULL, true, NULL,
 '019d2848-5272-7853-bf7c-7f7ce99a0399', '019d2848-5278-71e3-907a-507a7569af45', 'biological', '{"school":"Tiểu học Lê Văn Tám"}');


-- ==================================================
-- 4. MARRIAGES
-- ==================================================
INSERT INTO public.marriages (id, tree_id, husband_id, wife_id, marriage_order, marriage_date, divorce_date, note) VALUES
  ('019d2848-5281-7636-9f34-1f341db9c82b',  '019d2848-5228-7551-934d-934dae4131fa', '019d2848-5237-7110-9fd0-9fd04dc460b9',   '019d2848-5239-7c18-9c16-5c1651d42f60',  1, '1872-02-10', NULL, 'Hôn nhân do cha mẹ hai bên sắp xếp theo phong tục làng xã.'),
  ('019d2848-5283-7c3e-8b03-0b03a8204852',  '019d2848-5228-7551-934d-934dae4131fa', '019d2848-523b-7336-8307-0307990fb436',   '019d2848-523d-7141-8530-8530ba59d806',  1, '1901-03-20', NULL, NULL),
  ('019d2848-5285-71fb-956a-556ac71a0551',  '019d2848-5228-7551-934d-934dae4131fa', '019d2848-5240-7b6f-a440-a4409ffd9e08',   '019d2848-5242-7638-8ccb-4ccb980dddae',  1, '1907-11-05', NULL, NULL),
  ('019d2848-5287-7c41-b0f8-f0f8eef7e39a',  '019d2848-5228-7551-934d-934dae4131fa', '019d2848-5246-7342-9b30-5b305755e6e8',  '019d2848-5248-7ab3-979d-579ddd52e7fc', 1, '1935-01-15', NULL, 'Kết hôn sau kháng chiến.'),
  ('019d2848-5289-7314-86ad-46adf60ce9c2',  '019d2848-5228-7551-934d-934dae4131fa', '019d2848-524a-7265-abc0-2bc0681f8c81', '019d2848-524d-7823-8b8d-8b8d7c502881',   1, '1938-08-12', NULL, NULL),
  ('019d2848-528c-7ed3-bec9-fec999101fc1',  '019d2848-5228-7551-934d-934dae4131fa', '019d2848-524f-7474-a74d-e74dd6282223',  '019d2848-5251-72d0-8800-c800ce6a3752',  1, '1945-06-20', NULL, NULL),
  ('019d2848-528e-7491-a080-a080b33b14f3',  '019d2848-5228-7551-934d-934dae4131fa', '019d2848-5253-7650-8af7-8af750a721b1',  '019d2848-5262-7cf9-abf2-6bf218ef00fe', 1, '1965-04-30', NULL, NULL),
  ('019d2848-5290-72bd-acaf-2cafd82d238d',  '019d2848-5228-7551-934d-934dae4131fa', '019d2848-5264-7415-9d9a-9d9aa732b32a',  '019d2848-5255-7936-b638-763826b32ec9', 1, '1963-09-01', NULL, NULL),
  ('019d2848-5292-7418-a3a0-e3a05f4cb2a1',  '019d2848-5228-7551-934d-934dae4131fa', '019d2848-5260-7464-9a73-9a73f504bc1b',  '019d2848-5267-7456-800d-000d9067c2e8',1, '1978-10-10', NULL, NULL),
  ('019d2848-5294-7a73-8599-c599c63c48b1', '019d2848-5228-7551-934d-934dae4131fa', '019d2848-5269-7b1c-9fdc-dfdc58df375c',  '019d2848-5276-7f61-8d4a-cd4ab295bc90',   1, '1995-11-20', NULL, 'Kết hôn tại Hà Nội, đám cưới tổ chức theo phong tục truyền thống.'),
  ('019d2848-5297-75a9-ad43-6d434d0009f4', '019d2848-5228-7551-934d-934dae4131fa', '019d2848-5272-7853-bf7c-7f7ce99a0399',  '019d2848-5278-71e3-907a-507a7569af45', 1, '2007-02-14', NULL, 'Kết hôn tại TP. Hồ Chí Minh.');


-- ==================================================
-- 5. TREE_MEMBERS (User Permissions)
-- ==================================================
INSERT INTO public.tree_members (tree_id, user_id, role) VALUES
  ('019d2848-5228-7551-934d-934dae4131fa', '019d2848-521b-70e8-91a6-51a6071bfb1a', 'owner'),
  ('019d2848-5228-7551-934d-934dae4131fa', '019d2848-521f-789b-a74b-674b7f1d48d8', 'editor'),
  ('019d2848-5228-7551-934d-934dae4131fa', '019d2848-5221-7fe4-b559-b559362cd05b', 'editor'),
  ('019d2848-5228-7551-934d-934dae4131fa', '019d2848-5223-73c1-91eb-51eb5886688c', 'viewer'),
  ('019d2848-5228-7551-934d-934dae4131fa', '019d2848-5226-7372-ab12-6b12f2e465e7', 'viewer'),
  ('019d2848-522a-714d-823d-c23dab5f8428', '019d2848-521d-7be4-bbae-7baef2ce257b', 'owner');


-- ==================================================
-- 6. EVENTS
-- ==================================================
INSERT INTO public.events (id, tree_id, title, description, event_date, is_lunar, event_type, reminder_days) VALUES
  ('019d2848-5299-7d1c-98b0-98b0a1e80d4f', '019d2848-5228-7551-934d-934dae4131fa', 'Giỗ Cụ Nguyễn Văn Đức',
   'Giỗ cụ tổ đời thứ nhất dòng họ Nguyễn Văn. Con cháu tập trung tại nhà thờ họ.',
   '2024-11-02', true, 'death_anniversary', 7),
  ('019d2848-529b-7420-a48b-e48b78cfb0ec', '019d2848-5228-7551-934d-934dae4131fa', 'Giỗ Cụ Bà Lê Thị Hoa',
   'Giỗ cụ bà đời thứ nhất.',
   '2024-04-10', true, 'death_anniversary', 5),
  ('019d2848-529d-7b26-b89e-389e72d0c135', '019d2848-5228-7551-934d-934dae4131fa', 'Họp Mặt Gia Tộc Thường Niên',
   'Họp mặt toàn thể con cháu dòng họ Nguyễn Văn.',
   '2024-01-28', true, 'reunion', 14),
  ('019d2848-529f-7aab-abf4-2bf422e6cc1a', '019d2848-5228-7551-934d-934dae4131fa', 'Khánh Thành Nhà Thờ Họ',
   'Lễ khánh thành nhà thờ họ Nguyễn Văn sau khi tu sửa lớn.',
   '2024-03-15', false, 'ceremony', 30),
  ('019d2848-52a2-7336-89d8-49d8fb0111ee', '019d2848-5228-7551-934d-934dae4131fa', 'Giỗ Ông Nguyễn Văn Tài',
   'Giỗ ông nội của Chi Trưởng.',
   '2024-08-20', true, 'death_anniversary', 5),
  ('019d2848-52a4-7715-afe1-2fe12462394e', '019d2848-5228-7551-934d-934dae4131fa', 'Đám Cưới Nguyễn Văn An',
   'Lễ thành hôn của cháu Nguyễn Văn An - đời thứ 6.',
   '2024-12-08', false, 'wedding', 30);


-- ==================================================
-- 7. CLAN RULES (Bylaws)
-- ==================================================
INSERT INTO public.clan_rules (id, tree_id, branch_id, rule_content, effective_date, is_active) VALUES
  ('019d2848-52a6-7753-a257-e25702a0057f', '019d2848-5228-7551-934d-934dae4131fa', NULL,
   'Con trưởng mỗi đời có trách nhiệm giữ gìn nhà thờ họ, hương hỏa và tổ chức các ngày giỗ tổ theo lịch âm hàng năm.',
   '1900-01-01', true),
  ('019d2848-52a8-72bc-9e7f-9e7fdb5f1c0a', '019d2848-5228-7551-934d-934dae4131fa', NULL,
   'Các thành viên trong dòng họ phải báo cáo việc kết hôn, sinh con, và mất cho Ban Gia Tộc trong vòng 30 ngày để cập nhật gia phả.',
   '2000-01-01', true),
  ('019d2848-52aa-7a92-8a6d-ca6de3223e8c', '019d2848-5228-7551-934d-934dae4131fa', NULL,
   'Không được phép cải đạo hoặc từ bỏ tín ngưỡng thờ cúng tổ tiên truyền thống của dòng họ.',
   '1900-01-01', true),
  ('019d2848-52ac-778a-86f0-46f082dffb1f', '019d2848-5228-7551-934d-934dae4131fa', NULL,
   'Quỹ khuyến học dòng họ: Mỗi gia đình đóng góp 500.000 VNĐ/năm. Con cháu đỗ đại học được thưởng 2.000.000 VNĐ, đỗ thạc sĩ/tiến sĩ được thưởng 5.000.000 VNĐ.',
   '2010-01-01', true),
  ('019d2848-52af-753e-9440-14409a53c59c', '019d2848-5228-7551-934d-934dae4131fa', '019d2848-522c-7f0f-968d-968d48929b0c',
   'Riêng Chi Trưởng: Con trai trưởng trong mỗi thế hệ mang trách nhiệm thờ cúng ông bà Chi Trưởng và quản lý đất hương hỏa 5 sào tại Hà Nam.',
   '1900-01-01', true),
  ('019d2848-52b1-77e7-a0c8-e0c8586603e3', '019d2848-5228-7551-934d-934dae4131fa', NULL,
   'Con gái lấy chồng không được quyền thừa kế tài sản gia tộc. (Quy tắc cũ, đã bãi bỏ năm 1995)',
   '1900-01-01', false);


-- ==================================================
-- 8. FAMILY ASSETS (Physical & Digital)
-- ==================================================
INSERT INTO public.family_assets (id, tree_id, branch_id, asset_type, title, content) VALUES
  ('019d2848-52b3-7e87-ba12-fa1227a616fc', '019d2848-5228-7551-934d-934dae4131fa', '019d2848-522c-7f0f-968d-968d48929b0c', 'land',
   'Đất Hương Hỏa Chi Trưởng',
   'Diện tích 5 sào (~1.800 m²) tại xã Phú Thịnh, huyện Lý Nhân, Hà Nam. Đất ông cha để lại, không được bán hay chuyển nhượng.'),
  ('019d2848-52b5-7909-93f8-13f807b73a5c', '019d2848-5228-7551-934d-934dae4131fa', NULL, 'document',
   'Gia Phả Cổ Viết Tay',
   'Cuốn gia phả viết tay bằng chữ Nôm, ước tính viết vào năm 1900 bởi cụ Nguyễn Văn Tài. Đã được scan số hóa năm 2020.'),
  ('019d2848-52b7-73d8-9ea1-5ea110ceabea', '019d2848-5228-7551-934d-934dae4131fa', NULL, 'building',
   'Nhà Thờ Họ Nguyễn Văn',
   'Nhà thờ họ xây năm 1930, tu sửa lớn năm 2024. Địa chỉ: Xóm 3, xã Phú Thịnh, Hà Nam.'),
  ('019d2848-52b9-74d1-8669-0669d9c1369a', '019d2848-5228-7551-934d-934dae4131fa', NULL, 'document',
   'Bằng Khen Gia Đình Văn Hóa',
   'Bằng khen Gia đình Văn hóa tiêu biểu do UBND tỉnh Hà Nam trao tặng năm 2015.'),
  ('019d2848-52bc-7263-b6c9-76c9baa72ceb', '019d2848-5228-7551-934d-934dae4131fa', '019d2848-522e-7649-983b-d83b18263a19', 'document',
   'Sổ Hộ Khẩu Cũ Chi Thứ - Hà Nội',
   'Sổ hộ khẩu của gia đình Nguyễn Văn Lộc tại phố Hàng Bồ, Hoàn Kiếm, Hà Nội.');


-- ==================================================
-- 9. MEDIA (Photos & Documents)
-- ==================================================
INSERT INTO public.media (id, tree_id, person_id, file_name, file_path, file_type, mime_type, file_size, is_avatar) VALUES
  ('019d2848-52be-7a38-89d5-c9d5e3024270', '019d2848-5228-7551-934d-934dae4131fa', '019d2848-5237-7110-9fd0-9fd04dc460b9',  'cu_nguyen_van_duc.jpg',    'media/trees/tree1/persons/p_duc/avatar.jpg',   'image', 'image/jpeg',       245000, true),
  ('019d2848-52c0-703d-877d-877d9f382718', '019d2848-5228-7551-934d-934dae4131fa', NULL,             'gia_dinh_doi_3_1950.jpg',  'media/trees/tree1/albums/gia_dinh_doi3.jpg',   'image', 'image/jpeg',      1850000, false),
  ('019d2848-52c2-7252-8c5b-0c5b24487694', '019d2848-5228-7551-934d-934dae4131fa', '019d2848-5269-7b1c-9fdc-dfdc58df375c', 'nguyen_van_tuan.jpg',      'media/trees/tree1/persons/p_tuan/avatar.jpg',  'image', 'image/jpeg',       320000, true),
  ('019d2848-52c4-7c68-855b-455bac561cb6', '019d2848-5228-7551-934d-934dae4131fa', NULL,             'hop_mat_gia_toc_2023.jpg', 'media/trees/tree1/albums/hop_mat_2023.jpg',    'image', 'image/jpeg',      5200000, false),
  ('019d2848-52c6-7357-be52-7e52d5c9264f', '019d2848-5228-7551-934d-934dae4131fa', NULL,             'gia_pha_co_scan.pdf',      'media/trees/tree1/documents/gia_pha_co.pdf',   'document', 'application/pdf', 18500000, false),
  ('019d2848-52c8-7449-8d0a-cd0ad32d9c17', '019d2848-5228-7551-934d-934dae4131fa', '019d2848-5272-7853-bf7c-7f7ce99a0399', 'nguyen_van_phuc.jpg',      'media/trees/tree1/persons/p_phuc/avatar.jpg',  'image', 'image/jpeg',       280000, true);


COMMIT;


-- ==================================================
-- DATA VERIFICATION
-- ==================================================
-- Summary of rows per table
SELECT 'trees'         AS "table", COUNT(*) AS rows FROM public.trees        UNION ALL
SELECT 'branches',       COUNT(*) FROM public.branches      UNION ALL
SELECT 'persons',        COUNT(*) FROM public.persons       UNION ALL
SELECT 'marriages',      COUNT(*) FROM public.marriages     UNION ALL
SELECT 'tree_members',   COUNT(*) FROM public.tree_members  UNION ALL
SELECT 'events',         COUNT(*) FROM public.events        UNION ALL
SELECT 'clan_rules',     COUNT(*) FROM public.clan_rules    UNION ALL
SELECT 'family_assets',  COUNT(*) FROM public.family_assets UNION ALL
SELECT 'media',          COUNT(*) FROM public.media
ORDER BY "table";

-- Summary by generation for the primary tree
SELECT generation_number AS doi, COUNT(*) so_nguoi,
       COUNT(*) FILTER (WHERE gender = 1) nam,
       COUNT(*) FILTER (WHERE gender = 0) nu,
       COUNT(*) FILTER (WHERE is_alive)   con_song
FROM public.persons
WHERE tree_id = '019d2848-5228-7551-934d-934dae4131fa'
GROUP BY generation_number ORDER BY generation_number;