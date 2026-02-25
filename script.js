'use strict';

/* =====================================================
   Dr.いわたつ 糖尿病経口薬 腎機能サポートツール
   script.js  ver3.0  (商品名完全網羅版)
   2026-02
===================================================== */

// ══════════════════════════════════════════════════════
//  成分マスター（brand 配列追加）
// ══════════════════════════════════════════════════════
const ingredientMaster = [
  {
    ingredient: "メトホルミン",
    brands: ["メトグルコ®", "グリコラン®", "ジベトス®"],
    class: "ビグアナイド",
    renal: [
      { min: 60,  max: 999, text: "最大 2250 mg/日", level: "green"  },
      { min: 45,  max: 59,  text: "最大 1500 mg/日", level: "yellow" },
      { min: 30,  max: 44,  text: "最大 750 mg/日",  level: "orange" },
      { min: 0,   max: 29,  text: "禁忌",             level: "red"    }
    ],
    dialysis:      "禁忌",
    perioperative: "手術当日中止 / 大手術は前日から検討 / 術後は経口再開＋腎機能安定後に再開",
    contrast:      "当日中止 / 48 時間後に腎機能確認後再開",
    sickday:       "中止",
    risk:          "乳酸アシドーシス（ミトコンドリア複合体Ⅰ阻害 → 乳酸蓄積。脱水・低酸素・腎機能低下で悪化）"
  },
  {
    ingredient: "グリメピリド",
    brands: ["アマリール®"],
    class: "SU",
    renal:    "腎機能低下で低血糖リスク増大（慎重投与）",
    dialysis: "慎重",
    sickday:  "中止",
    risk:     "遷延性低血糖（腎機能低下で代謝物蓄積）"
  },
  {
    ingredient: "グリクラジド",
    brands: ["グリミクロン®"],
    class: "SU",
    renal:    "腎機能低下で低血糖リスク増大（慎重投与）",
    dialysis: "慎重",
    sickday:  "中止",
    risk:     "遷延性低血糖"
  },
  {
    ingredient: "グリベンクラミド",
    brands: ["オイグルコン®", "ダオニール®"],
    class: "SU",
    renal:    "腎機能低下で禁忌に準じる",
    dialysis: "禁忌",
    sickday:  "中止",
    risk:     "遷延性低血糖（長時間作用型）"
  },
  {
    ingredient: "ナテグリニド",
    brands: ["スターシス®", "ファスティック®"],
    class: "グリニド",
    renal:    "高度腎障害では慎重投与",
    dialysis: "慎重",
    sickday:  "中止",
    risk:     "低血糖（食直前服用必須）"
  },
  {
    ingredient: "ミチグリニド",
    brands: ["グルファスト®"],
    class: "グリニド",
    renal:    "高度腎障害では慎重投与",
    dialysis: "慎重",
    sickday:  "中止",
    risk:     "低血糖（食直前服用必須）"
  },
  {
    ingredient: "レパグリニド",
    brands: ["シュアポスト®"],
    class: "グリニド",
    renal:    "腎機能低下でも比較的使用しやすい（胆汁排泄主体）",
    dialysis: "可（慎重）",
    sickday:  "中止",
    risk:     "低血糖"
  },
  {
    ingredient: "ボグリボース",
    brands: ["ベイスン®"],
    class: "αGI",
    renal:    "調整不要（腸管内作用・吸収ほぼなし）",
    dialysis: "可",
    sickday:  "中止（食事摂取不良時）",
    risk:     "腸閉塞・肝機能障害（まれ）"
  },
  {
    ingredient: "アカルボース",
    brands: ["グルコバイ®"],
    class: "αGI",
    renal:    "高度腎障害（Cr 2.0 以上）では禁忌",
    dialysis: "禁忌",
    sickday:  "中止（食事摂取不良時）",
    risk:     "腸閉塞・肝機能障害（まれ）"
  },
  {
    ingredient: "ミグリトール",
    brands: ["セイブル®"],
    class: "αGI",
    renal:    "高度腎障害では禁忌（腎排泄型）",
    dialysis: "禁忌",
    sickday:  "中止（食事摂取不良時）",
    risk:     "腸閉塞（まれ）"
  },
  {
    ingredient: "シタグリプチン",
    brands: ["ジャヌビア®", "グラクティブ®"],
    class: "DPP-4",
    renal: [
      { min: 50, max: 999, text: "50 mg（最大 100 mg）",  level: "green"  },
      { min: 30, max: 49,  text: "25 mg（最大 50 mg）",   level: "yellow" },
      { min: 0,  max: 29,  text: "12.5 mg（最大 25 mg）", level: "orange" }
    ],
    dialysis: "投与可（12.5 mg、最大 25 mg に減量）",
    sickday:  "原則継続可（脱水なければ）"
  },
  {
    ingredient: "ビルダグリプチン",
    brands: ["エクア®"],
    class: "DPP-4",
    renal: [
      { min: 50, max: 999, text: "50 mg × 2 回/日",          level: "green"  },
      { min: 0,  max: 49,  text: "50 mg × 1 回/日（減量）",  level: "yellow" }
    ],
    dialysis: "可（50 mg × 1 回/日）",
    sickday:  "原則継続可（脱水なければ）"
  },
  {
    ingredient: "アログリプチン",
    brands: ["ネシーナ®"],
    class: "DPP-4",
    renal: [
      { min: 60, max: 999, text: "25 mg/日",              level: "green"  },
      { min: 30, max: 59,  text: "12.5 mg/日（減量）",    level: "yellow" },
      { min: 0,  max: 29,  text: "6.25 mg/日（減量）",    level: "orange" }
    ],
    dialysis: "可（6.25 mg/日）",
    sickday:  "原則継続可（脱水なければ）"
  },
  {
    ingredient: "サキサグリプチン",
    brands: ["オングリザ®"],
    class: "DPP-4",
    renal: [
      { min: 50, max: 999, text: "5 mg/日",               level: "green"  },
      { min: 0,  max: 49,  text: "2.5 mg/日（減量）",     level: "yellow" }
    ],
    dialysis: "可（2.5 mg/日）",
    sickday:  "原則継続可（脱水なければ）"
  },
  {
    ingredient: "アナグリプチン",
    brands: ["スイニー®"],
    class: "DPP-4",
    renal: [
      { min: 30, max: 999, text: "100 mg × 2 回/日",          level: "green"  },
      { min: 0,  max: 29,  text: "100 mg × 1 回/日（減量）",  level: "yellow" }
    ],
    dialysis: "可（100 mg × 1 回/日）",
    sickday:  "原則継続可（脱水なければ）"
  },
  {
    ingredient: "リナグリプチン",
    brands: ["トラゼンタ®"],
    class: "DPP-4",
    renal:    "調整不要（胆汁排泄主体）",
    dialysis: "可",
    sickday:  "継続可"
  },
  {
    ingredient: "テネリグリプチン",
    brands: ["テネリア®"],
    class: "DPP-4",
    renal:    "調整不要",
    dialysis: "可",
    sickday:  "継続可"
  },
  {
    ingredient: "オマリグリプチン",
    brands: ["マリゼブ®"],
    class: "DPP-4週1",
    renal: [
      { min: 50, max: 999, text: "25 mg/週",              level: "green"  },
      { min: 30, max: 49,  text: "12.5 mg/週（減量）",    level: "yellow" },
      { min: 0,  max: 29,  text: "慎重投与",               level: "orange" }
    ],
    dialysis: "慎重",
    sickday:  "原則継続可（脱水なければ）"
  },
  {
    ingredient: "トレラグリプチン",
    brands: ["ザファテック®"],
    class: "DPP-4週1",
    renal: [
      { min: 50, max: 999, text: "100 mg/週",             level: "green"  },
      { min: 0,  max: 49,  text: "50 mg/週（減量）",      level: "yellow" }
    ],
    dialysis: "可（50 mg/週）",
    sickday:  "原則継続可（脱水なければ）"
  },
  {
    ingredient: "イメグリミン",
    brands: ["ツイミーグ®"],
    class: "グリミン",
    renal: [
      { min: 45, max: 999, text: "2000 mg/日",            level: "green"  },
      { min: 15, max: 44,  text: "1000 mg/日（減量）",    level: "yellow" },
      { min: 10, max: 14,  text: "500 mg/日（減量）",     level: "orange" },
      { min: 0,  max: 9,   text: "推奨されない",           level: "red"    }
    ],
    dialysis: "推奨されない",
    sickday:  "中止",
    risk:     "乳酸アシドーシスリスク（メトホルミンとの併用時は特に注意）"
  },
  {
    ingredient: "ダパグリフロジン",
    brands: ["フォシーガ®"],
    class: "SGLT2",
    start: [
      { min: 45, max: 999, text: "開始可",                level: "green"  },
      { min: 25, max: 44,  text: "開始可（効果減弱）",    level: "yellow" },
      { min: 0,  max: 24,  text: "開始不可",              level: "red"    }
    ],
    continue: [
      { min: 25, max: 999, text: "継続可",                level: "green"  },
      { min: 0,  max: 24,  text: "原則中止",              level: "red"    }
    ],
    dialysis:      "禁忌（血糖管理目的）",
    perioperative: "術前 3 日前から中止 / 術後は経口摂取安定後に再開",
    sickday:       "中止",
    risk:          "正常血糖 DKA（インスリン低下→グルカゴン増加→ケトン産生亢進。腹痛・悪心・倦怠感は受診）"
  },
  {
    ingredient: "エンパグリフロジン",
    brands: ["ジャディアンス®"],
    class: "SGLT2",
    start: [
      { min: 45, max: 999, text: "開始可",                level: "green"  },
      { min: 20, max: 44,  text: "開始可",                level: "yellow" },
      { min: 0,  max: 19,  text: "開始不可",              level: "red"    }
    ],
    continue: [
      { min: 20, max: 999, text: "継続可",                level: "green"  },
      { min: 0,  max: 19,  text: "原則中止",              level: "red"    }
    ],
    dialysis:      "禁忌（血糖管理目的）",
    perioperative: "術前 3 日前から中止 / 術後は経口摂取安定後に再開",
    sickday:       "中止",
    risk:          "正常血糖 DKA"
  },
  {
    ingredient: "カナグリフロジン",
    brands: ["カナグル®"],
    class: "SGLT2",
    start: [
      { min: 45, max: 999, text: "開始可",                level: "green"  },
      { min: 30, max: 44,  text: "慎重開始",              level: "yellow" },
      { min: 0,  max: 29,  text: "開始不可",              level: "red"    }
    ],
    continue: [
      { min: 30, max: 999, text: "継続可",                level: "green"  },
      { min: 0,  max: 29,  text: "原則中止",              level: "red"    }
    ],
    dialysis:      "禁忌（血糖管理目的）",
    perioperative: "術前 3 日前から中止 / 術後は経口摂取安定後に再開",
    sickday:       "中止",
    risk:          "正常血糖 DKA"
  },
  {
    ingredient: "イプラグリフロジン",
    brands: ["スーグラ®"],
    class: "SGLT2",
    start: [
      { min: 45, max: 999, text: "開始可",                level: "green"  },
      { min: 0,  max: 44,  text: "開始不可",              level: "red"    }
    ],
    continue: [
      { min: 45, max: 999, text: "継続可",                level: "green"  },
      { min: 0,  max: 44,  text: "原則中止",              level: "red"    }
    ],
    dialysis:      "禁忌（血糖管理目的）",
    perioperative: "術前 3 日前から中止 / 術後は経口摂取安定後に再開",
    sickday:       "中止",
    risk:          "正常血糖 DKA"
  },
  {
    ingredient: "ルセオグリフロジン",
    brands: ["ルセフィ®"],
    class: "SGLT2",
    start: [
      { min: 45, max: 999, text: "開始可",                level: "green"  },
      { min: 0,  max: 44,  text: "開始不可",              level: "red"    }
    ],
    continue: [
      { min: 45, max: 999, text: "継続可",                level: "green"  },
      { min: 0,  max: 44,  text: "原則中止",              level: "red"    }
    ],
    dialysis:      "禁忌（血糖管理目的）",
    perioperative: "術前 3 日前から中止 / 術後は経口摂取安定後に再開",
    sickday:       "中止",
    risk:          "正常血糖 DKA"
  },
  {
    ingredient: "トホグリフロジン",
    brands: ["デベルザ®"],
    class: "SGLT2",
    start: [
      { min: 45, max: 999, text: "開始可",                level: "green"  },
      { min: 0,  max: 44,  text: "開始不可",              level: "red"    }
    ],
    continue: [
      { min: 45, max: 999, text: "継続可",                level: "green"  },
      { min: 0,  max: 44,  text: "原則中止",              level: "red"    }
    ],
    dialysis:      "禁忌（血糖管理目的）",
    perioperative: "術前 3 日前から中止 / 術後は経口摂取安定後に再開",
    sickday:       "中止",
    risk:          "正常血糖 DKA"
  },
  {
    ingredient: "ピオグリタゾン",
    brands: ["アクトス®"],
    class: "TZD",
    renal:    "調整不要",
    dialysis: "可（慎重）",
    risk:     "浮腫・心不全増悪リスク。高齢女性で骨折リスク増加（PROactive 解析）"
  },
  {
    ingredient: "セマグルチド（経口）",
    brands: ["リベルサス®"],
    class: "GLP-1",
    renal:    "調整不要",
    dialysis: "慎重",
    sickday:  "中止",
    risk:     "悪心・嘔吐（用量依存性）",
    special:  "起床時空腹で 120 mL 以下の水で服用。服用後 30 分は飲食・他薬不可"
  }
];

