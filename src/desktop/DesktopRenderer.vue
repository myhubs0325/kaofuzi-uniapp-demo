<template>
  <DesktopShell
    :active-tab="activeTab"
    :active-child-id="activeChildId"
    :child-options="childOptions"
    :active-feature-key="activeFeatureKey"
    :grade-label="demoData.student.className.replace(/\s/g, '')"
    :section-label="screenMeta.sectionLabel"
    :student-name="demoData.student.name"
    :summary="screenMeta.summary"
    :title="screenMeta.title"
    :show-topbar="!['accountSettings', 'messages'].includes(currentScreen)"
    :is-elder-mode="isElderMode"
    :set-elder-mode="setElderMode"
    :switch-child="switchChild"
    @navigate="handleNav"
    @feature-navigate="handleAction"
    @open-privacy="handleAction('OPEN_DATA_PRIVACY')"
    @reset="reset"
  >
    <div class="pc-page" :data-font-size="fontSize">
      <DesktopLearningReport v-if="currentScreen === 'progress'" :handle-action="handleAction" />
      <DesktopSiteMessages
        v-else-if="currentScreen === 'messages'"
        :go-back="goBack"
        :handle-action="handleAction"
      />
      <DesktopAccountSettings
        v-else-if="currentScreen === 'accountSettings'"
        :font-size="fontSize"
        :font-sizes="fontSizes"
        :sound-enabled="soundEnabled"
        :set-font-size="updateFontSize"
        :set-sound-enabled="updateSoundEnabled"
        :handle-action="handleAction"
        :go-back="goBack"
      />
      <template v-else>
      <div v-if="showCancelModal" class="pc-modal-backdrop" @click.self="showCancelModal = false">
        <section class="pc-modal" role="dialog" aria-modal="true" aria-label="注销账号确认">
          <span class="pc-modal-icon">!</span>
          <span class="pc-eyebrow">账号注销</span>
          <h2>确定要注销这个账号吗？</h2>
          <p>注销后将不能继续查看孩子的学习报告、错题记录和家校绑定信息。如果只是暂时不用，建议先退出登录。</p>
          <div class="pc-modal-actions">
            <button class="pc-secondary" @click="showCancelModal = false">暂不注销</button>
            <button class="pc-danger" @click="showCancelModal = false; handleAction('OPEN_ACCOUNT_CANCEL')">继续注销</button>
          </div>
        </section>
      </div>
      <header class="pc-page-header">
        <div class="pc-page-header-leading">
          <button v-if="showBackButton" type="button" class="pc-back-button" aria-label="返回上一级" @click="goBack"><ArrowLeft :size="18" /></button>
          <div><span class="pc-eyebrow">{{ screenMeta.sectionLabel }}</span><h1>{{ screenMeta.title }}</h1><p>{{ screenMeta.summary }}</p></div>
        </div>
        <div class="pc-student-badge"><span class="pc-avatar">{{ demoData.student.name.slice(-1) }}</span><div><strong>{{ demoData.student.name }}</strong><small>{{ demoData.student.grade }} · {{ demoData.student.className }}</small></div></div>
      </header>

      <section v-if="screenKey === 'previewLesson'" class="pc-preview-lesson-page pc-layout-2">
        <article class="pc-card pc-main-card">
          <span class="pc-eyebrow">课内知识巩固</span>
          <h2>预习讲解</h2>
          <p class="pc-lead">先选择学科和课题，生成课件后可以在线预览、下载 PPT 和文字教案。</p>
          <div class="pc-form-grid pc-preview-select-grid">
            <label class="pc-field"><span>选择学科</span><select v-model="previewSubject" @change="changePreviewSubject"><option v-for="subject in previewSubjectOptions" :key="subject" :value="subject">{{ subject }}</option></select></label>
            <label class="pc-field"><span>选择课题</span><select v-model="previewTopic" @change="previewGenerated = false"><option v-for="topic in previewTopicOptions" :key="topic" :value="topic">{{ topic }}</option></select></label>
          </div>
          <button class="pc-primary" @click="generatePreviewLesson">生成预习课件 <ArrowRight :size="18" /></button>
          <template v-if="previewGenerated">
            <div class="pc-preview-toolbar"><div class="pc-preview-format-tabs"><button :class="{ active: previewFormat === 'html' }" @click="previewFormat = 'html'">在线预览</button><button :class="{ active: previewFormat === 'text' }" @click="previewFormat = 'text'">文字版 PPT</button></div><button class="pc-secondary" @click="toggleSpeech(`${previewSubject}，${previewTopic}。${previewSlides[previewSlideIndex].detail}`)"><VolumeX v-if="isSpeaking" :size="16" /><Volume2 v-else :size="16" />{{ isSpeaking ? '停止朗读' : '语音讲解' }}</button><button class="pc-secondary" @click="downloadPreviewArtifact('ppt')"><Download :size="16" />下载 PPT</button><button class="pc-secondary" @click="downloadPreviewArtifact('text')"><Download :size="16" />下载文字版</button></div>
            <div v-if="previewFormat === 'html'" class="pc-preview-slide"><span>{{ previewSubject }} · {{ previewTopic }}</span><h3>{{ previewSlides[previewSlideIndex].title }}</h3><p>{{ previewSlides[previewSlideIndex].summary }}</p><div class="pc-preview-interactions"><button v-for="item in previewSlides[previewSlideIndex].points" :key="item" :class="{ active: selectedPreviewPoint === item }" @click="selectedPreviewPoint = item">{{ item }}</button></div><div class="pc-tint-note">{{ previewSlides[previewSlideIndex].detail }}</div><div class="pc-preview-pagination"><span>第 {{ previewSlideIndex + 1 }} / {{ previewSlides.length }} 页</span><div><button class="pc-preview-page-button" :disabled="previewSlideIndex === 0" @click="previousPreviewSlide">上一页</button><button class="pc-preview-page-button" :disabled="previewSlideIndex === previewSlides.length - 1" @click="nextPreviewSlide">下一页</button></div></div></div>
            <div v-else class="pc-text-ppt-preview-wrap"><pre class="pc-text-ppt-preview">{{ previewTextPages[previewSlideIndex] }}</pre><div class="pc-preview-pagination"><span>文字版 · 第 {{ previewSlideIndex + 1 }} / {{ previewTextPages.length }} 页</span><div><button class="pc-preview-page-button" :disabled="previewSlideIndex === 0" @click="previousPreviewSlide">上一页</button><button class="pc-preview-page-button" :disabled="previewSlideIndex === previewTextPages.length - 1" @click="nextPreviewSlide">下一页</button></div></div></div>
            <div class="pc-preview-actions"><button class="pc-primary" @click="runFeaturePrimaryAction">根据当前课题出题练习 <ArrowRight :size="17" /></button></div>
            <section class="pc-lesson-plan"><div class="pc-card-title"><div><strong>文字教案</strong><small>长文字默认折叠，按需展开</small></div><button class="pc-secondary" @click="downloadPreviewArtifact('plan')"><FileDown :size="16" />下载教案</button></div><article v-for="(section, index) in previewPlanSections" :key="section.title" class="pc-plan-item"><button class="pc-plan-head" @click="togglePreviewPlan(index)"><span><strong>{{ section.title }}</strong><small>{{ section.duration }}</small></span><ChevronRight :class="{ rotated: previewPlanExpanded.includes(index) }" :size="17" /></button><p v-if="previewPlanExpanded.includes(index)">{{ section.body }}</p></article></section>
          </template>
        </article>
        <aside class="pc-card pc-side-stack"><h3>预习流程</h3><div class="pc-step-list"><div><b>1</b><span>选择学科和课题</span></div><div><b>2</b><span>生成 PPT 与文字教案</span></div><div><b>3</b><span>在线预览并语音讲解</span></div><div><b>4</b><span>下载后进入针对练习</span></div></div></aside>
      </section>

      <section v-if="screenKey === 'targetedQuestion'" class="pc-targeted-page pc-layout-2">
        <article class="pc-card pc-main-card">
          <span class="pc-eyebrow">课内知识巩固</span>
          <h2>针对出题</h2>
          <p class="pc-lead">先选择学科，再选择多个课题生成综合测试，最多可选择 10 个课题。</p>
          <div class="pc-form-grid pc-targeted-select-grid"><label class="pc-field"><span>选择学科</span><select v-model="targetedSubject" @change="changeTargetedSubject"><option v-for="subject in targetedSubjectOptions" :key="subject" :value="subject">{{ subject }}</option></select></label><div class="pc-selection-count"><span>已选课题</span><strong>{{ selectedTargetedTopics.length }} / 10</strong></div></div>
          <div class="pc-targeted-topic-grid"><button v-for="topic in targetedTopicOptions" :key="topic.title" :class="{ active: selectedTargetedTopics.includes(topic.title) }" @click="toggleTargetedTopic(topic.title)"><strong>{{ topic.title }}</strong><small>{{ topic.meta }}</small><span>{{ topic.count }} 道题 · {{ selectedTargetedTopics.includes(topic.title) ? '已选择' : '点击选择' }}</span></button></div>
          <div class="pc-targeted-preview"><span class="pc-eyebrow">综合测试预览</span><strong>{{ targetedPreview.prompt }}</strong><small>{{ targetedPreview.meta }} · 共选择 {{ selectedTargetedTopics.length }} 个课题</small></div>
          <button class="pc-primary" @click="runFeaturePrimaryAction">开始针对练习 <ArrowRight :size="18" /></button>
        </article>
        <aside class="pc-card pc-side-stack"><h3>会这样出题</h3><div class="pc-step-list"><div><b>1</b><span>先看当前薄弱点</span></div><div><b>2</b><span>基础题确认步骤</span></div><div><b>3</b><span>变式题检查迁移</span></div><div><b>4</b><span>综合题完成巩固</span></div></div></aside>
      </section>

      <template v-if="screenKey === 'home'">
        <section class="pc-home-grid">
          <article class="pc-hero pc-span-2"><div class="pc-hero-copy"><span class="pc-eyebrow">今天的学习安排</span><h2>先练 {{ demoData.task.durationMinutes }} 分钟，今天就会更稳一点</h2><p>{{ demoData.task.title }}，系统根据老师反馈和最近的作答结果安排了 {{ demoData.task.questionCount }} 道题。</p><div class="pc-stat-line"><span>{{ demoData.task.questionCount }} 道题</span><span>约 {{ demoData.task.durationMinutes }} 分钟</span><span>优先补 {{ demoData.task.weakPointCount }} 个薄弱点</span></div><button class="pc-primary" @click="handleAction('START_TASK')">现在开始 <ArrowRight :size="18" /></button></div><div class="pc-hero-orbit"><span>今日优先</span><strong>{{ demoData.progress.currentAccuracy }}%</strong><small>当前正确率</small></div></article>
          <article class="pc-card pc-summary-card"><div class="pc-card-title"><strong>学习变化</strong><button class="pc-link" @click="handleAction('VIEW_PROGRESS')">查看报告</button></div><strong class="pc-big-number">{{ demoData.progress.previousAccuracy }}% → {{ demoData.progress.currentAccuracy }}%</strong><p>同类题每 10 题大约多做对 {{ extraCorrectPerTen }} 题</p></article>
          <article class="pc-card pc-summary-card"><div class="pc-card-title"><strong>老师同步</strong><small>{{ demoData.teacher.syncedAt }}</small></div><strong class="pc-card-value">{{ demoData.teacher.wrongQuestionCount }} 道错题</strong><p>{{ demoData.progress.teacherNote }}</p></article>
        </section>
        <section class="pc-section"><div class="pc-section-title"><div><span class="pc-eyebrow">快捷入口</span><h2>家长常用功能</h2></div><small>选择一个继续</small></div><div class="pc-shortcut-grid"><button v-for="feature in homeFeatures" :key="feature.key" class="pc-shortcut" @click="handleHomeFeature(feature.key)"><span class="pc-shortcut-icon">{{ feature.title.slice(0, 1) }}</span><span><strong>{{ feature.title }}</strong><small>{{ feature.badge }}</small></span><ChevronRight :size="17" /></button></div></section>
      </template>

      <template v-else-if="screenKey === 'agent'">
        <section class="pc-layout-2"><article class="pc-card pc-main-card"><div class="pc-card-title"><div><span class="pc-eyebrow">家长补充</span><h2>补充孩子最近的真实状态</h2></div><span class="pc-pill">{{ selectedSurveyCount }} / {{ studySurveyFields.length }} 已完成</span></div><p class="pc-lead">老师反馈和作答结果只能看到一部分，把家长在家里看到的状态补充进来，系统才能安排更有针对性的练习。</p><div class="pc-survey-grid"><article v-for="field in studySurveyFields" :key="field.key" class="pc-survey-card"><div class="pc-card-title"><strong>{{ field.title }}</strong><span>{{ surveySelections[field.key] ? '已选择' : '必选' }}</span></div><small>{{ field.summary }}</small><div class="pc-option-grid"><button v-for="option in field.options" :key="option.key" :class="['pc-option', { active: surveySelections[field.key] === option.key }]" @click="surveySelections[field.key] = option.key"><strong>{{ option.label }}</strong><small>{{ option.hint }}</small></button></div></article></div><label class="pc-field"><span>家长补充说明（选填）</span><textarea placeholder="比如：孩子一做应用题就着急，不愿意慢慢读题。" /></label><button class="pc-primary" :disabled="selectedSurveyCount < studySurveyFields.length" @click="handleAction('SUBMIT_STUDY_SURVEY')">提交学情信息 <ArrowRight :size="18" /></button></article><aside class="pc-side-stack"><article class="pc-card"><h3>这页怎么填</h3><div class="pc-step-list"><div><b>1</b><span>每组选择一个最符合的状态</span></div><div><b>2</b><span>四组必选题都完成后才能提交</span></div><div><b>3</b><span>最后说明可写可不写</span></div></div></article><article class="pc-card pc-tint-card"><strong>为什么要补充？</strong><p>系统会把老师反馈、答题数据和家庭观察合在一起，生成下一次练习的题量与讲解重点。</p></article></aside></section>
      </template>

      <template v-else-if="screenKey === 'agentResult'">
        <section class="pc-layout-2"><article class="pc-hero pc-result-hero"><span class="pc-eyebrow">学情已整理完成</span><h2>下一次练习，会更贴近孩子现在的状态</h2><p>{{ demoData.progress.summary }}</p><div class="pc-stat-line"><span>家长观察已保存</span><span>首轮 {{ demoData.task.questionCount }} 道题</span><span>{{ demoData.task.durationMinutes }} 分钟</span></div></article><aside class="pc-card pc-side-stack"><h3>系统建议</h3><p>{{ demoData.progress.familyTips[0] }}</p><p>{{ demoData.progress.familyTips[1] }}</p><button class="pc-primary" @click="handleAction('START_TASK')">开始推荐练习</button><button class="pc-secondary" @click="handleAction('EDIT_STUDY_SURVEY')">返回修改问卷</button></aside></section>
      </template>

      <template v-else-if="screenKey === 'learning'">
        <section class="pc-hero pc-learning-hero"><div><span class="pc-eyebrow">学习总览</span><h2>这周已经看见实打实的进步</h2><p>{{ demoData.progress.summary }}</p></div><div class="pc-metric-row"><div><strong>{{ demoData.progress.currentAccuracy }}%</strong><span>当前正确率</span></div><div><strong>{{ demoData.progress.closedKnowledgePoints }}</strong><span>已补会知识点</span></div><div><strong>4 次</strong><span>本周已练</span></div></div></section><section class="pc-section"><div class="pc-section-title"><div><span class="pc-eyebrow">学习入口</span><h2>从最值得开始的放前面</h2></div></div><div class="pc-scene-grid"><button v-for="item in learningEntries" :key="item.key" class="pc-scene" @click="runLearningFeature(item.key)"><div class="pc-card-title"><span class="pc-scene-icon">{{ item.icon }}</span><span class="pc-pill">{{ item.badge }}</span></div><strong>{{ item.title }}</strong><p>{{ item.summary }}</p><span class="pc-link">{{ item.actionLabel }} <ArrowRight :size="15" /></span></button></div></section><section class="pc-card pc-note-card"><span class="pc-eyebrow">老师这次提醒</span><strong>{{ demoData.progress.teacherNote }}</strong><button class="pc-link" @click="handleAction('OPEN_TEACHER_FEEDBACK')">查看老师反馈 <ArrowRight :size="15" /></button></section></template>

      <template v-else-if="screenKey === 'wrongBook' || screenKey === 'wrongBookDetail'">
        <section v-if="screenKey === 'wrongBook'" class="pc-layout-2">
          <article class="pc-card pc-main-card">
            <div class="pc-card-title"><div><span class="pc-eyebrow">错题整理</span><h2>{{ currentWrongTopic.title }}</h2></div><span class="pc-pill">{{ wrongBookTopics.length }} 个专题</span></div>
            <p class="pc-lead">{{ currentWrongTopic.summary }}</p>
            <div class="pc-topic-list"><button v-for="topic in wrongBookTopics" :key="topic.key" :class="['pc-topic', { active: topic.key === selectedWrongBookTopicKey }]" @click="openWrongBookDetail(topic.key)"><span><strong>{{ topic.title }}</strong><small>{{ topic.meta }} · {{ topic.commonMistake }}</small></span><b>{{ topic.count }} </b></button></div>
          </article>
          <aside class="pc-side-stack"><article class="pc-card"><h3>先从这里开始</h3><strong class="pc-card-value">{{ currentWrongTopic.practiceGoal }}</strong><p>{{ currentWrongTopic.commonMistake }}</p></article><article class="pc-card pc-tint-card"><h3>家长怎么陪</h3><p>先让孩子说出每一步怎么想，再做同类确认题，不要直接告诉答案。</p></article></aside>
        </section>
        <section v-else class="pc-wrong-detail-layout">
          <article class="pc-card pc-wrong-detail-main">
            <div class="pc-wrong-detail-heading"><div><span class="pc-eyebrow">错题详情 · {{ currentWrongTopic.meta }}</span><h2>{{ currentWrongTopic.title }}</h2><p>{{ currentWrongTopic.summary }}</p></div><span class="pc-wrong-detail-count">{{ currentWrongTopic.questions.length }} 道重点题</span></div>
            <div class="pc-wrong-question-list">
              <article v-if="currentWrongQuestion" :key="currentWrongQuestion.id" class="pc-wrong-question-card">
                <div class="pc-wrong-question-meta"><span>重点题 {{ wrongDetailPage + 1 }}</span><small>{{ currentWrongQuestion.source }}</small></div>
                <h3>{{ currentWrongQuestion.prompt }}</h3>
                <div class="pc-answer-strip"><div class="pc-answer-cell pc-answer-cell-wrong"><small>孩子作答</small><strong>{{ currentWrongQuestion.studentAnswer }}</strong></div><div class="pc-answer-cell pc-answer-cell-correct"><small>正确答案</small><strong>{{ currentWrongQuestion.correctAnswer }}</strong></div></div>
                <div class="pc-explanation-grid"><div class="pc-explanation-block pc-explanation-reason"><span>为什么错</span><p>{{ currentWrongQuestion.reason }}</p></div><div class="pc-explanation-block pc-explanation-method"><span>下一步怎么做</span><p>{{ wrongDetailSuggestion(currentWrongQuestion.reason) }}</p></div></div>
                <div class="pc-explanation-steps"><span>一步一步看</span><ol><li v-for="step in wrongDetailSteps(currentWrongQuestion)" :key="step">{{ step }}</li></ol></div>
              </article>
            </div>
            <div class="pc-wrong-pagination"><span>第 {{ wrongDetailPage + 1 }} / {{ currentWrongTopic.questions.length }} 题</span><div><button class="pc-preview-page-button" :disabled="wrongDetailPage === 0" @click="previousWrongQuestion">上一页</button><button class="pc-preview-page-button" :disabled="wrongDetailPage === currentWrongTopic.questions.length - 1" @click="nextWrongQuestion">下一页</button></div></div>
          </article>
          <aside class="pc-wrong-detail-aside"><article class="pc-card pc-wrong-focus-card"><span class="pc-eyebrow">本专题重点</span><h3>{{ currentWrongTopic.practiceGoal }}</h3><div class="pc-wrong-focus-line"><span>{{ currentWrongTopic.questions.length }} 道题</span><span>重复错误优先处理</span></div><button class="pc-primary" @click="startPracticeFromSource(wrongBookSourceMap[selectedWrongBookTopicKey])">进入专题练习 <ArrowRight :size="18" /></button></article><article class="pc-card pc-tint-card"><h3>家长提醒</h3><p>不要只问“答案是多少”，请让孩子先指出错在第几步，再用同类题确认是否真的改会。</p></article></aside>
        </section>
      </template>


      <template v-else-if="isFeatureScreen"><section :class="['pc-layout-2', 'pc-feature-layout', { 'pc-tutor-feature': screenKey === 'tutorExplain', 'pc-exam-prep-feature': screenKey === 'examPrep' }]" ><article class="pc-card pc-main-card"><span class="pc-eyebrow">学习专题</span><h2>{{ screenMeta.title }}</h2><p class="pc-lead">{{ featureSummary }}</p><div v-if="featureOverview" class="pc-stat-grid"><div v-for="stat in featureOverview.stats" :key="stat.label" class="pc-mini-stat"><span>{{ stat.label }}</span><strong>{{ stat.value }}</strong></div></div><div v-if="featureOverview" class="pc-detail-list"><button v-for="(item, index) in featureOverview.items" :key="item.title" type="button" :class="['pc-detail-row', 'pc-feature-detail', screenKey === 'examPrep' ? `pc-exam-priority-${index}` : '']" @click="runFeatureDetailAction(item.title)"><div><strong>{{ item.title }}</strong><small>{{ item.meta }}</small></div><b>{{ item.value }}</b></button></div><div v-else class="pc-preview-list"><div v-for="item in practiceScenario.previewQuestions" :key="item.prompt"><strong>{{ item.prompt }}</strong><small>{{ item.meta }}</small></div></div><div class="pc-feature-actions"><button class="pc-primary" @click="runFeaturePrimaryAction">{{ featureActionLabel }} <ArrowRight :size="18" /></button><button class="pc-secondary" @click="handleAction('GO_HOME')">返回首页</button></div></article><aside class="pc-card pc-action-panel"><h3>本页重点</h3><p>{{ featureActionDescription }}</p></aside></section></template>

      <template v-else-if="isReviewScreen">
        <section v-if="screenKey === 'afterClassReview'" class="pc-layout-2">
          <article class="pc-card pc-main-card"><span class="pc-eyebrow">课后复习 · 准备</span><h2>先选好今天要复习的内容</h2><div class="pc-form-grid pc-review-select-grid"><label class="pc-field"><span>选择学科</span><select v-model="afterClassSubject" @change="changeAfterClassSubject"><option v-for="subject in afterClassSubjectOptions" :key="subject" :value="subject">{{ subject }}</option></select></label><label class="pc-field"><span>选择课题</span><select v-model="afterClassTopic"><option v-for="topic in afterClassTopicOptions" :key="topic" :value="topic">{{ topic }}</option></select></label></div><button class="pc-primary" @click="startAfterClassReview">生成并开始复习小测 <ArrowRight :size="18" /></button></article>
          <aside class="pc-card"><h3>会这样进行</h3><div class="pc-step-list"><div v-for="(step,index) in reviewSteps" :key="step"><b>{{ index + 1 }}</b><span>{{ step }}</span></div></div></aside>
        </section>
        <section v-else-if="screenKey === 'afterClassReviewPaper'" class="pc-layout-2 pc-practice-layout">
          <article class="pc-card pc-practice-board"><div class="pc-card-title"><div><span class="pc-eyebrow">课后复习 · 答题</span><h2>{{ afterClassSubject }} · {{ afterClassTopic }} · 小测</h2></div><span class="pc-pill">第 {{ reviewQuestionIndex + 1 }} / {{ afterClassReviewExam.questions.length }} 题</span></div><div class="pc-test-tools"><button class="pc-secondary" @click="toggleSpeech(currentReviewQuestion.prompt + '，' + currentReviewQuestion.hint)"><VolumeX v-if="isSpeaking" :size="16" /><Volume2 v-else :size="16" />{{ isSpeaking ? "停止朗读" : "朗读题目" }}</button><button class="pc-secondary" @click="downloadReview"><Download :size="16" />下载试题</button></div><div class="pc-question-board"><p>{{ currentReviewQuestion.type }} · {{ currentReviewQuestion.hint }}</p><strong>{{ currentReviewQuestion.prompt }}</strong></div><div class="pc-option-grid pc-review-option-grid"><button v-for="answer in currentReviewQuestion.options" :key="answer" :class="['pc-option', { active: reviewSelections[currentReviewQuestion.id] === answer }]" @click="reviewSelections[currentReviewQuestion.id] = answer">{{ answer }}</button></div><div class="pc-review-pagination"><span>第 {{ reviewQuestionIndex + 1 }} / {{ afterClassReviewExam.questions.length }} 题</span><div><button class="pc-preview-page-button" :disabled="reviewQuestionIndex === 0" @click="previousReviewQuestion">上一页</button><button v-if="reviewQuestionIndex < afterClassReviewExam.questions.length - 1" class="pc-preview-page-button" @click="nextReviewQuestion">下一页</button><button v-else class="pc-primary pc-review-submit-button" @click="handleAction('SUBMIT_AFTER_CLASS_REVIEW')">提交小测</button></div></div></article>
          <aside class="pc-card pc-practice-summary"><h3>答题规则</h3><p>{{ afterClassReviewExam.rule }}</p><div class="pc-tint-note">先完整答题，提交后统一分析正确率和薄弱知识点。</div><div class="pc-selection-list"><div><span>预计用时</span><strong>{{ afterClassReviewExam.totalMinutes }} 分钟</strong></div><div><span>题目数量</span><strong>{{ afterClassReviewExam.questions.length }} 道</strong></div></div></aside>
        </section>
        <section v-else-if="screenKey === 'afterClassReviewResult'" class="pc-layout-2"><article class="pc-card pc-main-card"><span class="pc-eyebrow">课后复习 · 结果</span><h2>这次不是只看对错，而是找到卡点</h2><div class="pc-metric-row"><div><strong>{{ reviewCorrectCount }} / {{ afterClassReviewExam.questions.length }}</strong><span>本次正确</span></div><div><strong>{{ afterClassReviewExam.weakPoints.length }}</strong><span>主要薄弱点</span></div></div><div class="pc-detail-list"><div v-for="question in afterClassReviewExam.questions" :key="question.id" class="pc-detail-row"><div><strong>{{ question.prompt }}</strong><small>{{ question.knowledgePoint }}</small></div><span>作答 {{ question.studentAnswer }}<br />正确 {{ question.correctAnswer }}</span></div></div></article><aside class="pc-card pc-action-panel"><h3>系统找到的不懂点</h3><div v-for="point in afterClassReviewExam.weakPoints" :key="point.title" class="pc-tint-note"><strong>{{ point.title }}</strong><p>{{ point.evidence }}</p></div><button class="pc-primary" @click="handleAction('OPEN_AFTER_CLASS_KNOWLEDGE')">看知识点讲解</button></aside></section>
        <section v-else class="pc-layout-2"><article class="pc-card pc-main-card"><span class="pc-eyebrow">课后复习 · 知识点</span><h2>{{ afterClassReviewExam.knowledgeExplain.title }}</h2><p class="pc-lead">{{ afterClassReviewExam.knowledgeExplain.summary }}</p><div class="pc-tint-note">{{ afterClassReviewExam.knowledgeExplain.coreRule }}</div><div class="pc-step-list"><div v-for="(step,index) in afterClassReviewExam.knowledgeExplain.steps" :key="step"><b>{{ index + 1 }}</b><span>{{ step }}</span></div></div></article><aside class="pc-card"><h3>家长怎么协助</h3><p>{{ afterClassReviewExam.knowledgeExplain.familyGuide }}</p><div class="pc-chip-list"><span v-for="mistake in afterClassReviewExam.knowledgeExplain.commonMistakes" :key="mistake">{{ mistake }}</span></div><button class="pc-primary" @click="handleAction('VIEW_PROGRESS')">看学习报告</button></aside></section>
      </template>

      <template v-else-if="isPracticeScreen">
        <section class="pc-layout-2 pc-practice-layout"><article class="pc-card pc-practice-board"><div class="pc-card-title pc-practice-head"><div><span class="pc-eyebrow">练习流程</span><h2>{{ practiceScreenTitle }}</h2></div></div><template v-if="['practice','bridge','confirm'].includes(screenKey)"><div class="pc-practice-toolbar"><div class="pc-practice-status"><span class="pc-pill">{{ practiceScenario.meta }}</span><span class="pc-progress-label">{{ practiceActiveScreen.progress }}</span></div><div class="pc-test-tools"><button class="pc-secondary" @click="toggleSpeech(practiceActiveScreen.expression + '，' + practiceActiveScreen.hint)"><VolumeX v-if="isSpeaking" :size="16" /><Volume2 v-else :size="16" />{{ isSpeaking ? '停止朗读' : '朗读题目' }}</button><button class="pc-secondary" @click="downloadPractice"><Download :size="16" />下载试题</button></div></div><div class="pc-question-board"><p>{{ practiceActiveScreen.hint }}</p><strong>{{ practiceActiveScreen.expression }}</strong></div><div class="pc-answer-grid"><button v-for="answer in practiceActiveScreen.answers" :key="answer.label" @click="handleAction(answer.correct ? 'ANSWER_CORRECT' : 'ANSWER_WRONG')">{{ answer.label }}</button></div></template><template v-else-if="screenKey === 'wrong'"><div class="pc-practice-status"><span class="pc-pill">{{ practiceScenario.meta }}</span></div><h3>{{ practiceFlow.wrong.title }}</h3><p>{{ practiceFlow.wrong.summary }}</p><div class="pc-tint-note">{{ practiceFlow.wrong.keyline }}</div><button class="pc-primary" @click="handleAction('CONTINUE')">{{ practiceFlow.wrong.buttonLabel }}</button></template><template v-else-if="['bridgeRetry','confirmRetry'].includes(screenKey)"><div class="pc-practice-status"><span class="pc-pill">{{ practiceScenario.meta }}</span></div><h3>{{ practiceRetry.cardTitle }}</h3><p>{{ practiceRetry.explanation }}</p><div class="pc-step-list"><div v-for="(step,index) in practiceRetry.steps" :key="step"><b>{{ index + 1 }}</b><span>{{ step }}</span></div></div><button class="pc-primary" @click="handleAction('TRY_AGAIN')">再试一次</button></template><template v-else><div class="pc-practice-status"><span class="pc-pill">{{ practiceScenario.meta }}</span></div><h3>{{ practiceFlow.mastered.title }}</h3><p>{{ practiceFlow.mastered.summary }}</p><div class="pc-metric-row"><div><strong>{{ practiceFlow.mastered.currentAccuracy }}%</strong><span>当前正确率</span></div><div><strong>{{ practiceFlow.mastered.closedKnowledgePoints }}</strong><span>已补会知识点</span></div></div><button class="pc-primary" @click="handleAction('GO_HOME')">回到首页</button></template></article><aside class="pc-card pc-practice-summary"><div class="pc-practice-summary-head"><h3>本组练习</h3><span>{{ practiceScenario.meta }}</span></div><div class="pc-practice-stat-grid"><div><span>预计用时</span><strong>{{ practiceScenario.estimatedMinutes }} 分钟</strong></div><div><span>题目数量</span><strong>{{ practiceScenario.totalQuestionCount }} 道</strong></div></div><div class="pc-practice-focus"><span>练习重点</span><strong>{{ practiceScenario.focus }}</strong></div><div class="pc-preview-list pc-practice-preview-list"><div v-for="(item, index) in practiceScenario.previewQuestions.slice(0, 3)" :key="item.prompt"><span class="pc-practice-preview-index">{{ String(index + 1).padStart(2, '0') }}</span><div><strong>{{ item.prompt }}</strong><small>{{ item.meta }}</small></div></div></div></aside></section>
      </template>

      <template v-else-if="screenKey === 'photo' || screenKey === 'photoAnalyzing' || screenKey === 'photoResult'">
        <section class="pc-layout-2 pc-photo-layout"><article v-if="screenKey !== 'photoResult'" class="pc-card pc-upload-board"><span class="pc-eyebrow">作业检查</span><h2>把作业图片放到这里</h2><p>上传作业图片后，系统会识别题目、分析作答并生成解析。</p><div class="pc-photo-flow-steps"><span :class="{ active: screenKey === 'photo' }">1 上传作业</span><span :class="{ active: screenKey === 'photoAnalyzing' }">2 智能识别</span><span>3 查看结果</span></div><div class="pc-upload-visual"><div :class="['pc-dropzone', { 'pc-ai-scanning': screenKey === 'photoAnalyzing' }]" /><template v-if="screenKey === 'photoAnalyzing'"><div class="pc-ai-orb" aria-hidden="true"><i /><i /><i /><span>AI</span></div><strong>正在识别题目与错误原因</strong><small class="pc-ai-caption">正在读取题目结构 · 检查作答步骤 · 生成解析</small></template><template v-else><div class="pc-upload-empty"><Camera :size="34" /><strong>拖拽图片或点击开始识别</strong><button class="pc-primary" @click="handleAction('ANALYZE_PHOTO')">开始识别</button></div></template></div></article><aside v-if="screenKey === 'photoResult'" class="pc-card pc-photo-result-panel"><div class="pc-photo-summary"><strong>发现 {{ photoCheckData.summary.focusCount }} 道需要重点讲解</strong><span>{{ photoCheckData.summary.correctCount }} 道计算正确，已生成对应解析</span></div><h3>逐题结果</h3><div class="pc-detail-list"><div v-for="question in photoCheckData.questions" :key="question.id" class="pc-detail-row"><div><strong>第 {{ question.id }} 题 · {{ question.expression }}</strong><small>孩子答案：{{ question.studentAnswer }} · 正确答案：{{ question.correctAnswer }} · {{ question.note }}</small></div><span>{{ question.statusLabel }}</span></div></div><section v-for="question in photoFocusQuestions" :key="`focus-${question.id}`" class="pc-photo-explanation"><div class="pc-card-title"><strong>{{ question.analysisTitle }}</strong><span class="pc-pill">{{ question.knowledgePoint }}</span></div><p>{{ question.diagnosis }}</p><ol><li v-for="step in question.steps" :key="step">{{ step }}</li></ol><div class="pc-tint-note"><strong>记住：</strong>{{ question.takeaway }}</div></section><div class="pc-photo-result-actions"><button class="pc-primary" @click="handleAction('PRACTICE_MISTAKE')">练重点错题 <ArrowRight :size="18" /></button><button class="pc-secondary" @click="handleAction('OPEN_PHOTO')">重新上传</button></div></aside><aside v-else class="pc-card"><h3>识别说明</h3><p>上传作业图片后，系统会完成识别、分析和解析。</p><div class="pc-step-list"><div><b>1</b><span>上传一张作业图片</span></div><div><b>2</b><span>系统识别题目和错误原因</span></div><div><b>3</b><span>查看解析并进入错题练习</span></div></div></aside></section>
      </template>

      <template v-else-if="screenKey === 'profile'"><section class="pc-layout-2"><article class="pc-card pc-main-card"><span class="pc-eyebrow">家长账号</span><h2>你好，{{ demoData.guardian.name }}</h2><p class="pc-lead">{{ accountDescription }}</p><div class="pc-profile-box"><span class="pc-avatar pc-avatar-large">{{ demoData.guardian.name.slice(0, 1) }}</span><div><strong>{{ demoData.guardian.name }}</strong><small>{{ demoData.guardian.relation }} · {{ demoData.guardian.phone }}</small></div><button class="pc-secondary" @click="setElderMode(!isElderMode)">{{ isElderMode ? '关闭长者模式' : '开启长者模式' }}</button></div><div class="pc-account-list"><button v-for="item in accountItems" :key="item.title" class="pc-account-row" @click="handleAccountItem(item)"><span class="pc-shortcut-icon">{{ item.icon }}</span><span><strong>{{ item.title }}</strong><small>{{ item.summary }}</small></span><ChevronRight :size="17" /></button></div></article><aside class="pc-card pc-side-stack"><h3>孩子信息</h3><div class="pc-selection-list"><div v-for="item in accountDetailItems" :key="item.label"><span>{{ item.label }}</span><strong>{{ item.value }}</strong></div></div></aside></section></template>

      <template v-else-if="isAccountScreen">
        <section :class="['pc-layout-2', { 'pc-data-privacy-layout': screenKey === 'dataPrivacy' }]">
          <article :class="['pc-card', 'pc-main-card', { 'pc-data-privacy-main': screenKey === 'dataPrivacy' }]">
            <span class="pc-eyebrow">账号服务</span><h2>{{ screenMeta.title }}</h2><p class="pc-lead">{{ accountDescription }}</p>
            <template v-if="screenKey === 'schoolBinding'"><div class="pc-status-banner" :class="{ active: bindingActive }"><strong>{{ bindingActive ? '家校绑定已确认' : '当前未绑定老师' }}</strong><small>{{ bindingActive ? `${demoData.teacher.name} · 学情正在同步` : '填写绑定码后提交确认' }}</small></div><label class="pc-field"><span>老师绑定码</span><input v-model="bindingCode" placeholder="例如：WLS-301" /></label><button class="pc-primary" @click="toggleBinding">{{ bindingActive ? '取消当前绑定' : '提交绑定确认' }}</button><span v-if="bindingFeedback" class="pc-save-note">{{ bindingFeedback }}</span></template>
            <template v-else-if="screenKey === 'learningReminder'"><div class="pc-switch-row"><div><strong>学习提醒</strong><small>{{ reminderEnabled ? '每天提醒一次' : '提醒已关闭' }}</small></div><button :class="['pc-switch', { active: reminderEnabled }]" @click="reminderEnabled = !reminderEnabled"><span>{{ reminderEnabled ? '开' : '关' }}</span></button></div><div class="pc-choice-tabs"><button v-for="time in reminderTimes" :key="time" :class="{ active: reminderTime === time }" @click="reminderTime = time">{{ time }}</button></div><div class="pc-tint-note">今天 {{ reminderTime }} 提醒：{{ demoData.student.name }} 先完成 {{ demoData.task.durationMinutes }} 分钟“{{ demoData.task.title }}”练习。</div><button class="pc-primary" @click="reminderSaved = true">{{ reminderSaved ? '提醒设置已保存' : '保存提醒设置' }}</button></template>
            <template v-else-if="screenKey === 'dataPrivacy'"><div class="pc-form-grid pc-guardian-form"><label class="pc-field"><span>家长姓名</span><input v-model="guardianName" :readonly="!privacyEditing" /></label><label class="pc-field"><span>手机号</span><input v-model="guardianPhone" :readonly="!privacyEditing" /></label></div><button class="pc-secondary pc-profile-edit-button" @click="togglePrivacyEditing">{{ privacyEditing ? '保存资料' : '修改资料' }}</button><span v-if="!privacyEditing && privacySaved" class="pc-save-note">资料已保存</span></template>
            <template v-else-if="screenKey === 'accountSettings'"><div class="pc-setting-group"><div class="pc-setting-head"><strong>系统字体</strong><small>当前：{{ fontSize }}</small></div><div class="pc-choice-tabs"><button v-for="size in fontSizes" :key="size" :class="{ active: fontSize === size }" @click="fontSize = size">{{ size }}</button></div></div><div class="pc-switch-row"><div><strong>声音提醒</strong><small>练习完成和提醒到达时播放提示</small></div><button :class="['pc-switch', { active: soundEnabled }]" @click="soundEnabled = !soundEnabled"><span>{{ soundEnabled ? '开' : '关' }}</span></button></div><div class="pc-setting-group"><div class="pc-setting-head"><strong>账号操作</strong><small>谨慎处理</small></div><button class="pc-danger-link" @click="showCancelModal = true">注销账号 <ChevronRight :size="16" /></button></div></template>
            <template v-else><div class="pc-danger-panel"><strong>注销后将不能继续查看孩子学习服务</strong><p>如果只是暂时不用，建议返回设置页选择“退出登录”。</p><label class="pc-check-row"><input v-model="cancelUnderstood" type="checkbox" /> 我已经知道注销会影响账号和学习数据查看</label></div><button v-if="!cancelConfirm" class="pc-primary pc-danger" :disabled="!cancelUnderstood" @click="cancelConfirm = true">进入二次确认</button><div v-else-if="!cancelSubmitted" class="pc-confirm-panel"><strong>再次确认注销账号</strong><p>如果确定不再使用这个账号，再提交注销申请。</p><button class="pc-secondary" @click="cancelConfirm = false">先不注销</button><button class="pc-danger" @click="cancelSubmitted = true">确认提交注销申请</button></div><span v-else class="pc-save-note">注销申请已提交</span></template>
            <StudentManager
              v-if="screenKey === 'dataPrivacy'"
              :active-child-id="props.activeChildId"
              :children="props.childOptions"
              :add-child="props.addChild"
              :update-child="props.updateChild"
              :delete-child="props.deleteChild"
              :set-current-child="selectCurrentChild"
              compact
            />
          </article>
          <aside class="pc-card pc-side-stack"><h3>{{ accountDetailTitle }}</h3><div class="pc-selection-list"><div v-for="item in accountDetailItems" :key="item.label" :class="{ 'pc-selection-note': item.label === '提示' }"><small v-if="item.label === '提示'">* {{ item.value }}</small><template v-else><span>{{ item.label }}</span><strong>{{ item.value }}</strong></template></div></div></aside>
        </section>
      </template>

      <template v-else-if="!['previewLesson', 'targetedQuestion'].includes(screenKey)"><section class="pc-card pc-empty-card"><h2>{{ screenMeta.title }}</h2><p>{{ screenMeta.summary }}</p></section></template>
      </template>
    </div>
  </DesktopShell>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import { ArrowLeft, ArrowRight, Camera, ChevronRight, Download, FileDown, Volume2, VolumeX } from "lucide-vue-next";
