-- Seed sample data for EduVerse platform
-- This populates the database with realistic test data

-- Insert subjects
INSERT INTO subjects (name, description, color, icon) VALUES
('Mathematics', 'Numbers, algebra, geometry, and problem-solving', '#3B82F6', 'calculator'),
('Science', 'Physics, chemistry, biology, and scientific method', '#10B981', 'microscope'),
('History', 'World history, civilizations, and historical analysis', '#F59E0B', 'scroll'),
('English Language Arts', 'Reading, writing, literature, and communication', '#EF4444', 'book'),
('Computer Science', 'Programming, algorithms, and digital literacy', '#8B5CF6', 'laptop');

-- Insert sample users (teachers)
INSERT INTO users (email, password_hash, role, first_name, last_name, phone, date_of_birth) VALUES
('sarah.johnson@eduverse.com', '$2b$10$example_hash_1', 'teacher', 'Sarah', 'Johnson', '555-0101', '1985-03-15'),
('michael.chen@eduverse.com', '$2b$10$example_hash_2', 'teacher', 'Michael', 'Chen', '555-0102', '1982-07-22'),
('emily.davis@eduverse.com', '$2b$10$example_hash_3', 'teacher', 'Emily', 'Davis', '555-0103', '1988-11-08'),
('david.wilson@eduverse.com', '$2b$10$example_hash_4', 'teacher', 'David', 'Wilson', '555-0104', '1980-05-30'),
('lisa.brown@eduverse.com', '$2b$10$example_hash_5', 'teacher', 'Lisa', 'Brown', '555-0105', '1987-09-12');

-- Insert sample users (students)
INSERT INTO users (email, password_hash, role, first_name, last_name, phone, date_of_birth) VALUES
('alex.smith@student.eduverse.com', '$2b$10$example_hash_6', 'student', 'Alex', 'Smith', '555-0201', '2008-01-15'),
('emma.garcia@student.eduverse.com', '$2b$10$example_hash_7', 'student', 'Emma', 'Garcia', '555-0202', '2007-12-03'),
('noah.martinez@student.eduverse.com', '$2b$10$example_hash_8', 'student', 'Noah', 'Martinez', '555-0203', '2008-04-18'),
('sophia.lee@student.eduverse.com', '$2b$10$example_hash_9', 'student', 'Sophia', 'Lee', '555-0204', '2007-08-25'),
('liam.taylor@student.eduverse.com', '$2b$10$example_hash_10', 'student', 'Liam', 'Taylor', '555-0205', '2008-02-10');

-- Insert sample users (parents)
INSERT INTO users (email, password_hash, role, first_name, last_name, phone, date_of_birth) VALUES
('john.smith@parent.eduverse.com', '$2b$10$example_hash_11', 'parent', 'John', 'Smith', '555-0301', '1975-06-20'),
('maria.garcia@parent.eduverse.com', '$2b$10$example_hash_12', 'parent', 'Maria', 'Garcia', '555-0302', '1978-03-14'),
('robert.martinez@parent.eduverse.com', '$2b$10$example_hash_13', 'parent', 'Robert', 'Martinez', '555-0303', '1973-11-08'),
('jennifer.lee@parent.eduverse.com', '$2b$10$example_hash_14', 'parent', 'Jennifer', 'Lee', '555-0304', '1980-07-22'),
('william.taylor@parent.eduverse.com', '$2b$10$example_hash_15', 'parent', 'William', 'Taylor', '555-0305', '1976-09-15');

-- Insert teachers data
INSERT INTO teachers (user_id, employee_id, department, specialization, years_experience, qualifications) VALUES
(1, 'T001', 'Mathematics', ARRAY['Algebra', 'Geometry', 'Calculus'], 8, ARRAY['M.Ed Mathematics', 'B.S. Mathematics']),
(2, 'T002', 'Science', ARRAY['Physics', 'Chemistry'], 12, ARRAY['Ph.D. Physics', 'M.S. Chemistry']),
(3, 'T003', 'History', ARRAY['World History', 'American History'], 6, ARRAY['M.A. History', 'B.A. History']),
(4, 'T004', 'English', ARRAY['Literature', 'Creative Writing'], 10, ARRAY['M.F.A. Creative Writing', 'B.A. English']),
(5, 'T005', 'Computer Science', ARRAY['Programming', 'Web Development'], 5, ARRAY['M.S. Computer Science', 'B.S. Software Engineering']);