// ══════════════════════════════════════════════════════
//  配合剤マスター
// ══════════════════════════════════════════════════════
const combinationMaster = [
  { brand: "イニシンク®",     ingredients: ["シタグリプチン",   "メトホルミン"]       },
  { brand: "エクメット®",     ingredients: ["ビルダグリプチン", "メトホルミン"]       },
  { brand: "メタクト®",       ingredients: ["ピオグリタゾン",   "メトホルミン"]       },
  { brand: "スージャヌ®",     ingredients: ["シタグリプチン",   "イプラグリフロジン"]  },
  { brand: "トラディアンス®",  ingredients: ["リナグリプチン",   "エンパグリフロジン"]  },
  { brand: "カナリア®",       ingredients: ["カナグリフロジン", "メトホルミン"]       }
];

// ══════════════════════════════════════════════════════
//  ユーティリティ
// ══════════════════════════════════════════════════════
const THEME = { green: "theme-green", yellow: "theme-yellow", orange: "theme-orange", red: "theme-red", gray: "theme-gray" };
const BADGE = { green: "badge-green", yellow: "badge-yellow", orange: "badge-orange", red: "badge-red", gray: "badge-gray" };

function themeClass(level) { return THEME[level] || THEME.gray; }
function badgeClass(level) { return BADGE[level] || BADGE.gray; }

