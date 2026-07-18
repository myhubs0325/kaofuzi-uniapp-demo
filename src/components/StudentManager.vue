<template>
  <section :class="['student-manager', { 'student-manager-compact': compact }]">
    <div v-if="!compact" class="student-manager-head">
      <div>
        <span class="student-manager-kicker">学生管理</span>
        <h3>已绑定学生</h3>
      </div>
      <span class="student-manager-count">{{ children.length }} 名学生</span>
    </div>
    <p v-if="!compact" class="student-manager-lead">每次只编辑一名学生，学习内容会跟随当前学生切换。</p>

    <div class="student-manager-list">
      <article v-for="child in children" :key="child.id" class="student-manager-card">
        <div class="student-manager-row">
          <span class="student-manager-avatar">{{ child.student.name.slice(0, 1) || "?" }}</span>
          <div class="student-manager-info">
            <strong>{{ child.student.name || "未填写姓名" }}</strong>
            <span>{{ child.student.grade || "未填写年级" }} / {{ child.student.className || "未填写班级" }}</span>
            <small>{{ child.student.schoolName || "未填写学校" }}</small>
          </div>
          <span v-if="child.id === activeChildId" class="student-manager-current">当前学生</span>
          <button v-else-if="!compact" type="button" class="student-manager-current-button" @click="setCurrentChild(child.id)">设为当前</button>
          <div class="student-manager-actions">
            <button v-if="!compact" type="button" class="student-manager-action" @click="beginEdit(child)">
              <Pencil :size="15" />
              编辑
            </button>
            <div class="student-manager-more">
              <button type="button" class="student-manager-action" @click.stop="toggleMore(child.id)">
                <MoreHorizontal :size="16" />
                更多
              </button>
              <div v-if="moreOpenId === child.id" class="student-manager-menu">
                <button v-if="compact && child.id !== activeChildId" type="button" @click="setCurrentChild(child.id); moreOpenId = null">设为当前</button>
                <button v-if="compact" type="button" @click="beginEdit(child)">编辑</button>
                <button type="button" @click="requestRemove(child)">移除学生</button>
              </div>
            </div>
          </div>
        </div>

        <form v-if="editingChildId === child.id" class="student-manager-edit" @submit.prevent="saveEdit">
          <div class="student-manager-form-head">
            <strong>编辑 {{ child.student.name || "学生资料" }}</strong>
            <button type="button" class="student-manager-close" aria-label="取消编辑" @click="cancelEdit"><X :size="16" /></button>
          </div>
          <div class="student-manager-fields">
            <label><span>学生姓名</span><input v-model="draft.name" placeholder="填写学生姓名" /></label>
            <div class="student-manager-school-fields">
              <span class="student-manager-field-label">学校信息</span>
              <div class="student-manager-school-row">
                <select v-model="draft.province" aria-label="省"><option v-for="option in provinceOptions" :key="option" :value="option">{{ option }}</option></select>
                <select v-model="draft.city" aria-label="市"><option v-for="option in cityOptions" :key="option" :value="option">{{ option }}</option></select>
                <select v-model="draft.district" aria-label="区县"><option v-for="option in districtOptions" :key="option" :value="option">{{ option }}</option></select>
              </div>
              <input v-model="draft.schoolName" placeholder="填写学校名称" aria-label="学校名称" />
            </div>
            <label><span>年级</span><input v-model="draft.grade" placeholder="填写年级" /></label>
            <label><span>班级</span><input v-model="draft.className" placeholder="填写班级" /></label>
          </div>
          <div class="student-manager-form-actions">
            <button type="button" class="student-manager-cancel" @click="cancelEdit">取消</button>
            <button type="submit" class="student-manager-save">保存学生资料</button>
          </div>
        </form>
      </article>
    </div>

    <form v-if="adding" class="student-manager-edit student-manager-add" @submit.prevent="saveAdd">
      <div class="student-manager-form-head">
        <strong>添加学生</strong>
        <button type="button" class="student-manager-close" aria-label="取消添加" @click="cancelEdit"><X :size="16" /></button>
      </div>
      <div class="student-manager-fields">
        <label><span>学生姓名</span><input v-model="draft.name" placeholder="填写学生姓名" /></label>
        <div class="student-manager-school-fields">
          <span class="student-manager-field-label">学校信息</span>
          <div class="student-manager-school-row">
            <select v-model="draft.province" aria-label="省"><option v-for="option in provinceOptions" :key="option" :value="option">{{ option }}</option></select>
            <select v-model="draft.city" aria-label="市"><option v-for="option in cityOptions" :key="option" :value="option">{{ option }}</option></select>
            <select v-model="draft.district" aria-label="区县"><option v-for="option in districtOptions" :key="option" :value="option">{{ option }}</option></select>
          </div>
          <input v-model="draft.schoolName" placeholder="填写学校名称" aria-label="学校名称" />
        </div>
        <label><span>年级</span><input v-model="draft.grade" placeholder="填写年级" /></label>
        <label><span>班级</span><input v-model="draft.className" placeholder="填写班级" /></label>
      </div>
      <div class="student-manager-form-actions">
        <button type="button" class="student-manager-cancel" @click="cancelEdit">取消</button>
        <button type="submit" class="student-manager-save">添加学生</button>
      </div>
    </form>

    <button v-else type="button" class="student-manager-add-button" @click="beginAdd">
      <Plus :size="18" />
      添加学生
    </button>
    <p v-if="notice" class="student-manager-notice">{{ notice }}</p>

    <div v-if="pendingRemove" class="student-manager-confirm-backdrop" @click.self="pendingRemove = null">
      <section class="student-manager-confirm" role="dialog" aria-modal="true" aria-label="确认移除学生">
        <span class="student-manager-confirm-icon"><Trash2 :size="19" /></span>
        <h4>确认移除学生？</h4>
        <p>将解除“{{ pendingRemove.student.name }}”与当前家长账号的绑定，不会处理学习数据。</p>
        <div class="student-manager-form-actions">
          <button type="button" class="student-manager-cancel" @click="pendingRemove = null">暂不移除</button>
          <button type="button" class="student-manager-remove-confirm" @click="confirmRemove">确认移除</button>
        </div>
      </section>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { MoreHorizontal, Pencil, Plus, Trash2, X } from "lucide-vue-next";
