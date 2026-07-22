<template>
  <main :class="['uni-demo-layout', displayModeClass]">
    <section class="uni-demo-device">
      <HomePage
        v-if="currentScreen === 'home'"
        @navigate="handleNav"
        @action="handleAction"
      />
      <AgentPage
        v-else-if="currentScreen === 'agent'"
        @navigate="handleNav"
        @action="handleAction"
      />
      <AgentResultPage
        v-else-if="currentScreen === 'agentResult'"
        @navigate="handleNav"
        @action="handleAction"
      />
      <LearningPage
        v-else-if="currentScreen === 'learning'"
        @navigate="handleNav"
        @action="handleAction"
      />
      <ProfilePage
        v-else-if="currentScreen === 'profile'"
        :active-child-id="activeChildId"
        :child-options="childOptions"
        :elder-mode="isElderMode"
        :switch-child="switchChild"
        @navigate="handleNav"
        @action="handleAction"
        @toggle-elder-mode="setElderMode"
      />
      <SiteMessagesPage
        v-else-if="currentScreen === 'messages'"
        @navigate="handleNav"
        @action="handleAction"
      />
      <SchoolBindingPage
        v-else-if="currentScreen === 'schoolBinding'"
        @navigate="handleNav"
        @action="handleAction"
      />
      <LearningReminderPage
        v-else-if="currentScreen === 'learningReminder'"
        @navigate="handleNav"
        @action="handleAction"
      />
      <DataPrivacyPage
        v-else-if="currentScreen === 'dataPrivacy'"
        :active-child-id="activeChildId"
        :children="childOptions"
        :add-child="addChild"
        :update-child="updateChild"
        :delete-child="deleteChild"
        :set-current-child="selectCurrentChild"
        @navigate="handleNav"
        @action="handleAction"
      />
      <AccountSettingsPage
        v-else-if="currentScreen === 'accountSettings'"
        @navigate="handleNav"
        @action="handleAction"
      />
      <AccountCancelPage
        v-else-if="currentScreen === 'accountCancel'"
        @navigate="handleNav"
        @action="handleAction"
      />
      <WrongBookPage
        v-else-if="currentScreen === 'wrongBook'"
        @navigate="handleNav"
        @action="handleAction"
        @open-detail="openWrongBookDetail"
        @open-practice="startPracticeFromSource($event)"
      />
      <WrongBookDetailPage
        v-else-if="currentScreen === 'wrongBookDetail'"
        :topic-key="selectedWrongBookTopicKey"
        @navigate="handleNav"
        @action="handleAction"
        @open-practice="startPracticeFromSource($event)"
      />
      <AfterClassReviewPage
        v-else-if="currentScreen === 'afterClassReview'"
        @back="handleAction('OPEN_TUTOR')"
        @start="handleAction('START_AFTER_CLASS_REVIEW')"
      />
      <AfterClassReviewPaperPage
        v-else-if="currentScreen === 'afterClassReviewPaper'"
        @action="handleAction"
      />
      <AfterClassReviewResultPage
        v-else-if="currentScreen === 'afterClassReviewResult'"
        @action="handleAction"
      />
      <AfterClassReviewKnowledgePage
        v-else-if="currentScreen === 'afterClassReviewKnowledge'"
        @action="handleAction"
      />
      <TargetedQuestionPage
        v-else-if="currentScreen === 'targetedQuestion'"
        @back="handleAction('OPEN_TUTOR')"
        @start="startPracticeFromSource('tutorTargeted')"
      />
      <ExamPrepPage
        v-else-if="currentScreen === 'examPrep'"
        @navigate="handleNav"
        @action="handleAction"
        @open-practice="startPracticeFromSource($event)"
      />
      <TutorExplainPage
        v-else-if="currentScreen === 'tutorExplain'"
        @navigate="handleNav"
        @action="handleAction"
        @open-practice="startPracticeFromSource($event)"
      />
      <PreviewLessonPage
        v-else-if="currentScreen === 'previewLesson'"
        @action="handleAction"
        @open-practice="startPracticeFromSource('tutorPreview')"
      />
      <TeacherFeedbackPage
        v-else-if="currentScreen === 'teacherFeedback'"
        @navigate="handleNav"
        @action="handleAction"
      />
      <QuestionPage
        v-else-if="currentScreen === 'practice'"
        mode="practice"
        :source-key="selectedPracticeSourceKey"
        @action="handleAction"
      />
      <WrongPage
        v-else-if="currentScreen === 'wrong'"
        :source-key="selectedPracticeSourceKey"
        @action="handleAction"
      />
      <QuestionPage
        v-else-if="currentScreen === 'bridge'"
        mode="bridge"
        :source-key="selectedPracticeSourceKey"
        @action="handleAction"
      />
      <RetryPage
        v-else-if="currentScreen === 'bridgeRetry'"
        mode="bridgeRetry"
        :source-key="selectedPracticeSourceKey"
        @action="handleAction"
      />
      <QuestionPage
        v-else-if="currentScreen === 'confirm'"
        mode="confirm"
        :source-key="selectedPracticeSourceKey"
        @action="handleAction"
      />
      <RetryPage
        v-else-if="currentScreen === 'confirmRetry'"
        mode="confirmRetry"
        :source-key="selectedPracticeSourceKey"
        @action="handleAction"
      />
      <MasteredPage
        v-else-if="currentScreen === 'mastered'"
        :source-key="selectedPracticeSourceKey"
        @action="handleAction"
      />
      <PhotoPage
        v-else-if="currentScreen === 'photo'"
        @navigate="handleNav"
        @action="handleAction"
      />
      <PhotoAnalyzingPage
        v-else-if="currentScreen === 'photoAnalyzing'"
      />
      <PhotoResultPage
        v-else-if="currentScreen === 'photoResult'"
        @navigate="handleNav"
        @action="handleAction"
      />
      <ProgressPage
        v-else-if="currentScreen === 'progress'"
        @navigate="handleNav"
        @action="handleAction"
      />
    </section>
  </main>
