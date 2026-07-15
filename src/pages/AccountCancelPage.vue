<template>
  <PhoneScaffold
    title="注销账号"
    meta="需要再次确认"
    content-class="insight-content account-detail-content"
    shell-class="insight-shell"
    show-back
    active-tab="profile"
    @back="$emit('action', 'BACK_FROM_PROFILE_DETAIL')"
    @navigate="$emit('navigate', $event)"
  >
    <section class="account-hero-card account-cancel-hero-card">
      <div class="account-hero-top">
        <div>
          <span class="account-kicker danger">账号注销</span>
          <h2>注销后，当前账号将不能继续查看孩子学习服务</h2>
          <p>这个操作影响比较大，所以单独放到确认页，避免老人误点。</p>
        </div>
        <div class="account-hero-icon danger">
          <Trash2 :size="28" />
        </div>
      </div>
    </section>

    <section class="account-section">
      <div class="account-section-head">
        <strong>注销前请确认</strong>
        <span>三点都要看清楚</span>
      </div>
      <div class="account-feature-list">
        <article v-for="item in cancelRisks" :key="item.title" class="account-feature-card danger">
          <span class="account-feature-icon danger">
            <CircleAlert :size="20" />
          </span>
          <div>
            <strong>{{ item.title }}</strong>
            <p>{{ item.summary }}</p>
          </div>
        </article>
      </div>
    </section>

    <section class="account-section">
      <div class="account-section-head">
        <strong>确认方式</strong>
        <span>防止误操作</span>
      </div>
      <button type="button" :class="['account-switch-row', { active: understood }]" @click="understood = !understood">
        <span>我已经知道注销会影响账号和学习数据查看</span>
        <b>{{ understood ? "已确认" : "未确认" }}</b>
      </button>
    </section>

    <button
      v-if="!confirmStep && !submitted"
      type="button"
      class="primary-button account-primary-button account-danger-primary-button"
      :disabled="!understood"
      @click="confirmStep = true"
    >
      进入二次确认
      <Trash2 :size="21" />
    </button>

    <section v-if="confirmStep && !submitted" class="account-section account-final-confirm-card">
      <div class="account-section-head">
        <strong>再次确认注销账号</strong>
        <span>最后一步</span>
      </div>
      <p>请再确认一次：如果只是暂时不用，建议返回设置页选择“退出登录”。如果确定不再使用这个账号，再点下面红色按钮。</p>
      <div class="account-confirm-actions">
        <button type="button" class="account-confirm-cancel" @click="confirmStep = false">
          先不注销
        </button>
        <button type="button" class="account-confirm-submit" @click="submitted = true">
          确认提交注销申请
          <Trash2 :size="18" />
        </button>
      </div>
    </section>

    <section v-if="submitted" class="account-save-strip warning">
      <CircleAlert :size="18" />
      <span>注销申请已提交。</span>
    </section>
  </PhoneScaffold>
</template>

<script setup lang="ts">
import { CircleAlert, Trash2 } from "lucide-vue-next";
import { ref } from "vue";
import PhoneScaffold from "../components/PhoneScaffold.vue";
import type { DemoEvent } from "../composables/useDemoFlow";

const understood = ref(false);
const confirmStep = ref(false);
const submitted = ref(false);

const cancelRisks = [
  {
    title: "不能继续查看当前孩子学情",
    summary: "学习报告、错题整理、老师反馈等内容将不能继续通过这个账号查看。"
  },
  {
    title: "家校绑定会停止服务",
    summary: "家长端和老师端之间的学情互通会停止，后续需要重新绑定。"
  },
  {
    title: "建议先确认是否只是退出登录",
    summary: "如果只是换手机或临时不用，返回上一页点“退出登录”就够了。"
  }
];

defineEmits<{
  action: [DemoEvent];
  navigate: ["home" | "agent" | "learning" | "profile"];
}>();
</script>
