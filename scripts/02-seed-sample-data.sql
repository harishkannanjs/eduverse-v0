-- Seed sample data for EduVerse platform
-- This script populates the database with realistic sample data for demonstration

-- Insert sample subjects
INSERT INTO subjects (id, name, description) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'Mathematics', 'Algebra, Geometry, Calculus, and Statistics'),
    ('550e8400-e29b-41d4-a716-446655440002', 'Science', 'Biology, Chemistry, Physics, and Earth Science'),
    ('550e8400-e29b-41d4-a716-446655440003', 'History', 'World History, American History, and Social Studies'),
    ('550e8400-e29b-41d4-a716-446655440004', 'English', 'Literature, Writing, and Language Arts'),
    ('550e8400-e29b-41d4-a716-446655440005', 'Computer Science', 'Programming, Web Development, and Digital Literacy')
ON CONFLICT (id) DO NOTHING;

-- Insert sample users
INSERT INTO users (id, email, name, role, avatar_url) VALUES
    -- Students
    ('550e8400-e29b-41d4-a716-446655440010', 'alex.johnson@student.edu', 'Alex Johnson', 'student', '/student-avatar.png'),
    ('550e8400-e29b-41d4-a716-446655440011', 'emma.davis@student.edu', 'Emma Davis', 'student', '/student-avatar.png'),
    ('550e8400-e29b-41d4-a716-446655440012', 'jake.wilson@student.edu', 'Jake Wilson', 'student', '/student-avatar.png'),
    ('550e8400-e29b-41d4-a716-446655440013', 'maria.garcia@student.edu', 'Maria Garcia', 'student', '/student-avatar.png'),
    
    -- Teachers
    ('550e8400-e29b-41d4-a716-446655440020', 'sarah.wilson@teacher.edu', 'Sarah Wilson', 'teacher', '/teacher-avatar.png'),
    ('550e8400-e29b-41d4-a716-446655440021', 'john.davis@teacher.edu', 'John Davis', 'teacher', '/teacher-avatar.png'),
    ('550e8400-e29b-41d4-a716-446655440022', 'lisa.martinez@teacher.edu', 'Lisa Martinez', 'teacher', '/teacher-avatar.png'),
    
    -- Parents
    ('550e8400-e29b-41d4-a716-446655440030', 'michael.brown@parent.edu', 'Michael Brown', 'parent', '/parent-avatar.png'),
    ('550e8400-e29b-41d4-a716-446655440031', 'jennifer.davis@parent.edu', 'Jennifer Davis', 'parent', '/parent-avatar.png'),
    ('550e8400-e29b-41d4-a716-446655440032', 'robert.wilson@parent.edu', 'Robert Wilson', 'parent', '/parent-avatar.png')
ON CONFLICT (id) DO NOTHING;

-- Insert sample teachers
INSERT INTO teachers (id, user_id, department, specialization, years_experience) VALUES
    ('550e8400-e29b-41d4-a716-446655440040', '550e8400-e29b-41d4-a716-446655440020', 'Mathematics', ARRAY['Algebra', 'Geometry', 'Pre-Calculus'], 8),
    ('550e8400-e29b-41d4-a716-446655440041', '550e8400-e29b-41d4-a716-446655440021', 'Science', ARRAY['Chemistry', 'Physics'], 12),
    ('550e8400-e29b-41d4-a716-446655440042', '550e8400-e29b-41d4-a716-446655440022', 'History', ARRAY['World History', 'American History'], 6)
ON CONFLICT (id) DO NOTHING;

-- Insert sample students
INSERT INTO students (id, user_id, grade_level, learning_style, parent_id) VALUES
    ('550e8400-e29b-41d4-a716-446655440050', '550e8400-e29b-41d4-a716-446655440010', 10, 'visual', '550e8400-e29b-41d4-a716-446655440030'),
    ('550e8400-e29b-41d4-a716-446655440051', '550e8400-e29b-41d4-a716-446655440011', 10, 'kinesthetic', '550e8400-e29b-41d4-a716-446655440031'),
    ('550e8400-e29b-41d4-a716-446655440052', '550e8400-e29b-41d4-a716-446655440012', 11, 'auditory', '550e8400-e29b-41d4-a716-446655440032'),
    ('550e8400-e29b-41d4-a716-446655440053', '550e8400-e29b-41d4-a716-446655440013', 10, 'mixed', '550e8400-e29b-41d4-a716-446655440030')