-- Insert students data
INSERT INTO students (user_id, student_id, grade_level, parent_id, emergency_contact, learning_preferences) VALUES
(6, 'S001', 10, 11, 'John Smith - 555-0301', '{"learning_style": "visual", "preferred_subjects": ["math", "science"]}'),
(7, 'S002', 10, 12, 'Maria Garcia - 555-0302', '{"learning_style": "auditory", "preferred_subjects": ["english", "history"]}'),
(8, 'S003', 10, 13, 'Robert Martinez - 555-0303', '{"learning_style": "kinesthetic", "preferred_subjects": ["science", "computer_science"]}'),
(9, 'S004', 10, 14, 'Jennifer Lee - 555-0304', '{"learning_style": "visual", "preferred_subjects": ["math", "english"]}'),
(10, 'S005', 10, 15, 'William Taylor - 555-0305', '{"learning_style": "auditory", "preferred_subjects": ["history", "computer_science"]}');

-- Insert parents data
INSERT INTO parents (user_id, occupation, relationship_to_student) VALUES
(11, 'Software Engineer', 'Father'),
(12, 'Nurse', 'Mother'),
(13, 'Teacher', 'Father'),
(14, 'Marketing Manager', 'Mother'),
(15, 'Accountant', 'Father');

-- Insert classes
INSERT INTO classes (name, subject_id, teacher_id, grade_level, description, schedule, max_students) VALUES
('Advanced Algebra', 1, 1, 10, 'Advanced algebraic concepts and problem-solving', '{"days": ["Monday", "Wednesday", "Friday"], "time": "09:00-10:00"}', 25),
('Physics Fundamentals', 2, 2, 10, 'Introduction to physics principles and experiments', '{"days": ["Tuesday", "Thursday"], "time": "10:00-11:30"}', 20),
('World History', 3, 3, 10, 'Comprehensive study of world civilizations', '{"days": ["Monday", "Wednesday", "Friday"], "time": "11:00-12:00"}', 30),
('English Literature', 4, 4, 10, 'Analysis of classic and contemporary literature', '{"days": ["Tuesday", "Thursday"], "time": "13:00-14:30"}', 25),
('Introduction to Programming', 5, 5, 10, 'Basic programming concepts using Python', '{"days": ["Monday", "Wednesday"], "time": "14:00-15:30"}', 20);

-- Insert class enrollments
INSERT INTO class_enrollments (class_id, student_id, enrollment_date, status) VALUES
(1, 1, '2024-09-01', 'active'),
(1, 2, '2024-09-01', 'active'),
(1, 3, '2024-09-01', 'active'),
(2, 1, '2024-09-01', 'active'),
(2, 3, '2024-09-01', 'active'),
(2, 4, '2024-09-01', 'active'),
(3, 2, '2024-09-01', 'active'),
(3, 4, '2024-09-01', 'active'),
(3, 5, '2024-09-01', 'active'),
(4, 1, '2024-09-01', 'active'),
(4, 2, '2024-09-01', 'active'),
(4, 4, '2024-09-01', 'active'),
(5, 3, '2024-09-01', 'active'),
(5, 5, '2024-09-01', 'active');

-- Insert lessons
INSERT INTO lessons (class_id, title, description, content, lesson_type, duration_minutes, scheduled_date, learning_objectives) VALUES
(1, 'Quadratic Equations', 'Solving quadratic equations using various methods', 'Learn to solve quadratic equations using factoring, completing the square, and the quadratic formula.', 'lecture', 60, '2024-09-16 09:00:00', ARRAY['Understand quadratic equations', 'Apply solving methods', 'Graph quadratic functions']),
(1, 'Systems of Equations', 'Solving systems of linear equations', 'Methods for solving systems including substitution and elimination.', 'practice', 60, '2024-09-18 09:00:00', ARRAY['Solve systems by substitution', 'Solve systems by elimination', 'Interpret solutions graphically']),
(2, 'Newton''s Laws of Motion', 'Understanding the three laws of motion', 'Comprehensive study of Newton''s three laws and their applications.', 'lecture', 90, '2024-09-17 10:00:00', ARRAY['State Newton''s three laws', 'Apply laws to real-world problems', 'Calculate forces and acceleration']),
(3, 'Ancient Civilizations', 'Study of early human civilizations', 'Exploration of Mesopotamia, Egypt, and Indus Valley civilizations.', 'lecture', 60, '2024-09-16 11:00:00', ARRAY['Identify key civilizations', 'Compare social structures', 'Analyze historical sources']),
(5, 'Variables and Data Types', 'Introduction to Python variables', 'Learn about different data types and variable assignment in Python.', 'hands-on', 90, '2024-09-16 14:00:00', ARRAY['Declare variables', 'Use different data types', 'Perform basic operations']);

