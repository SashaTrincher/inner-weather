'use strict';
const modes = {
 quick: {title:'Quick check-in',time:'About 2 minutes',model:window.EmotionModel},
 deep: {title:'In-depth check-in',time:'About 7–10 minutes',model:window.DeepEmotionModel}
};
const workspace=document.getElementById('workspace');
const sessions=Object.fromEntries(Object.entries(modes).map(([key,mode])=>[key,{answers:Array(mode.model.questions.length).fill(undefined),step:0,complete:false}]));
let modeKey=null,view='home',editing=false;
const active=()=>sessions[modeKey];
const config=()=>modes[modeKey];
const labelsFor=q=>q.labels||['Not at all','A little','Moderately','Quite a lot','Very much'];
const focusHeading=id=>document.getElementById(id).focus();
function home(focus=false){
 view='home';editing=false;workspace.classList.remove('result-workspace');
 workspace.innerHTML=`<span class="question-category">TWO WAYS TO CHECK IN</span><h2 id="choose-title" tabindex="-1">How much space do you need?</h2><p class="hint">A small snapshot or a deeper exploration. Choose what feels right today.</p><div class="mode-options">${Object.entries(modes).map(([key,m])=>{
 const s=sessions[key],answered=s.answers.filter(a=>a!==undefined).length;
 return `<article class="mode-card"><div class="mode-meta">${m.model.questions.length} QUESTIONS · ${m.time.toUpperCase()}</div><h3>${m.title}</h3><p>${key==='quick'?'The familiar, lighter reflection on your mood, energy, connection and sense of direction.':'Explore feelings alongside body sensations, thought patterns, relationships and current circumstances.'}</p><span class="mode-range">${m.model.profiles.length} possible emotional patterns</span><button class="${key==='quick'?'primary':'secondary'}" data-mode="${key}">${s.complete?'View results':answered?'Resume check-in':key==='quick'?'Start quick check-in':'Start in-depth check-in'}</button>${answered&&!s.complete?`<span class="saved-note">${answered} of ${s.answers.length} answered in this tab</span>`:''}</article>`;
 }).join('')}</div><p class="micro">Both give you a closest match and three alternatives.<br>Your answers stay in this tab and disappear on reload.</p>`;
 workspace.querySelectorAll('[data-mode]').forEach(button=>button.onclick=()=>{modeKey=button.dataset.mode;sessions[modeKey].complete?results():render(true);});
 if(focus)focusHeading('choose-title');
}
function render(focus=false){
 view='question';workspace.classList.remove('result-workspace');
 const {model,title,time}=config(),s=active(),q=model.questions[s.step],last=s.step===model.questions.length-1;
 workspace.innerHTML=`<div class="progress-top"><button class="back mode-link" id="choose-mode">${title}</button><span>Question ${s.step+1} / ${model.questions.length}</span></div><progress class="question-progress" max="${model.questions.length}" value="${s.answers.filter(a=>a!==undefined).length}" aria-label="Questions answered"></progress><div class="question-category">${modeKey==='deep'?`SECTION ${q.section+1} / ${model.sections.length} · `:''}${q.category}</div><h2 id="question" tabindex="-1">${q.title}</h2><p class="hint" id="hint">${q.hint}${q.context?' <span class="optional-note">Optional context · not used to rank emotions.</span>':''}</p><fieldset class="choices" aria-describedby="hint"><legend class="visually-hidden">${q.title}</legend>${labelsFor(q).map((label,i)=>`<label class="choice"><input type="radio" name="answer" value="${i}" ${s.answers[s.step]===i?'checked':''}><span class="choice-label">${label}</span></label>`).join('')}${q.context?`<label class="choice skip-choice"><input type="radio" name="answer" value="skip" ${s.answers[s.step]===null?'checked':''}><span class="choice-label">Not sure / prefer not to answer</span></label>`:''}</fieldset><div class="actions"><button class="back" id="back">${editing?'Back to review':s.step===0?'Choose check-in':'Back'}</button><button class="primary" id="next" ${s.answers[s.step]===undefined?'disabled':''}>${editing?'Save and return':last?'Explore my feelings':'Continue'}</button></div><p class="micro">${time} total · Answer for right now unless the question says otherwise.</p>`;
 workspace.querySelectorAll('input').forEach(input=>input.addEventListener('change',()=>{s.answers[s.step]=input.value==='skip'?null:Number(input.value);document.getElementById('next').disabled=false;}));
 document.getElementById('choose-mode').onclick=()=>home(true);
 document.getElementById('back').onclick=()=>{if(editing)review();else if(s.step===0)home(true);else{s.step--;render(true);}};
 document.getElementById('next').onclick=()=>{if(s.answers[s.step]===undefined)return;if(editing){editing=false;review();}else if(last){s.complete=true;results();}else{s.step++;render(true);}};
 if(focus)focusHeading('question');
}
function review(){
 view='review';editing=false;workspace.classList.add('result-workspace');const s=active(),m=config().model;
 workspace.innerHTML=`<span class="question-category">${config().title}</span><h2 id="review-title" tabindex="-1">Your answers, together.</h2><p class="hint">Edit any answer. Your results will be recalculated when you return.</p><button class="primary" id="return-results">Return to results</button><div class="review-list">${m.questions.map((q,i)=>`${i===0||q.category!==m.questions[i-1].category?`<h3>${q.category}</h3>`:''}<div class="review-row"><div><p>${i+1}. ${q.title}</p><strong>${s.answers[i]===null?'Not sure / prefer not to answer':labelsFor(q)[s.answers[i]]}</strong></div><button class="text-button" data-edit="${i}" aria-label="Edit answer ${i+1}">Edit</button></div>`).join('')}</div><button class="primary" id="return-bottom">Return to results</button>`;
 document.getElementById('return-results').onclick=results;document.getElementById('return-bottom').onclick=results;
 workspace.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>{s.step=Number(b.dataset.edit);editing=true;render(true);});focusHeading('review-title');
}
function results(){
 const {model,title}=config(),s=active(),matches=model.rank(s.answers),best=matches[0],gap=matches[1].distance-best.distance;
 const weak=best.distance>2,close=gap<.35,reasons=model.explain(s.answers,best),notes=model.context?model.context(s.answers):[];
 s.complete=true;view='results';editing=false;workspace.classList.add('result-workspace');
 workspace.innerHTML=`<span class="result-label">${title} · YOUR SNAPSHOT</span><h2 class="result-title" id="result-title" tabindex="-1">${best.name}</h2><p class="hint">${weak?'An approximate starting point — no description fits especially closely.':gap<.000001?'One of several equally close matches in this check-in.':close?'A tentative closest match — a few feelings sit close together.':'The closest match in this check-in.'}</p><div class="result-copy">${best.description}<p>${best.meaning}</p></div><div class="why"><h3>What in your answers points here</h3>${reasons.length?`<ul>${reasons.map(r=>`<li>${r}</li>`).join('')}</ul>`:'<p class="alternatives-note">There are few clear distinguishing signals in your answers. Treat these suggestions as words to explore.</p>'}</div>${model.snapshot?`<h3 class="alternatives-heading">Your body and mind snapshot</h3><p class="alternatives-note">A summary of what you reported, not an explanation of what caused it.</p><div class="factor-grid">${model.snapshot(s.answers).map(g=>`<section class="factor-card"><h4>${g.title}</h4><ul>${g.items.map(x=>`<li>${x}</li>`).join('')}</ul></section>`).join('')}</div><details class="context-details"><summary><strong>Physical & time context</strong></summary>${notes.length?notes.map(n=>`<p>${n}</p>`).join(''):'<p>No strong physical context was reported, or you chose not to answer those questions.</p>'}<p>Sleep, physical discomfort, basic needs and other physical influences are kept separate from emotion ranking. Physical symptoms can have many causes; this questionnaire cannot assess them.</p></details>`:''}<h3 class="alternatives-heading alternatives-title">Other feelings in the picture</h3><p class="alternatives-note">Three next-closest possibilities.${close?' Some have a similar fit, so their order is tentative.':' They have less support in this matching system.'} Open each to explore.</p><div id="alternatives">${matches.slice(1,4).map((m,i)=>`<details><summary><span class="rank">0${i+2}</span><strong>${m.name}</strong><span class="fit">${m.distance-best.distance<.000001?'Equal fit':m.distance-best.distance<.35?'Similar fit':'Less close'}</span></summary><p>${m.description}</p><p>${m.meaning}</p>${modeKey==='deep'?`<p><strong>Clues in your answers:</strong> ${model.explain(s.answers,m).join(' ')||'Few distinguishing signals; this is a tentative suggestion.'}</p>`:''}</details>`).join('')}</div><p class="result-footnote">These are hand-written, relative matches, not measured probabilities or a clinical assessment. ${modeKey==='deep'?'More questions add detail; they do not make this a validated test. ':''}Feelings can overlap, and you decide which words fit.</p><div class="result-actions"><button class="primary" id="review">Review my answers</button><button class="text-button" id="switch-mode">Choose another check-in</button><button class="text-button" id="restart">Start this check-in again</button></div>`;
 document.getElementById('review').onclick=review;document.getElementById('switch-mode').onclick=()=>home(true);
 document.getElementById('restart').onclick=()=>{sessions[modeKey]={answers:Array(model.questions.length).fill(undefined),step:0,complete:false};render(true);};focusHeading('result-title');
}
document.getElementById('about').onclick=()=>document.getElementById('info').showModal();
document.getElementById('close-info').onclick=()=>document.getElementById('info').close();
document.querySelector('.brand').addEventListener('click',event=>{event.preventDefault();home(true);});
home();
if(document.modelContext?.registerTool){try{Promise.resolve(document.modelContext.registerTool({name:'read_emotion_checkin',description:'Read the selected emotion check-in, its progress, or its completed results.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:false},execute:()=>{
 if(view==='home')return {view,modes:Object.entries(modes).map(([id,m])=>({id,title:m.title,questions:m.model.questions.length}))};
 const s=active(),m=config().model;
 if(view==='results')return {view,mode:modeKey,matches:m.rank(s.answers).slice(0,4).map(p=>({name:p.name,description:p.description}))};
 if(view==='review')return {view,mode:modeKey,questionCount:m.questions.length};
 return {view,mode:modeKey,questionNumber:s.step+1,questionCount:m.questions.length,question:m.questions[s.step].title,options:labelsFor(m.questions[s.step]),optional:!!m.questions[s.step].context};
}})).catch(()=>{});}catch{}}
