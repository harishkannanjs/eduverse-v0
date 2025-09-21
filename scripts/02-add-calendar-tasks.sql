-- Add calendar tasks table for task management and reminders
CREATE TABLE IF NOT EXISTS public.calendar_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    time TIME,
    type TEXT NOT NULL CHECK (type IN ('assignment', 'reminder', 'event', 'meeting')),
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
    created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    assigned_to UUID[] DEFAULT '{}', -- Array of user IDs
    is_completed BOOLEAN DEFAULT FALSE,
    reminder_settings JSONB DEFAULT '{"enabled": false, "remindBefore": 60, "reminderSent": false}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for calendar tasks
ALTER TABLE public.calendar_tasks ENABLE ROW LEVEL SECURITY;

-- Users can see tasks they created or tasks assigned to them
CREATE POLICY "calendar_tasks_select" ON public.calendar_tasks FOR SELECT USING (
    auth.uid() = created_by OR 
    auth.uid() = ANY(assigned_to) OR
    (array_length(assigned_to, 1) IS NULL AND auth.uid() = created_by)
);

-- Users can insert their own tasks
CREATE POLICY "calendar_tasks_insert" ON public.calendar_tasks FOR INSERT WITH CHECK (
    auth.uid() = created_by
);

-- Users can update tasks they created or completion status for assigned tasks
CREATE POLICY "calendar_tasks_update" ON public.calendar_tasks FOR UPDATE USING (
    auth.uid() = created_by OR 
    (auth.uid() = ANY(assigned_to) AND current_setting('app.update_type', true) = 'completion_only')
);

-- Users can delete tasks they created
CREATE POLICY "calendar_tasks_delete" ON public.calendar_tasks FOR DELETE USING (
    auth.uid() = created_by
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_calendar_tasks_created_by ON public.calendar_tasks(created_by);
CREATE INDEX IF NOT EXISTS idx_calendar_tasks_date ON public.calendar_tasks(date);
CREATE INDEX IF NOT EXISTS idx_calendar_tasks_assigned_to ON public.calendar_tasks USING GIN(assigned_to);

-- Add groups table for study groups functionality
CREATE TABLE IF NOT EXISTS public.study_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    subject TEXT,
    created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    admin_ids UUID[] DEFAULT '{}',
    max_members INTEGER DEFAULT 20,
    current_members INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    is_public BOOLEAN DEFAULT TRUE,
    invite_code TEXT UNIQUE,
    meeting_schedule JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add study group members table
CREATE TABLE IF NOT EXISTS public.study_group_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID REFERENCES public.study_groups(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    user_role TEXT NOT NULL,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(group_id, user_id)
);

-- Add RLS policies for study groups
ALTER TABLE public.study_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_group_members ENABLE ROW LEVEL SECURITY;

-- Users can see public groups or groups they're members of
CREATE POLICY "study_groups_select" ON public.study_groups FOR SELECT USING (
    is_public = true OR 
    auth.uid() IN (
        SELECT user_id FROM public.study_group_members WHERE group_id = id
    )
);

-- Any authenticated user can create groups
CREATE POLICY "study_groups_insert" ON public.study_groups FOR INSERT WITH CHECK (
    auth.uid() = created_by
);

-- Group admins can update groups
CREATE POLICY "study_groups_update" ON public.study_groups FOR UPDATE USING (
    auth.uid() = ANY(admin_ids)
);

-- Group admins can delete groups
CREATE POLICY "study_groups_delete" ON public.study_groups FOR DELETE USING (
    auth.uid() = ANY(admin_ids)
);

-- Members can see their own membership records
CREATE POLICY "study_group_members_select" ON public.study_group_members FOR SELECT USING (
    auth.uid() = user_id OR 
    auth.uid() IN (
        SELECT unnest(admin_ids) FROM public.study_groups WHERE id = group_id
    )
);

-- Users can join groups (insert their own membership)
CREATE POLICY "study_group_members_insert" ON public.study_group_members FOR INSERT WITH CHECK (
    auth.uid() = user_id
);

-- Users can leave groups (delete their own membership) or admins can remove members
CREATE POLICY "study_group_members_delete" ON public.study_group_members FOR DELETE USING (
    auth.uid() = user_id OR 
    auth.uid() IN (
        SELECT unnest(admin_ids) FROM public.study_groups WHERE id = group_id
    )
);

-- Add announcements table
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    target_audience TEXT NOT NULL DEFAULT 'all' CHECK (target_audience IN ('all', 'students', 'teachers', 'parents')),
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for announcements
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Users can see announcements based on their role and target audience
CREATE POLICY "announcements_select" ON public.announcements FOR SELECT USING (
    is_active = true AND (
        target_audience = 'all' OR
        (target_audience = 'students' AND (
            SELECT role FROM public.profiles WHERE id = auth.uid()
        ) IN ('student', 'teacher')) OR
        (target_audience = 'teachers' AND (
            SELECT role FROM public.profiles WHERE id = auth.uid()
        ) = 'teacher') OR
        (target_audience = 'parents' AND (
            SELECT role FROM public.profiles WHERE id = auth.uid()
        ) IN ('parent', 'teacher'))
    )
);

-- Only teachers can create announcements
CREATE POLICY "announcements_insert" ON public.announcements FOR INSERT WITH CHECK (
    auth.uid() = author_id AND (
        SELECT role FROM public.profiles WHERE id = auth.uid()
    ) = 'teacher'
);

-- Authors can update their own announcements
CREATE POLICY "announcements_update" ON public.announcements FOR UPDATE USING (
    auth.uid() = author_id
);

-- Authors can delete their own announcements
CREATE POLICY "announcements_delete" ON public.announcements FOR DELETE USING (
    auth.uid() = author_id
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_study_groups_created_by ON public.study_groups(created_by);
CREATE INDEX IF NOT EXISTS idx_study_groups_is_public ON public.study_groups(is_public);
CREATE INDEX IF NOT EXISTS idx_study_group_members_group_id ON public.study_group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_study_group_members_user_id ON public.study_group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_announcements_author_id ON public.announcements(author_id);
CREATE INDEX IF NOT EXISTS idx_announcements_target_audience ON public.announcements(target_audience);
CREATE INDEX IF NOT EXISTS idx_announcements_created_at ON public.announcements(created_at);

-- Function to generate invite codes for study groups
CREATE OR REPLACE FUNCTION generate_invite_code()
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    result TEXT := '';
    i INTEGER;
BEGIN
    FOR i IN 1..8 LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to automatically set invite code for public groups
CREATE OR REPLACE FUNCTION set_invite_code_for_public_groups()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_public = true AND NEW.invite_code IS NULL THEN
        NEW.invite_code := generate_invite_code();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to set invite code for public groups
CREATE TRIGGER set_invite_code_trigger
    BEFORE INSERT ON public.study_groups
    FOR EACH ROW
    EXECUTE FUNCTION set_invite_code_for_public_groups();

-- Function to update group member count
CREATE OR REPLACE FUNCTION update_group_member_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.study_groups 
        SET current_members = current_members + 1 
        WHERE id = NEW.group_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.study_groups 
        SET current_members = current_members - 1 
        WHERE id = OLD.group_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Triggers to maintain group member count
CREATE TRIGGER update_member_count_on_join
    AFTER INSERT ON public.study_group_members
    FOR EACH ROW
    EXECUTE FUNCTION update_group_member_count();

CREATE TRIGGER update_member_count_on_leave
    AFTER DELETE ON public.study_group_members
    FOR EACH ROW
    EXECUTE FUNCTION update_group_member_count();