-- Insert lesson progress
INSERT INTO lesson_progress (lesson_id, student_id, status, progress_percentage, time_spent_minutes, last_accessed) VALUES
(1, 1, 'completed', 100, 65, '2024-09-16 10:00:00'),
(1, 2, 'in_progress', 75, 45, '2024-09-16 09:45:00'),
(1, 3, 'completed', 100, 70, '2024-09-16 10:05:00'),
(2, 1, 'not_started', 0, 0, NULL),
(3, 1, 'in_progress', 60, 35, '2024-09-17 10:30:00'),
(3, 3, 'completed', 100, 85, '2024-09-17 11:15:00'),
(3, 4, 'in_progress', 40, 25, '2024-09-17 10:20:00'),
(5, 3, 'completed', 100, 95, '2024-09-16 15:30:00'),
(5, 5, 'in_progress', 80, 75, '2024-09-16 15:15:00');

-- Insert assignments
INSERT INTO assignments (class_id, title, description, assignment_type, due_date, max_points, instructions) VALUES
(1, 'Quadratic Equations Practice', 'Solve 20 quadratic equations using different methods', 'homework', '2024-09-20 23:59:00', 100, 'Complete all problems showing your work. Use at least two different solving methods.'),
(2, 'Forces Lab Report', 'Write a lab report on the forces experiment', 'lab_report', '2024-09-25 23:59:00', 150, 'Include hypothesis, methodology, results, and conclusion. Minimum 3 pages.'),
(3, 'Civilization Comparison Essay', 'Compare two ancient civilizations', 'essay', '2024-09-22 23:59:00', 120, 'Write a 5-paragraph essay comparing social, political, and economic aspects.'),
(4, 'Poetry Analysis', 'Analyze a poem of your choice', 'analysis', '2024-09-24 23:59:00', 100, 'Choose a poem and analyze its themes, literary devices, and meaning.'),
(5, 'Python Variables Exercise', 'Complete programming exercises on variables', 'coding', '2024-09-19 23:59:00', 80, 'Complete all exercises in the provided Python notebook.');

-- Insert assignment submissions
INSERT INTO assignment_submissions (assignment_id, student_id, submission_text, submitted_at, grade, feedback, graded_at, graded_by) VALUES
(1, 1, 'Completed all 20 problems with detailed solutions...', '2024-09-19 20:30:00', 95, 'Excellent work! Minor error in problem 15.', '2024-09-20 08:00:00', 1),
(1, 3, 'Solutions for quadratic equations assignment...', '2024-09-20 22:45:00', 88, 'Good understanding shown. Check your arithmetic in problems 8 and 12.', '2024-09-21 09:15:00', 1),
(5, 3, 'Python code with variable exercises completed...', '2024-09-18 16:20:00', 92, 'Great job! Code is clean and well-commented.', '2024-09-19 10:30:00', 5),
(5, 5, 'Variable exercises with explanations...', '2024-09-19 21:10:00', 85, 'Good work. Consider using more descriptive variable names.', '2024-09-20 11:00:00', 5);

-- Insert quizzes
INSERT INTO quizzes (class_id, title, description, questions, time_limit_minutes, max_attempts, due_date) VALUES
(1, 'Algebra Basics Quiz', 'Test your understanding of basic algebra', '[{"question": "Solve for x: 2x + 5 = 13", "type": "multiple_choice", "options": ["x = 4", "x = 6", "x = 8", "x = 9"], "correct": 0}, {"question": "What is the slope of y = 3x + 2?", "type": "short_answer", "correct": "3"}]', 30, 2, '2024-09-21 23:59:00'),
(2, 'Physics Concepts Quiz', 'Quiz on Newton''s laws and forces', '[{"question": "State Newton''s first law", "type": "short_answer", "correct": "An object at rest stays at rest and an object in motion stays in motion unless acted upon by an external force"}]', 45, 1, '2024-09-23 23:59:00');