import DesktopAccountSettings from "./DesktopAccountSettings.vue";
import DesktopShell from "./DesktopShell.vue";
import DesktopLearningReport from "./DesktopLearningReport.vue";
import DesktopSiteMessages from "./DesktopSiteMessages.vue";
import StudentManager from "../components/StudentManager.vue";
import { screenDefinitionMap } from "../app/screens";
import type { DemoEvent } from "../composables/useDemoFlow";
import { afterClassReviewExam, demoData, featureOverviews, homeFeatures, photoCheckData, practiceEntryScenarios, practiceFlows, schoolRegions, type DemoChild, type PracticeEntryKey, type ScreenKey, type StudentProfile, type WrongBookTopicKey, wrongBookTopics } from "../data/demoData";
import { studySurveyFields } from "../data/studySurvey";

const props = defineProps<{
  activeTab: "home" | "agent" | "learning" | "profile";
  activeChildId: string;
  addChild: (student: StudentProfile) => boolean;
  childOptions: DemoChild[];
  currentScreen: ScreenKey;
  goBack: () => void;
  handleAction: (event: DemoEvent) => void;
  handleNav: (tab: "home" | "agent" | "learning" | "profile") => void;
  isElderMode: boolean;
  deleteChild: (childId: string) => boolean;
  openWrongBookDetail: (topicKey: WrongBookTopicKey) => void;
  reset: () => void;
  selectedPracticeSourceKey: PracticeEntryKey;
  selectedWrongBookTopicKey: WrongBookTopicKey;
  setElderMode: (enabled: boolean) => void;
  switchChild: (childId: string, returnHome?: boolean) => void;
  updateChild: (childId: string, student: StudentProfile) => boolean;
  startPracticeFromSource: (sourceKey: PracticeEntryKey) => void;
}>();

