<template>
  <PhoneScaffold
    title="家校绑定"
    :meta="`${demoData.student.name} · ${bindingStatus}`"
    content-class="insight-content account-detail-content"
    shell-class="insight-shell"
    show-back
    active-tab="profile"
    @back="$emit('action', 'BACK_FROM_PROFILE_DETAIL')"
    @navigate="$emit('navigate', $event)"
  >
    <section class="account-hero-card binding-hero-card">
      <div class="account-hero-top">
        <div>
          <span class="account-kicker">家校互通</span>
          <h2>绑定后，老师和家长能看到同一份实时学情</h2>
          <p>老师确认课堂表现，家长补充家里真实情况，系统再根据两边信息调整练习和讲解。</p>
        </div>
        <div class="account-hero-icon binding">
          <Link2 :size="28" />
        </div>
      </div>

      <div :class="['binding-status-strip', { active: isBound }]">
        <CheckCircle2 v-if="isBound" :size="20" />
        <CircleDashed v-else :size="20" />
        <span>{{ isBound ? "当前已完成家校确认绑定" : "当前未绑定老师端" }}</span>
      </div>
    </section>

    <section class="account-section">
      <div class="account-section-head">
        <strong>绑定信息</strong>
        <span>学生与教师端相互确认</span>
      </div>

      <div class="account-info-list">
        <div class="account-info-row">
          <span>学生</span>
          <strong>{{ demoData.student.name }} · {{ demoData.student.className }}</strong>
        </div>
        <div class="account-info-row">
          <span>教师端</span>
          <strong>{{ isBound ? `${demoData.teacher.name} · 已确认` : "暂无老师确认" }}</strong>
        </div>
        <div class="account-info-row">
          <span>同步内容</span>
          <strong>错题、课堂反馈、练习进度、家长补充学情</strong>
        </div>
      </div>
    </section>

    <section class="account-section">
      <div class="account-section-head">
        <strong>绑定后能做什么</strong>
        <span>帮助双方调整方式</span>
      </div>

      <div class="account-feature-list">
        <article v-for="item in bindingBenefits" :key="item.title" class="account-feature-card">
          <span class="account-feature-icon">
            <component :is="item.icon" :size="20" />
          </span>
          <div>
            <strong>{{ item.title }}</strong>
            <p>{{ item.summary }}</p>
          </div>
        </article>
      </div>
    </section>

    <section v-if="!isBound" class="account-section">
      <div class="account-section-head">
        <strong>新增绑定</strong>
        <span>绑定信息</span>
      </div>
      <label class="account-input-field">
        <span>老师绑定码</span>
        <input v-model="teacherCode" placeholder="例如：WLS-301" />
      </label>
    </section>

    <button type="button" class="primary-button account-primary-button" @click="toggleBinding">
      {{ isBound ? "取消当前家校绑定" : "提交绑定确认" }}
      <Unlink v-if="isBound" :size="21" />
      <Plus v-else :size="21" />
    </button>
  </PhoneScaffold>
</template>

<script setup lang="ts">
import {
  CheckCircle2,
  CircleDashed,
  GraduationCap,
  Link2,
  MessageSquareText,
  Plus,
  RotateCcw,
  Unlink
} from "lucide-vue-next";
import { computed, ref } from "vue";
import type { Component } from "vue";
import PhoneScaffold from "../components/PhoneScaffold.vue";
import type { DemoEvent } from "../composables/useDemoFlow";
import { demoData } from "../data/demoData";

const isBound = ref(true);
const teacherCode = ref("WLS-301");
const bindingStatus = computed(() => (isBound.value ? "已绑定" : "待绑定"));

const bindingBenefits: Array<{ title: string; summary: string; icon: Component }> = [
  {
    title: "老师看到家里练习情况",
    summary: "老师能知道孩子哪些题在家里还不稳，课堂上可以继续盯。",
    icon: GraduationCap
  },
  {
    title: "家长看到老师真实反馈",
    summary: "家长不用猜孩子在校表现，可以根据老师反馈安排家里陪学。",
    icon: MessageSquareText
  },
  {
    title: "系统按两边学情调整任务",
    summary: "课堂、错题、家庭补充都会进入推荐依据，练习更有针对性。",
    icon: RotateCcw
  }
];

const toggleBinding = () => {
  isBound.value = !isBound.value;
};

defineEmits<{
  action: [DemoEvent];
  navigate: ["home" | "agent" | "learning" | "profile"];
}>();
</script>