-- Insert quiz attempts
INSERT INTO quiz_attempts (quiz_id, student_id, answers, score, max_score, started_at, completed_at, time_taken_minutes) VALUES
(1, 1, '[{"question": 0, "answer": 0}, {"question": 1, "answer": "3"}]', 100, 100, '2024-09-20 15:00:00', '2024-09-20 15:25:00', 25),
(1, 2, '[{"question": 0, "answer": 1}, {"question": 1, "answer": "3"}]', 50, 100, '2024-09-20 16:00:00', '2024-09-20 16:20:00', 20),
(1, 3, '[{"question": 0, "answer": 0}, {"question": 1, "answer": "3"}]', 100, 100, '2024-09-21 14:30:00', '2024-09-21 14:50:00', 20);

-- Insert conversations
INSERT INTO conversations (title, conversation_type, created_by) VALUES
('Math Study Group', 'group', 6),
('Parent-Teacher Conference - Alex Smith', 'direct', 1),
('School Announcements', 'announcement', 1),
('Physics Lab Partners', 'group', 8),
('Homework Help - Quadratic Equations', 'group', 7);

-- Insert conversation participants
INSERT INTO conversation_participants (conversation_id, user_id, role) VALUES
(1, 6, 'admin'), (1, 7, 'member'), (1, 9, 'member'),
(2, 1, 'admin'), (2, 11, 'member'),
(3, 1, 'admin'), (3, 6, 'member'), (3, 7, 'member'), (3, 8, 'member'), (3, 9, 'member'), (3, 10, 'member'),
(4, 8, 'admin'), (4, 6, 'member'), (4, 9, 'member'),
(5, 7, 'admin'), (5, 6, 'member'), (5, 8, 'member');

-- Insert messages
INSERT INTO messages (conversation_id, sender_id, content, message_type, sent_at) VALUES
(1, 6, 'Hey everyone! Let''s meet tomorrow to review quadratic equations.', 'text', '2024-09-15 18:30:00'),
(1, 7, 'Sounds great! I''m struggling with the quadratic formula.', 'text', '2024-09-15 18:35:00'),
(1, 9, 'I can help with that! Let''s meet in the library at 3 PM.', 'text', '2024-09-15 18:40:00'),
(2, 1, 'Hello Mr. Smith, I wanted to discuss Alex''s progress in mathematics.', 'text', '2024-09-14 10:00:00'),
(2, 11, 'Thank you for reaching out. How is Alex doing?', 'text', '2024-09-14 10:15:00'),
(2, 1, 'Alex is doing very well! He scored 95% on the recent assignment.', 'text', '2024-09-14 10:20:00'),
(3, 1, 'Reminder: Parent-teacher conferences are scheduled for next week.', 'text', '2024-09-13 09:00:00'),
(4, 8, 'Who wants to be my lab partner for the forces experiment?', 'text', '2024-09-16 12:00:00'),
(4, 6, 'I''d like to partner with you!', 'text', '2024-09-16 12:05:00'),
(5, 7, 'Can someone explain how to complete the square?', 'text', '2024-09-16 19:00:00'),
(5, 6, 'First, you move the constant to the right side...', 'text', '2024-09-16 19:10:00');