const selectCurrentChild = (childId: string) => props.switchChild(childId, false);
const screenKey = computed(() => props.currentScreen);
const showBackButton = computed(() => !["home", "agent", "learning", "profile"].includes(props.currentScreen));
const activeFeatureKey = computed(() => {
  const screen = props.currentScreen;
  if (["photo", "photoAnalyzing", "photoResult"].includes(screen)) return "photo";
  if (["wrongBook", "wrongBookDetail"].includes(screen)) return "wrongBook";
  if (["examPrep"].includes(screen)) return "examPrep";
  if (["tutorExplain", "previewLesson", "afterClassReview", "afterClassReviewPaper", "afterClassReviewResult", "afterClassReviewKnowledge", "targetedQuestion"].includes(screen)) return "tutorExplain";
  if (["progress"].includes(screen)) return "progress";
  if (["teacherFeedback"].includes(screen)) return "teacherFeedback";
  return "";
});
const screenMeta = computed(() => {
  const definition = screenDefinitionMap[props.currentScreen];
  const sectionLabelMap = { capture: "拍照检查", home: "首页", learning: "学习进展", practice: "练习流程", profile: "我的" } as const;
  return { ...definition, sectionLabel: sectionLabelMap[definition.section] };
});
const extraCorrectPerTen = Math.round(demoData.progress.currentAccuracy / 10) - Math.round(demoData.progress.previousAccuracy / 10);
const wrongBookSourceMap: Record<WrongBookTopicKey, PracticeEntryKey> = { borrowSubtraction: "wrongBorrowSubtraction", multiplicationVertical: "wrongMultiplicationVertical", wordProblemReading: "wrongWordProblemReading" };
const currentWrongTopic = computed(() => wrongBookTopics.find((topic) => topic.key === props.selectedWrongBookTopicKey) ?? wrongBookTopics[0]);
const wrongDetailPage = ref(0);
const currentWrongQuestion = computed(() => currentWrongTopic.value.questions[wrongDetailPage.value] ?? currentWrongTopic.value.questions[0]);
const previousWrongQuestion = () => {
  if (wrongDetailPage.value > 0) wrongDetailPage.value -= 1;
};
const nextWrongQuestion = () => {
  if (wrongDetailPage.value < currentWrongTopic.value.questions.length - 1) wrongDetailPage.value += 1;
};
watch(() => props.selectedWrongBookTopicKey, () => {
  wrongDetailPage.value = 0;
});
const wrongDetailSuggestion = (reason: string) => {
  if (props.selectedWrongBookTopicKey === "wordProblemReading") return "先圈出已知数量和问题，再用一句话说清楚题目要找什么，最后决定运算方法";
  if (props.selectedWrongBookTopicKey === "multiplicationVertical") return "把个位进位单独写在横线上，算十位时先加上进位数，再检查竖式每一位";
  if (reason.includes("0") || reason.includes("连续")) return "遇到 0 不能直接当成 10 使用，要继续向前借位，并把被借的每一位先改小";
  return "每借一次先修改被借的那一位，再继续往后计算，完成后从个位到百位回头检查";
};
const wrongDetailSteps = (question: { prompt: string; correctAnswer: string; reason: string }) => {
  if (props.selectedWrongBookTopicKey === "wordProblemReading") return [
    "先圈出题目中的已知数量和最后要解决的问题",
    "把数量关系用一句话说出来，再决定使用加、减、乘或除",
    `重新列式并计算，结果应为 ${question.correctAnswer}。`
  ];
  if (props.selectedWrongBookTopicKey === "multiplicationVertical") return [
    "先算个位，并把产生的进位数单独写清楚",
    "计算十位时，要把个位的进位数加进去",
    `逐位检查后，正确结果为 ${question.correctAnswer}。`
  ];
  return [
    "从个位开始判断是否够减，不够减就向前一位借 1",
    "借位后先修改被借的那一位，再继续计算下一位",
    `按顺序完成并回头验算，正确结果为 ${question.correctAnswer}。`
  ];
};
const practiceScenario = computed(() => practiceEntryScenarios[props.selectedPracticeSourceKey]);
const practiceFlow = computed(() => practiceFlows[props.selectedPracticeSourceKey]);
const practiceActiveScreen = computed(() => props.currentScreen === "bridge" ? practiceFlow.value.bridge : props.currentScreen === "confirm" ? practiceFlow.value.confirm : practiceFlow.value.practice);
const practiceRetry = computed(() => props.currentScreen === "confirmRetry" ? practiceFlow.value.confirmRetry : practiceFlow.value.bridgeRetry);
const practiceScreenTitle = computed(() => props.currentScreen === "practice" ? practiceFlow.value.practice.title : props.currentScreen === "bridge" ? practiceFlow.value.bridge.title : props.currentScreen === "confirm" ? practiceFlow.value.confirm.title : props.currentScreen === "wrong" ? practiceFlow.value.wrong.title : props.currentScreen === "mastered" ? practiceFlow.value.mastered.title : practiceRetry.value.pageTitle);
const isPracticeScreen = computed(() => ["practice", "wrong", "bridge", "bridgeRetry", "confirm", "confirmRetry", "mastered"].includes(props.currentScreen));
const isFeatureScreen = computed(() => ["teacherFeedback", "tutorExplain", "examPrep"].includes(props.currentScreen));
const isReviewScreen = computed(() => ["afterClassReview", "afterClassReviewPaper", "afterClassReviewResult", "afterClassReviewKnowledge"].includes(props.currentScreen));
const isAccountScreen = computed(() => ["schoolBinding", "learningReminder", "dataPrivacy", "accountSettings", "accountCancel"].includes(props.currentScreen));
const featureOverview = computed(() => {
  if (props.currentScreen === "examPrep") return featureOverviews.examPrep;
  if (props.currentScreen === "tutorExplain") return featureOverviews.tutorExplain;
  if (props.currentScreen === "teacherFeedback") return featureOverviews.teacherFeedback;
  return null;
});
const photoFocusQuestions = computed(() => photoCheckData.questions.filter((question) => question.status === "wrong"));
const featureSummary = computed(() => featureOverview.value?.summary ?? practiceScenario.value.summary);
const featureActionLabel = computed(() => props.currentScreen === "teacherFeedback" ? "进入今日练习" : props.currentScreen === "previewLesson" ? "开始预习练习" : props.currentScreen === "targetedQuestion" ? "开始针对练习" : props.currentScreen === "examPrep" ? "开始考前冲刺" : "开始课后复习练习");
const featureActionDescription = computed(() => props.currentScreen === "teacherFeedback" ? demoData.progress.teacherNote : `围绕“${practiceScenario.value.focus}”安排 ${practiceScenario.value.totalQuestionCount} 道题，预计 ${practiceScenario.value.estimatedMinutes} 分钟。`);
const selectedSurvey = reactive<Record<string, string>>({});
const surveySelections = selectedSurvey;
const selectedSurveyCount = computed(() => Object.keys(selectedSurvey).length);
const bindingActive = ref(true);
const bindingCode = ref("WLS-301");
const bindingFeedback = ref("");
const reminderEnabled = ref(true);
const reminderTime = ref("晚上 7:30");
const reminderSaved = ref(false);
const reminderTimes = ["放学后 5:30", "晚上 7:30", "睡前 8:30"];
const privacyEditing = ref(false);
const privacySaved = ref(false);
const guardianName = ref(demoData.guardian.name);
const guardianPhone = ref(demoData.guardian.phone);
const studentName = ref(demoData.student.name);
const className = ref(demoData.student.className);
const schoolProvince = ref(demoData.student.province);
const schoolCity = ref(demoData.student.city);
const schoolDistrict = ref(demoData.student.district);
const schoolName = ref(demoData.student.schoolName);
const schoolProvinceOptions = Object.keys(schoolRegions);
const schoolCityOptions = computed(() => Object.keys(schoolRegions[schoolProvince.value] ?? {}));
const schoolDistrictOptions = computed(() => schoolRegions[schoolProvince.value]?.[schoolCity.value] ?? []);
watch(schoolProvince, () => { schoolCity.value = schoolCityOptions.value[0] ?? ""; });
watch(schoolCity, () => { schoolDistrict.value = schoolDistrictOptions.value[0] ?? ""; });
const fontSize = ref("大号");
const fontSizes = ["标准", "大号", "超大"];
const soundEnabled = ref(true);
const updateFontSize = (value: string) => { fontSize.value = value; };
const updateSoundEnabled = (value: boolean) => { soundEnabled.value = value; };
const showCancelModal = ref(false);
const cancelUnderstood = ref(false);
const cancelConfirm = ref(false);
const cancelSubmitted = ref(false);
const togglePrivacyEditing = () => {
  if (privacyEditing.value) privacySaved.value = true;
  privacyEditing.value = !privacyEditing.value;
};
const toggleBinding = () => {
  if (bindingActive.value) {
    bindingActive.value = false;
    bindingFeedback.value = "当前绑定已取消";
    return;
  }
  if (!/^WLS-\d{3}$/i.test(bindingCode.value.trim())) {
    bindingFeedback.value = "请输入正确格式的绑定码，例如 WLS-301";
    return;
  }
  bindingActive.value = true;
  bindingFeedback.value = "绑定成功，老师端信息已同步";
};
const reviewSelections = ref<Record<string, string>>(Object.fromEntries(afterClassReviewExam.questions.map((question) => [question.id, question.studentAnswer])));
const reviewQuestionIndex = ref(0);
const currentReviewQuestion = computed(() => afterClassReviewExam.questions[reviewQuestionIndex.value] ?? afterClassReviewExam.questions[0]);
const previousReviewQuestion = () => {
  if (reviewQuestionIndex.value > 0) reviewQuestionIndex.value -= 1;
};
const nextReviewQuestion = () => {
  if (reviewQuestionIndex.value < afterClassReviewExam.questions.length - 1) reviewQuestionIndex.value += 1;
};
const reviewCorrectCount = computed(() => afterClassReviewExam.questions.filter((question) => reviewSelections.value[question.id] === question.correctAnswer).length);
const afterClassSubjectOptions = ["数学", "语文", "英语"];
const afterClassTopicsBySubject: Record<string, string[]> = {
  数学: [afterClassReviewExam.topic, "应用题数量关系", "乘法竖式"],
  语文: ["段落大意概括", "重点句子理解", "阅读中心意思"],
  英语: ["现在进行时句型", "一般疑问句回答", "单词拼写与运用"]
};
const afterClassSubject = ref("数学");
const afterClassTopic = ref<string>(afterClassReviewExam.topic);
const afterClassTopicOptions = computed(() => afterClassTopicsBySubject[afterClassSubject.value] ?? []);
const changeAfterClassSubject = () => {
  afterClassTopic.value = afterClassTopicOptions.value[0] ?? afterClassReviewExam.topic;
};
const startAfterClassReview = () => props.handleAction("START_AFTER_CLASS_REVIEW");
const previewSlideIndex = ref(0);
const selectedPreviewPoint = ref("个位先算");
const previewSubjectOptions = ["数学", "语文", "英语"];
const previewTopicsBySubject: Record<string, string[]> = {
  数学: ["三位数连续退位减法", "应用题数量关系"],
  语文: ["概括段落大意", "理解重点句子"],
  英语: ["现在进行时句型", "一般疑问句回答"]
};
const previewSubject = ref("数学");
const previewTopic = ref<string>(previewTopicsBySubject.数学[0]);
const previewTopicOptions = computed(() => previewTopicsBySubject[previewSubject.value] ?? []);
const previewGenerated = ref(false);
const previewFormat = ref<"ppt" | "html" | "text">("html");
const previewPlanExpanded = ref<number[]>([]);
const changePreviewSubject = () => {
  previewTopic.value = previewTopicOptions.value[0] ?? "";
  previewGenerated.value = false;
};
const generatePreviewLesson = () => {
  previewGenerated.value = true;
  previewSlideIndex.value = 0;
  selectedPreviewPoint.value = previewSlides[0].points[0];
};
const previousPreviewSlide = () => {
  if (previewSlideIndex.value === 0) return;
  previewSlideIndex.value -= 1;
  selectedPreviewPoint.value = previewSlides[previewSlideIndex.value].points[0];
};
const nextPreviewSlide = () => {
  if (previewSlideIndex.value >= previewSlides.length - 1) return;
  previewSlideIndex.value += 1;
  selectedPreviewPoint.value = previewSlides[previewSlideIndex.value].points[0];
};
const previewPlanSections = [
  { title: "一、导入与目标", duration: "2 分钟", body: "先让孩子说一说这类题最容易卡在哪里，再明确今天只练一个关键步骤" },
  { title: "二、方法讲解", duration: "5 分钟", body: "从个位开始检查够不够减，发生借位后同步修改前一位，再继续往后计算。" },
  { title: "三、互动确认", duration: "3 分钟", body: "通过一题变式题确认孩子能不能把方法迁移到新的数字组合中。" }
];
const togglePreviewPlan = (index: number) => {
  previewPlanExpanded.value = previewPlanExpanded.value.includes(index)
    ? previewPlanExpanded.value.filter((item) => item !== index)
    : [...previewPlanExpanded.value, index];
};
const previewArtifactText = computed(() => [
  `考夫子教评助手 · ${previewSubject.value} · ${previewTopic.value}`,
  "预习课件文字版",
  ...previewSlides.map((slide, index) => `${index + 1}. ${slide.title}\n${slide.summary}\n${slide.detail}`),
  "文字教案",
  ...previewPlanSections.map((section) => `${section.title}（${section.duration}）\n${section.body}`)
].join("\n\n"));
const previewTextPages = computed(() => previewSlides.map((slide, index) => [
  `${previewSubject.value} · ${previewTopic.value}`,
  `第 ${index + 1} / ${previewSlides.length} 页`,
  slide.title,
  slide.summary,
  ...slide.points.map((point) => `· ${point}`),
  slide.detail
].join("\n\n")));
const downloadArtifact = (filename: string, content: string, type = "text/plain;charset=utf-8") => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};
const downloadPreviewArtifact = (kind: "ppt" | "html" | "text" | "plan") => {
  if (kind === "html") {
    const html = `<article><h1>${previewSubject.value} · ${previewTopic.value}</h1><h2>预习课件</h2><p>${previewArtifactText.value.split("\n").join("<br />")}</p></article>`;
    downloadArtifact(`${previewTopic.value}-预习课件.html`, html, "text/html;charset=utf-8");
    return;
  }
  if (kind === "ppt") {
    downloadArtifact(`${previewTopic.value}-预习课件.ppt`, previewArtifactText.value, "application/vnd.ms-powerpoint;charset=utf-8");
    return;
  }
  if (kind === "plan") {
    downloadArtifact(`${previewTopic.value}-文字教案.txt`, previewPlanSections.map((section) => `${section.title}（${section.duration}）\n${section.body}`).join("\n\n"));
    return;
  }
  downloadArtifact(`${previewTopic.value}-文字版PPT.txt`, previewArtifactText.value);
};
const previewSlides = [
  { title: "先看借位顺序", summary: "哪一位不够减，就向前一位借 1。", points: ["个位先算", "十位借位", "百位更新"], detail: "每借一次，都要把被借的那一位先改小，再继续计算。" },
  { title: "遇到 0 也能借位", summary: "如果十位是 0，就继续向百位借。", points: ["继续向前借", "十位变 10", "最后剩 9"], detail: "百位借出 1 后，十位先变成 10，再借 1 给个位。" },
  { title: "用一道题确认", summary: "把方法放回题目里，按顺序完成计算。", points: ["列出竖式", "逐位检查", "回头验算"], detail: "做完后提醒孩子检查：每一位是否都已经更新。" }
];
const targetedTopics = [
  { title: "连续退位中的 0 借位", meta: "第 3、4 题需要重点确认", count: 3 },
  { title: "借位链条逐位更新", meta: "避免借过以后忘记改小", count: 2 },
  { title: "应用题数量关系", meta: "先分清一共、用了、还剩", count: 3 }
];
const targetedSubjectOptions = ["数学", "语文", "英语"];
const targetedTopicsBySubject: Record<string, typeof targetedTopics> = {
  数学: targetedTopics,
  语文: [
    { title: "概括段落大意", meta: "第 2、3 题需要重点确认", count: 3 },
    { title: "重点句子理解", meta: "避免只看表面意思", count: 2 },
    { title: "阅读中心意思", meta: "先找反复出现的线索", count: 3 }
  ],
  英语: [
    { title: "现在进行时句型", meta: "注意 be 动词变化", count: 3 },
    { title: "一般疑问句回答", meta: "先判断问句结构", count: 2 },
    { title: "单词拼写与运用", meta: "放回句子中确认", count: 3 }
  ]
};
const targetedSubject = ref("数学");
const selectedTargetedTopics = ref<string[]>([targetedTopics[0].title, targetedTopics[1].title]);
const targetedTopicOptions = computed(() => targetedTopicsBySubject[targetedSubject.value] ?? []);
const changeTargetedSubject = () => {
  selectedTargetedTopics.value = targetedTopicOptions.value.slice(0, 2).map((item) => item.title);
  selectedTargetedTopic.value = selectedTargetedTopics.value[0] ?? "";
};
const toggleTargetedTopic = (title: string) => {
  if (selectedTargetedTopics.value.includes(title)) {
    if (selectedTargetedTopics.value.length > 1) selectedTargetedTopics.value = selectedTargetedTopics.value.filter((item) => item !== title);
    return;
  }
  if (selectedTargetedTopics.value.length < 10) selectedTargetedTopics.value = [...selectedTargetedTopics.value, title];
  selectedTargetedTopic.value = title;
};
const selectedTargetedTopic = ref(targetedTopics[0].title);
const targetedPreview = computed(() => ({
  "连续退位中的 0 借位": { prompt: "703 - 468 = ?", meta: "先处理十位是 0 的连续借位" },
  "借位链条逐位更新": { prompt: "704 - 286 = ?", meta: "每发生一次借位都要同步修改" },
  "应用题数量关系": { prompt: "借走 287 本后还剩多少本？", meta: "先把题意转换成减法算式" }
}[selectedTargetedTopic.value] ?? { prompt: "703 - 468 = ?", meta: "针对当前薄弱点安排" }));
const reviewSteps = ["先完整答题", "提交后统一判定", "反推出薄弱知识点", "再讲知识点并继续练习"];
const isSpeaking = ref(false);
const toggleSpeech = (text: string) => {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  if (isSpeaking.value) {
    window.speechSynthesis.cancel();
    isSpeaking.value = false;
    return;
  }
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "zh-CN";
  utterance.onend = () => { isSpeaking.value = false; };
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
  isSpeaking.value = true;
};
const downloadPractice = () => {
  const text = `${practiceScreenTitle.value}\n${practiceScenario.value.focus}\n\n${practiceScenario.value.previewQuestions.map((item) => `${item.prompt}\n${item.meta}`).join("\n\n")}`;
  downloadArtifact(`${practiceScreenTitle.value}-练习题.txt`, text);
};
const downloadReview = () => {
  const text = `${afterClassSubject.value} · ${afterClassTopic.value} · 课后复习小测\n\n${afterClassReviewExam.questions.map((question) => `${question.id}. ${question.prompt}\n${question.options.join(" / ")}`).join("\n\n")}`;
  downloadArtifact(`${afterClassTopic.value}-课后复习小测.txt`, text);
};
const learningEntries = [{ key: "wrongBook", title: "错题本", badge: "优先处理", summary: "先练重复出错最多的错题。", actionLabel: "查看错题本", icon: "错" }, { key: "examPrep", title: "考前冲刺", badge: "离测评 5 天", summary: "把容易重复失分的地方往前放。", actionLabel: "进入考前冲刺", icon: "冲" }, { key: "progress", title: "学习报告", badge: "变化已整理", summary: "把最近的学习变化讲清楚。", actionLabel: "查看学习报告", icon: "报" }, { key: "teacherFeedback", title: "老师反馈", badge: "老师新提醒", summary: "查看老师提到的进步和关注点。", actionLabel: "查看老师反馈", icon: "师" }];
const loggedOut = ref(false);
const accountItems = computed(() => [{ title: "家校绑定", summary: "老师与家长共享同一份学情", event: "OPEN_SCHOOL_BINDING" as DemoEvent, icon: "校" }, { title: "站内信", summary: "查看系统通知与任务消息", event: "OPEN_MESSAGES" as DemoEvent, icon: "信" }, { title: "学习提醒", summary: "每天 1 条消息，提醒完成任务", event: "OPEN_LEARNING_REMINDER" as DemoEvent, icon: "提" }, { title: "账号与数据", summary: "账号、孩子信息和数据范围", event: "OPEN_DATA_PRIVACY" as DemoEvent, icon: "隐" }, { title: "设置", summary: "字体、声音、密码和注销", event: "OPEN_ACCOUNT_SETTINGS" as DemoEvent, icon: "设" }, { title: loggedOut.value ? "已退出登录" : "退出登录", summary: loggedOut.value ? "当前已退出登录" : "退出当前家长账号", event: "OPEN_ACCOUNT_SETTINGS" as DemoEvent, icon: "出", action: "logout" as const }]);
const handleAccountItem = (item: { title: string; event: DemoEvent; action?: "logout" }) => {
  if (item.action === "logout") {
    loggedOut.value = true;
    return;
  }
  props.handleAction(item.event);
};
const accountDetailTitle = computed(() => ({ schoolBinding: "绑定信息", learningReminder: "提醒设置", dataPrivacy: "账号与数据", accountSettings: "使用习惯", accountCancel: "注销前确认" }[props.currentScreen as string] ?? "孩子信息"));
const accountDescription = computed(() => ({ profile: "家校绑定、学习提醒和账号设置都集中在这里。", schoolBinding: "绑定后老师和家长能看到同一份实时学情。", learningReminder: "每天只提醒一次，盯住当天该完成的任务。", dataPrivacy: "查看账号、孩子信息以及数据使用范围。", accountSettings: "字体、声音和账号安全操作都放在这里。", accountCancel: "注销影响较大，需要完成二次确认。" }[props.currentScreen as string] ?? ""));
const accountDetailItems = computed(() => { if (props.currentScreen === "schoolBinding") return [{ label: "学生", value: `${demoData.student.name} · ${demoData.student.className}` }, { label: "教师端", value: `${demoData.teacher.name} · ${bindingActive.value ? "已确认" : "未绑定"}` }, { label: "同步内容", value: "错题、反馈、进度、家长补充" }]; if (props.currentScreen === "learningReminder") return [{ label: "提醒状态", value: reminderEnabled.value ? "已开启" : "已关闭" }, { label: "提醒时间", value: reminderTime.value }, { label: "今日任务", value: demoData.task.title }]; if (props.currentScreen === "dataPrivacy") return [{ label: "账号编号", value: demoData.guardian.accountId }, { label: "注册时间", value: demoData.guardian.registeredAt }, { label: "数据范围", value: "仅用于学习服务" }, { label: "提示", value: "孩子姓名、班级和错题数据仅用于学习服务，家长与已绑定老师可见。" }]; if (props.currentScreen === "accountSettings") return [{ label: "系统字体", value: fontSize.value }, { label: "声音提醒", value: soundEnabled.value ? "已开启" : "已关闭" }, { label: "账号操作", value: "修改密码、注销" }]; if (props.currentScreen === "accountCancel") return [{ label: "学习数据", value: "注销后无法继续查看" }, { label: "家校绑定", value: "注销后停止服务" }, { label: "建议", value: "暂时不用可先退出登录" }]; return [{ label: "孩子", value: `${demoData.student.name} · ${demoData.student.grade}` }, { label: "当前正确率", value: `${demoData.progress.currentAccuracy}%` }, { label: "老师", value: demoData.teacher.name }]; });
const handleHomeFeature = (key: string) => { const map: Record<string, DemoEvent> = { examPrep: "OPEN_EXAM_PREP", photo: "OPEN_PHOTO", progress: "VIEW_PROGRESS", teacherFeedback: "OPEN_TEACHER_FEEDBACK", tutorExplain: "OPEN_TUTOR", wrongBook: "OPEN_WRONG_BOOK" }; if (map[key]) props.handleAction(map[key]); };
const runLearningFeature = (key: string) => { const map: Record<string, DemoEvent> = { wrongBook: "OPEN_WRONG_BOOK", examPrep: "OPEN_EXAM_PREP", progress: "VIEW_PROGRESS", teacherFeedback: "OPEN_TEACHER_FEEDBACK" }; if (map[key]) props.handleAction(map[key]); };
const runFeaturePrimaryAction = () => { if (props.currentScreen === "teacherFeedback") return props.startPracticeFromSource("dailyBoost"); const map: Partial<Record<ScreenKey, PracticeEntryKey>> = { tutorExplain: "tutorReview", previewLesson: "tutorPreview", targetedQuestion: "tutorTargeted", examPrep: "examPrepFocus" }; const source = map[props.currentScreen]; if (source) props.startPracticeFromSource(source); };
const runFeatureDetailAction = (title: string) => {
  if (props.currentScreen !== "tutorExplain") return;
  if (title === "预习讲解") return props.handleAction("OPEN_PREVIEW_LESSON");
  if (title === "课后复习") return props.handleAction("OPEN_AFTER_CLASS_REVIEW");
  if (title === "针对出题") return props.handleAction("OPEN_TARGETED_QUESTION");
};
</script>