</template>

<script setup lang="ts">
import type { DemoEvent } from "../composables/useDemoFlow";
import type { DemoChild, PracticeEntryKey, ScreenKey, StudentProfile, WrongBookTopicKey } from "../data/demoData";
import AccountCancelPage from "../pages/AccountCancelPage.vue";
import AccountSettingsPage from "../pages/AccountSettingsPage.vue";
import AgentPage from "../pages/AgentPage.vue";
import AgentResultPage from "../pages/AgentResultPage.vue";
import AfterClassReviewKnowledgePage from "../pages/AfterClassReviewKnowledgePage.vue";
import AfterClassReviewPaperPage from "../pages/AfterClassReviewPaperPage.vue";
import AfterClassReviewPage from "../pages/AfterClassReviewPage.vue";
import AfterClassReviewResultPage from "../pages/AfterClassReviewResultPage.vue";
import DataPrivacyPage from "../pages/DataPrivacyPage.vue";
import ExamPrepPage from "../pages/ExamPrepPage.vue";
import HomePage from "../pages/HomePage.vue";
import LearningPage from "../pages/LearningPage.vue";
import LearningReminderPage from "../pages/LearningReminderPage.vue";
import MasteredPage from "../pages/MasteredPage.vue";
import PhotoAnalyzingPage from "../pages/PhotoAnalyzingPage.vue";
import PhotoPage from "../pages/PhotoPage.vue";
import PhotoResultPage from "../pages/PhotoResultPage.vue";
import PreviewLessonPage from "../pages/PreviewLessonPage.vue";
import ProfilePage from "../pages/ProfilePage.vue";
import SiteMessagesPage from "../pages/SiteMessagesPage.vue";
import ProgressPage from "../pages/ProgressPage.vue";
import QuestionPage from "../pages/QuestionPage.vue";
import RetryPage from "../pages/RetryPage.vue";
import SchoolBindingPage from "../pages/SchoolBindingPage.vue";
import TargetedQuestionPage from "../pages/TargetedQuestionPage.vue";
import TeacherFeedbackPage from "../pages/TeacherFeedbackPage.vue";
import TutorExplainPage from "../pages/TutorExplainPage.vue";
import WrongBookDetailPage from "../pages/WrongBookDetailPage.vue";
import WrongBookPage from "../pages/WrongBookPage.vue";
import WrongPage from "../pages/WrongPage.vue";

const props = defineProps<{
  currentScreen: ScreenKey;
  activeChildId: string;
  addChild: (student: StudentProfile) => boolean;
  childOptions: DemoChild[];
  displayModeClass: string;
  handleAction: (event: DemoEvent) => void;
  handleNav: (tab: "home" | "agent" | "learning" | "profile") => void;
  isElderMode: boolean;
  deleteChild: (childId: string) => boolean;
  selectedPracticeSourceKey: PracticeEntryKey;
  selectedWrongBookTopicKey: WrongBookTopicKey;
  setElderMode: (enabled: boolean) => void;
  switchChild: (childId: string, returnHome?: boolean) => void;
  updateChild: (childId: string, student: StudentProfile) => boolean;
  startPracticeFromSource: (sourceKey: PracticeEntryKey) => void;
  openWrongBookDetail: (topicKey: WrongBookTopicKey) => void;
}>();

const selectCurrentChild = (childId: string) => props.switchChild(childId, false);
</script>
