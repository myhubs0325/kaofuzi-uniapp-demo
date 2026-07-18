<template>
  <PhoneScaffold
    title="账号与数据"
    :meta="`${demoData.guardian.name} · 账号信息`"
    content-class="insight-content account-detail-content"
    shell-class="insight-shell"
    show-back
    active-tab="profile"
    @back="$emit('action', 'BACK_FROM_PROFILE_DETAIL')"
    @navigate="$emit('navigate', $event)"
  >
    <section class="account-hero-card privacy-hero-card">
      <div class="account-hero-top">
        <div>
          <span class="account-kicker">账号资料</span>
          <h2>这里能查看和修改家长账号、孩子姓名与班级</h2>
          <p>系统只展示当前绑定孩子的信息，老师端同步数据会跟随绑定关系更新。</p>
        </div>
        <div class="account-hero-icon privacy">
          <ShieldCheck :size="28" />
        </div>
      </div>

      <div class="account-info-list compact">
        <div class="account-info-row">
          <span>账号编号</span>
          <strong>{{ demoData.guardian.accountId }}</strong>
        </div>
        <div class="account-info-row">
          <span>注册时间</span>
          <strong>{{ demoData.guardian.registeredAt }}</strong>
        </div>
      </div>
    </section>

    <section class="account-section">
      <div class="account-section-head">
        <strong>可修改信息</strong>
        <button type="button" class="account-text-button" @click="toggleEdit">
          <Pencil v-if="!editing" :size="16" />
          <Save v-else :size="16" />
          <span>{{ editing ? "保存" : "修改" }}</span>
        </button>
      </div>

      <div class="account-form-list">
        <label v-for="field in editableFields.slice(0, 2)" :key="field.key" class="account-input-field">
          <span>{{ field.label }}</span>
          <input v-model="field.model.value" :readonly="!editing" />
        </label>
        <div v-if="false" class="account-school-field">
          <div class="account-school-heading">
            <strong>学校信息</strong>
            <span>完善孩子所在学校</span>
          </div>
          <div class="account-school-region">
            <label>
              <span>省</span>
              <select v-model="province" :disabled="!editing" @change="changeProvince">
                <option v-for="option in provinceOptions" :key="option" :value="option">{{ option }}</option>
              </select>
            </label>
            <label>
              <span>市</span>
              <select v-model="city" :disabled="!editing" @change="changeCity">
                <option v-for="option in cityOptions" :key="option" :value="option">{{ option }}</option>
              </select>
            </label>
            <label>
              <span>区 / 县</span>
              <select v-model="district" :disabled="!editing">
                <option v-for="option in districtOptions" :key="option" :value="option">{{ option }}</option>
              </select>
            </label>
          </div>
          <label class="account-input-field account-school-name">
            <span>学校名称</span>
            <input v-model="schoolName" :readonly="!editing" placeholder="请输入学校全称" />
          </label>
        </div>
        <label v-if="false" v-for="field in editableFields.slice(3)" :key="field.key" class="account-input-field">
          <span>{{ field.label }}</span>
          <input v-model="field.model.value" :readonly="!editing" />
        </label>
      </div>
    </section>

    <StudentManager
      :active-child-id="props.activeChildId"
      :children="props.children"
      :add-child="props.addChild"
      :update-child="props.updateChild"
      :delete-child="props.deleteChild"
      :set-current-child="props.setCurrentChild"
    />

    <section class="account-section">
      <div class="account-section-head">
        <strong>数据使用范围</strong>
        <span>说明清楚，家长放心</span>
      </div>
      <div class="account-feature-list">
        <article class="account-feature-card">
          <span class="account-feature-icon"><LockKeyhole :size="20" /></span>
          <div>
            <strong>仅用于学习服务</strong>
            <p>孩子姓名、班级和错题数据用于生成学习任务、报告和老师反馈。</p>
          </div>
        </article>
        <article class="account-feature-card">
          <span class="account-feature-icon"><UsersRound :size="20" /></span>
          <div>
            <strong>仅家长与已绑定老师可见</strong>
            <p>取消家校绑定后，老师端不再继续接收新的家庭学情补充。</p>
          </div>
        </article>
      </div>
    </section>

    <section v-if="saved" class="account-save-strip">
      <CheckCircle2 :size="18" />
      <span>资料已保存，本次修改会用于后续学习服务。</span>
    </section>
  </PhoneScaffold>
</template>

<script setup lang="ts">
import {
  CheckCircle2,
  LockKeyhole,
  Pencil,
  Save,
  ShieldCheck,
  UsersRound
} from "lucide-vue-next";
import { computed, ref } from "vue";
import StudentManager from "../components/StudentManager.vue";
import PhoneScaffold from "../components/PhoneScaffold.vue";
import type { DemoEvent } from "../composables/useDemoFlow";
import { demoData, schoolRegions, type DemoChild, type StudentProfile } from "../data/demoData";

const editing = ref(false);
const saved = ref(false);
const guardianName = ref(demoData.guardian.name);
const guardianPhone = ref(demoData.guardian.phone);
const studentName = ref(demoData.student.name);
const grade = ref(demoData.student.grade);
const className = ref(demoData.student.className);
const province = ref(demoData.student.province);
const city = ref(demoData.student.city);
const district = ref(demoData.student.district);
const schoolName = ref(demoData.student.schoolName);

const provinceOptions = Object.keys(schoolRegions);
const cityOptions = computed(() => Object.keys(schoolRegions[province.value] ?? {}));
const districtOptions = computed(() => schoolRegions[province.value]?.[city.value] ?? []);

const changeCity = () => {
  district.value = districtOptions.value[0] ?? "";
};

const changeProvince = () => {
  city.value = cityOptions.value[0] ?? "";
  changeCity();
};

const editableFields = [
  { key: "guardianName", label: "家长姓名", model: guardianName },
  { key: "guardianPhone", label: "手机号", model: guardianPhone },
  { key: "studentName", label: "孩子姓名", model: studentName },
  { key: "grade", label: "年级", model: grade },
  { key: "className", label: "班级", model: className }
];

const props = defineProps<{
  activeChildId: string;
  children: DemoChild[];
  addChild: (student: StudentProfile) => boolean;
  updateChild: (childId: string, student: StudentProfile) => boolean;
  deleteChild: (childId: string) => boolean;
  setCurrentChild: (childId: string) => void;
}>();

const toggleEdit = () => {
  if (editing.value) {
    saved.value = true;
  } else {
    saved.value = false;
  }
  editing.value = !editing.value;
};

defineEmits<{
  action: [DemoEvent];
  navigate: ["home" | "agent" | "learning" | "profile"];
}>();
</script>
