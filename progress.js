import { firebaseConfig } from './firebase-config.js';

const FIREBASE_VERSION = '12.18.0';
const FIREBASE_BASE = `https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}`;
const EMAIL_STORAGE_KEY = 'familyHistoryEmailForSignIn';
const $ = selector => document.querySelector(selector);
const loginButton = $('#login-button');
const accountStatus = $('#account-status');
const accountActions = $('#account-actions');
const trackerError = $('#tracker-error');
const archive = $('#listened-archive');
const archiveItems = $('#listened-items');
const listenedCount = $('#listened-count');
const nextPanel = $('#next-episode');
const nextItem = $('#next-episode-item');
const loginDialog = $('#login-dialog');
const loginForm = $('#login-form');
const loginEmail = $('#login-email');
const loginError = $('#login-error');
const loginCancel = $('#login-cancel');
const emailLinkDialog = $('#email-link-dialog');
const emailLinkForm = $('#email-link-form');
const emailLinkTitle = $('#email-link-title');
const emailLinkMessage = $('#email-link-message');
const emailLinkField = $('#email-link-field');
const emailLinkEmail = $('#email-link-email');
const emailLinkError = $('#email-link-error');
const emailLinkContinue = $('#email-link-continue');
const emailLinkNew = $('#email-link-new');
const emailLinkCancel = $('#email-link-cancel');
const accessRequestDialog = $('#access-request-dialog');
const accessRequestForm = $('#access-request-form');
const accessRequestError = $('#access-request-error');
const accessRequestCancel = $('#access-request-cancel');
const notesDialog = $('#notes-dialog');
const notesText = $('#notes-text');
const notesTitle = $('#notes-title');
const notesPrompt = $('#notes-prompt');
const notesError = $('#notes-error');
const notesSaveStatus = $('#notes-save-status');
const notesClose = $('#notes-close');
const downloadButton = $('#download-button');
const deleteAccountButton = $('#delete-account-button');
const adminPanel = $('#admin-panel');
const requestCount = $('#request-count');
const requestList = $('#request-list');
const memberList = $('#member-list');

const articles = [...document.querySelectorAll('main > article')];
const records = new Map();
let currentUser = null;
let currentMember = false;
let currentAdmin = false;
let currentRequestStatus = null;
let currentNotesId = null;
let notesSaveTimer = null;
let auth;
let db;
let firebase;

