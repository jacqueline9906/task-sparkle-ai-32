import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const emailInput = z.object({
  purpose: z.string(),
  recipient: z.string(),
  tone: z.string(),
  keyPoints: z.string().min(1),
  instructions: z.string().optional(),
});

const meetingInput = z.object({
  title: z.string(),
  date: z.string(),
  participants: z.string(),
  notes: z.string().min(1),
  length: z.string().optional(),
});

const planInput = z.object({
  goal: z.string().min(1),
  deadline: z.string(),
  priority: z.string(),
  availableTime: z.string(),
});

const emailSchema = z.object({ subject: z.string(), body: z.string() });
const meetingSchema = z.object({
  summary: z.string(),
  key_points: z.array(z.string()),
  decisions: z.array(z.string()),
  action_items: z.array(
    z.object({
      task: z.string(),
      assignee: z.string(),
      priority: z.string(),
      due_date: z.string(),
    }),
  ),
  follow_up_questions: z.array(z.string()),
});
const planSchema = z.object({
  tasks: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      priority: z.string(),
      duration: z.string(),
      deadline: z.string(),
    }),
  ),
});

async function callAi<T>(schema: z.ZodType<T>, system: string, prompt: string) {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) return { demo: true as const, data: null };

  const { generateText, Output } = await import("ai");
  const { createLovableAiGatewayProvider, DEFAULT_MODEL } = await import("./ai-gateway.server");
  const gateway = createLovableAiGatewayProvider(key);

  const { output } = await generateText({
    model: gateway(DEFAULT_MODEL),
    system,
    prompt,
    output: Output.object({ schema: schema as never }),
  });
  return { demo: false as const, data: output as T };
}

function demoEmail(d: z.infer<typeof emailInput>) {
  const first = d.keyPoints.split(/\n|\./).filter(Boolean)[0]?.trim() ?? "our recent discussion";
  return {
    subject: `${d.purpose}: ${first.slice(0, 60)}`,
    body: `Hi there,\n\nI hope this message finds you well. I'm reaching out regarding ${first}.\n\n${d.keyPoints
      .split("\n")
      .filter(Boolean)
      .map((l) => `• ${l.trim()}`)
      .join(
        "\n",
      )}\n\nPlease let me know if you'd like to discuss any of this in more detail — I'm happy to find a time that suits you.\n\nBest regards,\n[Your name]`,
  };
}

function demoMeeting(d: z.infer<typeof meetingInput>) {
  const lines = d.notes
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  return {
    summary: `${d.title || "The meeting"} covered ${lines.length} discussion threads with ${
      d.participants || "the team"
    }. The group aligned on priorities and agreed on immediate next steps.`,
    key_points: lines.slice(0, 5),
    decisions: lines.slice(0, 2).map((l) => `Agreed: ${l}`),
    action_items: lines.slice(0, 3).map((l, i) => ({
      task: l.slice(0, 80),
      assignee: (d.participants.split(/[,;]/)[i] || "Unassigned").trim(),
      priority: ["High", "Medium", "Low"][i % 3],
      due_date: d.date || "TBD",
    })),
    follow_up_questions: [
      "Who owns the items without a named assignee?",
      "Do the proposed dates fit the wider roadmap?",
    ],
  };
}

function demoPlan(d: z.infer<typeof planInput>) {
  const steps = [
    ["Clarify the outcome", "Write down exactly what success looks like for this goal."],
    ["Break the goal into milestones", "Split the work into 3-4 checkpoints you can measure."],
    ["Gather inputs and resources", "Collect documents, data and people you need before starting."],
    ["Do the core work block", "Protect focused time for the highest-value execution step."],
    ["Review and refine", "Check the output against your original definition of success."],
    ["Share and follow up", "Communicate results and confirm the next owner or action."],
  ];
  return {
    tasks: steps.map(([name, description], i) => ({
      name,
      description,
      priority: i < 2 ? d.priority : i < 4 ? "Medium" : "Low",
      duration: d.availableTime,
      deadline: d.deadline || "TBD",
    })),
  };
}

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => emailInput.parse(d))
  .handler(async ({ data }) => {
    try {
      const res = await callAi(
        emailSchema,
        "You are an expert workplace communication assistant. Write clear, professional emails. Never invent facts the user did not provide; use [placeholders] instead.",
        `Write an email.\nPurpose: ${data.purpose}\nRecipient type: ${data.recipient}\nTone: ${data.tone}\nKey points:\n${data.keyPoints}\nAdditional instructions: ${data.instructions || "none"}`,
      );
      if (res.data) return { ...res.data, demo: false };
    } catch (e) {
      console.error(e);
    }
    return { ...demoEmail(data), demo: true };
  });

export const summarizeMeeting = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => meetingInput.parse(d))
  .handler(async ({ data }) => {
    try {
      const res = await callAi(
        meetingSchema,
        "You are a meeting analyst. Summarize notes faithfully. Do not invent decisions or owners; use 'Unassigned' and 'TBD' when unknown.",
        `Meeting title: ${data.title}\nDate: ${data.date}\nParticipants: ${data.participants}\nSummary length preference: ${data.length || "concise"}\nNotes:\n${data.notes}`,
      );
      if (res.data) return { ...res.data, demo: false };
    } catch (e) {
      console.error(e);
    }
    return { ...demoMeeting(data), demo: true };
  });

export const generateTaskPlan = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => planInput.parse(d))
  .handler(async ({ data }) => {
    try {
      const res = await callAi(
        planSchema,
        "You are a pragmatic productivity coach. Produce 5-8 concrete, sequenced tasks with realistic durations.",
        `Goal: ${data.goal}\nDeadline: ${data.deadline || "not set"}\nOverall priority: ${data.priority}\nAvailable time per session: ${data.availableTime}`,
      );
      if (res.data) return { ...res.data, demo: false };
    } catch (e) {
      console.error(e);
    }
    return { ...demoPlan(data), demo: true };
  });
