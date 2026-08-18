# AI Workplace Hub

Build a modern, responsive web application called AI Workplace Productivity Assistant.

The application is an all-in-one AI productivity platform designed to help professionals automate common workplace tasks, save time, and improve productivity.

The application must feel like a polished, production-ready SaaS product rather than a simple prototype.

CORE FEATURES

The application must integrate these three AI productivity tools into one unified platform:

Smart Email Generator

Meeting Notes Summarizer

AI Task Planner

All three tools should share the same dashboard, navigation, design system, AI service layer, user experience, and data/history system.

1. DASHBOARD

Create a professional dashboard as the main landing page after login.

Header

Display:

AI Workplace Productivity Assistant

Welcome message:

Good morning! 👋

Subtitle:

Work smarter, automate routine tasks, and get more done with AI.

Include:

User profile

Notifications

Settings

Search

Responsive mobile menu

Productivity Overview

Create statistic cards:

Emails Generated

Meetings Summarized

Tasks Planned

Estimated Time Saved

AI Productivity Tools

Create three large feature cards.

Smart Email Generator

Icon: Mail

Description:

"Generate clear, professional emails in seconds using AI."

Button:

Generate Email

Meeting Notes Summarizer

Icon: FileText

Description:

"Transform meeting notes into concise summaries, decisions, and action items."

Button:

Summarize Meeting

AI Task Planner

Icon: CheckSquare

Description:

"Turn goals and tasks into an organized, prioritized action plan."

Button:

Create Task Plan

Recent Activity

Display recently generated:

Emails

Meeting summaries

Task plans

Each item should show:

Title

Type

Date

Short preview

Open button

2. SIDEBAR NAVIGATION

Create a modern collapsible sidebar on desktop and a mobile navigation drawer on smaller screens.

Navigation items:

Dashboard

Smart Email Generator

Meeting Notes Summarizer

AI Task Planner

History

Settings

Use professional icons.

The currently selected page should be clearly highlighted.

At the bottom display:

User profile

Settings

Logout

The sidebar should collapse into icons on smaller desktop screens and become a hamburger menu on mobile.

3. SMART EMAIL GENERATOR

Create a dedicated page:

Smart Email Generator

Subtitle:

Create professional, effective emails with the help of AI.

INPUT SECTION

Create a professional form containing:

Email Purpose

Dropdown:

Follow-up

Meeting Request

Introduction

Thank You

Request

Apology

Announcement

Customer Response

Job Application

Other

Recipient

Dropdown:

Manager

Colleague

Client

Customer

Supplier

Executive

Other

Tone

Options:

Professional

Friendly

Formal

Concise

Persuasive

Casual

Key Points

Large textarea.

Placeholder:

"Describe what you want to communicate..."

Additional Instructions

Optional textarea.

Button:

✨ Generate Email

Show an AI loading animation while generating.

OUTPUT SECTION

Display the generated email in a professional email preview card.

Include:

Subject

Email Body

Buttons:

Copy

Edit

Regenerate

Save

The user must be able to edit the generated email before copying or saving it.

Display a small AI-generated-content label.

4. MEETING NOTES SUMMARIZER

Create a dedicated page:

Meeting Notes Summarizer

Subtitle:

Turn lengthy meeting notes into clear summaries and actionable outcomes.

INPUT SECTION

Provide:

Meeting Title

Text input.

Meeting Date

Date picker.

Participants

Text input.

Meeting Notes

Large textarea.

Placeholder:

"Paste your meeting notes here..."

Also provide:

Upload Notes

Allow supported text/document files where practical.

Button:

✨ Summarize Meeting

AI OUTPUT SECTION

After processing, display:

Executive Summary

A concise overview of the meeting.

Key Discussion Points

Use bullet points.

Decisions Made

Clearly identify decisions.

Action Items

Display a structured table/card:

TaskAssigned ToPriorityDue Date

Follow-up Questions

Show unresolved questions.

Buttons:

Copy Summary

Edit

Regenerate

Save

Download

Show AI processing/loading state while generating.

5. AI TASK PLANNER

Create a dedicated page:

AI Task Planner

Subtitle:

Turn your goals into a practical, prioritized action plan.

INPUT SECTION

Goal

Large textarea.

Placeholder:

"What do you need to accomplish?"

Deadline

Date picker.

Priority

Options:

Low

Medium

High

Urgent

Available Time

Options:

30 minutes

1 hour

2 hours

Half day

Full day

Multiple days

Button:

✨ Create My Plan

AI OUTPUT SECTION

Display:

Goal

Show the user's goal.

AI Recommended Plan

Generate a structured list of tasks.

Each task should include:

Task name

Description

Priority

Estimated duration

Suggested deadline

Status

Allow users to:

Mark task complete

Edit task

Delete task

Add task

Reorder tasks

Display progress:

3 of 8 tasks completed

Include a visual progress bar.

Buttons:

Regenerate Plan

Save Plan

Export Plan

6. HISTORY

Create a unified History page.

Use tabs:

All

Emails

Meetings

Task Plans

Each saved item should display:

Title

Type

Date created

Preview

Open

Delete

Add:

Search

Filtering

Sorting

Allow users to reopen previous AI-generated content.

7. RESPONSIBLE AI DISCLAIMER

Include a clearly visible Responsible AI section.