-- Insert AI insights
INSERT INTO ai_insights (user_id, insight_type, title, description, data, confidence_score, generated_at) VALUES
(6, 'learning_pattern', 'Strong Visual Learner', 'Alex shows excellent performance with visual learning materials', '{"learning_style": "visual", "performance_boost": 15, "recommended_materials": ["diagrams", "charts", "videos"]}', 0.92, '2024-09-15 08:00:00'),
(6, 'performance_prediction', 'Math Performance Trending Up', 'Based on recent assignments, Alex is likely to excel in upcoming math assessments', '{"subject": "mathematics", "predicted_grade": "A", "confidence": 0.88}', 0.88, '2024-09-16 07:30:00'),
(7, 'learning_recommendation', 'Consider Additional Reading Practice', 'Emma would benefit from extra reading comprehension exercises', '{"subject": "english", "recommendation": "reading_practice", "estimated_improvement": 12}', 0.85, '2024-09-15 08:15:00'),
(8, 'wellness_alert', 'Monitor Stress Levels', 'Noah has reported higher stress levels recently', '{"stress_trend": "increasing", "recommended_action": "counselor_meeting", "urgency": "medium"}', 0.78, '2024-09-16 09:00:00'),
(1, 'teaching_insight', 'Class Engagement Analysis', 'Your physics class shows high engagement during hands-on experiments', '{"class_id": 2, "engagement_score": 0.91, "best_activities": ["experiments", "demonstrations"]}', 0.89, '2024-09-16 06:00:00');

-- Insert wellness check-ins
INSERT INTO wellness_checkins (student_id, mood_rating, stress_level, sleep_hours, notes, checkin_date) VALUES
(1, 4, 2, 8.5, 'Feeling good about the math test results!', '2024-09-16'),
(1, 5, 1, 8.0, 'Great day overall, enjoyed the physics lab.', '2024-09-15'),
(2, 3, 3, 7.0, 'A bit worried about the upcoming essay deadline.', '2024-09-16'),
(3, 2, 4, 6.5, 'Stressed about multiple assignments due this week.', '2024-09-16'),
(3, 3, 3, 7.5, 'Better today, got help with programming assignment.', '2024-09-15'),
(4, 4, 2, 8.0, 'Excited about the poetry analysis project.', '2024-09-16'),
(5, 4, 2, 7.5, 'Looking forward to the history presentation.', '2024-09-16');

-- Insert study groups
INSERT INTO study_groups (name, description, subject_id, created_by, max_members, meeting_schedule) VALUES
('Algebra Masters', 'Study group focused on mastering algebraic concepts', 1, 1, 8, '{"days": ["Tuesday", "Thursday"], "time": "15:00-16:30", "location": "Library Room 201"}'),
('Physics Explorers', 'Hands-on physics problem solving group', 2, 3, 6, '{"days": ["Wednesday"], "time": "16:00-17:30", "location": "Science Lab 1"}'),
('History Buffs', 'Discussion group for history enthusiasts', 3, 4, 10, '{"days": ["Friday"], "time": "14:00-15:30", "location": "Classroom 305"}'),
('Code Warriors', 'Programming practice and project collaboration', 5, 5, 8, '{"days": ["Monday", "Wednesday"], "time": "15:30-17:00", "location": "Computer Lab"}');

-- Insert study group members
INSERT INTO study_group_members (group_id, student_id, role) VALUES
(1, 1, 'admin'), (1, 2, 'member'), (1, 4, 'member'),
(2, 1, 'member'), (2, 3, 'admin'), (2, 4, 'member'),
(3, 2, 'member'), (3, 4, 'admin'), (3, 5, 'member'),
(4, 3, 'admin'), (4, 5, 'member');

-- Insert announcements
INSERT INTO announcements (title, content, author_id, target_audience, priority, published_at, expires_at) VALUES
('Parent-Teacher Conferences Next Week', 'Parent-teacher conferences are scheduled for September 23-25. Please check your email for your assigned time slot.', 1, 'parents', 'high', '2024-09-16 08:00:00', '2024-09-25 23:59:00'),
('New Library Hours', 'The school library will now be open until 6 PM on weekdays to provide more study time for students.', 2, 'all', 'normal', '2024-09-15 12:00:00', '2024-10-15 23:59:00'),
('Science Fair Registration Open', 'Registration for the annual science fair is now open! Deadline for submissions is October 15th.', 2, 'students', 'normal', '2024-09-14 09:00:00', '2024-10-15 23:59:00'),
('Midterm Exam Schedule Released', 'Midterm examination schedules have been posted on the student portal. Please review your exam dates and times.', 3, 'students', 'high', '2024-09-13 10:00:00', '2024-10-01 23:59:00'),
('School Closure - Weather Advisory', 'Due to severe weather conditions, school will be closed tomorrow, September 17th. All classes will be conducted online.', 1, 'all', 'urgent', '2024-09-16 16:00:00', '2024-09-17 23:59:00');

COMMIT;