const REFLECTION_PROMPTS = {
  'the-shtetl-myth-and-reality': 'Kassow contrasts the real shtetl with both nostalgia and caricature. Which parts complicate the picture you had before, and what might daily life have felt like for your family?',
  'remembering-vilna-introduction': 'Vilna was a centre of religious tradition, secular culture and Jewish politics. Which side of the city feels closest to the Vilna you imagined, and which would you like to explore further?',
  'remembering-vilna-chapter-1-childhood-memories': 'Survivors recall Vilna through homes, streets, schools, synagogues and organisations. Which details make the city feel most alive, and what would you most like to know about your family’s life there?',
  'chronicles-of-a-talmud-girl-boss': 'Devorah Romm’s story reveals publishing, technology and women’s work in Vilna. What does it add to a history often told through rabbis and yeshivas, and did anything challenge your assumptions?',
  'in-the-shadow-of-the-shtetl-telling-the-story-of-small-town-jewish-life': 'Veidlinger reconstructs small-town life from many individual memories. What can oral testimony preserve that official records cannot, and whose voice from your own family would you most want to hear?',
  'yankel-s-tavern-jews-liquor-and-life-in-the-kingdom-of-poland': 'Jewish tavern keepers worked between landowners, customers, neighbours and the state. Does this help you imagine the family’s tavern landlords differently, and what questions does it raise about their relationships with the wider community?',
  'tradition-jewish-matchmaking-past-present': 'The episode presents marriage as romance, family strategy, economics and social expectation. Which pressures might have shaped marriages in your family, and what feels familiar or distant today?',
  'the-lost-history-of-yiddish-popular-fiction': 'Popular Yiddish stories reveal what ordinary readers enjoyed, feared and laughed about. What surprised you about their tastes, and what might your relatives have read purely for pleasure?',
  'episode-5-before-zionism': 'The episode explores migration to Ottoman Palestine before political Zionism became dominant. How does this earlier story complicate familiar accounts of Zionism, and what motives for migration stood out to you?',
  'rethinking-kishinev-how-a-riot-changed-20th-century-jewish-history': 'Kishinev influenced Jewish politics, self-defence, migration and international opinion far beyond the city. Why do you think this event became so powerful in Jewish memory, and how might fear have shaped family decisions?',
  'david-biale-hasidism-a-new-history': 'Biale describes Hasidism as a social movement as well as a religious one. What helps you understand its appeal to ordinary people, and does it change how you view the Hasidic strand of the family story?',
  'kabbalah-and-the-rupture-of-modernity-an-existential-history-of-chabad-hasidism': 'Rubin presents Chabad from within the tradition as well as historically. Which ideas illuminate the Tumarkin connection, and where would you want another perspective or more context?',
  'the-last-ships-from-hamburg-an-immigration-story': 'Millions of journeys depended on shipping lines, agents, money and practical decisions. Which part makes your relatives’ migration feel most real, and what would you most like to discover about their particular journey?',
  'now-you-re-talking-cockney-yiddish': 'Yiddish and Cockney met in the streets of the East End and reshaped one another. Which words or stories capture that encounter for you, and how might language have affected your family’s first experience of Britain?',
  'machloket': 'These voices tell Jewish migration and belonging through communities across Britain, not only London. Which experience echoes your family’s northern story, and what does belonging to a place mean across generations?',
  'a-memory-map-of-jewish-manchester': 'Memories are attached to Manchester streets, shops and neighbourhoods. Which place would you most like to walk through, and what family memory would you add to such a map?',
  'from-poland-to-paradise-lane': 'Blackburn’s small Jewish community included members of the Goldberg family. What felt most personal in this account, and how might life in a small northern community have shaped the family differently from life in a large city?',
  'blackburn-s-vanished-jewish-community': 'This history traces a community through its synagogue, families and eventual disappearance. What makes a vanished community recoverable, and what would you want preserved about the Goldbergs’ Blackburn life?',
  'liverpool-jewish-community-history': 'Liverpool became the place where the Gillman and Goldberg branches came together. Which features of the city’s Jewish life help explain that chapter, and what family questions does the setting prompt?',
  'the-shtetl-crumbles': 'The episode recounts the roundup and murder at Eišiškės, including Jews brought from nearby towns such as Olkieniki. Which testimony stays with you, and how does knowing the local geography change the way you hold this part of the family story?',
  'a-matter-of-savagery': 'This second account deepens the testimony and reconstruction of the Eišiškės massacre. What feels important to remember as an individual family story rather than only as a historical event?',
  'combatants-and-protectors': 'The Bielski group combined resistance with rescuing families and sustaining community life in hiding. Which choices or tensions affected you most, and how does this broaden your idea of resistance and survival?',
  'remembering-vilna-chapter-3-nazi-invasion': 'Survivors describe how persecution and mass murder followed the Nazi occupation of Vilna with terrifying speed. Which details convey that rupture most strongly, and how does hearing individual voices affect your understanding?',
  'remembering-vilna-chapter-7-liquidation': 'The liquidation brought deportation, forced labour, hiding and escape to the forests. Which decisions or experiences stay with you, and what do they suggest about the limits and possibilities of individual choice?',
  'remembering-vilna-chapter-10-aftermath': 'Survivors searched for relatives and began new lives after Vilna’s Jewish world was destroyed. What does rebuilding mean in these accounts, and how might this aftermath connect to your family’s later dispersal?',
  'eisiskes-the-place-of-murder': 'Eišiškės was the place where relatives from Degsnės and Olkeniki were murdered. How does connecting names to a particular place affect you, and what form of remembrance feels most meaningful?',
  'a-odz-ghetto-survivor-and-her-daughter-experience-memory-unearthed': 'Rose Fogel and her daughter respond to photographs of a place Rose survived. What happens when personal memory meets a historical image, and how might different generations see the same evidence differently?',
  'henryk-ross-s-photographs-of-the-odz-ghetto': 'Ross photographed suffering alongside ordinary life and moments of dignity inside the ghetto. Which kind of image feels most revealing, and what responsibilities come with looking at these photographs?',
  'the-dna-reunion-project': 'DNA can reconnect branches separated by migration and the Holocaust, while also revealing unexpected relationships. What would you hope to find, and are there discoveries you would approach cautiously?',
  'arthur-kurzweil-the-persistence-of-memory': 'Kurzweil pursued a lost shtetl through archives, people and a return journey. Which part resembles your own family-history impulse, and what place or person would you follow next?',
  'galicia-jewish-museum-director-jacek-stawiski': 'The museum tries to recover Jewish life in Galicia rather than presenting only its destruction. What balance between life, loss and renewal feels right to you when telling a family or community history?',
  'southern-africa-jewish-genealogy': 'Lithuanian Jewish migration created families and communities across southern Africa. What might have drawn your relatives there, and which records or stories could help reconnect that branch?',
  'australian-jewish-historical-society': 'The Australian and Tasmanian branches carried the family story to another continent. What would you most like to know about how they adapted, and which connections with the wider family may have endured?',
  '473-the-other-side-of-ellis-island': 'Arrival at Ellis Island could involve inspection, detention, treatment or separation rather than an immediate welcome. Which part changes how you imagine arrival, and what might uncertainty have felt like for a family?',
  '183-orchard-street-life-in-the-lower-east-side': 'Tenements, workshops and pushcarts shaped everyday immigrant life on the Lower East Side. Which details help you picture a new beginning, and what might your relatives have gained or missed there?',
  'love-thy-neighbor-four-days-in-crown-heights-that-changed-new-york': 'The episode brings Lubavitch and Caribbean-American histories together in one neighbourhood and examines the tensions between them. Whose perspective changed or complicated your view, and what makes coexistence possible or fragile?',
  'in-jewish-history': 'Indiana’s Jewish history includes small-town merchants and families far from the best-known centres. What might Jewish life in Bluffton have required, and how do unusual destinations change the family migration story?',
  'jews-on-the-texas-frontier': 'Jewish settlers built lives in small Texas communities, with some arriving through the Galveston movement. What helps you imagine the Amarillo branch, and what might have been distinctive about creating Jewish life there?',
  'exploring-jewish-life-in-uruguay-and-the-importance-of-stories': 'Porzecanski explores immigration, identity and the importance of stories in Jewish Uruguay. What might the Montevideo branch have preserved or reinvented, and which family story would you most want them to tell?'
};

