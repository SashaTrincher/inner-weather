(function (root) {
'use strict';
const scale = ['Not at all', 'A little', 'Moderately', 'Quite a lot', 'Very much'];
const sections = ['Your emotional tone', 'Your body', 'Your thoughts', 'Your connections', 'Your experiences', 'What feels possible', 'Your current context'];
// Physical context is reported separately. It is not evidence of a particular emotion.
const rows = [
['pleasant',0,'How pleasant does this moment feel?','Answer for right now, even if the rest of the day felt different.','Things feel unpleasant.','Things feel pleasant.',['Very unpleasant','Somewhat unpleasant','In between','Somewhat pleasant','Very pleasant']],
['energy',0,'How much energy do you have?','Notice your capacity to act, rather than how busy you are.','Your energy is low.','Your energy is high.',['Almost none','A little','A steady amount','Quite a lot','A great deal']],
['intensity',0,'How strong are your feelings overall?','A quiet feeling is just as valid as an intense one.','Your feelings are quiet.','Your feelings are intense.'],
['mixed',0,'How much do pleasant and painful feelings coexist?','For example, appreciating an experience while also feeling sad about it.','Your feelings have a fairly consistent tone.','Pleasant and painful feelings coexist.'],
['interest',0,'How drawn are you to things you usually enjoy?','Think about interest or motivation, whether or not you can act on it.','Your usual interests have little pull right now.','You feel drawn to things you enjoy.'],
['numb',0,'How emotionally numb or distant do you feel?','This means finding feelings hard to reach, rather than simply feeling calm.','Your feelings feel accessible.','Your feelings feel distant or hard to reach.'],
['tension',1,'How tense does your body feel?','Notice muscles, your jaw or your shoulders without trying to change anything.','Your body feels relatively relaxed.','Your body feels tense.'],
['restless',1,'How physically restless do you feel?','Notice an urge to move or difficulty settling, whatever its cause.','Your body feels relatively settled.','You feel physically restless.'],
['heavy',1,'How physically heavy or slowed down do you feel?','Answer relative to what is usual for you.','Your body does not feel especially slowed down.','Your body feels heavy or slowed down.'],
['sleep',1,'How restorative has your recent sleep felt?','Think about the last few nights. This is context, not a test of sleep health.',null,null,['Not restorative','A little restorative','Moderately restorative','Quite restorative','Very restorative']],
['discomfort',1,'How much physical discomfort is taking your attention?','For example, pain, illness or feeling physically unwell. No cause is assumed.',null,null],
['needs',1,'How much are unmet physical needs affecting your comfort?','Think about food, water, temperature or a chance to rest.',null,null],
['worry',2,'How much are you anticipating something going wrong?','Notice future-focused worry, rather than planning by itself.','Future-focused worry is quiet.','You are anticipating things going wrong.'],
['rumination',2,'How much are the same thoughts going round in circles?','Think about replaying events or questions without getting anywhere new.','Your thoughts are not especially repetitive.','Your thoughts keep circling back.'],
['clarity',2,'How clear and focused does your thinking feel?','Compare with your usual experience, not with an ideal level of productivity.','Your thinking feels foggy or unfocused.','Your thinking feels clear and focused.'],
['judgment',2,'How strongly are you judging yourself as a person?','For example, feeling inadequate or wanting to hide who you are.','Self-judgment is quiet.','You are judging yourself harshly.'],
['purpose',2,'How much are you questioning your purpose or identity?','This might involve who you are, what matters or where your life is heading.','Questions of purpose are not prominent.','Questions about purpose or identity stand out.'],
['control',2,'How much influence do you feel you have over what happens next?','Focus on your felt sense of choice, even if your options are small.','You feel little influence over what happens next.','You feel a sense of choice and influence.'],
['connection',3,'How connected and understood do you feel?','Connection can be with one person and does not require being physically together.','You feel distant from others.','You feel connected and understood.'],
['lonely',3,'How much are you longing for more closeness?','Being alone and feeling lonely are not always the same thing.','You are not especially longing for closeness.','You are longing for more closeness.'],
['affection',3,'How much warmth or tenderness do you feel towards someone?','Think of caring, love or wanting someone to be well.','Affection is not especially prominent.','You feel warmth and tenderness towards someone.'],
['envy',3,'How much do you wish you had something someone else has?','It could be an opportunity, relationship, quality or achievement.','Comparison with others is quiet.','Wanting something someone else has stands out.'],
['rejection',3,'How much do you feel excluded, rejected or not valued?','This asks how it feels, without deciding what another person intended.','Rejection is not especially prominent.','You feel excluded or not valued.'],
['exposed',3,'How uncomfortable do you feel about how others see you?','For example, replaying an awkward moment or feeling unusually visible.','You feel relatively at ease about how others see you.','You feel self-conscious or exposed.'],
['loss',4,'How strongly are you missing someone or something?','It may be a person, a place, a possibility or a chapter of life.','Missing something is not prominent.','Missing someone or something stands out.'],
['nostalgia',4,'How much are you drawn to meaningful memories of the past?','Notice the pull of remembering, whether those memories feel warm, painful or both.','The past is not especially drawing your attention.','Meaningful memories are drawing you back.'],
['unfair',4,'How strongly do you feel that something is unfair?','This may involve a boundary, how you were treated or something you witnessed.','Unfairness is not especially prominent.','A sense of unfairness stands out.'],
['blocked',4,'How frustrated do you feel by obstacles in your way?','Think about something you want to do or need that feels blocked.','Obstacles are not causing much frustration.','Blocked goals or needs feel frustrating.'],
['guilt',4,'How much do you regret a specific action or inaction?','Focus on something you did or did not do, rather than judging your whole self.','Regret about your actions is quiet.','You regret a specific action or inaction.'],
['disappointed',4,'How much has something fallen short of what you hoped?','This could be an outcome, an expectation or a promise.','Unmet expectations are not prominent.','Something has fallen short of your hopes.'],
['gratitude',5,'How much appreciation do you feel for something in your life?','It can be small, and it can coexist with difficulty.','Appreciation is not prominent right now.','You feel appreciation for something in your life.'],
['pride',5,'How satisfied do you feel with something you have done?','Consider effort, growth or an action that mattered to you.','Pride is not prominent right now.','You feel satisfied with your efforts or actions.'],
['hope',5,'How possible does a positive next step feel?','This is about possibility, not a guarantee that things will work out.','Positive possibilities feel hard to see.','A positive next step feels possible.'],
['relief',5,'How much has a burden or worry recently eased?','Think about the feeling of pressure lifting or something difficult passing.','You have not noticed much pressure lifting.','A burden or worry has eased.'],
['awe',5,'How much wonder do you feel at something beyond your everyday experience?','This might involve nature, art, an idea or a moment that shifts your perspective.','Wonder is not prominent right now.','You feel a sense of wonder or awe.'],
['curiosity',5,'How much do you want to explore, learn or discover?','Think about interest in something unfamiliar, rather than pressure to be productive.','Exploration has little pull right now.','You want to explore or discover something.'],
['demands',6,'How much do current demands exceed your available capacity?','Think about tasks, decisions, responsibilities or emotional demands.','Current demands feel within your capacity.','Current demands feel greater than your capacity.'],
['uncertainty',6,'How unclear does the near future feel?','Uncertainty may feel welcome, difficult or a bit of both.','The near future feels relatively clear.','The near future feels unclear.'],
['sensory',6,'How overloaded do you feel by what is happening around you?','For example, noise, crowds, interruptions or too much information.','Your surroundings feel manageable.','Your surroundings feel overstimulating.'],
['acceptance',6,'How able do you feel to let this moment be as it is?','Acceptance does not mean liking everything or giving up on change.','It feels hard to let this moment be as it is.','You feel able to let this moment be as it is.'],
['influences',6,'How much might physical influences be shaping this moment?','For example, caffeine, alcohol, medication, recent exertion or hormonal changes. No details are needed.',null,null],
['duration',6,'How long has this overall emotional pattern been around?','Choose the closest answer. Duration gives context but does not establish a condition.',null,null,['Just this moment','Several hours','A few days','A few weeks','Longer than a few weeks']]
];
const contextIds = ['sleep','discomfort','needs','influences','duration'];
const questions=rows.map(([id,section,title,hint,low,high,labels])=>({id,section,category:sections[section],title,hint,signal:[low,high],labels:labels||scale,context:contextIds.includes(id),weight:['tension','restless','heavy'].includes(id)?0.35:1}));
const base=Object.fromEntries(questions.filter(q=>!q.context).map(q=>[q.id,0]));
Object.assign(base,{pleasant:2,energy:2,intensity:2,interest:2,clarity:2,connection:2,control:2});
// Every profile uses the same broad dimensions, plus a small set of defining cues.
// Key cues weigh more than nonspecific body sensations; these are editorial heuristics.
const definitions=[
['Happiness','Enjoyment or satisfaction with the present moment.','This can be an ordinary, quiet pleasure as well as a bright feeling of joy.',{pleasant:4,interest:3,energy:3,acceptance:3},['pleasant','interest']],
['Contentment','A gentle sense of having enough in this moment.','You may feel settled without needing anything especially exciting to happen.',{pleasant:3,energy:2,intensity:1,acceptance:4,control:3},['acceptance','pleasant','intensity']],
['Excitement','Pleasant energy and anticipation of something engaging.','Excitement can include restlessness while still feeling welcome.',{pleasant:4,energy:4,intensity:4,interest:4,curiosity:3,hope:3,restless:2},['pleasant','energy','intensity']],
['Gratitude','Appreciation for something or someone that matters to you.','Gratitude can sit alongside sadness or difficulty; it does not erase either.',{pleasant:3,gratitude:4,connection:3,affection:2,acceptance:3},['gratitude']],
['Pride','Satisfaction in your effort, growth or something you have done.','This is a feeling about what matters to you, rather than proof that you must keep achieving.',{pleasant:4,pride:4,control:3,energy:3},['pride']],
['Hopefulness','A sense that something good remains possible.','Hope can be present even when the route forward is unclear.',{pleasant:3,hope:4,uncertainty:3,control:2,interest:3},['hope','uncertainty']],
['Relief','The release that follows a burden or worry easing.','Relief may feel energising or leave you tired after a demanding period.',{pleasant:3,relief:4,energy:1,acceptance:3},['relief']],
['Affection','Warmth, tenderness or care towards another person.','You may want closeness or simply want someone else to be well.',{pleasant:3,affection:4,connection:4,gratitude:2},['affection','connection']],
['Awe','Wonder at something that feels larger than your usual frame of reference.','Awe may be joyful, unsettling or both. It can leave familiar concerns feeling different for a moment.',{pleasant:3,awe:4,intensity:3,curiosity:2,mixed:2},['awe']],
['Curiosity','An active interest in exploring or understanding something.','Curiosity points towards what catches your attention, without requiring a particular achievement.',{pleasant:3,curiosity:4,interest:4,energy:3,clarity:3},['curiosity','interest']],
['Quiet neutrality','A moment without a strong pleasant or painful emotional pull.','Neutrality can simply be an ordinary pause. It is different from feeling cut off from your emotions.',{pleasant:2,intensity:0,energy:2,acceptance:2},['pleasant','intensity','numb']],
['Sadness','A painful emotional heaviness or a sense that life feels less bright.','Sadness names an experience, not its cause or a diagnosis.',{pleasant:0,energy:1,interest:1,intensity:3,heavy:3,loss:2,disappointed:2},['pleasant','energy','intensity']],
['Loneliness','A gap between the closeness you want and the closeness you feel.','You can feel lonely with others nearby, or comfortable while alone.',{pleasant:1,connection:0,lonely:4,energy:1,rejection:2},['lonely','connection']],
['Grief-like longing','A painful sense of missing someone, something or a changed chapter of life.','This may resemble grief if a loss is part of your situation. These answers cannot establish what happened.',{pleasant:0,loss:4,intensity:4,energy:1,heavy:3,nostalgia:2,mixed:2},['loss','pleasant','intensity']],
['Nostalgia','An emotional pull towards meaningful memories.','Nostalgia can feel comforting, painful or both: the past feels close while still being out of reach.',{pleasant:2,nostalgia:4,loss:2,mixed:3,affection:2},['nostalgia']],
['Bittersweetness','Pleasant and painful feelings sharing the same space.','Something may feel valuable and difficult at once; neither part cancels the other.',{pleasant:2,mixed:4,loss:2,gratitude:2,affection:2,intensity:3},['mixed','pleasant']],
['Anxiety-like unease','An unsettled anticipation that something may go wrong.','This describes worry and uncertainty as feelings, not an anxiety disorder.',{pleasant:1,worry:4,uncertainty:4,tension:3,restless:3,rumination:3,control:1},['worry','uncertainty']],
['Overwhelm','A sense that what is coming at you exceeds the room you have for it.','Demands, information or feelings may be difficult to hold together in this moment.',{pleasant:1,demands:4,clarity:0,control:1,energy:1,tension:3,sensory:3,rumination:2},['demands','clarity','control']],
['Frustration','Agitation about a blocked goal or an unmet need.','You may want movement or change but feel that something is getting in the way.',{pleasant:1,blocked:4,energy:3,tension:2,control:1,unfair:2},['blocked']],
['Anger','A strong response to something that feels unfair or crosses a boundary.','The feeling can signal that something matters to you; it does not establish what another person intended.',{pleasant:0,unfair:4,intensity:4,energy:4,blocked:2,tension:3},['unfair','intensity','energy']],
['Resentment','A lingering sense of unfairness that is difficult to put down.','Replaying how you were treated may be part of the feeling, particularly when it still feels unresolved.',{pleasant:1,unfair:4,rumination:4,rejection:2,energy:2,blocked:2},['unfair','rumination']],
['Guilt','Discomfort about a particular action or something you did not do.','Guilt concerns behaviour. Feeling guilty does not establish that you actually did something wrong.',{pleasant:1,guilt:4,rumination:3,judgment:2,intensity:3},['guilt']],
['Shame','A painful sense of being inadequate or wanting to hide your whole self.','Shame can make a harsh judgment feel true. The feeling is not evidence that you are defective.',{pleasant:0,judgment:4,exposed:3,rejection:2,connection:1,rumination:2},['judgment','exposed']],
['Embarrassment','Self-conscious discomfort about being seen or evaluated.','An awkward moment may feel especially visible even when others have moved on.',{pleasant:1,exposed:4,judgment:1,rumination:2,intensity:3},['exposed','judgment']],
['Envy','A painful wish for something that someone else seems to have.','Envy can draw attention to a want or value. It does not make you a bad person.',{pleasant:1,envy:4,disappointed:2,judgment:1},['envy']],
['Rejection-related hurt','Pain at feeling excluded, dismissed or not valued.','This describes your experience without deciding whether rejection was intended.',{pleasant:0,rejection:4,connection:1,lonely:2,intensity:3},['rejection']],
['Disappointment','Sadness about something falling short of your hopes.','There may be a gap between what you expected and what actually happened.',{pleasant:1,disappointed:4,energy:1,loss:1,blocked:2},['disappointed']],
['Emotional depletion','A sense of having little energy or emotional capacity left.','This describes feeling worn down. It does not identify burnout, depression or a physical cause.',{pleasant:1,energy:0,interest:0,heavy:4,demands:3,clarity:1,intensity:1},['energy','interest','demands']],
['Emotional numbness','A sense that your emotions feel distant or difficult to reach.','Numbness is different from ordinary calm. This check-in cannot determine why it is happening.',{pleasant:2,numb:4,intensity:0,interest:0,connection:1,energy:1},['numb','intensity']],
['Boredom','A flat or restless sense that nothing available feels engaging.','You may want interest or stimulation without feeling especially worried or overloaded.',{pleasant:1,interest:0,restless:3,energy:2,intensity:1,demands:0},['interest','demands','pleasant']],
['Helplessness','A painful sense of having little influence over what happens.','This is a felt lack of agency, not proof that no options exist.',{pleasant:0,control:0,hope:0,blocked:3,demands:3,energy:1},['control','hope','pleasant']],
['Existential unease','An unsettled questioning of your purpose, identity or direction.','When intense, this broader experience is sometimes called an existential crisis. This check-in cannot determine that you are in a crisis.',{pleasant:1,purpose:4,uncertainty:4,rumination:3,mixed:3,control:1},['purpose','uncertainty','pleasant']],
['Reflective uncertainty','An inward-looking state with important questions still open.','You may be exploring your direction without a single intense or unpleasant emotion.',{pleasant:2,purpose:3,uncertainty:3,curiosity:2,mixed:2,intensity:1},['purpose','uncertainty','pleasant']],
['Sensory overwhelm','A feeling of having too much surrounding input to process comfortably.','Noise, crowds or information may be prominent. This is an experience, not a diagnosis or a statement about its cause.',{pleasant:1,sensory:4,tension:3,restless:2,clarity:1,demands:2},['sensory']]
];
const profiles=definitions.map(([name,description,meaning,overrides,keys])=>({name,description,meaning,targets:{...base,...overrides},keys}));
function validate(answers){
 if(!Array.isArray(answers)||answers.length!==questions.length) throw new Error('Please complete the in-depth check-in.');
 for(let i=0;i<questions.length;i++){const a=answers[i];if(questions[i].context&&a===null)continue;if(!Number.isInteger(a)||a<0||a>4)throw new Error('Answer every required question with a value from 0 to 4.');}
}
function values(answers){return Object.fromEntries(questions.map((q,i)=>[q.id,answers[i]]));}
function rank(answers){
 validate(answers);const a=values(answers),scored=questions.filter(q=>!q.context),weight=scored.reduce((s,q)=>s+q.weight,0);
 return profiles.map(p=>{
  const broad=scored.reduce((s,q)=>s+q.weight*(a[q.id]-p.targets[q.id])**2,0)/weight;
  const defining=p.keys.reduce((s,key)=>s+(a[key]-p.targets[key])**2,0)/p.keys.length;
  return {...p,distance:.4*broad+.6*defining};
 }).sort((a,b)=>a.distance-b.distance||a.name.localeCompare(b.name));
}
function explain(answers,p){
 const meaningfulLow=['pleasant','energy','intensity','interest','clarity','connection','control'];
 validate(answers);return questions.map((q,i)=>({q,a:answers[i],key:p.keys.includes(q.id)})).filter(({q,a,key})=>!q.context&&a!==2&&Math.abs(a-p.targets[q.id])<=1&&(a>=3||key||meaningfulLow.includes(q.id)))
 .sort((a,b)=>(Number(b.key)-Number(a.key))||((Math.abs(b.a-2)*b.q.weight)-(Math.abs(a.a-2)*a.q.weight)))
 .slice(0,4).map(({q,a})=>q.signal[a>2?1:0]);
}
function context(answers){
 validate(answers);const a=values(answers);const notes=[];
 if(a.sleep!==null&&a.sleep<=1)notes.push('You reported sleep that has not felt very restorative. That is useful context, not evidence of any one emotion.');
 if(a.discomfort!==null&&a.discomfort>=2)notes.push('Physical discomfort is taking some of your attention. This check-in cannot tell whether it has an emotional or physical cause.');
 if(a.needs!==null&&a.needs>=2)notes.push('You noted unmet physical needs. Keep that context in mind when interpreting this snapshot.');
 if(a.influences!==null&&a.influences>=2)notes.push('You noted possible physical influences such as substances, medication or exertion. Their effects cannot be assessed here.');
 if(a.duration!==null)notes.push(`You described this pattern as lasting ${['just this moment','several hours','a few days','a few weeks','longer than a few weeks'][a.duration]}. Duration is context, not a diagnosis.`);
 return notes;
}
function snapshot(answers){validate(answers);const a=values(answers);return [
 {title:'Body & energy',items:[a.energy<=1?'Low energy':a.energy>=3?'High energy':'Steady energy',a.tension>=3?'Noticeable tension':'No strong tension signal',...(a.restless>=3?['Restlessness']:[]),...(a.heavy>=3?['Physical heaviness']:[]),...(a.restless<3&&a.heavy<3?['No strong movement signal']:[])]},
 {title:'Thoughts & attention',items:[...(a.worry>=3?['Future-focused worry']:[]),...(a.rumination>=3?['Repetitive thoughts']:[]),...(a.worry<3&&a.rumination<3?['No strong worry or repetition signal']:[]),a.clarity<=1?'Thinking feels unclear':a.clarity>=3?'Clear thinking':'Mixed mental clarity',a.judgment>=3?'Harsh self-judgment':'No strong self-judgment signal']},
 {title:'Connection & capacity',items:[a.connection<=1?'Low felt connection':a.connection>=3?'Felt connection':'Some felt connection',a.demands>=3?'Demands feel too high':'Demands feel more manageable',a.control<=1?'Low felt influence':a.control>=3?'A sense of influence':'Some felt influence']}
 ];}
root.DeepEmotionModel={questions,profiles,sections,rank,explain,context,snapshot};
})(typeof module==='object'?module.exports:window);
