export type User = {
  id: string;
  name: string;
  email: string;
  created_at: string;
  avatar?: string;
};

export type GeneratedEmail = {
  id: string;
  user_id: string;
  purpose: string;
  recipient: string;
  tone: string;
  key_points: string;
  instructions?: string;
  subject: string;
  body: string;
  created_at: string;
  demo?: boolean;
};

export type ActionItem = {
  task: string;
  assignee: string;
  priority: "Low" | "Medium" | "High" | "Urgent" | string;
  due_date: string;
};

export type MeetingSummary = {
  id: string;
  user_id: string;
  meeting_title: string;
  meeting_date: string;
  participants: string;
  original_notes: string;
  summary: string;
  key_points: string[];
  decisions: string[];
  action_items: ActionItem[];
  follow_up_questions: string[];
  created_at: string;
  demo?: boolean;
};

export type PlanTask = {
  id: string;
  name: string;
  description: string;
  priority: string;
  duration: string;
  deadline: string;
  status: "todo" | "done";
};

export type TaskPlan = {
  id: string;
  user_id: string;
  goal: string;
  deadline: string;
  priority: string;
  available_time: string;
  tasks: PlanTask[];
  created_at: string;
  demo?: boolean;
};

export type HistoryKind = "email" | "meeting" | "plan";

export type Preferences = {
  defaultTone: string;
  defaultSummaryLength: string;
  defaultPriority: string;
  theme: "light" | "dark" | "system";
  emailNotifications: boolean;
  productivityReminders: boolean;
};
