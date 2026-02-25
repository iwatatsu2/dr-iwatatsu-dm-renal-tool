'use strict';

/* =====================================================
   Dr.いわたつ 糖尿病経口薬 腎機能サポートツール
   script.js  ver1.0
===================================================== */

// ── ユーティリティ ──────────────────────────────────
function theme(key) {
  const map = { green:'theme-green', yellow:'theme-yellow', orange:'theme-orange', red:'theme-red', gray:'theme-gray' };
  return map[key] || 'theme-gray';
}
function badge(key) {
  const map = { green:'badge-green', yellow:'badge-yellow', orange:'badge-orange', red:'badge-red', gray:'badge-gray' };
  return map[key] || 'badge-gray';
}

// ── 各薬剤の判定関数 ────────────────────────────────

function judgeMetformin(egfr, dialysis) {
  if (dialysis) return { color:'red', status:'禁忌', dose:'投与不可', detail:'透析患者への投与は禁忌です。' };
  if (egfr >= 60) return { color:'green',  status:'標準',  dose:'最大 2250 mg/日', detail:'通常用量で使用可能です。' };
  if (egfr >= 45) return { color:'yellow', status:'減量',  dose:'最大 1500 mg/日', detail:'腎機能に応じて減量してください。' };
  if (egfr >= 30) return { color:'orange', status:'慎重',  dose:'最大 750 mg/日',  detail:'慎重投与。定期的な腎機能モニタリングが必要です。' };
  return { color:'red', status:'禁忌', dose:'投与不可', detail:'eGFR 30 未満では乳酸アシドーシスリスクのため禁忌です。' };
}

function judgeSitagliptin(egfr, dialysis) {
  if (dialysis) return { color:'yellow', status:'減量', dose:'12.5 mg（最大 25 mg）', detail:'透析患者も投与可。用量調整が必要です。' };
  if (egfr >= 50) return { color:'green',  status:'標準', dose:'50 mg（最大 100 mg）', detail:'通常用量で使用可能です。' };
  if (egfr >= 30) return { color:'yellow', status:'減量', dose:'25 mg（最大 50 mg）',  detail:'腎機能に応じて減量してください。' };
  return { color:'orange', status:'減量', dose:'12.5 mg（最大 25 mg）', detail:'eGFR 30 未満では最小用量に減量してください。' };
}

function judgeTradjenta(egfr, dialysis) {
  return { color:'green', status:'標準', dose:'5 mg/日（調整不要）', detail:'腎機能による用量調整は不要です。透析患者にも投与可能です。' };
}

function judgeTenelia(egfr, dialysis) {
  return { color:'green', status:'標準', dose:'20 mg/日（調整不要）', detail:'腎機能による用量調整は不要です。透析患者にも投与可能です。' };
}

function judgeZafatek(egfr, dialysis) {
  if (dialysis) return { color:'yellow', status:'減量', dose:'50 mg/週（透析・減量）', detail:'透析患者も投与可。50 mg/週に減量してください。' };
  if (egfr >= 50) return { color:'green',  status:'標準', dose:'100 mg/週', detail:'通常用量で使用可能です（週1回投与）。' };
  return { color:'yellow', status:'減量', dose:'50 mg/週', detail:'eGFR 50 未満では 50 mg/週に減量してください。' };
}

function judgeMarizerb(egfr, dialysis) {
  if (dialysis) return { color:'orange', status:'慎重', dose:'慎重投与', detail:'透析患者への投与は慎重に行ってください。' };
  if (egfr >= 50) return { color:'green',  status:'標準', dose:'25 mg/週', detail:'通常用量で使用可能です（週1回投与）。' };
  if (egfr >= 30) return { color:'yellow', status:'減量', dose:'12.5 mg/週', detail:'eGFR 30〜49 では 12.5 mg/週に減量してください。' };
  return { color:'orange', status:'慎重', dose:'慎重投与', detail:'eGFR 30 未満では慎重投与。リスクとベネフィットを慎重に評価してください。' };
}