Display a subtle disclaimer near AI-generated outputs:

Responsible AI: AI-generated content may contain errors or inaccuracies. Always review and verify AI-generated information before using it for important workplace decisions, communications, or commitments.

Also include a Responsible AI page or modal accessible from the footer/settings.

Include principles such as:

Human review

Accuracy verification

Privacy awareness

No sensitive information unless appropriate

AI should support human decision-making, not replace responsible judgment

Do not present AI-generated content as guaranteed factual or authoritative.

8. PROFESSIONAL UI/UX

Use a modern SaaS design.

Requirements:

Clean interface

Professional typography

Excellent spacing

Rounded cards

Subtle shadows

Modern icons

Consistent buttons

Clear visual hierarchy

Accessible contrast

Smooth transitions

Responsive layouts

Mobile-first behavior

Light and dark mode

Use a professional blue/purple AI-inspired visual identity.

Avoid excessive gradients, animations, or visual clutter.

The application should look suitable for a corporate environment.

9. INPUT AND OUTPUT LAYOUT

For desktop screens, use a clear two-column layout where appropriate:

Left: AI Input

Right: AI Output

For mobile devices, automatically stack them vertically:

Input → Generate → Output

The output panel should remain visually distinct from the input form.

Use loading skeletons or animated progress indicators while AI responses are being generated.

10. AI INTEGRATION

Create a centralized AI service architecture.

Implement reusable functions such as:

generateEmail()
summarizeMeeting()
generateTaskPlan()


Keep AI/API logic separate from UI components.

Use environment variables for API credentials.

Never expose secret API keys in client-side code.

If an AI API is not configured, implement a realistic Demo Mode so that the application remains functional.

Clearly label Demo Mode when it is being used.

11. USER EXPERIENCE

Include:

Form validation

Error messages

Loading states

Empty states

Success notifications

Toast messages

Confirmation dialogs

Copy-to-clipboard

Save functionality

Regenerate functionality

Edit functionality

Delete functionality

Do not leave buttons that do nothing.

Every major interaction should provide visible feedback.

12. SETTINGS

Create a Settings page.

Sections:

Profile

Name

Email

Profile image

AI Preferences

Default email tone

Default summary length

Default task priority

Appearance

Light

Dark

System

Notifications

Email notifications

Productivity reminders

Responsible AI

Link to the Responsible AI information.

13. RESPONSIVE DESIGN

The application must work correctly on:

Desktop

Laptop

Tablet

Mobile

On mobile:

Sidebar becomes a hamburger menu

Cards become single-column

Input/output panels stack vertically

Tables become responsive cards

Buttons remain easily tappable

Forms use full available width

14. ACCESSIBILITY

Follow good accessibility practices.

Include:

Proper form labels

Keyboard navigation

Accessible buttons

ARIA labels where appropriate

Visible focus states

Sufficient color contrast

Screen-reader-friendly navigation

15. DATA AND STORAGE

Structure the application so it can later connect to Supabase or another backend.

Create models for:

User

id

name

email

created_at

Generated Email

id

user_id

purpose

recipient

tone

key_points

subject

body

created_at

Meeting Summary

id

user_id

meeting_title

meeting_date

participants

original_notes

summary

decisions

action_items

created_at

Task Plan

id

user_id

goal

deadline

priority

tasks

progress

created_at

For the initial version, local/mock data may be used if no backend is configured.

16. LANDING PAGE

Create a polished public landing page.

Hero:

Work Smarter. Automate More. Get More Done.

Description:

AI Workplace Productivity Assistant brings email generation, meeting summarization, and intelligent task planning together in one powerful productivity workspace.

Primary button:

Get Started

Secondary button:

Explore Features

Feature sections:

Write Better Emails

Generate professional emails tailored to your purpose and tone.

Understand Meetings Faster

Convert meeting notes into summaries, decisions, and actionable tasks.

Plan Work Intelligently

Transform goals into prioritized and manageable action plans.

17. AUTHENTICATION

Prepare the application for authentication.

Include:

Sign Up

Login

Forgot Password

Logout

The dashboard and productivity tools should be protected routes.

If authentication/backend environment variables are not configured, provide a clearly marked demo access mode.

18. TECHNOLOGY

Use:

React

TypeScript

Tailwind CSS

Modern component architecture

Responsive design

Reusable components

Centralized AI service

Environment variables

Clean project structure

Suggested structure:

src/
  components/
  pages/
  layouts/
  services/
  hooks/
  lib/
  types/
  utils/


19. FINAL PRODUCT REQUIREMENT

Build the application end-to-end, not just as static screens.

A user should be able to:

Open the application.

Navigate through the sidebar.

Generate a professional email.

Edit and copy the email.

Summarize meeting notes.

Review decisions and action items.

Create an AI-powered task plan.

Mark tasks as completed.

Track task progress.

Save generated content.

View previous content in History.

Search and filter history.

Manage settings.

Switch between light and dark mode.

View the Responsible AI disclaimer.

Use the application comfortably on mobile, tablet, and desktop.

Make the final application feel like a real, professional AI workplace productivity platform with a cohesive design, intuitive navigation, functional interactions, realistic AI responses, and a strong focus on responsible human oversight.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://task-sparkle-ai-32.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/6fa1dced-cb5b-4efc-b52c-a4ae7c3e03bd).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