function episodeId(article) {
  const title = article.querySelector('h3').childNodes[0].textContent.trim();
  return title.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

for (const article of articles) {
  const marker = document.createComment(`original-position:${episodeId(article)}`);
  article.before(marker);
  article.dataset.episodeId = episodeId(article);
  article._originalMarker = marker;
}

function showError(message = '') {
  trackerError.textContent = message;
  trackerError.hidden = !message;
}

function restoreArticles() {
  for (const article of articles) article._originalMarker.after(article);
}

function canTrack() {
  return Boolean(currentUser && (currentMember || currentAdmin));
}

function addTools(article) {
  let tools = article.querySelector('.episode-tools');
  if (!tools) {
    tools = document.createElement('div');
    tools.className = 'episode-tools';
    article.querySelector(':scope > div:last-child').append(tools);
  }
  const item = records.get(article.dataset.episodeId) || {};
  tools.replaceChildren();
  const listenedButton = document.createElement('button');
  listenedButton.type = 'button';
  listenedButton.className = item.listened ? 'secondary' : '';
  listenedButton.textContent = item.listened ? 'Mark as not listened' : 'Mark as listened';
  listenedButton.addEventListener('click', () => setListened(article.dataset.episodeId, !item.listened));
  const notesButton = document.createElement('button');
  notesButton.type = 'button';
  notesButton.className = 'notes-button';
  notesButton.textContent = item.notes ? 'Edit thoughts and reflections' : 'Add thoughts and reflections';
  notesButton.addEventListener('click', () => openNotes(article));
  tools.append(listenedButton, notesButton);
}

function refreshSectionHeadings() {
  for (const heading of document.querySelectorAll('main > h2')) {
    let node = heading.nextElementSibling;
    let hasVisibleArticle = false;
    while (node && node.tagName !== 'H2') {
      if (node.tagName === 'ARTICLE' && node.parentElement === heading.parentElement) {
        hasVisibleArticle = true;
        break;
      }
      node = node.nextElementSibling;
    }
    heading.hidden = !hasVisibleArticle;
  }
}

function renderPlaylist() {
  restoreArticles();
  archiveItems.replaceChildren();
  nextItem.replaceChildren();
  if (!canTrack()) {
    archive.hidden = true;
    nextPanel.hidden = true;
    for (const article of articles) article.querySelector('.episode-tools')?.remove();
    for (const heading of document.querySelectorAll('main > h2')) heading.hidden = false;
    return;
  }
  for (const article of articles) addTools(article);
  const listened = articles.filter(article => records.get(article.dataset.episodeId)?.listened);
  const unlistened = articles.filter(article => !records.get(article.dataset.episodeId)?.listened);
  for (const article of listened) archiveItems.append(article);
  if (unlistened[0]) nextItem.append(unlistened[0]);
  listenedCount.textContent = `${listened.length} of ${articles.length}`;
  archive.hidden = listened.length === 0;
  nextPanel.hidden = unlistened.length === 0;
  refreshSectionHeadings();
}

async function setListened(id, listened) {
  if (!canTrack()) return;
  const previous = records.get(id) || {};
  records.set(id, { ...previous, listened });
  renderPlaylist();
  try {
    await firebase.setDoc(firebase.doc(db, 'users', currentUser.uid, 'episodeProgress', id),
      { listened, updatedAt: firebase.serverTimestamp() }, { merge: true });
  } catch (error) {
    records.set(id, previous);
    renderPlaylist();
    showError('That change could not be saved. Please try again.');
  }
}

function openNotes(article) {
  currentNotesId = article.dataset.episodeId;
  const title = article.querySelector('h3').childNodes[0].textContent.trim();
  notesTitle.textContent = `Thoughts and reflections: ${title}`;
  notesPrompt.textContent = REFLECTION_PROMPTS[currentNotesId] || 'What did this episode make you think or feel? What would you like to understand more deeply?';
  notesText.value = records.get(currentNotesId)?.notes || '';
  notesError.hidden = true;
  notesSaveStatus.textContent = '';
  notesDialog.showModal();
}

async function saveNotes() {
  clearTimeout(notesSaveTimer);
  notesSaveTimer = null;
  if (!currentNotesId || !canTrack()) return;
  const id = currentNotesId;
  const notes = notesText.value;
  const previous = records.get(id) || {};
  notesSaveStatus.textContent = 'Saving…';
  notesError.hidden = true;
  try {
    await firebase.setDoc(firebase.doc(db, 'users', currentUser.uid, 'episodeProgress', id),
      { notes, updatedAt: firebase.serverTimestamp() }, { merge: true });
    records.set(id, { ...previous, notes });
    notesSaveStatus.textContent = 'Saved';
    renderPlaylist();
  } catch (error) {
    notesSaveStatus.textContent = 'Couldn’t save';
    notesError.textContent = 'Your reflections could not be saved. Please try again.';
    notesError.hidden = false;
  }
}

notesText.addEventListener('input', () => {
  notesSaveStatus.textContent = 'Waiting to save…';
  clearTimeout(notesSaveTimer);
  notesSaveTimer = setTimeout(saveNotes, 1000);
});

async function closeNotes() {
  if (notesSaveTimer) await saveNotes();
  notesDialog.close();
  currentNotesId = null;
}

notesClose.addEventListener('click', closeNotes);
notesDialog.addEventListener('cancel', event => {
  event.preventDefault();
  closeNotes();
});

function configured() {
  return firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith('REPLACE_');
}

function emailActionSettings() {
  return { url: `${window.location.origin}${window.location.pathname}`, handleCodeInApp: true };
}

async function requestEmailLink(email) {
  await firebase.sendSignInLinkToEmail(auth, email, emailActionSettings());
  localStorage.setItem(EMAIL_STORAGE_KEY, email);
}

function cleanEmailLinkUrl() {
  history.replaceState({}, document.title, window.location.pathname);
}

function askForLinkEmail() {
  emailLinkTitle.textContent = 'Confirm your email address';
  emailLinkMessage.textContent = 'This link was opened in a different browser or after your previous session ended. Enter the email address that received it.';
  emailLinkField.hidden = false;
  emailLinkContinue.hidden = false;
  emailLinkNew.hidden = true;
  emailLinkCancel.textContent = 'Cancel';
  emailLinkError.hidden = true;
  emailLinkDialog.showModal();
  emailLinkEmail.focus();
  return new Promise(resolve => {
    const submit = event => {
      event.preventDefault();
      const email = emailLinkEmail.value.trim();
      emailLinkForm.removeEventListener('submit', submit);
      emailLinkCancel.removeEventListener('click', cancel);
      if (emailLinkDialog.open) emailLinkDialog.close();
      resolve(email);
    };
    const cancel = () => {
      emailLinkForm.removeEventListener('submit', submit);
      emailLinkCancel.removeEventListener('click', cancel);
      if (emailLinkDialog.open) emailLinkDialog.close();
      resolve(null);
    };
    emailLinkForm.addEventListener('submit', submit);
    emailLinkCancel.addEventListener('click', cancel);
  });
}

function showUnusableLink() {
  emailLinkTitle.textContent = 'This sign-in link cannot be used';
  emailLinkMessage.textContent = 'It may already have been used, or it may have expired. Please request a new sign-in link.';
  emailLinkField.hidden = true;
  emailLinkContinue.hidden = true;
  emailLinkNew.hidden = false;
  emailLinkCancel.textContent = 'Close';
  emailLinkError.hidden = true;
  emailLinkDialog.showModal();
}

async function completeEmailLink() {
  if (!firebase.isSignInWithEmailLink(auth, window.location.href)) return;
  let email = localStorage.getItem(EMAIL_STORAGE_KEY);
  if (!email) email = await askForLinkEmail();
  if (!email) {
    cleanEmailLinkUrl();
    return;
  }
  try {
    await firebase.signInWithEmailLink(auth, email, window.location.href);
    localStorage.removeItem(EMAIL_STORAGE_KEY);
    cleanEmailLinkUrl();
  } catch (error) {
    localStorage.removeItem(EMAIL_STORAGE_KEY);
    cleanEmailLinkUrl();
    showUnusableLink();
  }
}

async function membershipStatus(user) {
  const [memberSnapshot, adminSnapshot, requestSnapshot] = await Promise.all([
    firebase.getDoc(firebase.doc(db, 'members', user.uid)),
    firebase.getDoc(firebase.doc(db, 'admins', user.uid)),
    firebase.getDoc(firebase.doc(db, 'accessRequests', user.uid))
  ]);
  currentMember = memberSnapshot.exists() && memberSnapshot.data().active === true;
  currentAdmin = adminSnapshot.exists();
  currentRequestStatus = requestSnapshot.exists() ? requestSnapshot.data().status : null;
}

async function submitAccessRequest(user) {
  await firebase.setDoc(firebase.doc(db, 'accessRequests', user.uid), {
    email: user.email,
    status: 'pending',
    privacyNoticeAcceptedAt: firebase.serverTimestamp(),
    requestedAt: firebase.serverTimestamp()
  });
}

async function loadProgress() {
  records.clear();
  const snapshot = await firebase.getDocs(firebase.collection(db, 'users', currentUser.uid, 'episodeProgress'));
  snapshot.forEach(progressDoc => records.set(progressDoc.id, progressDoc.data()));
}

async function loadAdminPanel() {
  if (!currentAdmin) return;
  const [snapshot, members] = await Promise.all([
    firebase.getDocs(firebase.query(firebase.collection(db, 'accessRequests'),
      firebase.where('status', '==', 'pending'))),
    firebase.getDocs(firebase.collection(db, 'members'))
  ]);
  requestList.replaceChildren();
  memberList.replaceChildren();
  requestCount.textContent = snapshot.empty ? '' : `(${snapshot.size})`;
  for (const requestDoc of snapshot.docs) {
    const data = requestDoc.data();
    const row = document.createElement('li');
    const email = document.createElement('strong');
    email.textContent = data.email;
    const actions = document.createElement('div');
    actions.className = 'tracker-actions';
    const approve = document.createElement('button');
    approve.type = 'button';
    approve.textContent = 'Approve';
    approve.addEventListener('click', () => decideRequest(requestDoc.id, data.email, true));
    const decline = document.createElement('button');
    decline.type = 'button';
    decline.className = 'secondary';
    decline.textContent = 'Decline';
    decline.addEventListener('click', () => decideRequest(requestDoc.id, data.email, false));
    actions.append(approve, decline);
    row.append(email, actions);
    requestList.append(row);
  }
  if (snapshot.empty) {
    const row = document.createElement('li');
    row.textContent = 'There are no pending requests.';
    requestList.append(row);
  }
  const sortedMembers = [...members.docs].sort((a, b) =>
    (a.data().email || '').localeCompare(b.data().email || ''));
  for (const memberDoc of sortedMembers) {
    const data = memberDoc.data();
    const row = document.createElement('li');
    const email = document.createElement('strong');
    email.textContent = data.email;
    const status = document.createElement('span');
    status.className = 'account-status';
    status.textContent = data.active ? ' — access active' : ' — access removed; data preserved';
    row.append(email, status);
    if (memberDoc.id !== currentUser.uid) {
      const actions = document.createElement('div');
      actions.className = 'tracker-actions';
      const accessButton = document.createElement('button');
      accessButton.type = 'button';
      accessButton.className = 'secondary';
      accessButton.textContent = data.active ? 'Remove access' : 'Restore access';
      accessButton.addEventListener('click', () => setMemberAccess(memberDoc.id, data.email, !data.active));
      actions.append(accessButton);
      row.append(actions);
    }
    memberList.append(row);
  }
  if (members.empty) {
    const row = document.createElement('li');
    row.textContent = 'No family members have been approved yet.';
    memberList.append(row);
  }
}

async function setMemberAccess(userId, email, active) {
  if (!active && !window.confirm(`Remove access for ${email}? Their saved journey will be preserved.`)) return;
  showError();
  try {
    await firebase.updateDoc(firebase.doc(db, 'members', userId), { active });
    await loadAdminPanel();
  } catch (error) {
    showError('That member’s access could not be changed. Please try again.');
  }
}

async function decideRequest(userId, email, approved) {
  showError();
  try {
    const batch = firebase.writeBatch(db);
    if (approved) batch.set(firebase.doc(db, 'members', userId), {
      email, active: true, approvedAt: firebase.serverTimestamp()
    });
    batch.update(firebase.doc(db, 'accessRequests', userId), {
      status: approved ? 'approved' : 'declined', decidedAt: firebase.serverTimestamp()
    });
    await batch.commit();
    await loadAdminPanel();
  } catch (error) {
    showError('That access decision could not be saved. Please try again.');
  }
}

function updateAccountUi() {
  if (!currentUser) {
    loginButton.textContent = 'Request access or log in';
    accountStatus.textContent = '';
    accountActions.hidden = true;
    adminPanel.hidden = true;
    return;
  }
  loginButton.textContent = 'Log out';
  accountActions.hidden = false;
  adminPanel.hidden = !currentAdmin;
  if (canTrack()) accountStatus.textContent = `Logged in as ${currentUser.email}`;
  else if (currentRequestStatus === 'approved') {
    accountStatus.textContent = `Access has been removed for ${currentUser.email}. Your saved journey is preserved.`;
  } else if (currentRequestStatus === 'declined') {
    accountStatus.textContent = `Access has not been approved for ${currentUser.email}.`;
  } else if (!currentRequestStatus) {
    accountStatus.textContent = `Email verified for ${currentUser.email}. Complete the access request to ask Jon for approval.`;
  } else {
    accountStatus.textContent = `Access requested for ${currentUser.email}. Approval is still pending.`;
  }
}

function episodeTitle(id) {
  const article = articles.find(item => item.dataset.episodeId === id);
  return article?.querySelector('h3').childNodes[0].textContent.trim() || id;
}

function downloadJourney() {
  const lines = ['My Jewish family-history listening journey', '', `Account: ${currentUser.email}`, ''];
  for (const article of articles) {
    const id = article.dataset.episodeId;
    const item = records.get(id) || {};
    lines.push(`${article.querySelector('.number').textContent}. ${episodeTitle(id)}`);
    lines.push(`Listened: ${item.listened ? 'Yes' : 'No'}`);
    if (item.notes) lines.push('Thoughts and reflections:', item.notes);
    lines.push('');
  }
  const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'my-jewish-family-history-journey.txt';
  link.click();
  URL.revokeObjectURL(link.href);
}

async function deleteAccountAndData() {
  const confirmed = window.confirm('Permanently delete your account, listening history and reflections? This cannot be undone.');
  if (!confirmed) return;
  showError();
  try {
    const progress = await firebase.getDocs(firebase.collection(db, 'users', currentUser.uid, 'episodeProgress'));
    const batch = firebase.writeBatch(db);
    progress.forEach(progressDoc => batch.delete(progressDoc.ref));
    batch.delete(firebase.doc(db, 'members', currentUser.uid));
    batch.delete(firebase.doc(db, 'accessRequests', currentUser.uid));
    await batch.commit();
    await firebase.deleteUser(currentUser);
  } catch (error) {
    showError('Your account could not be deleted. Log out, log in again and retry.');
  }
}

async function start() {
  if (!configured()) {
    loginButton.disabled = true;
    accountStatus.textContent = 'Account tracking is being prepared.';
    return;
  }
  const [appModule, authModule, storeModule] = await Promise.all([
    import(`${FIREBASE_BASE}/firebase-app.js`),
    import(`${FIREBASE_BASE}/firebase-auth.js`),
    import(`${FIREBASE_BASE}/firebase-firestore.js`)
  ]);
  firebase = { ...authModule, ...storeModule };
  const app = appModule.initializeApp(firebaseConfig);
  auth = authModule.getAuth(app);
  db = storeModule.getFirestore(app);
  await authModule.setPersistence(auth, authModule.browserLocalPersistence);
  loginButton.addEventListener('click', async () => {
    showError();
    if (currentUser) await authModule.signOut(auth);
    else loginDialog.showModal();
  });
  loginCancel.addEventListener('click', () => loginDialog.close());
  emailLinkNew.addEventListener('click', () => {
    emailLinkDialog.close();
    emailLinkForm.reset();
    loginDialog.showModal();
    loginEmail.focus();
  });
  emailLinkCancel.addEventListener('click', () => {
    if (emailLinkDialog.open) emailLinkDialog.close();
  });
  loginForm.addEventListener('submit', async event => {
    event.preventDefault();
    loginError.hidden = true;
    const submitButton = loginForm.querySelector('[type="submit"]');
    submitButton.disabled = true;
    try {
      await requestEmailLink(loginEmail.value.trim());
      loginForm.reset();
      loginDialog.close();
      accountStatus.textContent = 'Check your email and open the secure login link.';
    } catch (error) {
      loginError.textContent = 'The login email could not be sent. Please try again.';
      loginError.hidden = false;
    } finally {
      submitButton.disabled = false;
    }
  });
  accessRequestForm.addEventListener('submit', async event => {
    event.preventDefault();
    accessRequestError.hidden = true;
    const submitButton = accessRequestForm.querySelector('[type="submit"]');
    submitButton.disabled = true;
    try {
      await submitAccessRequest(currentUser);
      currentRequestStatus = 'pending';
      accessRequestForm.reset();
      accessRequestDialog.close();
      updateAccountUi();
    } catch (error) {
      accessRequestError.textContent = 'Your access request could not be sent. Please try again.';
      accessRequestError.hidden = false;
    } finally {
      submitButton.disabled = false;
    }
  });
  accessRequestCancel.addEventListener('click', () => {
    accessRequestDialog.close();
    authModule.signOut(auth);
  });
  accessRequestDialog.addEventListener('cancel', event => {
    event.preventDefault();
    accessRequestDialog.close();
    authModule.signOut(auth);
  });
  downloadButton.addEventListener('click', downloadJourney);
  deleteAccountButton.addEventListener('click', deleteAccountAndData);
  await completeEmailLink();
  authModule.onAuthStateChanged(auth, async user => {
    currentUser = user;
    currentMember = false;
    currentAdmin = false;
    currentRequestStatus = null;
    records.clear();
    showError();
    if (!user) {
      updateAccountUi();
      renderPlaylist();
      return;
    }
    try {
      await membershipStatus(user);
      await loadProgress();
      updateAccountUi();
      renderPlaylist();
      if (currentAdmin) await loadAdminPanel();
      if (!currentMember && !currentAdmin && !currentRequestStatus && !accessRequestDialog.open) {
        accessRequestDialog.showModal();
      }
    } catch (error) {
      updateAccountUi();
      renderPlaylist();
      showError('Your account information could not be loaded. Please try again.');
    }
  });
}

start().catch(() => {
  loginButton.disabled = true;
  showError('Account tracking is temporarily unavailable. The listening links still work normally.');
});
