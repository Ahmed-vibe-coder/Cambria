-- ============================================================================
-- CAMBRIA INTERNATIONAL COLLEGE PLATFORM — SEED DATA
-- Version: seed.sql
-- Generated for Supabase Cloud Database Provisioning
-- ============================================================================

-- SET session_replication_role = 'replica'; -- Not needed and requires superuser on Supabase Cloud

-- ----------------------------------------------------------------------------
-- Table: programs (4 rows)
-- ----------------------------------------------------------------------------
INSERT INTO public.programs (id, code, name, name_ar, degree_level, description, description_ar, duration, credits, is_active, created_at, updated_at)
VALUES ('a0000000-0000-0000-0000-000000000001', 'EMBA-701', 'Executive Leadership & Educational Governance', 'القيادة التنفيذية والحوكمة التعليمية', 'professional_masters', 'A postgraduate curriculum designed for senior academic administrators, provosts, and institutional directors focusing on higher education policy, ethics, and strategic institutional governance.', 'منهج دراسي عالي المستوى مصمم للقيادات الأكاديمية ومدراء المؤسسات يركز على سياسات التعليم العالي والحوكمة الاستراتيجية.', '18 Months (Full-Time)', 60, true, '2026-09-26T08:48:27.342Z', '2026-09-26T08:48:27.342Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.programs (id, code, name, name_ar, degree_level, description, description_ar, duration, credits, is_active, created_at, updated_at)
VALUES ('a0000000-0000-0000-0000-000000000002', 'IBDS-501', 'International Business Administration & Digital Strategy', 'إدارة الأعمال الدولية والاستراتيجية الرقمية', 'professional_diploma', 'Comprehensive professional diploma covering transnational trade, corporate finance, digital enterprise transformation, and multinational organizational leadership.', 'دبلوم مهني شامل يغطي التجارة الدولية والتحول الرقمي للشركات وإدارة المؤسسات متعددة الجنسيات.', '12 Months (Full-Time)', 36, true, '2026-09-26T08:48:27.482Z', '2026-09-26T08:48:27.482Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.programs (id, code, name, name_ar, degree_level, description, description_ar, duration, credits, is_active, created_at, updated_at)
VALUES ('a0000000-0000-0000-0000-000000000003', 'CYBR-301', 'Advanced Cybersecurity & Cloud Defense Systems', 'الأمن السيبراني المتقدم وأنظمة الدفاع السحابي', 'training_course', 'Rigorous technical specialization course covering threat modeling, zero-trust infrastructure architecture, incident response protocols, and security compliance.', 'برنامج تدريبي تقني مكثف يشمل نمذجة التهديدات وبنية الثقة الصفرية وبروتوكولات الاستجابة للحوادث.', '16 Weeks (Intensive)', 16, true, '2026-09-26T08:48:27.486Z', '2026-09-26T08:48:27.486Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.programs (id, code, name, name_ar, degree_level, description, description_ar, duration, credits, is_active, created_at, updated_at)
VALUES ('a0000000-0000-0000-0000-000000000004', 'AIMS-601', 'Applied Artificial Intelligence & Data Architecture', 'الذكاء الاصطناعي التطبيقي وهندسة البيانات', 'professional_masters', 'Advanced graduate program spanning deep learning system design, scalable data engineering, natural language processing, and ethical AI deployment in enterprise contexts.', 'برنامج ماجستير مهني متقدم يغطي تصميم أنظمة التعلم العميق وهندسة البيانات الضخمة وأخلاقيات الذكاء الاصطناعي.', '24 Months', 64, true, '2026-09-26T08:48:27.490Z', '2026-09-26T08:48:27.490Z')
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- Table: templates (5 rows)
-- ----------------------------------------------------------------------------
INSERT INTO public.templates (id, code, name, template_kind, width, height, background_image_url, layout_schema, is_active, created_at, updated_at)
VALUES (
  'c0000000-0000-0000-0000-000000000001',
  'CERT_LANDSCAPE_GEOMETRIC',
  'Modern Geometric Certificate of Completion (Landscape)',
  'certificate',
  2000,
  1414,
  'https://res.cloudinary.com/kwe1gmrq/image/upload/v1790515734/cambria/templates/cert_landscape_geometric_master.png',
  '{"width":2000,"height":1414,"template_kind":"certificate","background_color":"#FFFFFF","background_image_url":"https://res.cloudinary.com/kwe1gmrq/image/upload/v1790515734/cambria/templates/cert_landscape_geometric_master.png","fields":[{"id":"student_name_en","type":"text","x":200,"y":580,"w":1600,"h":110,"font":"Cormorant Garamond","size":68,"weight":700,"color":"#000000","align":"center","contentKey":"student_name_en"},{"id":"statement","type":"text","x":250,"y":730,"w":1500,"h":55,"font":"Montserrat","size":22,"weight":500,"color":"#0F172A","align":"center","staticText":"Has successfully completed the college training program, passed the final examinations, and has been awarded the degree of"},{"id":"program_name_en","type":"text","x":200,"y":810,"w":1600,"h":85,"font":"Cormorant Garamond","size":52,"weight":700,"color":"#020B5A","align":"center","contentKey":"program_name_en"},{"id":"credential_number","type":"text","x":420,"y":920,"w":700,"h":35,"font":"Montserrat","size":22,"weight":700,"color":"#0F172A","align":"left","contentKey":"credential_number","staticPrefix":"Certificate Number: "},{"id":"grade","type":"text","x":420,"y":960,"w":700,"h":35,"font":"Montserrat","size":22,"weight":600,"color":"#0F172A","align":"left","contentKey":"grade","staticPrefix":"Grade: "},{"id":"issue_date","type":"text","x":420,"y":1000,"w":700,"h":35,"font":"Montserrat","size":22,"weight":600,"color":"#0F172A","align":"left","contentKey":"issue_date","staticPrefix":"CER.Date: "},{"id":"verification_notice","type":"text","x":420,"y":1040,"w":900,"h":35,"font":"Montserrat","size":20,"weight":600,"color":"#0F172A","align":"left","contentKey":"verification_notice","staticPrefix":"To confirm certificate visit: "},{"id":"qr_code","type":"qr","x":1380,"y":1180,"w":130,"h":130,"borderRadius":4,"contentKey":"verification_url"}]}'::jsonb,
  true,
  '2026-09-26T08:48:27.554Z',
  '2026-09-26T08:48:27.554Z'
)
ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  name = EXCLUDED.name,
  template_kind = EXCLUDED.template_kind,
  width = EXCLUDED.width,
  height = EXCLUDED.height,
  background_image_url = EXCLUDED.background_image_url,
  layout_schema = EXCLUDED.layout_schema,
  is_active = EXCLUDED.is_active;

INSERT INTO public.templates (id, code, name, template_kind, width, height, background_image_url, layout_schema, is_active, created_at, updated_at)
VALUES (
  'c0000000-0000-0000-0000-000000000002',
  'CARD_CR80_EXECUTIVE',
  'Official Student Identification Card (CR80 Executive)',
  'student_card',
  1013,
  638,
  'https://res.cloudinary.com/kwe1gmrq/image/upload/v1790515732/cambria/templates/id_card_cr80_master.png',
  '{"width":1013,"height":638,"template_kind":"student_card","background_color":"#FFFFFF","background_image_url":"https://res.cloudinary.com/kwe1gmrq/image/upload/v1790515732/cambria/templates/id_card_cr80_master.png","fields":[{"id":"student_photo","type":"image","x":17,"y":190,"w":294,"h":392,"borderRadius":24,"contentKey":"student_photo"},{"id":"student_name","type":"text","x":505,"y":292,"w":350,"h":35,"font":"Montserrat","size":24,"weight":700,"color":"#07133F","align":"left","contentKey":"student_name_en","staticPrefix":": "},{"id":"student_national_id","type":"text","x":505,"y":338,"w":350,"h":35,"font":"Montserrat","size":22,"weight":600,"color":"#07133F","align":"left","contentKey":"student_national_id","staticPrefix":": "},{"id":"student_country","type":"text","x":505,"y":384,"w":350,"h":35,"font":"Montserrat","size":22,"weight":600,"color":"#07133F","align":"left","contentKey":"student_country","staticPrefix":": "},{"id":"degree_level","type":"text","x":505,"y":430,"w":350,"h":35,"font":"Montserrat","size":22,"weight":600,"color":"#07133F","align":"left","contentKey":"degree_level","staticPrefix":": "},{"id":"specialization","type":"text","x":505,"y":476,"w":350,"h":35,"font":"Montserrat","size":20,"weight":600,"color":"#07133F","align":"left","contentKey":"specialization","staticPrefix":": "},{"id":"expiry_date","type":"text","x":485,"y":596,"w":160,"h":28,"font":"Montserrat","size":22,"weight":700,"color":"#07133F","align":"left","contentKey":"expiry_date"},{"id":"qr_code","type":"qr","x":665,"y":514,"w":66,"h":66,"borderRadius":4,"contentKey":"verification_url"},{"id":"credential_number","type":"text","x":760,"y":550,"w":235,"h":30,"font":"Montserrat","size":20,"weight":700,"color":"#07133F","align":"center","contentKey":"credential_number"}]}'::jsonb,
  true,
  '2026-09-26T08:48:27.606Z',
  '2026-09-26T08:48:27.606Z'
)
ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  name = EXCLUDED.name,
  template_kind = EXCLUDED.template_kind,
  width = EXCLUDED.width,
  height = EXCLUDED.height,
  background_image_url = EXCLUDED.background_image_url,
  layout_schema = EXCLUDED.layout_schema,
  is_active = EXCLUDED.is_active;

INSERT INTO public.templates (id, code, name, template_kind, width, height, background_image_url, layout_schema, is_active, created_at, updated_at)
VALUES (
  'c0000000-0000-0000-0000-000000000003',
  'CERT_PORTRAIT_ELEGANT_GOLD',
  'Elegant Gold & Blue Seminar Certificate (Portrait)',
  'certificate',
  1414,
  2000,
  'https://res.cloudinary.com/kwe1gmrq/image/upload/v1790515735/cambria/templates/cert_portrait_elegant_gold_master.png',
  '{"width":1414,"height":2000,"template_kind":"certificate","background_color":"#FFFFFF","background_image_url":"https://res.cloudinary.com/kwe1gmrq/image/upload/v1790515735/cambria/templates/cert_portrait_elegant_gold_master.png","fields":[{"id":"student_name_en","type":"text","x":100,"y":650,"w":1214,"h":110,"font":"Alex Brush","size":74,"weight":400,"color":"#020B5A","align":"center","contentKey":"student_name_en"},{"id":"statement","type":"text","x":150,"y":860,"w":1114,"h":80,"font":"Montserrat","size":24,"weight":500,"color":"#0F172A","align":"center","lineHeight":1.4,"staticText":"Has successfully completed the college training program, passed the final examinations, and has been awarded the degree of"},{"id":"degree_level","type":"text","x":150,"y":990,"w":1114,"h":60,"font":"Montserrat","size":44,"weight":800,"color":"#020B5A","align":"center","contentKey":"degree_level"},{"id":"program_name_en","type":"text","x":100,"y":1080,"w":1214,"h":75,"font":"Montserrat","size":36,"weight":700,"color":"#020B5A","align":"center","contentKey":"program_name_en"},{"id":"credential_number","type":"text","x":240,"y":1180,"w":900,"h":40,"font":"Montserrat","size":24,"weight":700,"color":"#0F172A","align":"left","contentKey":"credential_number","staticPrefix":"Certificate Number: "},{"id":"grade","type":"text","x":240,"y":1230,"w":900,"h":40,"font":"Montserrat","size":24,"weight":600,"color":"#0F172A","align":"left","contentKey":"grade","staticPrefix":"Grade: "},{"id":"issue_date","type":"text","x":240,"y":1280,"w":900,"h":40,"font":"Montserrat","size":24,"weight":600,"color":"#0F172A","align":"left","contentKey":"issue_date","staticPrefix":"CER.Date: "},{"id":"verification_notice","type":"text","x":240,"y":1330,"w":900,"h":40,"font":"Montserrat","size":22,"weight":600,"color":"#0F172A","align":"left","contentKey":"verification_notice","staticPrefix":"To confirm certificate visit: "},{"id":"qr_code","type":"qr","x":790,"y":1760,"w":170,"h":170,"borderRadius":4,"contentKey":"verification_url"}]}'::jsonb,
  true,
  '2026-09-26T08:48:27.606Z',
  '2026-09-26T08:48:27.606Z'
)
ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  name = EXCLUDED.name,
  template_kind = EXCLUDED.template_kind,
  width = EXCLUDED.width,
  height = EXCLUDED.height,
  background_image_url = EXCLUDED.background_image_url,
  layout_schema = EXCLUDED.layout_schema,
  is_active = EXCLUDED.is_active;

INSERT INTO public.templates (id, code, name, template_kind, width, height, background_image_url, layout_schema, is_active, created_at, updated_at)
VALUES (
  'c0000000-0000-0000-0000-000000000004',
  'CERT_PORTRAIT_BLUE_RIBBON',
  'Classic Navy Ribbon Distinction Certificate (Portrait)',
  'certificate',
  1414,
  2000,
  'https://res.cloudinary.com/kwe1gmrq/image/upload/v1790515737/cambria/templates/cert_portrait_blue_ribbon_master.png',
  '{"width":1414,"height":2000,"template_kind":"certificate","background_color":"#FFFFFF","background_image_url":"https://res.cloudinary.com/kwe1gmrq/image/upload/v1790515737/cambria/templates/cert_portrait_blue_ribbon_master.png","fields":[{"id":"student_name_en","type":"text","x":100,"y":742,"w":1214,"h":80,"font":"Cormorant Garamond","size":60,"weight":700,"color":"#FFFFFF","align":"center","contentKey":"student_name_en"},{"id":"statement","type":"text","x":150,"y":890,"w":1114,"h":80,"font":"Montserrat","size":24,"weight":500,"color":"#0F172A","align":"center","lineHeight":1.4,"staticText":"Has successfully completed the college training program, passed the final examinations, and has been awarded the degree of"},{"id":"program_name_en","type":"text","x":100,"y":1000,"w":1214,"h":80,"font":"Cormorant Garamond","size":46,"weight":700,"color":"#020B5A","align":"center","contentKey":"program_name_en"},{"id":"credential_number","type":"text","x":240,"y":1150,"w":900,"h":40,"font":"Montserrat","size":24,"weight":700,"color":"#0F172A","align":"left","contentKey":"credential_number","staticPrefix":"Certificate Number: "},{"id":"grade","type":"text","x":240,"y":1200,"w":900,"h":40,"font":"Montserrat","size":24,"weight":600,"color":"#0F172A","align":"left","contentKey":"grade","staticPrefix":"Grade: "},{"id":"issue_date","type":"text","x":240,"y":1250,"w":900,"h":40,"font":"Montserrat","size":24,"weight":600,"color":"#0F172A","align":"left","contentKey":"issue_date","staticPrefix":"CER.Date: "},{"id":"verification_notice","type":"text","x":240,"y":1300,"w":900,"h":40,"font":"Montserrat","size":22,"weight":600,"color":"#0F172A","align":"left","contentKey":"verification_notice","staticPrefix":"To confirm certificate visit: "},{"id":"qr_code","type":"qr","x":790,"y":1760,"w":170,"h":170,"borderRadius":4,"contentKey":"verification_url"}]}'::jsonb,
  true,
  '2026-09-26T08:48:27.606Z',
  '2026-09-26T08:48:27.606Z'
)
ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  name = EXCLUDED.name,
  template_kind = EXCLUDED.template_kind,
  width = EXCLUDED.width,
  height = EXCLUDED.height,
  background_image_url = EXCLUDED.background_image_url,
  layout_schema = EXCLUDED.layout_schema,
  is_active = EXCLUDED.is_active;

INSERT INTO public.templates (id, code, name, template_kind, width, height, background_image_url, layout_schema, is_active, created_at, updated_at)
VALUES (
  'c0000000-0000-0000-0000-000000000005',
  'CERT_PORTRAIT_APPRECIATION',
  'Prestigious Academic Appreciation Certificate (Portrait)',
  'certificate',
  1414,
  2000,
  'https://res.cloudinary.com/kwe1gmrq/image/upload/v1790515744/cambria/templates/cert_portrait_appreciation_master.png',
  '{"width":1414,"height":2000,"template_kind":"certificate","background_color":"#FFFFFF","background_image_url":"https://res.cloudinary.com/kwe1gmrq/image/upload/v1790515744/cambria/templates/cert_portrait_appreciation_master.png","fields":[{"id":"student_name_en","type":"text","x":100,"y":820,"w":1214,"h":110,"font":"Alex Brush","size":74,"weight":400,"color":"#020B5A","align":"center","contentKey":"student_name_en"},{"id":"statement","type":"text","x":150,"y":1040,"w":1114,"h":80,"font":"Montserrat","size":24,"weight":500,"color":"#0F172A","align":"center","lineHeight":1.4,"staticText":"Has successfully completed the college training program, passed the final examinations, and has been awarded the degree of"},{"id":"program_name_en","type":"text","x":100,"y":1150,"w":1214,"h":80,"font":"Cormorant Garamond","size":48,"weight":700,"color":"#020B5A","align":"center","contentKey":"program_name_en"},{"id":"credential_number","type":"text","x":240,"y":1270,"w":900,"h":40,"font":"Montserrat","size":24,"weight":700,"color":"#0F172A","align":"left","contentKey":"credential_number","staticPrefix":"Certificate Number: "},{"id":"grade","type":"text","x":240,"y":1320,"w":900,"h":40,"font":"Montserrat","size":24,"weight":600,"color":"#0F172A","align":"left","contentKey":"grade","staticPrefix":"Grade: "},{"id":"issue_date","type":"text","x":240,"y":1370,"w":900,"h":40,"font":"Montserrat","size":24,"weight":600,"color":"#0F172A","align":"left","contentKey":"issue_date","staticPrefix":"CER.Date: "},{"id":"verification_notice","type":"text","x":240,"y":1420,"w":900,"h":40,"font":"Montserrat","size":22,"weight":600,"color":"#0F172A","align":"left","contentKey":"verification_notice","staticPrefix":"To confirm certificate visit: "},{"id":"qr_code","type":"qr","x":790,"y":1760,"w":170,"h":170,"borderRadius":4,"contentKey":"verification_url"}]}'::jsonb,
  true,
  '2026-09-26T08:48:27.606Z',
  '2026-09-26T08:48:27.606Z'
)
ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  name = EXCLUDED.name,
  template_kind = EXCLUDED.template_kind,
  width = EXCLUDED.width,
  height = EXCLUDED.height,
  background_image_url = EXCLUDED.background_image_url,
  layout_schema = EXCLUDED.layout_schema,
  is_active = EXCLUDED.is_active;

-- ----------------------------------------------------------------------------
-- Table: students (5 rows)
-- ----------------------------------------------------------------------------
INSERT INTO public.students (id, student_id_number, full_name_en, full_name_ar, national_id, email, phone, birth_date, gender, nationality, created_at, updated_at)
VALUES ('b0000000-0000-0000-0000-000000000001', 'STU-2026-000184', 'Tariq Mansoor Al-Hashimi', 'طارق منصور الهاشمي', 'ID-98240182', 't.mansoor@example.org', '+44 20 7946 0912', '1994-06-14T00:00:00.000Z', 'Male', 'Jordanian', '2026-09-26T08:48:27.494Z', '2026-09-26T08:48:27.494Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.students (id, student_id_number, full_name_en, full_name_ar, national_id, email, phone, birth_date, gender, nationality, created_at, updated_at)
VALUES ('b0000000-0000-0000-0000-000000000002', 'STU-2026-000185', 'Eleanor Claire Vance', 'إليانور كلير فانس', 'ID-84729104', 'e.vance@example.org', '+44 20 7946 0945', '1996-11-22T00:00:00.000Z', 'Female', 'British', '2026-09-26T08:48:27.524Z', '2026-09-26T08:48:27.524Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.students (id, student_id_number, full_name_en, full_name_ar, national_id, email, phone, birth_date, gender, nationality, created_at, updated_at)
VALUES ('b0000000-0000-0000-0000-000000000003', 'STU-2026-000186', 'Khalid Abdulrahman Al-Fassi', 'خالد عبد الرحمن الفاسي', 'ID-72910482', 'k.fassi@example.org', '+971 4 391 0293', '1992-03-08T00:00:00.000Z', 'Male', 'Emirati', '2026-09-26T08:48:27.526Z', '2026-09-26T08:48:27.526Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.students (id, student_id_number, full_name_en, full_name_ar, national_id, email, phone, birth_date, gender, nationality, created_at, updated_at)
VALUES ('b0000000-0000-0000-0000-000000000004', 'STU-2026-000187', 'Sarah Louise Jenkins', 'سارة لويز جينكينز', 'ID-62910394', 's.jenkins@example.org', '+44 20 7946 0881', '1998-08-30T00:00:00.000Z', 'Female', 'British', '2026-09-26T08:48:27.527Z', '2026-09-26T08:48:27.527Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.students (id, student_id_number, full_name_en, full_name_ar, national_id, email, phone, birth_date, gender, nationality, created_at, updated_at)
VALUES ('b0000000-0000-0000-0000-000000000005', 'STU-2026-000188', 'Omar Zaid Al-Qadi', 'عمر زيد القاضي', 'ID-51920381', 'o.qadi@example.org', '+966 11 482 9102', '1995-12-05T00:00:00.000Z', 'Male', 'Saudi', '2026-09-26T08:48:27.533Z', '2026-09-26T08:48:27.533Z')
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- Table: credentials (7 rows)
-- ----------------------------------------------------------------------------
INSERT INTO public.credentials (id, student_id, program_id, credential_number, verification_token, status, issue_date, expiry_date, revoked_at, revocation_reason, suspended_at, suspension_reason, replaced_by_credential_id, notes, created_by, created_at, updated_at)
VALUES ('6097167e-114f-4bbe-a0da-d8e6d0099f96', 'b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'CAM-2026-000190', 'tok_kJ18jcr95asHaLE9X4', 'active', '2026-03-25T00:00:00.000Z', '2031-03-25T00:00:00.000Z', NULL, NULL, NULL, NULL, NULL, 'Verified award issuance for Step 4 audit verification.', NULL, '2026-09-26T08:59:01.274Z', '2026-09-26T08:59:01.274Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.credentials (id, student_id, program_id, credential_number, verification_token, status, issue_date, expiry_date, revoked_at, revocation_reason, suspended_at, suspension_reason, replaced_by_credential_id, notes, created_by, created_at, updated_at)
VALUES ('d0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'CAM-2026-000184', 'tok_v8K29LpQx92M1a8B4z', 'active', '2026-01-15T00:00:00.000Z', '2031-01-15T00:00:00.000Z', NULL, NULL, NULL, NULL, NULL, 'Honor graduate with institutional distinction.', NULL, '2026-09-26T08:48:27.610Z', '2026-09-26T08:48:27.610Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.credentials (id, student_id, program_id, credential_number, verification_token, status, issue_date, expiry_date, revoked_at, revocation_reason, suspended_at, suspension_reason, replaced_by_credential_id, notes, created_by, created_at, updated_at)
VALUES ('d0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002', 'CAM-2026-000185', 'tok_k4M91ZbVx71P3c9D2w', 'expired', '2021-02-01T00:00:00.000Z', '2026-02-01T00:00:00.000Z', NULL, NULL, NULL, NULL, NULL, 'Standard 5-year credential validity elapsed.', NULL, '2026-09-26T08:48:27.661Z', '2026-09-26T08:48:27.661Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.credentials (id, student_id, program_id, credential_number, verification_token, status, issue_date, expiry_date, revoked_at, revocation_reason, suspended_at, suspension_reason, replaced_by_credential_id, notes, created_by, created_at, updated_at)
VALUES ('d0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000003', 'CAM-2026-000186', 'tok_r3N82AcWx62Q4d0E1y', 'revoked', '2025-06-10T00:00:00.000Z', '2030-06-10T00:00:00.000Z', '2026-01-20T14:30:00.000Z', 'Administrative disciplinary revocation under Academic Integrity Bylaw Article 14.', NULL, NULL, NULL, 'Revoked following disciplinary committee review.', NULL, '2026-09-26T08:48:27.664Z', '2026-09-26T08:48:27.664Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.credentials (id, student_id, program_id, credential_number, verification_token, status, issue_date, expiry_date, revoked_at, revocation_reason, suspended_at, suspension_reason, replaced_by_credential_id, notes, created_by, created_at, updated_at)
VALUES ('d0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000004', 'CAM-2026-000187', 'tok_p9L71BdUy53R5e2F3x', 'suspended', '2025-09-01T00:00:00.000Z', '2030-09-01T00:00:00.000Z', NULL, NULL, '2026-02-15T11:00:00.000Z', 'Temporary administrative suspension pending identity verification documentation.', NULL, 'Under institutional audit review.', NULL, '2026-09-26T08:48:27.680Z', '2026-09-26T08:48:27.680Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.credentials (id, student_id, program_id, credential_number, verification_token, status, issue_date, expiry_date, revoked_at, revocation_reason, suspended_at, suspension_reason, replaced_by_credential_id, notes, created_by, created_at, updated_at)
VALUES ('d0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'CAM-2026-000188', 'tok_m2K60CeTz44S6f3G4z', 'draft', '2026-03-01T00:00:00.000Z', '2031-03-01T00:00:00.000Z', NULL, NULL, NULL, NULL, NULL, 'Awaiting final Dean signature before issuance.', NULL, '2026-09-26T08:48:27.683Z', '2026-09-26T08:48:27.683Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.credentials (id, student_id, program_id, credential_number, verification_token, status, issue_date, expiry_date, revoked_at, revocation_reason, suspended_at, suspension_reason, replaced_by_credential_id, notes, created_by, created_at, updated_at)
VALUES ('17b8a962-4b43-44b9-99ae-fc603e3776e8', 'b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'CAM-2026-000191', 'tok_bp2JONgp89S5nPsZtm', 'active', '2026-03-25T00:00:00.000Z', '2031-03-25T00:00:00.000Z', NULL, NULL, NULL, NULL, NULL, 'Verified award issuance for Step 4 audit verification.', NULL, '2026-09-26T09:00:23.212Z', '2026-09-26T09:00:23.212Z')
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- Table: credential_documents (6 rows)
-- ----------------------------------------------------------------------------
INSERT INTO public.credential_documents (id, credential_id, document_type, template_id, current_version_id, file_path, thumbnail_path, created_at, updated_at)
VALUES ('1803054a-454e-47f2-9e57-9c9ba815688c', '6097167e-114f-4bbe-a0da-d8e6d0099f96', 'student_card', 'c0000000-0000-0000-0000-000000000002', NULL, NULL, NULL, '2026-09-26T08:59:01.829Z', '2026-09-26T08:59:01.829Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.credential_documents (id, credential_id, document_type, template_id, current_version_id, file_path, thumbnail_path, created_at, updated_at)
VALUES ('e065c0ef-0268-4973-9963-b39ddcc1a670', '6097167e-114f-4bbe-a0da-d8e6d0099f96', 'certificate', 'c0000000-0000-0000-0000-000000000001', '2ee603e1-4209-445c-a65e-b3bce4cc7273', '/documents/step4-cert-v2.pdf', '/documents/step4-cert-v2.png', '2026-09-26T08:59:01.706Z', '2026-09-26T08:59:10.109Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.credential_documents (id, credential_id, document_type, template_id, current_version_id, file_path, thumbnail_path, created_at, updated_at)
VALUES ('e0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'certificate', 'c0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', '/documents/sample-cert-001.pdf', '/documents/sample-cert-001.png', '2026-09-26T08:48:27.724Z', '2026-09-26T08:48:27.724Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.credential_documents (id, credential_id, document_type, template_id, current_version_id, file_path, thumbnail_path, created_at, updated_at)
VALUES ('e0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000001', 'student_card', 'c0000000-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000002', '/documents/sample-card-001.pdf', '/documents/sample-card-001.png', '2026-09-26T08:48:27.853Z', '2026-09-26T08:48:27.853Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.credential_documents (id, credential_id, document_type, template_id, current_version_id, file_path, thumbnail_path, created_at, updated_at)
VALUES ('d1191188-9a36-4aa8-926a-b1f299bac274', '17b8a962-4b43-44b9-99ae-fc603e3776e8', 'student_card', 'c0000000-0000-0000-0000-000000000002', NULL, NULL, NULL, '2026-09-26T09:00:23.357Z', '2026-09-26T09:00:23.357Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.credential_documents (id, credential_id, document_type, template_id, current_version_id, file_path, thumbnail_path, created_at, updated_at)
VALUES ('7d22f8cc-fd05-4f89-bafa-371284208b15', '17b8a962-4b43-44b9-99ae-fc603e3776e8', 'certificate', 'c0000000-0000-0000-0000-000000000001', '7304e36c-7d5a-4266-80f6-07d32f581439', '/documents/step4-cert-v2.pdf', '/documents/step4-cert-v2.png', '2026-09-26T09:00:23.344Z', '2026-09-26T09:00:31.828Z')
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- Table: document_versions (6 rows)
-- ----------------------------------------------------------------------------
INSERT INTO public.document_versions (id, credential_document_id, version_number, file_path, thumbnail_path, metadata_snapshot, generated_by, generated_at, file_size_bytes, sha256_hash)
VALUES ('30443c18-34b9-40b6-8106-9c52fd9488e1', 'e065c0ef-0268-4973-9963-b39ddcc1a670', 1, '/documents/step4-cert.pdf', '/documents/step4-cert.png', '{"version":1,"issue_date":"March 25, 2026","qr_data_uri":"data:image/png;base64,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","program_name_en":"Executive Leadership & Educational Governance","student_name_ar":"طارق منصور الهاشمي","student_name_en":"Tariq Mansoor Al-Hashimi","verification_url":"http://localhost:3000/verify/tok_kJ18jcr95asHaLE9X4","credential_number":"CAM-2026-000190"}'::jsonb, NULL, '2026-09-26T08:59:10.007Z', NULL, NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.document_versions (id, credential_document_id, version_number, file_path, thumbnail_path, metadata_snapshot, generated_by, generated_at, file_size_bytes, sha256_hash)
VALUES ('2ee603e1-4209-445c-a65e-b3bce4cc7273', 'e065c0ef-0268-4973-9963-b39ddcc1a670', 2, '/documents/step4-cert-v2.pdf', '/documents/step4-cert-v2.png', '{"version":2,"issue_date":"March 25, 2026","qr_data_uri":"data:image/png;base64,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","regenerated":true,"program_name_en":"Executive Leadership & Educational Governance","student_name_ar":"طارق منصور الهاشمي","student_name_en":"Tariq Mansoor Al-Hashimi","verification_url":"http://localhost:3000/verify/tok_kJ18jcr95asHaLE9X4","credential_number":"CAM-2026-000190"}'::jsonb, NULL, '2026-09-26T08:59:10.106Z', NULL, NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.document_versions (id, credential_document_id, version_number, file_path, thumbnail_path, metadata_snapshot, generated_by, generated_at, file_size_bytes, sha256_hash)
VALUES ('f0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 1, '/documents/sample-cert-001.pdf', '/documents/sample-cert-001.png', '{"program_name_en":"Executive Leadership & Educational Governance","student_name_ar":"طارق منصور الهاشمي","student_name_en":"Tariq Mansoor Al-Hashimi","credential_number":"CAM-2026-000184"}'::jsonb, NULL, '2026-09-26T08:48:27.858Z', NULL, NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.document_versions (id, credential_document_id, version_number, file_path, thumbnail_path, metadata_snapshot, generated_by, generated_at, file_size_bytes, sha256_hash)
VALUES ('f0000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000002', 1, '/documents/sample-card-001.pdf', '/documents/sample-card-001.png', '{"program_name_en":"Executive Leadership & Educational Governance","student_name_ar":"طارق منصور الهاشمي","student_name_en":"Tariq Mansoor Al-Hashimi","credential_number":"CAM-2026-000184"}'::jsonb, NULL, '2026-09-26T08:48:27.883Z', NULL, NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.document_versions (id, credential_document_id, version_number, file_path, thumbnail_path, metadata_snapshot, generated_by, generated_at, file_size_bytes, sha256_hash)
VALUES ('4212f55d-628c-4631-8a11-02c3632ccd79', '7d22f8cc-fd05-4f89-bafa-371284208b15', 1, '/documents/step4-cert.pdf', '/documents/step4-cert.png', '{"version":1,"issue_date":"March 25, 2026","qr_data_uri":"data:image/png;base64,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","program_name_en":"Executive Leadership & Educational Governance","student_name_ar":"طارق منصور الهاشمي","student_name_en":"Tariq Mansoor Al-Hashimi","verification_url":"http://localhost:3000/verify/tok_bp2JONgp89S5nPsZtm","credential_number":"CAM-2026-000191"}'::jsonb, NULL, '2026-09-26T09:00:31.745Z', NULL, NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.document_versions (id, credential_document_id, version_number, file_path, thumbnail_path, metadata_snapshot, generated_by, generated_at, file_size_bytes, sha256_hash)
VALUES ('7304e36c-7d5a-4266-80f6-07d32f581439', '7d22f8cc-fd05-4f89-bafa-371284208b15', 2, '/documents/step4-cert-v2.pdf', '/documents/step4-cert-v2.png', '{"version":2,"issue_date":"March 25, 2026","qr_data_uri":"data:image/png;base64,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","regenerated":true,"program_name_en":"Executive Leadership & Educational Governance","student_name_ar":"طارق منصور الهاشمي","student_name_en":"Tariq Mansoor Al-Hashimi","verification_url":"http://localhost:3000/verify/tok_bp2JONgp89S5nPsZtm","credential_number":"CAM-2026-000191"}'::jsonb, NULL, '2026-09-26T09:00:31.786Z', NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- Table: staff_users (2 rows)
-- ----------------------------------------------------------------------------
INSERT INTO public.staff_users (id, email, full_name, role, password_hash, mfa_secret, mfa_enrolled, created_at, updated_at)
VALUES ('b5146f4a-4ba1-456f-9df5-90ca935d0f19', 'admin@cambria.edu', 'Chief Registrar', 'super_admin', 'scrypt:3686e1d838c8ae668fc4acbe869513a2:407fb0b14a9b59dcff05597eb329460fd66fd9f109fb86ac8ade486208037b715396499d572fbe22533fbf13811d64e636f2abcf7627f3be8ff5d84607ca7234', 'aes256gcm:54a552355d5542cf1d6d0e1c:fdfaad6188f459bf145231cb10db64d1:eac7c79588ca4dbaec8803c7bb8afbd2423ebed6dc21af145f94b3c0b84c86f7', false, '2026-09-26T11:08:52.112Z', '2026-09-26T11:08:52.112Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.staff_users (id, email, full_name, role, password_hash, mfa_secret, mfa_enrolled, created_at, updated_at)
VALUES ('e4fdf986-6596-4448-a2c5-8a7a3dd2eb60', 'compliance@cambria.edu', 'Compliance Officer', 'compliance', 'scrypt:365eddac0687b776551d9a9be119ded8:edda90291c2337d006d1851f0e6dbc3af3191347014ba2721d06d5e9438194fa86a511d5fa01122be1426de67434be18152f4c22d2bb8e7265961068fe22dfd6', 'aes256gcm:58f22a3c961940999e8ea037:c03c7bafea6697092ca44bc0f9182106:8d0e6784e5f000ed0161911a7fbf0e3ed1f8f0207ee8da27ce561648bcf8cd30', false, '2026-09-26T11:08:52.130Z', '2026-09-26T11:08:52.130Z')
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- Storage Bucket & Security Policies: documents
-- ----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  false,
  10485760,
  ARRAY['application/pdf', 'image/png', 'image/jpeg']
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 10485760;

-- Storage RLS: authenticated staff can manage documents
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Staff manage documents'
  ) THEN
    CREATE POLICY "Staff manage documents"
      ON storage.objects FOR ALL
      TO authenticated
      USING (bucket_id = 'documents')
      WITH CHECK (bucket_id = 'documents');
  END IF;
END $$;

-- SET session_replication_role = 'origin';

-- End of seed.sql