import { schoolRegions, type DemoChild, type StudentProfile } from "../data/demoData";

const props = defineProps<{
  activeChildId: string;
  children: DemoChild[];
  addChild: (student: StudentProfile) => boolean;
  updateChild: (childId: string, student: StudentProfile) => boolean;
  deleteChild: (childId: string) => boolean;
  setCurrentChild: (childId: string) => void;
  compact?: boolean;
}>();

const compact = props.compact ?? false;

const createDraft = (): StudentProfile => ({
  name: "",
  grade: "",
  className: "",
  province: Object.keys(schoolRegions)[0] ?? "",
  city: Object.keys(schoolRegions[Object.keys(schoolRegions)[0] ?? ""] ?? {})[0] ?? "",
  district: "",
  schoolName: ""
});

const draft = reactive<StudentProfile>(createDraft());
const editingChildId = ref<string | null>(null);
const adding = ref(false);
const moreOpenId = ref<string | null>(null);
const pendingRemove = ref<DemoChild | null>(null);
const notice = ref("");

const provinceOptions = Object.keys(schoolRegions);
const cityOptions = computed(() => Object.keys(schoolRegions[draft.province] ?? {}));
const districtOptions = computed(() => schoolRegions[draft.province]?.[draft.city] ?? []);

const copyDraft = (student: StudentProfile) => Object.assign(draft, { ...student });
const resetDraft = () => Object.assign(draft, createDraft());
const beginEdit = (child: DemoChild) => {
  moreOpenId.value = null;
  notice.value = "";
  adding.value = false;
  editingChildId.value = child.id;
  copyDraft(child.student);
};
const beginAdd = () => {
  moreOpenId.value = null;
  notice.value = "";
  editingChildId.value = null;
  adding.value = true;
  resetDraft();
};
const cancelEdit = () => {
  editingChildId.value = null;
  adding.value = false;
  resetDraft();
};
const saveEdit = () => {
  if (!editingChildId.value) return;
  if (!draft.name.trim() || !draft.grade.trim() || !draft.className.trim()) {
    notice.value = "请至少填写姓名、年级和班级。";
    return;
  }
  if (props.updateChild(editingChildId.value, { ...draft })) cancelEdit();
};
const saveAdd = () => {
  if (!draft.name.trim() || !draft.grade.trim() || !draft.className.trim()) {
    notice.value = "请至少填写姓名、年级和班级。";
    return;
  }
  if (props.addChild({ ...draft })) cancelEdit();
};
const toggleMore = (childId: string) => {
  moreOpenId.value = moreOpenId.value === childId ? null : childId;
};
const requestRemove = (child: DemoChild) => {
  moreOpenId.value = null;
  if (props.children.length <= 1) {
    notice.value = "至少保留一名学生，当前学生不能移除。";
    return;
  }
  if (child.id === props.activeChildId) {
    notice.value = "请先将其他学生设为当前学生，再移除该学生。";
    return;
  }
  notice.value = "";
  pendingRemove.value = child;
};
const confirmRemove = () => {
  if (pendingRemove.value && props.deleteChild(pendingRemove.value.id)) {
    pendingRemove.value = null;
  }
};
</script>