function judgeTwiMeeg(egfr, dialysis) {
  if (dialysis) return { color:'red', status:'推奨されない', dose:'投与推奨されない', detail:'透析患者への投与は推奨されません。' };
  if (egfr >= 45) return { color:'green',  status:'標準', dose:'2000 mg/日', detail:'通常用量で使用可能です（2025年改訂基準）。' };
  if (egfr >= 15) return { color:'yellow', status:'減量', dose:'1000 mg/日', detail:'eGFR 15〜44 では 1000 mg/日に減量してください。' };
  if (egfr >= 10) return { color:'orange', status:'慎重', dose:'500 mg/日', detail:'eGFR 10〜14 では 500 mg/日。慎重投与が必要です。' };
  return { color:'red', status:'推奨されない', dose:'投与推奨されない', detail:'eGFR 10 未満では投与は推奨されません。' };
}

// SGLT2 阻害薬（血糖管理目的）
function judgeSGLT2(egfr, dialysis) {
  const drugs = [
    {
      name: 'フォシーガ', generic: 'ダパグリフロジン',
      start: egfr >= 45 ? { color:'green', text:'開始可' }
           : egfr >= 25 ? { color:'yellow', text:'開始可（効果減弱）' }
           : { color:'red', text:'開始不可' },
      cont:  egfr >= 25 ? { color:'green', text:'継続可' }
           : { color:'red', text:'原則中止' }
    },
    {
      name: 'ジャディアンス', generic: 'エンパグリフロジン',
      start: egfr >= 45 ? { color:'green', text:'開始可' }
           : egfr >= 20 ? { color:'yellow', text:'開始可' }
           : { color:'red', text:'開始不可' },
      cont:  egfr >= 20 ? { color:'green', text:'継続可' }
           : { color:'red', text:'原則中止' }
    },
    {
      name: 'カナグル', generic: 'カナグリフロジン',
      start: egfr >= 45 ? { color:'green', text:'開始可' }
           : egfr >= 30 ? { color:'orange', text:'慎重可' }
           : { color:'red', text:'開始不可' },
      cont:  egfr >= 30 ? { color:'green', text:'継続可' }
           : { color:'red', text:'原則中止' }
    },
    {
      name: 'スーグラ・ルセフィ・デベルザ', generic: 'イプラグリフロジン他',
      start: egfr >= 45 ? { color:'green', text:'開始可' }
           : { color:'red', text:'開始不可' },
      cont:  egfr >= 45 ? { color:'green', text:'継続可' }
           : { color:'red', text:'原則中止' }
    }
  ];

  if (dialysis) {
    drugs.forEach(d => {
      d.start = { color:'red', text:'開始不可' };
      d.cont  = { color:'red', text:'原則中止' };
    });
  }
  return drugs;
}

// ── カード生成ヘルパー ────────────────────────────────

function makeDrugCard(name, sub, result) {
  return `
  <div class="drug-card ${theme(result.color)}">
    <div class="drug-header">
      <div>
        <div class="drug-name">${name}</div>
        ${sub ? `<div class="drug-sub">${sub}</div>` : ''}
      </div>
      <span class="status-badge ${badge(result.color)}">${result.status}</span>
    </div>
    <div class="drug-detail">
      <p><strong>用量目安：</strong>${result.dose}</p>
      <p>${result.detail}</p>
    </div>
  </div>`;
}

function makeSGLT2Cards(drugs) {
  return drugs.map(d => {
    const overallColor = d.start.color === 'red' ? 'red'
      : d.start.color === 'orange' ? 'orange'
      : d.cont.color  === 'red'    ? 'yellow'
      : 'green';
    return `
    <div class="drug-card ${theme(overallColor)}">
      <div class="drug-header">
        <div>
          <div class="drug-name">${d.name}</div>
          <div class="drug-sub">${d.generic}</div>
        </div>
        <span class="status-badge ${badge(d.start.color)}">${d.start.text}</span>
      </div>
      <div class="drug-detail">
        <p><strong>開始：</strong><span style="color:var(--${d.start.color === 'green' ? 'green' : d.start.color === 'yellow' ? 'yellow' : d.start.color === 'orange' ? 'orange' : 'red'})">${d.start.text}</span></p>
        <p><strong>継続：</strong><span style="color:var(--${d.cont.color === 'green' ? 'green' : 'red'})">${d.cont.text}</span></p>
      </div>
    </div>`;
  }).join('');
}

