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
const accessRequestDialog = $('#access-request-dialog');
const accessRequestForm = $('#access-request-form');
const accessRequestError = $('#access-request-error');
const accessRequestCancel = $('#access-request-cancel');
const notesDialog = $('#notes-dialog');
const notesText = $('#notes-text');
const notesTitle = $('#notes-title');
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
  notesText.value = records.get(currentNotesId)?.notes || '';
  notesError.hidden = true;
  notesSaveStatus.textContent = '';
  notesDialog.showModal();
  notesText.focus();
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

async function completeEmailLink() {
  if (!firebase.isSignInWithEmailLink(auth, window.location.href)) return;
  let email = localStorage.getItem(EMAIL_STORAGE_KEY);
  if (!email) email = window.prompt('Please confirm the email address that received this login link.');
  if (!email) throw new Error('Email confirmation is required.');
  await firebase.signInWithEmailLink(auth, email, window.location.href);
  localStorage.removeItem(EMAIL_STORAGE_KEY);
  history.replaceState({}, document.title, window.location.pathname);
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