function matchRange(ranges, egfr) {
  if (!Array.isArray(ranges)) return null;
  return ranges.find(r => egfr >= r.min && egfr <= r.max) || null;
}

function worstLevel(levels) {
  const order = ["red", "orange", "yellow", "green"];
  for (const l of order) {
    if (levels.includes(l)) return l;
  }
  return "gray";
}

/** 商品名行を生成する */
function renderBrands(item) {
  if (!item.brands || item.brands.length === 0) return "";
  return `<p class="brand-line"><span class="brand-label">商品名：</span>${item.brands.join("／")}</p>`;
}

// ══════════════════════════════════════════════════════
//  カード HTML 生成
// ══════════════════════════════════════════════════════

function renderRenalText(item, egfr, dialysis) {
  if (dialysis) {
    const d = item.dialysis || "情報なし";
    const lvl = /禁忌/.test(d) ? "red" : /慎重/.test(d) ? "orange" : /推奨されない/.test(d) ? "red" : "yellow";
    return { level: lvl, html: `<p><strong>透析：</strong>${d}</p>` };
  }
  if (Array.isArray(item.renal)) {
    const r = matchRange(item.renal, egfr);
    if (r) return { level: r.level, html: `<p><strong>用量目安：</strong>${r.text}</p>` };
  }
  if (typeof item.renal === "string") {
    const lvl = /禁忌/.test(item.renal) ? "red" : /慎重/.test(item.renal) ? "orange" : "green";
    return { level: lvl, html: `<p><strong>腎機能：</strong>${item.renal}</p>` };
  }
  return { level: "gray", html: `<p>情報なし</p>` };
}