// ── メイン計算処理 ────────────────────────────────────

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

  // 判定
  const metformin   = judgeMetformin(effectiveEgfr, dialysis);
  const sitagliptin = judgeSitagliptin(effectiveEgfr, dialysis);
  const tradjenta   = judgeTradjenta(effectiveEgfr, dialysis);
  const tenelia     = judgeTenelia(effectiveEgfr, dialysis);
  const zafatek     = judgeZafatek(effectiveEgfr, dialysis);
  const marizerb    = judgeMarizerb(effectiveEgfr, dialysis);
  const twiMeeg     = judgeTwiMeeg(effectiveEgfr, dialysis);
  const sglt2drugs  = judgeSGLT2(effectiveEgfr, dialysis);

  const egfrLabel = dialysis ? '透析' : `eGFR ${egfr} mL/min/1.73m²`;

  // 周術期
  const periop = `
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
  </div>`;

  // 造影剤
  const contrast = `
  <div class="info-block">
    <div class="info-block-header">💉 造影剤使用時</div>
    <div class="info-block-body">
      <p><strong>メトホルミン</strong></p>
      <ul>
        <li>造影剤投与当日は中止</li>
        <li>投与後 48 時間は休薬し、腎機能を確認してから再開</li>
      </ul>
    </div>
  </div>`;

  // シックデイ
  const sickday = `
  <div class="info-block">
    <div class="info-block-header">🤒 シックデイ管理</div>
    <div class="info-block-body">
      <p><strong>中止が必要な薬剤</strong></p>
      <ul>
        <li>メトホルミン</li>
        <li>SGLT2 阻害薬</li>
        <li>ツイミーグ</li>
        <li>リベルサス（GLP-1 受容体作動薬）</li>
        <li>SU 薬</li>
        <li>グリニド薬</li>
      </ul>
      <p style="margin-top:8px"><strong>原則継続可</strong></p>
      <ul>
        <li>DPP-4 阻害薬（脱水がなければ継続可）</li>
      </ul>
    </div>
  </div>`;

  // 病態解説（折りたたみ）
  const pathophysiology = `
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
  </details>`;

  // 免責
  const disclaimer = `
  <div class="disclaimer">
    <strong>【免責事項】</strong><br>
    本ツールは薬剤師の意思決定支援を目的としています。最終判断は必ず主治医の指示に従い、最新の添付文書・ガイドラインを確認してください。
  </div>`;

  // 出力
  const resultsEl = document.getElementById('results');
  resultsEl.innerHTML = `
    <p style="font-size:.82rem;color:var(--gray);margin-bottom:12px">判定条件：<strong>${egfrLabel}</strong></p>

    <div class="section-title">ビグアナイド系</div>
    ${makeDrugCard('メトホルミン', 'グルコファージ・メトグルコ 他', metformin)}

    <div class="section-title">DPP-4 阻害薬</div>
    ${makeDrugCard('シタグリプチン', 'ジャヌビア／グラクティブ', sitagliptin)}
    ${makeDrugCard('リナグリプチン', 'トラゼンタ', tradjenta)}
    ${makeDrugCard('テネリグリプチン', 'テネリア', tenelia)}
    ${makeDrugCard('トレラグリプチン（週1回）', 'ザファテック', zafatek)}
    ${makeDrugCard('オマリグリプチン（週1回）', 'マリゼブ', marizerb)}

    <div class="section-title">イミダゾリン系</div>
    ${makeDrugCard('イメグリミン', 'ツイミーグ（2025 改訂）', twiMeeg)}

    <div class="section-title">SGLT2 阻害薬（血糖管理目的）</div>
    <p class="sglt2-note">※ 血糖管理目的を前提としています。心不全・CKD 適応は別基準を参照してください。</p>
    ${makeSGLT2Cards(sglt2drugs)}

    <div class="section-title">安全管理情報</div>
    ${periop}
    ${contrast}
    ${sickday}
    ${pathophysiology}
    ${disclaimer}
  `;

  resultsEl.style.display = 'block';
  resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ── イベント登録 ──────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('calc-btn').addEventListener('click', calculate);

  document.getElementById('egfr-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') calculate();
  });

  document.getElementById('dialysis-check').addEventListener('change', function() {
    const input = document.getElementById('egfr-input');
    input.disabled = this.checked;
    input.style.opacity = this.checked ? '0.4' : '1';
    if (this.checked) input.value = '';
  });
});