ON CONFLICT (id) DO NOTHING;

-- Insert sample classes
INSERT INTO classes (id, name, subject_id, teacher_id, room_number, schedule, max_students) VALUES
    ('550e8400-e29b-41d4-a716-446655440060', 'Algebra II - Period 3', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440040', '204', '{"days": ["Monday", "Wednesday", "Friday"], "time": "10:30-11:30"}', 28),
    ('550e8400-e29b-41d4-a716-446655440061', 'Pre-Calculus - Period 5', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440040', '204', '{"days": ["Tuesday", "Thursday"], "time": "13:00-14:00"}', 24),
    ('550e8400-e29b-41d4-a716-446655440062', 'Chemistry - Period 2', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440041', '301', '{"days": ["Monday", "Wednesday", "Friday"], "time": "09:00-10:00"}', 20),
    ('550e8400-e29b-41d4-a716-446655440063', 'World History - Period 4', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440042', '105', '{"days": ["Tuesday", "Thursday"], "time": "11:30-12:30"}', 30)
ON CONFLICT (id) DO NOTHING;

-- Insert class enrollments
INSERT INTO class_enrollments (student_id, class_id, enrollment_date, status) VALUES
    ('550e8400-e29b-41d4-a716-446655440050', '550e8400-e29b-41d4-a716-446655440060', '2024-09-01', 'active'),
    ('550e8400-e29b-41d4-a716-446655440050', '550e8400-e29b-41d4-a716-446655440062', '2024-09-01', 'active'),
    ('550e8400-e29b-41d4-a716-446655440050', '550e8400-e29b-41d4-a716-446655440063', '2024-09-01', 'active'),
    ('550e8400-e29b-41d4-a716-446655440051', '550e8400-e29b-41d4-a716-446655440060', '2024-09-01', 'active'),
    ('550e8400-e29b-41d4-a716-446655440052', '550e8400-e29b-41d4-a716-446655440061', '2024-09-01', 'active'),
    ('550e8400-e29b-41d4-a716-446655440053', '550e8400-e29b-41d4-a716-446655440060', '2024-09-01', 'active')
ON CONFLICT (student_id, class_id) DO NOTHING;

-- Insert sample lessons
INSERT INTO lessons (id, title, description, class_id, lesson_order, duration_minutes, objectives, resources) VALUES
    ('550e8400-e29b-41d4-a716-446655440070', 'Introduction to Quadratic Equations', 'Learn the basics of quadratic equations and their applications', '550e8400-e29b-41d4-a716-446655440060', 1, 50, ARRAY['Understand quadratic form', 'Identify coefficients', 'Graph basic parabolas'], '{"textbook": "Chapter 4", "videos": ["intro-quadratics.mp4"], "worksheets": ["quadratic-basics.pdf"]}'),
    ('550e8400-e29b-41d4-a716-446655440071', 'Solving Quadratic Equations', 'Methods for solving quadratic equations', '550e8400-e29b-41d4-a716-446655440060', 2, 50, ARRAY['Factoring method', 'Quadratic formula', 'Completing the square'], '{"textbook": "Chapter 4.2", "practice": ["solving-practice.pdf"]}'),
    ('550e8400-e29b-41d4-a716-446655440072', 'Chemical Bonding Basics', 'Understanding ionic and covalent bonds', '550e8400-e29b-41d4-a716-446655440062', 1, 45, ARRAY['Identify bond types', 'Predict molecular shapes', 'Understand electronegativity'], '{"textbook": "Chapter 8", "lab": "bonding-lab.pdf", "simulations": ["molecular-shapes"]}')
ON CONFLICT (id) DO NOTHING;

-- Insert sample assignments
INSERT INTO assignments (id, title, description, class_id, lesson_id, assignment_type, due_date, max_points, instructions) VALUES
    ('550e8400-e29b-41d4-a716-446655440080', 'Quadratic Equations Quiz', 'Test your understanding of quadratic equations', '550e8400-e29b-41d4-a716-446655440060', '550e8400-e29b-41d4-a716-446655440070', 'quiz', '2024-12-20 23:59:00', 100, '{"questions": 15, "time_limit": 45, "topics": ["factoring", "graphing", "applications"]}'),
    ('550e8400-e29b-41d4-a716-446655440081', 'Chemistry Lab Report', 'Document your chemical bonding experiment', '550e8400-e29b-41d4-a716-446655440062', '550e8400-e29b-41d4-a716-446655440072', 'project', '2024-12-22 23:59:00', 50, '{"format": "PDF", "sections": ["hypothesis", "procedure", "results", "conclusion"], "min_pages": 3}')
ON CONFLICT (id) DO NOTHING;

-- Insert sample student progress
INSERT INTO student_progress (student_id, lesson_id, completion_percentage, time_spent_minutes, last_accessed, completed_at) VALUES
    ('550e8400-e29b-41d4-a716-446655440050', '550e8400-e29b-41d4-a716-446655440070', 100, 65, '2024-12-15 14:30:00', '2024-12-15 14:30:00'),
    ('550e8400-e29b-41d4-a716-446655440050', '550e8400-e29b-41d4-a716-446655440071', 75, 45, '2024-12-16 10:15:00', NULL),
    ('550e8400-e29b-41d4-a716-446655440050', '550e8400-e29b-41d4-a716-446655440072', 90, 55, '2024-12-16 15:20:00', '2024-12-16 15:20:00')
ON CONFLICT (student_id, lesson_id) DO NOTHING;

-- Insert sample assignment submissions
INSERT INTO assignment_submissions (assignment_id, student_id, submission_content, submitted_at, score, feedback, graded_at, graded_by, status) VALUES
    ('550e8400-e29b-41d4-a716-446655440080', '550e8400-e29b-41d4-a716-446655440050', '{"answers": ["x=2,3", "x=-1,4", "x=0,5"], "work_shown": true}', '2024-12-18 16:45:00', 94, 'Excellent work! Minor error in problem 3.', '2024-12-19 09:30:00', '550e8400-e29b-41d4-a716-446655440040', 'graded')
ON CONFLICT (assignment_id, student_id) DO NOTHING;

-- Insert sample conversations
INSERT INTO conversations (id, title, conversation_type, created_by) VALUES
    ('550e8400-e29b-41d4-a716-446655440090', 'Math Help - Alex & Mrs. Wilson', 'direct', '550e8400-e29b-41d4-a716-446655440010'),
    ('550e8400-e29b-41d4-a716-446655440091', 'Parent Conference - Alex Progress', 'group', '550e8400-e29b-41d4-a716-446655440020')
ON CONFLICT (id) DO NOTHING;

-- Insert conversation participants
INSERT INTO conversation_participants (conversation_id, user_id, role) VALUES
    ('550e8400-e29b-41d4-a716-446655440090', '550e8400-e29b-41d4-a716-446655440010', 'member'),
    ('550e8400-e29b-41d4-a716-446655440090', '550e8400-e29b-41d4-a716-446655440020', 'member'),
    ('550e8400-e29b-41d4-a716-446655440091', '550e8400-e29b-41d4-a716-446655440020', 'admin'),
    ('550e8400-e29b-41d4-a716-446655440091', '550e8400-e29b-41d4-a716-446655440030', 'member')
ON CONFLICT (conversation_id, user_id) DO NOTHING;

-- Insert sample messages
INSERT INTO messages (sender_id, conversation_id, content, sent_at) VALUES
    ('550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440090', 'Could you explain the quadratic formula again? I''m still confused about the discriminant part.', '2024-12-16 14:30:00'),
    ('550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440090', 'Of course! The discriminant is b²-4ac. It tells us how many real solutions the equation has. Would you like me to show you some examples?', '2024-12-16 14:45:00'),
    ('550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440091', 'Alex did exceptionally well on today''s quiz! His understanding of quadratic equations has really improved.', '2024-12-18 17:00:00'),
    ('550e8400-e29b-41d4-a716-446655440030', '550e8400-e29b-41d4-a716-446655440091', 'That''s wonderful to hear! We''ve been working on practice problems at home.', '2024-12-18 17:15:00');

-- Insert sample AI insights
INSERT INTO ai_insights (user_id, insight_type, title, description, priority, actionable, metadata, is_read) VALUES
    ('550e8400-e29b-41d4-a716-446655440010', 'recommendation', 'Focus on Quadratic Equations', 'Based on your recent quiz results, spending more time on quadratic equations could improve your algebra scores by 15%.', 'medium', true, '{"suggested_resources": ["khan_academy_quadratics", "practice_worksheets"], "estimated_improvement": 15}', false),
    ('550e8400-e29b-41d4-a716-446655440010', 'achievement', 'Perfect Score Achievement', 'Congratulations! You scored 100% on your recent algebra quiz.', 'low', false, '{"quiz_id": "550e8400-e29b-41d4-a716-446655440080", "score": 94}', false),
    ('550e8400-e29b-41d4-a716-446655440020', 'alert', 'Students Need Attention', 'Emma, Jake, and Maria have shown declining performance in recent assignments.', 'high', true, '{"student_ids": ["550e8400-e29b-41d4-a716-446655440051", "550e8400-e29b-41d4-a716-446655440052", "550e8400-e29b-41d4-a716-446655440053"], "decline_percentage": 12}', false);

-- Insert sample student analytics
INSERT INTO student_analytics (student_id, subject_id, date_recorded, scores, time_spent_minutes, lessons_completed, assignments_completed, strengths, weaknesses, learning_velocity, engagement_score) VALUES
    ('550e8400-e29b-41d4-a716-446655440050', '550e8400-e29b-41d4-a716-446655440001', '2024-12-16', '[78, 82, 85, 88, 92, 89, 94]', 360, 12, 8, ARRAY['Problem solving', 'Logical reasoning', 'Pattern recognition'], ARRAY['Word problems', 'Time management'], 2.5, 85),
    ('550e8400-e29b-41d4-a716-446655440050', '550e8400-e29b-41d4-a716-446655440002', '2024-12-16', '[72, 75, 78, 82, 85]', 280, 8, 5, ARRAY['Laboratory skills', 'Data analysis'], ARRAY['Chemical equations', 'Molecular structure'], 1.8, 78);

-- Insert sample wellness data
INSERT INTO wellness_data (student_id, date_recorded, mood_rating, stress_level, sleep_hours, study_hours, physical_activity_minutes, notes) VALUES
    ('550e8400-e29b-41d4-a716-446655440050', '2024-12-16', 8, 4, 7.5, 3.5, 45, 'Feeling confident about math quiz tomorrow'),
    ('550e8400-e29b-41d4-a716-446655440050', '2024-12-15', 7, 6, 6.8, 4.2, 30, 'Stressed about chemistry lab report');

-- Insert sample announcements
INSERT INTO announcements (title, content, author_id, target_audience, priority, published_at, expires_at) VALUES
    ('Parent-Teacher Conference Week', 'Virtual conferences are scheduled for next week. Please check your email for time slots and meeting links.', '550e8400-e29b-41d4-a716-446655440020', 'parents', 'high', '2024-12-16 08:00:00', '2024-12-23 23:59:00'),
    ('Math Department Update', 'New interactive learning tools have been added to the algebra curriculum. Students can access them through the lesson portal.', '550e8400-e29b-41d4-a716-446655440020', 'students', 'medium', '2024-12-15 10:00:00', '2024-12-30 23:59:00'),
    ('Wellness Week Activities', 'Join us for mindfulness sessions and stress management workshops this week. Sign up in the student portal.', '550e8400-e29b-41d4-a716-446655440020', 'all', 'low', '2024-12-14 09:00:00', '2024-12-21 23:59:00');

-- Insert sample study groups
INSERT INTO study_groups (id, name, description, subject_id, created_by, max_members, meeting_schedule) VALUES
    ('550e8400-e29b-41d4-a716-446655440100', 'Chemistry Champions', 'Study group for advanced chemistry topics and lab work preparation.', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440021', 12, '{"days": ["Wednesday", "Friday"], "time": "15:30-16:30", "location": "Library Room 201"}'),
    ('550e8400-e29b-41d4-a716-446655440101', 'Math Masters', 'Collaborative problem-solving for algebra and pre-calculus students.', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440020', 8, '{"days": ["Tuesday", "Thursday"], "time": "16:00-17:00", "location": "Math Lab"}'),
    ('550e8400-e29b-41d4-a716-446655440102', 'History Buffs', 'Discussion group for world history topics and research projects.', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440022', 15, '{"days": ["Monday"], "time": "15:00-16:30", "location": "History Classroom"}}')
ON CONFLICT (id) DO NOTHING;

-- Insert study group memberships
INSERT INTO study_group_members (group_id, user_id, role) VALUES
    ('550e8400-e29b-41d4-a716-446655440100', '550e8400-e29b-41d4-a716-446655440021', 'admin'),
    ('550e8400-e29b-41d4-a716-446655440100', '550e8400-e29b-41d4-a716-446655440010', 'member'),
    ('550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440020', 'admin'),
    ('550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440010', 'member'),
    ('550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440051', 'member')
ON CONFLICT (group_id, user_id) DO NOTHING;