function buildExtras(item) {
  let html = "";
  if (item.perioperative) html += `<p><strong>周術期：</strong>${item.perioperative}</p>`;
  if (item.contrast)      html += `<p><strong>造影剤：</strong>${item.contrast}</p>`;
  if (item.sickday)       html += `<p><strong>シックデイ：</strong>${item.sickday}</p>`;
  if (item.risk)          html += `<p><strong>重大副作用：</strong>${item.risk}</p>`;
  if (item.special)       html += `<p><strong>特記：</strong>${item.special}</p>`;
  return html;
}

function renderSGLT2Card(item, egfr, dialysis) {
  let startEntry, contEntry, overallLevel;

  if (dialysis) {
    const d = item.dialysis || "禁忌";
    overallLevel = "red";
    startEntry   = { text: d, level: "red" };
    contEntry    = { text: d, level: "red" };
  } else {
    startEntry   = matchRange(item.start,    egfr) || { text: "情報なし", level: "gray" };
    contEntry    = matchRange(item.continue, egfr) || { text: "情報なし", level: "gray" };
    overallLevel = worstLevel([startEntry.level, contEntry.level]);
  }

  return `
  <div class="drug-card ${themeClass(overallLevel)}">
    <div class="drug-header">
      <div>
        <div class="drug-name">${item.ingredient}</div>
        <div class="drug-sub">${item.class}</div>
      </div>
      <span class="status-badge ${badgeClass(startEntry.level)}">${startEntry.text}</span>
    </div>
    <div class="drug-detail">
      ${renderBrands(item)}
      <p><strong>開始：</strong><span class="lv-${startEntry.level}">${startEntry.text}</span></p>
      <p><strong>継続：</strong><span class="lv-${contEntry.level}">${contEntry.text}</span></p>
      ${buildExtras(item)}
    </div>
  </div>`;
}

