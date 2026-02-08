-- 1. Create User table
CREATE TABLE IF NOT EXISTS "user" (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    role VARCHAR(50),
    image TEXT,
    image_public_id VARCHAR(255),
    email VARCHAR(65) UNIQUE NOT NULL,
    password VARCHAR(255),
    summary VARCHAR(500)
);


-- 2 Create Experience table
CREATE TABLE IF NOT EXISTS "experience" (
    experience_id SERIAL PRIMARY KEY,
    user_id SMALLINT NOT NULL REFERENCES "user"(user_id) ON DELETE CASCADE,
    company VARCHAR(30) NOT NULL,
    role VARCHAR(30) NOT NULL,
    years VARCHAR(3) NOT NULL CHECK(years IN ('0-2', '2-5' ,'5-8', '8+')),
    start_date DATE NOT NULL,
    end_date VARCHAR(255) NOT NULL,
    employment_type VARCHAR(9) NOT NULL CHECK(employment_type IN ('full time', 'part time')),
    description VARCHAR(500) NOT NULL
);
CREATE INDEX idx_experience_user_id ON "experience"(user_id);


-- 3. Create Education table
CREATE TABLE IF NOT EXISTS "education" (
    education_id SERIAL PRIMARY KEY,
    user_id SMALLINT NOT NULL REFERENCES "user"(user_id) ON DELETE CASCADE,
    institution VARCHAR(50) NOT NULL,
    field_of_study VARCHAR(30) NOT NULL,
    qualification VARCHAR(16) NOT NULL CHECK(qualification IN ('Primary School', 'Secondary School', 'ITE / Nitec', 'A Level', 'Diploma', 'Degree', 'Master', 'PhD')),
    start_date DATE NOT NULL,
    end_date VARCHAR(10) NOT NULL,
    description VARCHAR(500) NOT NULL,
    study_type VARCHAR(9) NOT NULL CHECK(study_type  IN ('full time', 'part time'))
);
CREATE INDEX idx_education_user_id ON "education"(user_id);


