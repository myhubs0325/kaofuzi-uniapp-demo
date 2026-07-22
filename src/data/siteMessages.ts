import { reactive } from "vue";
import type { DemoEvent } from "../composables/useDemoFlow";

export type SiteMessageTone = "blue" | "orange" | "green";

export type SiteMessage = {
  id: string;
  category: "system" | "task";
  title: string;
  summary: string;
  time: string;
  action: DemoEvent;
  tone: SiteMessageTone;
  unread: boolean;
};

export const siteMessages = reactive<SiteMessage[]>([
  {
    id: "daily-task-ready",
    category: "task",
    title: "今日学习任务已准备好",
    summary: "系统已根据最近学情生成今日推荐练习，完成后可查看学习变化。",
    time: "今天 18:00",
    action: "START_TASK",
    tone: "blue",
    unread: true
  },
  {
    id: "teacher-feedback-new",
    category: "system",
    title: "老师有一条新的学习反馈",
    summary: "王老师已更新课堂观察，点击查看孩子最近的进步与关注点。",
    time: "今天 16:20",
    action: "OPEN_TEACHER_FEEDBACK",
    tone: "green",
    unread: true
  },
  {
    id: "school-binding-confirmed",
    category: "system",
    title: "家校绑定已确认",
    summary: "老师与家长已连接，可以在同一处查看孩子的学习信息。",
    time: "昨天 09:30",
    action: "OPEN_SCHOOL_BINDING",
    tone: "orange",
    unread: false
  }
]);

export const addSiteMessage = (message: Omit<SiteMessage, "unread">) => {
  if (siteMessages.some((item) => item.id === message.id)) return;
  siteMessages.unshift({ ...message, unread: true });
};

export const markSiteMessageRead = (id: string) => {
  const message = siteMessages.find((item) => item.id === id);
  if (message) message.unread = false;
};