function renderIngredientCard(item, egfr, dialysis) {
  if (item.class === "SGLT2") return renderSGLT2Card(item, egfr, dialysis);

  const { level, html: renalHtml } = renderRenalText(item, egfr, dialysis);

  const statusLabel = level === "green"  ? "標準"
    : level === "yellow" ? "減量"
    : level === "orange" ? "慎重"
    : level === "red"    ? "禁忌"
    : "確認";

  return `
  <div class="drug-card ${themeClass(level)}">
    <div class="drug-header">
      <div>
        <div class="drug-name">${item.ingredient}</div>
        <div class="drug-sub">${item.class}</div>
      </div>
      <span class="status-badge ${badgeClass(level)}">${statusLabel}</span>
    </div>
    <div class="drug-detail">
      ${renderBrands(item)}
      ${renalHtml}
      ${buildExtras(item)}
    </div>
  </div>`;
}

// ══════════════════════════════════════════════════════
//  配合剤セクション
// ══════════════════════════════════════════════════════

function renderCombinationSection(egfr, dialysis) {
  let html = `<div class="section-title">配合剤（成分分解表示）</div>`;

  for (const combo of combinationMaster) {
    const resolved = combo.ingredients
      .map(name => ingredientMaster.find(m => m.ingredient === name))
      .filter(Boolean);

    if (resolved.length === 0) continue;

    html += `
    <div class="combo-wrapper">
      <div class="combo-brand-label">${combo.brand}（${combo.ingredients.join(" ＋ ")}）</div>
      ${resolved.map(item => renderIngredientCard(item, egfr, dialysis)).join("")}
    </div>`;
  }
  return html;
}

// ══════════════════════════════════════════════════════
//  クラス別グループ表示
// ══════════════════════════════════════════════════════