-- 4. Create Link table
CREATE TABLE IF NOT EXISTS "link" (
    link_id SERIAL PRIMARY KEY,
    user_id SMALLINT NOT NULL REFERENCES "user"(user_id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK(type  IN ('Website', 'LinkedIn', 'GitHub', 'Twitter', 'Portfolio', 'Other')),
    url VARCHAR(255) NOT NULL
);
CREATE INDEX idx_link_user_id ON "link"(user_id);


-- 5. Create Skill table
CREATE TABLE IF NOT EXISTS "skill" (
    skill_id SERIAL PRIMARY KEY,
    user_id SMALLINT NOT NULL REFERENCES "user"(user_id) ON DELETE CASCADE,
    skill VARCHAR(30) NOT NULL
);
CREATE INDEX idx_skill_user_id ON "skill"(user_id);


-- 6. Create Language table
CREATE TABLE IF NOT EXISTS "language" (
    language_id SERIAL PRIMARY KEY,
    user_id SMALLINT NOT NULL REFERENCES "user"(user_id) ON DELETE CASCADE,
    language VARCHAR(20) NOT NULL,
    proficiency VARCHAR(6) NOT NULL  CHECK(proficiency IN ('Native', 'Fluent', 'Basic'))
);
CREATE INDEX idx_language_user_id ON "language"(user_id);


-- 7. Create Company table
CREATE TABLE IF NOT EXISTS "company" (
    company_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    image TEXT,
    image_public_id VARCHAR(255),
    industry VARCHAR(20) NOT NULL CHECK(industry IN ('IT & Technology', 'Healthcare', 'Finance & Business', 'F&B (Food & Bev)', 'Creative & Media', 'Education', 'Engineering', 'Retail & Sales', 'Logistics & Trades')),
    location VARCHAR(50) NOT NULL,
    description VARCHAR(500)
);


-- 8. Create CompanyMember table (Join table for User and Company)
CREATE TABLE IF NOT EXISTS "company_member" (
    company_member_id SERIAL PRIMARY KEY,
    company_id SMALLINT NOT NULL REFERENCES "company"(company_id) ON DELETE CASCADE,
    user_id SMALLINT NOT NULL REFERENCES "user"(user_id) ON DELETE CASCADE,
    role VARCHAR(6) NOT NULL CHECK(role IN ('owner', 'admin', 'member')),
    removed BOOLEAN DEFAULT FALSE
);


-- 9. Create JobPost table (Depends on Company)
CREATE TABLE IF NOT EXISTS "job_post" (
    job_post_id SERIAL PRIMARY KEY,
    company_id SMALLINT NOT NULL REFERENCES "company"(company_id) ON DELETE CASCADE,
    title VARCHAR(50) NOT NULL,
    industry VARCHAR(20) NOT NULL CHECK(industry IN ('IT & Technology', 'Healthcare', 'Finance & Business', 'F&B (Food & Bev)', 'Creative & Media', 'Education', 'Engineering', 'Retail & Sales', 'Logistics & Trades')),
    requirements TEXT[], -- Using Postgres Array
    responsibilities TEXT[],
    employment_type VARCHAR(9) NOT NULL CHECK(employment_type IN ('full time', 'part time')),
    experience VARCHAR(3) NOT NULL CHECK(experience IN ('0-2', '2-5' ,'5-8', '8+')),
    created_at DATE NOT NULL,
    removed BOOLEAN DEFAULT FALSE,
    salary_start INT NOT NULL,
    salary_end INT NOT NULL,
    location VARCHAR(6) NOT NULL CHECK(location IN ('onsite', 'remote')),
    benefit TEXT[],
    contact_email VARCHAR(65) NOT NULL,
    description VARCHAR(500) NOT NULL,
    summary VARCHAR(100) NOT NULL
);


-- 10. Create JobApplicant table (Join table for User and JobPost)
CREATE TABLE IF NOT EXISTS "job_applicant" (
    applicant_id SERIAL PRIMARY KEY,
    user_id SMALLINT NOT NULL REFERENCES "user"(user_id) ON DELETE CASCADE,
    job_post_id SMALLINT NOT NULL REFERENCES "job_post"(job_post_id) ON DELETE CASCADE,
    status VARCHAR(10) DEFAULT 'PENDING' CHECK(status IN ('ACCEPTED', 'REJECTED' ,'WITHDRAWN', 'INTERVIEW', 'PENDING')),
    expected_salary INT NOT NULL, 
    applied_date DATE NOT NULL,
    interview_date DATE,
    interview_time VARCHAR(7)
);


-- 11. Create Notification table
CREATE TABLE IF NOT EXISTS "notification" (
    notification_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES "user"(user_id) ON DELETE CASCADE, -- Receiver
    sender_id INTEGER REFERENCES "user"(user_id) ON DELETE SET NULL,     -- Sender
    company_id INTEGER REFERENCES "company"(company_id) ON DELETE SET NULL,
    job_post_id INTEGER REFERENCES "job_post"(job_post_id) ON DELETE SET NULL,
    type VARCHAR(255) NOT NULL CHECK(type IN ('COMPANY_MEMBER_ADD', 'COMPANY_MEMBER_REMOVE' ,'COMPANY_MEMBER_UPDATE', 'COMPANY_PROFILE_UPDATE', 'JOB_POST_CREATED', 'JOB_POST_UPDATED', 'APPLICANT_NEW', 'APPLICANT_STATUS_CHANGE')),
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE
);
CREATE INDEX idx_notification_user_id ON "notification"(user_id);



-- sample data
-- 1. USER (not inserting image_public_id)
INSERT INTO "user" (name, role, image, email, password, summary, image_public_id) VALUES
('Armin Arlett', 'Full Stack Developer', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Shau', 'Armin@gmail.com', '$2a$10$xyz', 'Aspiring dev passionate about Next.js.', null),
('Jane Doe', 'HR Manager', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane', 'jane@techcorp.com', '$2a$10$abc', 'Recruiter at TechCorp.', null),
('Marcus Tan', 'Senior Backend Engineer', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus', 'marcus@dev.io', '$2a$10$def', 'Backend specialist and database architect.', null),
('Sarah Lim', 'Project Manager', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', 'sarah@global.com', '$2a$10$ghi', 'Managing logistics at Global Solutions.', null),
('Wei Kiat', 'UI/UX Designer', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Wei', 'weikiat@creative.sg', '$2a$10$jkl', 'Creative lead focusing on mobile-first design.', null),
('Kujo Jotaro', 'Sale master', null, 'Jotaro@gmail.com', '$2a$10$mno', null, null),
('Dio Brando', 'Logistic master', null, 'Dio@store.com', '$2a$10$mno', null, null),
('Kaneki Ken', 'Teacher', null, 'Kaneki@edu.com', '$2a$10$mno', 'Expert education.', null),
('Kevin Miller', null , null, 'kevin@example.com', 'password', null, null),

('Leila Omar', null, null, 'leila@example.com', 'password', null, null),
-- 11
('Eren Yeager', null, null, 'Yeager@example.com', 'password', null, null),
('Levi Ackermann', null, null,'Ackermann@example.com',  'password', null, null),
('Erwin Smith', null, null, 'Smith@example.com', 'password', null, null),
('Uzumaki Naruto', null, null, 'Uzumaki@example.com', 'password', null, null),
('Uchiha Sasuke', null, null, 'Sasuke@example.com', 'password', null, null),
('Uchiha Madara', null, null, 'Madara@example.com', 'password', null, null),
('Ilia topuria', null, null, 'topuria@example.com', 'password', null, null),
('James Wilson', 'Developer', null, 'jawilson@example.com', 'passw', 'developer specializing .', NULL),
('Emily Rodriguez', 'Designer', null, 'emiod@design.io', 'passw', 'Passionate designer with a focus on accessible products.', NULL),
('Michael Chang', 'Data Scientist', null, 'chang@techdata.net', 'passw', 'Machine learning expert.', NULL),
-- 21
('Sophie Bennett', 'Manager', null, 'sophie@business.com', 'passw', 'Dedicated to bridging the gap between tech and business.', NULL),
('Daniel Kim', 'Engineer', null, 'im@cloudops.org', 'passw', 'Specialist in CI/CD pipelines and Kubernetes.', NULL),
('Olivia Taylor', 'Specialist', null, 'olivia@growth.com', 'passw', 'Expert in digital growth strategies.', NULL),
('William Brown', 'Security', null, 'brown@cybersec.com', 'passw', 'Focused on penetration testing.', NULL),
('Isabella Garcia', 'Strategist', null, 'garcia@media.co', 'passw', 'Creating engaging narratives for global audiences.', NULL),
('Lucas White', 'Mobile Developer', null, 'white@appworks.dev', 'passw', 'Building high-performance Flutter applications.', NULL),
('Mia Johnson', 'HR Manager', null, 'miaj@people.net', 'passw', 'Experienced in talent acquisition.', NULL),
('Ethan Hunt', 'Backend Engineer', null, 'hunt@mission.dev', 'passw', 'Focusing on high-availability systems.', NULL),
('Ava Martinez', 'QA Lead', null, 'ava@quality.io', 'passw', 'Meticulous tester dedicated to automation.', NULL),
('Alexander Gray', 'Software Architect', null, 'gray@solutions.com', 'passw', 'Designing complex enterprise systems.', NULL),
-- 31
('Charlotte Lee', 'Systems Administrator', null, 'ee@network.org', 'passw', 'Maintaining network.', NULL),
('Benjamin Scott', 'Frontend Specialist', null, 'scott@webflow.dev', 'passw', 'Crafting interfaces with Tailwind.', NULL),
('Sophia Rivera', 'Business Analyst', null, 'rivera@corp.com', 'passw', 'Analyzing data patterns.', NULL),
('Jackson Hall', 'Full Stack Developer', null, 'hall@stack.io', 'passw', 'Versatile developer with SQL.', NULL),
('Amelia Young', 'Digital Designer', null, 'young@creative.net', 'passw', 'Focusing on branding.', NULL),
('Henry Adams', 'Operations Director', null, 'adams@logistics.com', 'passw', 'Streamlining internal processes.', NULL);



-- 2. EXPERIENCE
INSERT INTO experience (user_id, company, role, years, start_date, end_date, description, employment_type) VALUES
(1, 'HP', 'Technical Support', '2-5', '2021-06-11', '2023-12-01', 'Support.', 'full time'),
(3, 'Google', 'Senior Developer', '8+', '2015-03-01', '2022-10-10', 'Scaling infrastructure.', 'full time'),
(4, 'Global Logistics', 'Operations', '5-8', '2018-01-01', 'present', 'Fleet management.', 'full time'),
(5, 'Creative Minds', 'Lead Designer', '2-5', '2020-02-01', 'present', 'UX Lead.', 'full time'),
(6, 'OCBC', 'Analyst', '5-8', '2019-06-01', 'present', 'Risk assessment.', 'full time'),
(1, 'Freelance', 'Web Dev', '0-2', '2024-01-01', 'present', 'Next.js projects.', 'part time');

-- 3. EDUCATION 
INSERT INTO education (user_id, institution, field_of_study, qualification, start_date, end_date, description, study_type) VALUES
(1, 'Foon Yew High School', 'Art & Commercial', 'A Level', '2015-01-01', '2020-12-31', 'High school.', 'full time'),
(1, 'Nanyang Polytechnic', 'Information Technology', 'Diploma', '2021-04-01', '2024-03-31', 'Software focus.', 'full time'),
(3, 'NUS', 'Computer Science', 'Degree', '2010-08-01', '2014-05-01', 'Bachelors.', 'full time'),
(5, 'LASALLE', 'Design Communication', 'Degree', '2016-01-01', '2019-12-01', 'Visual arts.', 'full time'),
(6, 'SMU', 'Accountancy', 'Degree', '2012-08-01', '2016-05-01', 'Finance focus.', 'full time'),
(6, 'NTU', 'Finance', 'Master', '2017-08-01', '2019-05-01', 'Higher finance.', 'full time');

-- 4. SKILL
INSERT INTO skill (user_id, skill) VALUES 
(1, 'Javascript'), (1, 'React'), (1, 'Next.js'), (1, 'Prisma'), (3, 'PostgreSQL'), (3, 'Java'), (3, 'AWS'), (5, 'Figma'), (5, 'Adobe XD');

-- 5. LANGUAGE
INSERT INTO language (user_id, language, proficiency) VALUES 
(1, 'English', 'Fluent'), (1, 'Mandarin', 'Native'), (3, 'English', 'Native'), (3, 'Japanese', 'Basic'), (6, 'Spanish', 'Native'), (6, 'English', 'Fluent');

-- 6. LINK
INSERT INTO link (user_id, type, url) VALUES 
(1, 'GitHub', 'https://github.com/Armin'), (1, 'LinkedIn', 'https://linkedin.com/in/Armin'), (3, 'Portfolio', 'https://marcustan.dev'), (3, 'GitHub', 'https://github.com/marcus'), (5, 'Other', 'https://dribbble.com/weikiat'), (6, 'LinkedIn', 'https://linkedin.com/in/elena');


-- 7. COMPANY  (not inserting image_public_id)
INSERT INTO company (name, image, industry, location, description) VALUES 
('TechCorp', 'https://logo.clearbit.com/google.com', 'IT & Technology', 'Singapore', 'Leading tech.'),
('DBS Bank', 'https://logo.clearbit.com/dbs.com', 'Finance & Business', 'Marina Bay', 'Banking services.'),
('BuildSG', 'https://logo.clearbit.com/bca.gov.sg', 'Engineering', 'Jurong', 'Civil engineering.'),
('SG Health', NULL, 'Healthcare', 'Outram', 'General hospital.'),
('Studio 101', 'https://logo.clearbit.com/canva.com', 'Creative & Media', 'Clarke Quay', 'Ad agency.'),
('Food Paradise', 'https://logo.clearbit.com/foodpanda.sg', 'F&B (Food & Bev)', 'Orchard', 'Restaurant group.'),
('RetailKing', 'https://logo.clearbit.com/shopee.sg', 'Retail & Sales', 'Tampines', 'E-commerce retail.'),
('CargoFast', 'https://logo.clearbit.com/fedex.com', 'Logistics & Trades', 'Changi', 'Logistics provider.'),
('EduPrimary', 'https://logo.clearbit.com/moe.gov.sg', 'Education', 'Bishan', 'Tuition center.');


-- 8. COMPANY_MEMBER 
INSERT INTO company_member (company_id, user_id, role, removed) VALUES
(1, 1, 'owner', false), 
(2, 2, 'owner', false),  
(3, 3, 'owner', false),  
(4, 4, 'owner', false),  
(5, 5, 'owner', false),  
(6, 6, 'owner', false),  
(7, 7, 'owner', false),  
(8, 8, 'owner', false),  
(9, 9, 'owner', false),  
(1, 10, 'admin', false),  
(2, 11, 'admin', false),  
(3, 12, 'admin', false), 
(4, 13, 'admin', false),  
(5, 14, 'admin', false),  
(6, 15, 'admin', false),  
(7, 16, 'admin', false),  
(8, 17, 'admin', false),  
(9, 18, 'admin', false),  
(1, 19, 'member', true),  
(2, 20, 'member', true),  
(3, 21, 'member', true),  
(4, 22, 'member', true),  
(5, 23, 'member', true), 
(6, 24, 'member', true),  
(7, 25, 'member', true),  
(8, 26, 'member', true),  
(9, 27, 'member', true),  
(1, 28, 'member', false),  
(2, 29, 'member', false),  
(3, 30, 'member', false),  
(4, 31, 'member', false),  
(5, 32, 'member', false),  
(6, 33, 'member', false),  
(7, 34, 'member', false), 
(8, 35, 'member', false),  
(9, 36, 'member', false);


-- 9. JOB POST
-- a. Industry: IT & Technology
INSERT INTO job_post (company_id, title, industry, requirements, responsibilities, employment_type, experience, created_at, removed, salary_start, salary_end, location, benefit, summary, description, contact_email) VALUES
(1, 'Senior React Developer', 'IT & Technology', 
ARRAY['Bachelor degree in Computer Science or related field', '5+ years of experience with React and modern JavaScript', 'Strong understanding of React hooks, context API, and state management', 'Experience with TypeScript and Next.js', 'Proficiency in HTML5, CSS3, and responsive design', 'Familiarity with RESTful APIs and GraphQL'], 
ARRAY['Design and develop user-facing features using React', 'Build reusable components and front-end libraries', 'Optimize applications for maximum speed and scalability', 'Collaborate with backend developers and designers', 'Participate in code reviews and maintain code quality', 'Mentor junior developers and share best practices', 'Stay updated with emerging technologies and trends'], 
'full time', '5-8', '2026-01-14', false, 6000, 9000, 'remote', 
ARRAY['Medical and dental insurance', 'Flexible working hours', 'Work from home options', 'Annual performance bonus', 'Professional development budget', 'Gym membership', 'Free snacks and beverages', 'Team building activities'], 
'Build amazing user experiences with React and modern web technologies.', 
'We are seeking a talented Senior React Developer to join our dynamic engineering team. You will be responsible for building scalable, high-performance web applications using modern technologies.', 
'ksh@gmail.com');

INSERT INTO job_post (company_id, title, industry, requirements, responsibilities, employment_type, experience, created_at, removed, salary_start, salary_end, location, benefit, summary, description, contact_email) VALUES
(1, 'Backend Node.js Architect', 'IT & Technology', 
ARRAY['10+ years in software development', 'Expert knowledge of Node.js and Microservices', 'Experience with PostgreSQL and Redis', 'Strong understanding of system design and scalability'], 
ARRAY['Architect and implement high-throughput backend services', 'Optimize database queries and schema design', 'Lead technical strategy for cloud infrastructure', 'Ensure security best practices across the stack'], 
'full time', '8+', '2026-01-15', false, 8500, 13000, 'remote', 
ARRAY['Equity options', 'Private healthcare', 'Remote work flexibility', 'High-end hardware budget'], 
'Design and scale the mission-critical backend systems powering our global platform.', 
'As a Backend Architect, you will lead the design and implementation of our next-generation microservices architecture.', 
'ksh@gmail.com');

INSERT INTO job_post (company_id, title, industry, requirements, responsibilities, employment_type, experience, created_at, removed, salary_start, salary_end, location, benefit, summary, description, contact_email) VALUES
(1, 'Junior Fullstack Developer', 'IT & Technology', 
ARRAY['Degree in IT or Coding Bootcamp graduate', 'Basic knowledge of JavaScript and React', 'Familiarity with Git and SQL', 'Eagerness to learn and grow'], 
ARRAY['Develop small features and fix bugs under senior guidance', 'Assist in writing unit and integration tests', 'Participate in daily standups and sprint planning', 'Document technical processes'], 
'full time', '0-2', '2026-01-16', false, 3000, 4500, 'onsite', 
ARRAY['Mentorship program', 'Training budget', 'Free lunch', 'Gaming room access'], 
'Start your career building end-to-end features with a supportive engineering team.', 
'A perfect role for a motivated junior dev looking to level up their skills in a fast-paced startup environment.', 
'ksh@gmail.com');

-- b. Industry: Finance & Business
INSERT INTO job_post (company_id, title, industry, requirements, responsibilities, employment_type, experience, created_at, removed, salary_start, salary_end, location, benefit, summary, description, contact_email) VALUES
(2, 'Senior Financial Analyst', 'Finance & Business', ARRAY['CPA or CFA certification', '5+ years in corporate finance', 'Advanced Excel and SQL skills'], ARRAY['Analyze financial performance', 'Prepare annual budgets', 'Conduct market trend research'], 'full time', '8+', '2026-01-14', false, 5000, 7500, 'remote', ARRAY['Performance bonus', 'Dental insurance'], 'Analyze market trends and provide data-driven insights for investment portfolios.', 'Join our elite finance team to drive strategic investment decisions.', 'finance.hr@finedge.com'),
(2, 'Business Development Manager', 'Finance & Business', ARRAY['Proven sales track record', 'Strong networking skills'], ARRAY['Identify new market opportunities', 'Negotiate high-value contracts'], 'full time', '5-8', '2026-01-15', false, 6000, 9000, 'remote', ARRAY['Sales commission', 'Remote allowance'], 'Drive growth through strategic partnerships and market expansion initiatives.', 'We need a hungry manager to scale our business reach globally.', 'finance.hr@finedge.com'),
(2, 'Risk Compliance Officer', 'Finance & Business', ARRAY['Legal or Finance degree', 'Experience with AML/KYC'], ARRAY['Monitor regulatory changes', 'Audit internal processes'], 'full time', '2-5', '2026-01-16', false, 4500, 6500, 'onsite', ARRAY['Health insurance', 'Training budget'], 'Ensure corporate adherence to global financial regulations and safety standards.', 'Help us maintain the highest standards of financial integrity.', 'finance.hr@finedge.com');

-- c. Industry: Engineering
INSERT INTO job_post (company_id, title, industry, requirements, responsibilities, employment_type, experience, created_at, removed, salary_start, salary_end, location, benefit, summary, description, contact_email) VALUES
(3, 'Structural Engineer', 'Engineering', ARRAY['Civil Engineering degree', 'AutoCAD proficiency'], ARRAY['Design load-bearing structures', 'Supervise construction sites'], 'full time', '0-2', '2026-01-14', false, 5500, 8000, 'onsite', ARRAY['Site allowance', 'Safety gear'], 'Oversee structural design for large-scale urban infrastructure projects.', 'Be part of the team building the future of our city infrastructure.', 'eng.lead@buildit.com'),
(3, 'Mechanical Systems Designer', 'Engineering', ARRAY['B.Sc. Mechanical Engineering', 'SolidWorks experience'], ARRAY['Develop mechanical prototypes', 'Test thermal systems'], 'full time', '2-5', '2026-01-15', false, 4800, 7000, 'onsite', ARRAY['Professional membership', 'Bonus'], 'Design and test mechanical systems for sustainable energy solutions.', 'Innovative engineering role focused on green energy technology.', 'eng.lead@buildit.com'),
(3, 'Engineering Project Manager', 'Engineering', ARRAY['PMP Certification', '10+ years experience'], ARRAY['Coordinate multi-disciplinary teams', 'Manage project timelines'], 'full time', '8+', '2026-01-16', false, 8500, 12000, 'onsite', ARRAY['Executive car', 'Stocks'], 'Lead multi-disciplinary teams to deliver engineering projects on time.', 'Lead massive engineering projects from conception to completion.', 'eng.lead@buildit.com');

-- d. Industry: Healthcare
INSERT INTO job_post (company_id, title, industry, requirements, responsibilities, employment_type, experience, created_at, removed, salary_start, salary_end, location, benefit, summary, description, contact_email) VALUES
(4, 'Registered Clinical Nurse', 'Healthcare', ARRAY['Nursing license', 'BLS/ACLS certification'], ARRAY['Patient assessment', 'Administering medication'], 'full time', '2-5', '2026-01-14', false, 3500, 5000, 'onsite', ARRAY['Shift allowance', 'Uniform'], 'Provide high-quality patient care in a fast-paced clinical environment.', 'Dedicated nurses wanted for our modern healthcare facility.', 'medical.recruiter@healthplus.com'),
(4, 'Chief Pharmacist', 'Healthcare', ARRAY['Doctor of Pharmacy', 'Retail management experience'], ARRAY['Inventory control', 'Counseling patients'], 'full time', '5-8', '2026-01-15', false, 5500, 7500, 'onsite', ARRAY['Annual bonus', 'Insurance'], 'Dispense medication and provide expert health advice to community members.', 'Join our pharmacy team to ensure patient safety and care.', 'medical.recruiter@healthplus.com'),
(4, 'Medical Lab Scientist', 'Healthcare', ARRAY['Degree in Lab Science', 'Experience with hematology'], ARRAY['Processing blood samples', 'Calibration of lab equipment'], 'full time', '2-5', '2026-01-16', false, 3800, 5200, 'onsite', ARRAY['Training allowance'], 'Conduct precise medical tests and maintain laboratory safety standards.', 'Precision is key in this vital diagnostic healthcare role.', 'medical.recruiter@healthplus.com');

-- e. Industry: Creative & Media
INSERT INTO job_post (company_id, title, industry, requirements, responsibilities, employment_type, experience, created_at, removed, salary_start, salary_end, location, benefit, summary, description, contact_email) VALUES
(5, 'Senior UI/UX Designer', 'Creative & Media', ARRAY['Strong portfolio', 'Figma expert'], ARRAY['User research', 'Hi-fi prototyping'], 'full time', '5-8', '2026-01-14', false, 5000, 8000, 'remote', ARRAY['MacBook Pro', 'Design courses'], 'Craft intuitive user interfaces and seamless digital experiences.', 'Design the look and feel of our next-gen mobile applications.', 'creative.dir@artflow.com'),
(5, 'Motion Graphics Artist', 'Creative & Media', ARRAY['After Effects mastery', '3D software knowledge'], ARRAY['Animate marketing videos', 'Create brand visual assets'], 'full time', '2-5', '2026-01-15', false, 4000, 6000, 'remote', ARRAY['Flexible hours', 'Gym'], 'Animate high-impact promotional videos and digital brand content.', 'Bring our brand to life through stunning motion and animation.', 'creative.dir@artflow.com'),
(5, 'Content Strategist', 'Creative & Media', ARRAY['Journalism or Marketing degree', 'SEO knowledge'], ARRAY['Content planning', 'Managing writers'], 'full time', '2-5', '2026-01-16', false, 4500, 6500, 'remote', ARRAY['Internet subsidy'], 'Write and strategize compelling marketing copy for global brands.', 'Shape the voice and story of our creative agency.', 'creative.dir@artflow.com');

-- f. Industry: F&B (Food & Bev)
INSERT INTO job_post (company_id, title, industry, requirements, responsibilities, employment_type, experience, created_at, removed, salary_start, salary_end, location, benefit, summary, description, contact_email) VALUES
(6, 'Executive Head Chef', 'F&B (Food & Bev)', ARRAY['Culinary Arts degree', '10+ years experience'], ARRAY['Menu development', 'Staff training'], 'full time', '8+', '2026-01-14', false, 7000, 10000, 'onsite', ARRAY['Staff meals', 'Profit sharing'], 'Lead our kitchen team to deliver world-class gourmet cuisine.', 'Manage a top-tier kitchen and set new culinary standards.', 'fnb.ops@tastyhub.com'),
(6, 'Barista Trainer', 'F&B (Food & Bev)', ARRAY['Latte art skills', 'Coffee sourcing knowledge'], ARRAY['Training new baristas', 'Quality control'], 'full time', '0-2', '2026-01-15', false, 2800, 3800, 'onsite', ARRAY['Unlimited coffee', 'Transport'], 'Train the next generation of baristas in the art of coffee making.', 'Passionate about coffee? Lead our training academy.', 'fnb.ops@tastyhub.com'),
(6, 'Pastry Specialist', 'F&B (Food & Bev)', ARRAY['Pastry certification', 'Creativity'], ARRAY['Baking artisanal breads', 'Decorating cakes'], 'full time', '2-5', '2026-01-16', false, 3200, 4800, 'onsite', ARRAY['Insurance', 'Birthday leave'], 'Create artisanal desserts and baked goods for our flagship location.', 'Sweeten our menu with your creative baking expertise.', 'fnb.ops@tastyhub.com');

-- g. Industry: Retail & Sales
INSERT INTO job_post (company_id, title, industry, requirements, responsibilities, employment_type, experience, created_at, removed, salary_start, salary_end, location, benefit, summary, description, contact_email) VALUES
(7, 'Global Sales Director', 'Retail & Sales', ARRAY['MBA preferred', 'Retail leadership experience'], ARRAY['Set global sales targets', 'Lead regional managers'], 'full time', '8+', '2026-01-14', false, 9000, 15000, 'remote', ARRAY['Performance bonus', 'Luxury car'], 'Lead global sales strategy and mentor regional retail teams.', 'Drive our retail empire to new heights across all continents.', 'retail.manager@shopmax.com'),
(7, 'E-commerce Manager', 'Retail & Sales', ARRAY['Shopify/Amazon experience', 'Digital marketing'], ARRAY['Manage online listings', 'Optimize conversion rates'], 'full time', '2-5', '2026-01-15', false, 5000, 7500, 'remote', ARRAY['Work-from-home setup'], 'Optimize online store listings and manage digital inventory systems.', 'Grow our online presence and maximize e-commerce revenue.', 'retail.manager@shopmax.com'),
(7, 'Visual Merchandiser', 'Retail & Sales', ARRAY['Design background', 'Eye for detail'], ARRAY['Window display design', 'In-store layout planning'], 'full time', '2-5', '2026-01-16', false, 3500, 5000, 'onsite', ARRAY['Shopping discount'], 'Create visually stunning store displays that drive customer traffic.', 'Make our stores look amazing and improve the shopping experience.', 'retail.manager@shopmax.com');

-- h. Industry: Logistics & Trades
INSERT INTO job_post (company_id, title, industry, requirements, responsibilities, employment_type, experience, created_at, removed, salary_start, salary_end, location, benefit, summary, description, contact_email) VALUES
(8, 'Supply Chain Coordinator', 'Logistics & Trades', ARRAY['Logistics degree', 'ERP software skills'], ARRAY['Inventory tracking', 'Supplier negotiation'], 'full time', '2-5', '2026-01-14', false, 3800, 5500, 'remote', ARRAY['Transport allowance'], 'Optimize global shipping routes and manage supplier relationships.', 'Ensure our supply chain remains efficient and cost-effective.', 'logistics.head@logimove.com'),
(8, 'Warehouse Operations Lead', 'Logistics & Trades', ARRAY['Forklift license', 'Management experience'], ARRAY['Safety audits', 'Team scheduling'], 'full time', '5-8', '2026-01-15', false, 4200, 6000, 'onsite', ARRAY['Health plan', 'Overtime pay'], 'Oversee inventory management and safety protocols in the warehouse.', 'Keep our logistics hub running smoothly and safely.', 'logistics.head@logimove.com'),
(8, 'Fleet Maintenance Manager', 'Logistics & Trades', ARRAY['Mechanical background', 'Fleet software knowledge'], ARRAY['Preventive maintenance', 'Managing drivers'], 'full time', '0-2', '2026-01-16', false, 4500, 6500, 'onsite', ARRAY['Fuel card'], 'Ensure the safety and efficiency of our global delivery fleet.', 'Maintain our fleet to the highest safe', 'logistics.head@logimove.com');

-- i. Industry: Education
INSERT INTO job_post (company_id, title, industry, requirements, responsibilities, employment_type, experience, created_at, removed, salary_start, salary_end, location, benefit, summary, description, contact_email) VALUES
(9, 'Curriculum Developer', 'Education', ARRAY['Master in Education', 'Instructional design skills'], ARRAY['Creating lesson plans', 'Recording video lectures'], 'full time', '5-8', '2026-01-14', false, 4500, 7000, 'remote', ARRAY['Education budget', 'MacBook'], 'Design comprehensive learning paths and educational materials.', 'Create world-class educational content for a global audience.', 'edu.dean@edulearn.com'),
(9, 'Senior Student Advisor', 'Education', ARRAY['Counseling background', 'Communication skills'], ARRAY['Career coaching', 'Academic planning'], 'full time', '2-5', '2026-01-15', false, 3500, 5000, 'onsite', ARRAY['Medical insurance'], 'Guide students through their educational journeys and career planning.', 'Help students achieve their dreams through expert guidance.', 'edu.dean@edulearn.com'),
(9, 'LMS Administrator', 'Education', ARRAY['IT degree', 'Moodle/Canvas experience'], ARRAY['Maintaining the platform', 'Technical support for tutors'], 'full time', '0-2', '2026-01-16', false, 4000, 5500, 'onsite', ARRAY['Flexible hours'], 'Maintain the technical platform that powers our online learning.', 'Be the technical backbone of our online education ecosystem.', 'edu.dean@edulearn.com');


-- JOB APPLICANT
INSERT INTO "job_applicant" (user_id, job_post_id, status, expected_salary, applied_date, interview_date, interview_time) VALUES 
(12, 1, 'INTERVIEW', 4500, '2026-01-10', '2026-02-15', '10:00AM'),
(15, 1, 'PENDING', 4800, '2026-01-12', NULL, NULL),
(18, 2, 'REJECTED', 5000, '2026-01-05', NULL, NULL),
(20, 3, 'ACCEPTED', 6000, '2026-01-08', '2026-01-20', '02:30PM'),
(22, 4, 'PENDING', 4200, '2026-01-15', NULL, NULL),
(25, 5, 'INTERVIEW', 5500, '2026-01-18', '2026-02-10', '11:00AM'),
(28, 6, 'WITHDRAWN', 4700, '2026-01-20', NULL, NULL),
(30, 7, 'PENDING', 3900, '2026-01-22', NULL, NULL),
(32, 8, 'INTERVIEW', 7000, '2026-01-25', '2026-02-12', '09:00AM'),
(35, 9, 'REJECTED', 3500, '2026-01-28', NULL, NULL),
(2, 10, 'PENDING', 4600, '2026-02-01', NULL, NULL),
(5, 11, 'INTERVIEW', 5200, '2026-02-02', '2026-02-20', '01:00PM'),
(8, 12, 'ACCEPTED', 6500, '2026-01-15', '2026-01-25', '10:30AM'),
(11, 13, 'PENDING', 4400, '2026-02-03', NULL, NULL),
(14, 14, 'REJECTED', 5800, '2026-01-12', NULL, NULL),
(17, 15, 'INTERVIEW', 4900, '2026-02-04', '2026-02-18', '03:00PM'),
(19, 16, 'PENDING', 4100, '2026-02-05', NULL, NULL),
(21, 17, 'WITHDRAWN', 5300, '2026-01-30', NULL, NULL),
(24, 18, 'PENDING', 4700, '2026-02-05', NULL, NULL),
(27, 19, 'INTERVIEW', 6200, '2026-02-01', '2026-02-14', '11:30AM'),
(31, 20, 'REJECTED', 3800, '2026-01-20', NULL, NULL),
(34, 21, 'PENDING', 4500, '2026-02-06', NULL, NULL),
(36, 22, 'INTERVIEW', 5400, '2026-02-02', '2026-02-16', '04:00PM'),
(1, 23, 'ACCEPTED', 5900, '2026-01-10', '2026-01-28', '02:00PM'),
(4, 24, 'PENDING', 4300, '2026-02-07', NULL, NULL),
(7, 25, 'REJECTED', 5100, '2026-01-25', NULL, NULL),
(10, 26, 'INTERVIEW', 4800, '2026-02-05', '2026-02-19', '10:00AM'),
(13, 27, 'PENDING', 4000, '2026-02-08', NULL, NULL),
(16, 1, 'PENDING', 4700, '2026-02-08', NULL, NULL),
(23, 2, 'INTERVIEW', 5200, '2026-02-04', '2026-02-22', '09:30AM'),
(26, 3, 'REJECTED', 6100, '2026-01-18', NULL, NULL),
(29, 4, 'PENDING', 4400, '2026-02-09', NULL, NULL),
(33, 5, 'INTERVIEW', 5600, '2026-02-03', '2026-02-21', '11:00AM'),
(3, 6, 'ACCEPTED', 4900, '2026-01-20', '2026-02-01', '01:30PM'),
(6, 7, 'PENDING', 4100, '2026-02-10', NULL, NULL),
(9, 8, 'REJECTED', 6800, '2026-01-22', NULL, NULL),
(12, 9, 'INTERVIEW', 3700, '2026-02-05', '2026-02-23', '03:30PM'),
(15, 10, 'PENDING', 4500, '2026-02-11', NULL, NULL),
(22, 11, 'WITHDRAWN', 5300, '2026-02-01', NULL, NULL),
(25, 12, 'PENDING', 6400, '2026-02-12', NULL, NULL),
(28, 13, 'INTERVIEW', 4600, '2026-02-06', '2026-02-24', '10:30AM'),
(30, 14, 'REJECTED', 5700, '2026-01-28', NULL, NULL),
(35, 15, 'PENDING', 5000, '2026-02-12', NULL, NULL),
(2, 16, 'INTERVIEW', 4200, '2026-02-07', '2026-02-25', '01:00PM'),
(5, 17, 'ACCEPTED', 5400, '2026-01-30', '2026-02-10', '02:00PM'),
(8, 18, 'PENDING', 4800, '2026-02-13', NULL, NULL),
(11, 19, 'REJECTED', 6300, '2026-02-01', NULL, NULL),
(14, 20, 'INTERVIEW', 3900, '2026-02-08', '2026-02-26', '09:00AM'),
(17, 21, 'PENDING', 4600, '2026-02-14', NULL, NULL),
(20, 22, 'WITHDRAWN', 5500, '2026-02-02', NULL, NULL);

-- -- 11 NOTIFICATION
INSERT INTO notification (user_id, sender_id, company_id, job_post_id, type, message, created_at, is_read) VALUES 
(1, 2, 1, 1, 'APPLICANT_STATUS_CHANGE', 'Interview set for React Dev.', '2026-01-20', false),
(2, 1, 1, 1, 'APPLICANT_NEW', 'Shau applied for React role.', '2026-01-15', true);