const CLASS_ORDER = [
  { key: "ビグアナイド",  label: "ビグアナイド系" },
  { key: "SU",           label: "SU 薬（スルホニルウレア）" },
  { key: "グリニド",     label: "グリニド薬（速効型インスリン分泌促進）" },
  { key: "αGI",          label: "α-グルコシダーゼ阻害薬（αGI）" },
  { key: "DPP-4",        label: "DPP-4 阻害薬（1 日 1 回）" },
  { key: "DPP-4週1",     label: "DPP-4 阻害薬（週 1 回）" },
  { key: "グリミン",     label: "イミダゾリン系（グリミン）" },
  { key: "SGLT2",        label: "SGLT2 阻害薬（血糖管理目的）" },
  { key: "TZD",          label: "チアゾリジン系（TZD）" },
  { key: "GLP-1",        label: "GLP-1 受容体作動薬（経口）" }
];

function renderAllClasses(egfr, dialysis) {
  let html = "";
  for (const cls of CLASS_ORDER) {
    const items = ingredientMaster.filter(m => m.class === cls.key);
    if (items.length === 0) continue;

    html += `<div class="section-title">${cls.label}</div>`;

    if (cls.key === "SGLT2") {
      html += `<p class="sglt2-note">※ 血糖管理目的を前提としています。心不全・CKD 適応は別基準を参照してください。</p>`;
    }
    if (cls.key === "DPP-4" || cls.key === "DPP-4週1") {
      html += `<p class="dpp4-note">※ DPP-4 阻害薬は脱水がなければシックデイでも原則継続可です。</p>`;
    }

    html += items.map(item => renderIngredientCard(item, egfr, dialysis)).join("");
  }
  return html;
}

// ══════════════════════════════════════════════════════
//  安全管理情報ブロック
// ══════════════════════════════════════════════════════

function renderSafetyBlocks() {
  return `
  <div class="section-title">安全管理情報</div>

  <div class="info-block">
    <div class="info-block-header">🔪 周術期管理</div>
    <div class="info-block-body">
      <p><strong>メトホルミン</strong></p>
      <ul>
        <li>手術当日は中止</li>
        <li>大手術の場合は前日からの中止を検討</li>
        <li>術後は経口摂取再開かつ腎機能安定を確認後に再開</li>
      </ul>
      <p style="margin-top:8px"><strong>SGLT2 阻害薬</strong></p>
      <ul>
        <li>術前 3 日前から中止</li>
        <li>術後は経口摂取安定後に再開</li>
      </ul>
    </div>
  </div>

  <div class="info-block">
    <div class="info-block-header">💉 造影剤使用時</div>
    <div class="info-block-body">
      <p><strong>メトホルミン</strong></p>
      <ul>
        <li>造影剤投与当日は中止</li>
        <li>投与後 48 時間は休薬し、腎機能を確認してから再開</li>
      </ul>
    </div>
  </div>

  <div class="info-block">
    <div class="info-block-header">🤒 シックデイ管理</div>
    <div class="info-block-body">
      <p><strong>中止が必要な薬剤</strong></p>
      <ul>
        <li>メトホルミン（メトグルコ®・グリコラン®・ジベトス®）</li>
        <li>SGLT2 阻害薬（フォシーガ®・ジャディアンス®・カナグル®・スーグラ®・ルセフィ®・デベルザ®）</li>
        <li>イメグリミン（ツイミーグ®）</li>
        <li>セマグルチド経口（リベルサス®）</li>
        <li>SU 薬（アマリール®・グリミクロン®・オイグルコン®・ダオニール®）</li>
        <li>グリニド薬（スターシス®・ファスティック®・グルファスト®・シュアポスト®）</li>
        <li>αGI（食事摂取不良時は中止）</li>
      </ul>
      <p style="margin-top:8px"><strong>原則継続可</strong></p>
      <ul>
        <li>DPP-4 阻害薬（脱水がなければ継続可）</li>
      </ul>
    </div>
  </div>

  <details>
    <summary>病態解説（折りたたみ）</summary>
    <div class="details-body">
      <h4>◆ メトホルミン乳酸アシドーシス</h4>
      <ul>
        <li>ミトコンドリア複合体 Ⅰ を阻害し、嫌気的解糖を促進</li>
        <li>乳酸が蓄積し乳酸アシドーシスを引き起こす</li>
        <li>脱水・低酸素・腎機能低下で著明に悪化</li>
      </ul>
      <h4>◆ SGLT2 阻害薬による正常血糖 DKA</h4>
      <ul>
        <li>インスリン分泌低下 → グルカゴン増加 → ケトン産生亢進</li>
        <li>尿糖排泄によりグルコースが低下するため血糖上昇が目立たない</li>
        <li>腹痛・悪心・倦怠感が出現した場合は速やかに受診</li>
      </ul>
    </div>
  </details>

  <div class="disclaimer">
    <strong>【免責事項】</strong><br>
    本ツールは薬剤師の意思決定支援を目的としています（血糖管理目的を前提）。<br>
    最終判断は必ず主治医の指示に従い、最新の添付文書・ガイドラインを確認してください。<br>
    個人情報は一切保存・送信しません。
  </div>`;
}

// ══════════════════════════════════════════════════════
//  メイン計算処理
// ══════════════════════════════════════════════════════

function calculate() {
  const egfrInput = document.getElementById('egfr-input');
  const dialysis  = document.getElementById('dialysis-check').checked;
  const egfr      = parseFloat(egfrInput.value);

  if (!dialysis && (isNaN(egfr) || egfr < 0 || egfr > 200)) {
    egfrInput.style.borderColor = '#c62828';
    egfrInput.focus();
    return;
  }
  egfrInput.style.borderColor = '';

  const effectiveEgfr = dialysis ? 0 : egfr;
  const egfrLabel     = dialysis ? '透析' : `eGFR ${egfr} mL/min/1.73m²`;

  const resultsEl = document.getElementById('results');
  resultsEl.innerHTML = `
    <p style="font-size:.82rem;color:var(--gray);margin-bottom:12px">
      判定条件：<strong>${egfrLabel}</strong>
    </p>
    ${renderAllClasses(effectiveEgfr, dialysis)}
    ${renderCombinationSection(effectiveEgfr, dialysis)}
    ${renderSafetyBlocks()}
  `;

  resultsEl.style.display = 'block';
  resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ══════════════════════════════════════════════════════
//  追加スタイル（動的インジェクション）
// ══════════════════════════════════════════════════════

(function injectDynamicStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .lv-green  { color: var(--green);  font-weight: 700; }
    .lv-yellow { color: var(--yellow); font-weight: 700; }
    .lv-orange { color: var(--orange); font-weight: 700; }
    .lv-red    { color: var(--red);    font-weight: 700; }
    .lv-gray   { color: var(--gray);   font-weight: 700; }

    /* 商品名行 */
    .brand-line {
      font-size: .8rem;
      color: var(--blue-dark);
      margin-bottom: 4px;
      line-height: 1.5;
    }
    .brand-label {
      font-weight: 700;
      margin-right: 2px;
    }

    /* DPP-4 注意文 */
    .dpp4-note {
      font-size: .75rem;
      color: var(--blue-mid);
      font-weight: 600;
      margin-bottom: 6px;
    }

    /* 配合剤ラッパー */
    .combo-wrapper {
      margin-bottom: 18px;
    }
    .combo-brand-label {
      background: var(--blue-dark);
      color: #fff;
      font-size: .8rem;
      font-weight: 700;
      padding: 6px 14px;
      border-radius: 8px 8px 0 0;
      margin-bottom: -4px;
    }
    .combo-wrapper .drug-card:first-of-type {
      border-radius: 0;
    }
    .combo-wrapper .drug-card:last-of-type {
      border-radius: 0 0 var(--radius) var(--radius);
      margin-bottom: 0;
    }
  `;
  document.head.appendChild(style);
})();

// ══════════════════════════════════════════════════════
//  イベント登録
// ══════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('calc-btn').addEventListener('click', calculate);

  document.getElementById('egfr-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') calculate();
  });

  document.getElementById('dialysis-check').addEventListener('change', function () {
    const input = document.getElementById('egfr-input');
    input.disabled      = this.checked;
    input.style.opacity = this.checked ? '0.4' : '1';
    if (this.checked) input.value = '';
  });
});
