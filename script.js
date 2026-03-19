// --- FIREBASE INICIALIZACE ---
const firebaseConfig = {
    apiKey: "AIzaSyDO8ufRx3EwctJ6RjngvMzMlDpLfUjsuTg",
    authDomain: "study-with-cici-43671.firebaseapp.com",
    projectId: "study-with-cici-43671",
    databaseURL: "https://study-with-cici-43671-default-rtdb.europe-west1.firebasedatabase.app", 
    storageBucket: "study-with-cici-43671.firebasestorage.app",
    messagingSenderId: "298107726636",
    appId: "1:298107726636:web:dc2be52faa02a0edb3da89"
};

// Spustíme Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();


// --- DATABÁZE ITEMŮ ---
// Ceny jsou převedeny podle původní logiky (např. 40 * hodina_uceni, kde hodina = 20)
const ITEMS = [
    // Skiny
    { nazev: 'Cici default', typ: 'skin', cena: 0, image: 'assets/skin_default.png' },
    { nazev: 'Čiči Hello Kitty', typ: 'skin', cena: 600, image: 'assets/skin_hello-kitty.png' },
    { nazev: 'Čiči Kráva', typ: 'skin', cena: 300, image: 'assets/skin_krava.png' },
    { nazev: 'Čiči Šedá', typ: 'skin', cena: 150, image: 'assets/skin_cici_seda.png' },
    { nazev: 'Čiči Mourovatá', typ: 'skin', cena: 250, image: 'assets/skin_cici_mourovata.png' },
    { nazev: 'Čiči NEGR', typ: 'skin', cena: 100, image: 'assets/skin_cici_negr.png' },
    { nazev: 'Siamská', typ: 'skin', cena: 300, image: 'assets/skin_siamska.png' },

    // Trika
    { nazev: 'Doktor outfit', typ: 'triko', cena: 800, image: 'assets/triko_doktor.png' },
    { nazev: 'Triko růžové', typ: 'triko', cena: 60, image: 'assets/triko_ruzove.png' },
    { nazev: 'Batman oblek', typ: 'triko', cena: 500, image: 'assets/triko_batman.png' },
    { nazev: 'Právník outfit', typ: 'triko', cena: 600, image: 'assets/triko_pravnik.png' },
    { nazev: 'Status studenta', typ: 'triko', cena: 15, image: 'assets/triko_ujep.png' },
    { nazev: 'Brnění', typ: 'triko', cena: 300, image: 'assets/triko_rytir.png' },
    { nazev: 'Baletka', typ: 'triko', cena: 100, image: 'assets/triko_baletka.png' },
    { nazev: 'Superman z wishe oblek', typ: 'triko', cena: 15, image: 'assets/triko_wishsuperman.png' },

    
    // Masky
    { nazev: 'Gangster kukla', typ: 'maska', cena: 60, image: 'assets/maska_gangster.png' },
    { nazev: 'Batman maska', typ: 'maska', cena: 300, image: 'assets/maska_batman.png' },
    { nazev: 'Retard', typ: 'maska', cena: 10, image: 'assets/maska_retard.png' },
    { nazev: 'Rouška', typ: 'maska', cena: 50, image: 'assets/maska_rouska.png' },
    { nazev: 'Dudlík', typ: 'maska', cena: 20, image: 'assets/maska_dudlik.png' },
    { nazev: 'Superman z wishe maska', typ: 'maska', cena: 5, image: 'assets/maska_wishsuperman.png' },

    // Obojky
    { nazev: 'Mašlička růžová', typ: 'obojek', cena: 40, image: 'assets/obojek_masle.png' },
    { nazev: 'Perličky', typ: 'obojek', cena: 100, image: 'assets/obojek_perlicky.png' },
    { nazev: 'Známka', typ: 'obojek', cena: 10, image: 'assets/obojek_znamka.png' },

    // Čepice
    { nazev: 'Hello kitty mašle', typ: 'cepice', cena: 200, image: 'assets/cepice_hello-kitty.png' },
    { nazev: 'Jindřich ze Skalice', typ: 'cepice', cena: 200, image: 'assets/cepice_jindra.png' },
    { nazev: 'Královská koruna', typ: 'cepice', cena: 500, image: 'assets/cepice_koruna.png' },
    { nazev: 'Čarodějnický klobouk', typ: 'cepice', cena: 100, image: 'assets/cepice_carodejnicky_klobouk.png'},
    { nazev: 'Kuchař', typ: 'cepice', cena: 50, image: 'assets/cepice_kuchar.png'},
    { nazev: 'Rytíř', typ: 'cepice', cena: 200, image: 'assets/cepice_rytir.png'},
    { nazev: 'Kovboj', typ: 'cepice', cena: 120, image: 'assets/cepice_kovboj.png'},
    { nazev: 'Králičí uši', typ: 'cepice', cena: 25, image: 'assets/cepice_kralici_usi.png'}
];

// --- STAV APLIKACE (STATE) ---
let currentUser = null; 
let allUsers = {};      
let preservedFeedScroll = 0;


// Tohle je šablona pro nového hráče
const DEFAULT_STATE = {
    coins: 0,
    total_cas: 0,
    owned_items: ['Cici default'],
    equipped_items: {
        skin: 'Cici default',
        triko: null,
        maska: null,
        cepice: null,
        obojek: null
    },
    daily_time: 0,
    last_date: new Date().toDateString(),
    streaks: { red: 0, gold: 0, diamond: 0 },
    awarded_today: { red: false, gold: false, diamond: false },
    active_streak: 'red'
};

let state = JSON.parse(JSON.stringify(DEFAULT_STATE)); 

// --- FUNKCE PRO HLÍDÁNÍ PADÁNÍ STREAKŮ ---
function checkDateReset() {
    // Bezpečnostní pojistka pro staré účty, aby jim to nespadlo
    if (!state.streaks) state.streaks = { red: 0, gold: 0, diamond: 0 };
    if (!state.awarded_today) state.awarded_today = { red: false, gold: false, diamond: false };
    if (!state.last_date) state.last_date = new Date().toDateString();
    if (!state.daily_time) state.daily_time = 0;
    if (!state.active_streak) state.active_streak = 'red';

    const today = new Date().toDateString();
    
    if (state.last_date !== today) {
        // Počítáme, kolik dní hráč chyběl
        const msPerDay = 1000 * 60 * 60 * 24;
        const daysDiff = Math.floor((new Date(today) - new Date(state.last_date)) / msPerDay);
        
        if (daysDiff > 1) {
            // Chyběl víc než 1 den -> ztrácí všechny streaky
            state.streaks = { red: 0, gold: 0, diamond: 0 };
        } else if (daysDiff === 1) {
            // Přišel přesně další den -> pokud včera streak nezískal, spadne na nulu
            if (!state.awarded_today.red) state.streaks.red = 0;
            if (!state.awarded_today.gold) state.streaks.gold = 0;
            if (!state.awarded_today.diamond) state.streaks.diamond = 0;
        }
        
        // Dneska je nový den, nulujeme dnešní počítadlo
        state.daily_time = 0;
        state.awarded_today = { red: false, gold: false, diamond: false };
        state.last_date = today;
    }
}



let studyInterval = null;
let studySeconds = 0;
let currentShopCategory = 'skin';
let isPaused = false;
let currentPhase = 'learn'; // 'learn' nebo 'break'
let phaseTimeLeft = 0;
let learnDuration = 0;
let breakDuration = 0;
let pendingPostData = null;
let currentFeedContext = { type: null, username: null };
let wakeLock = null;
let lastTickTime = 0; // Pamatuje si přesný reálný čas posledního tiku

const bellSound = new Audio('assets/zvoneni.mp3');

// --- INICIALIZACE ---
function init() {
    setupEventListeners();

    const rememberedUser = localStorage.getItem('studywithcici_remembered_user');
    const rememberedPass = localStorage.getItem('studywithcici_remembered_pass');

    if (rememberedUser && rememberedPass) {
        document.getElementById('username-input').value = rememberedUser;
        document.getElementById('password-input').value = rememberedPass;
        loginUser(); // Rovnou spustíme přihlášení
    }
}


// --- DATABÁZE A PŘIHLAŠOVÁNÍ (FIREBASE CLOUD) ---
function saveData() {
    if (!currentUser) return; 
    db.ref('users/' + currentUser).set(state);
}

// --- DATABÁZE A PŘIHLAŠOVÁNÍ (FIREBASE CLOUD) ---

function loginUser() {
    const usernameInput = document.getElementById('username-input');
    const passwordInput = document.getElementById('password-input');
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (username === "" || password === "") {
        alert("Musíš zadat jméno i heslo!");
        return;
    }

    const loginBtn = document.getElementById('login-btn');
    loginBtn.innerText = "Ověřuji...";
    loginBtn.disabled = true;

    db.ref('users/' + username).once('value')
        .then((snapshot) => {
            if (snapshot.exists()) {
                const userData = snapshot.val();
                
                // Účet existuje, zkontrolujeme heslo
                if (userData.password === password) {
                    currentUser = username;
                    state = userData;
                    finishLogin(username, password);
                } else {
                    alert("Špatné heslo pro tohoto uživatele!");
                    resetLoginBtn();
                }
            } else {
                // ÚČET NEEXISTUJE (Už nevytváříme nový!)
                alert("Účet s tímto jménem neexistuje. Zkontroluj překlepy nebo se zaregistruj.");
                resetLoginBtn();
            }
        })
        .catch((error) => {
            alert("Chyba: " + error.message);
            resetLoginBtn();
        });
}

function registerUser() {
    const usernameInput = document.getElementById('username-input');
    const passwordInput = document.getElementById('password-input');
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (username === "" || password === "") {
        alert("Pro registraci musíš vyplnit jméno i heslo!");
        return;
    }

    db.ref('users/' + username).once('value')
        .then((snapshot) => {
            if (snapshot.exists()) {
                // Jméno už někdo má
                alert("Toto jméno už je zabrané, vyber si prosím jiné!");
            } else {
                // ZAKLÁDÁME NOVÝ ÚČET
                currentUser = username;
                state = JSON.parse(JSON.stringify(DEFAULT_STATE));
                state.password = password; 
                saveData();
                
                alert("Účet úspěšně vytvořen! Vítej ve hře.");
                finishLogin(username, password);
            }
        })
        .catch((error) => {
            alert("Chyba při registraci: " + error.message);
        });
}

// Pomocná funkce, ať nepíšeme ten samý kód dvakrát
function finishLogin(username, password) {
    localStorage.setItem('studywithcici_remembered_user', username);
    localStorage.setItem('studywithcici_remembered_pass', password);
    
    document.getElementById('login-modal').classList.add('hidden');
    resetLoginBtn();
    
    if (!state.notifications) state.notifications = [];

    updateHUD();
    updateCharacter();
    // NOVÉ: Kontrola, jestli se aplikace neukončila (nezabila) během učení
    const savedSession = localStorage.getItem('studywithcici_activesession');
    if (savedSession) {
        const parsedSession = JSON.parse(savedSession);
        startStudy(parsedSession); // Spustí učení rovnou ze zálohy
    }
}

function resetLoginBtn() {
    const loginBtn = document.getElementById('login-btn');
    loginBtn.innerText = "Přihlásit se";
    loginBtn.disabled = false;
}

// --- VYKRESLOVÁNÍ (UI) ---
function updateHUD() {
    checkDateReset(); // Pro jistotu zkontrolujeme datum hned po přihlášení
    
    // 1. Jméno hráče a odkaz na profil
    const nameDisplay = document.getElementById('player-name-display');
    nameDisplay.innerText = currentUser;
    nameDisplay.style.cursor = 'pointer';
    nameDisplay.style.textDecoration = 'underline';
    nameDisplay.onclick = () => showFeed('profile', currentUser);
    
    // 2. Mince (hlavní HUD i obchod)
    document.getElementById('coin-count').innerText = state.coins;
    if (document.getElementById('shop-coin-count')) {
        document.getElementById('shop-coin-count').innerText = state.coins;
    }
    
    // 3. Celkový čas
    const hours = Math.floor((state.total_cas || 0) / 3600);
    const minutes = Math.floor(((state.total_cas || 0) % 3600) / 60);
    const seconds = (state.total_cas || 0) % 60;
    if (document.getElementById('total-time-display')) {
        document.getElementById('total-time-display').innerText = `${hours} hodin ${minutes} minut a ${seconds} sekund`;
    }

    // 4. Dnešní čas (NOVÉ)
    const dHours = Math.floor((state.daily_time || 0) / 3600);
    const dMinutes = Math.floor(((state.daily_time || 0) % 3600) / 60);
    const dSeconds = (state.daily_time || 0) % 60;
    if (document.getElementById('daily-time-display')) {
        document.getElementById('daily-time-display').innerText = `${dHours} hodin ${dMinutes} minut a ${dSeconds} sekund`;
    }
    
    // 5. Streaky (výběr a zobrazení)
    const streakSel = document.getElementById('streak-selector');
    if (streakSel) streakSel.value = state.active_streak || 'red';
    
    const icons = { red: '🔥', gold: '⭐', diamond: '💎' };
    const currentCount = state.streaks[state.active_streak || 'red'];
    if (document.getElementById('current-streak-display')) {
        document.getElementById('current-streak-display').innerText = `${icons[state.active_streak || 'red']} ${currentCount}`;
    }

    // --- NOVÉ: Vykreslení přehledu všech streaků v pravém horním rohu footeru ---
    if (document.getElementById('all-streaks-display')) {
        const r = state.streaks.red || 0;
        const g = state.streaks.gold || 0;
        const d = state.streaks.diamond || 0;
        document.getElementById('all-streaks-display').innerText = `${r}🔥 ${g}⭐ ${d}💎`;
    }

    updateNotificationBadge();
    // -----------------------------------------------------------------------------
}

function updateNotificationBadge() {
    if (!state.notifications) state.notifications = [];
    const unread = state.notifications.filter(n => !n.read).length;
    const badge = document.getElementById('notification-badge');
    if (!badge) return;
    if (unread > 0) {
        badge.classList.remove('hidden');
        badge.innerText = unread > 99 ? '99+' : unread;
    } else {
        badge.classList.add('hidden');
    }
}

function addLocalNotification(message) {
    if (!state.notifications) state.notifications = [];
    state.notifications.unshift({
        id: Date.now(),
        text: message,
        date: new Date().toLocaleString('cs-CZ'),
        read: false,
    });
    saveData();
    updateNotificationBadge();
}

function sendNotificationToUser(username, message) {
    if (!username || !message) return;

    db.ref('users/' + username + '/notifications').once('value').then(snapshot => {
        const notifications = snapshot.val() || [];
        notifications.unshift({
            id: Date.now(),
            text: message,
            date: new Date().toLocaleString('cs-CZ'),
            read: username === currentUser,
        });

        db.ref('users/' + username + '/notifications').set(notifications).then(() => {
            if (username === currentUser) {
                state.notifications = notifications;
                updateNotificationBadge();
                renderNotifications();
            }
        });
    });
}

function renderNotifications() {
    const list = document.getElementById('notifications-list');
    list.innerHTML = '';
    if (!state.notifications || state.notifications.length === 0) {
        list.innerHTML = '<p style="text-align:center; opacity: 0.8;">Žádná oznámení.</p>';
        return;
    }

    state.notifications
        .sort((a, b) => {
            if (a.isGlobal && !b.isGlobal) return -1;
            if (!a.isGlobal && b.isGlobal) return 1;
            return b.id - a.id;
        })
        .forEach(notification => {
            const item = document.createElement('div');
            item.style.border = '1px solid #ccc';
            item.style.borderRadius = '8px';
            item.style.padding = '8px';
            item.style.background = notification.read ? '#f2f2f2' : '#fff7e6';
            item.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.85rem; margin-bottom:4px;">
                    <span style="font-weight: bold;">${notification.isGlobal ? 'ADMIN' : (notification.read ? 'Přečtené' : 'Nové')}</span>
                    <span style="color:#666; font-size:0.75rem;">${notification.date}</span>
                </div>
                <div style="font-size:0.95rem; white-space: pre-wrap; word-break: break-word;">${notification.text}</div>
            `;

        item.addEventListener('click', () => {
            notification.read = true;
            saveData();
            renderNotifications();
            updateNotificationBadge();
        });

        list.appendChild(item);
    });
}

function markAllNotificationsRead() {
    if (!state.notifications) return;
    state.notifications = state.notifications.map(notif => ({ ...notif, read: true }));
    saveData();
    updateNotificationBadge();
}


function updateCharacter() {
    const types = ['skin', 'triko', 'maska', 'obojek', 'cepice'];
    
    types.forEach(typ => {
        const layer = document.getElementById(`layer-${typ}`);
        // Bezpečné načtení z equipped_items (ošetření pro staré účty)
        const equippedItems = state.equipped_items || {};
        const equippedName = equippedItems[typ];
        
        if (equippedName) {
            const item = ITEMS.find(i => i.nazev === equippedName);
            if (item) {
                layer.src = item.image;
                layer.classList.remove('hidden');
            }
        } else {
            layer.classList.add('hidden');
        }
    });
}

// --- LOGIKA ŽEBŘÍČKU ---
function showLeaderboard() {
    const list = document.getElementById('leaderboard-list');
    list.innerHTML = '<p style="text-align:center">Načítám legendy...</p>';
    document.getElementById('leaderboard-modal').classList.remove('hidden');

    db.ref('users').once('value').then((snapshot) => {
        const data = snapshot.val();
        if (!data) return;

        let usersArray = [];
        for (let name in data) {
            usersArray.push({
                name: name,
                total_cas: data[name].total_cas || 0,
                equipped: data[name].equipped_items || {},
                // Načteme streaky z databáze
                streaks: data[name].streaks || {},
                active_streak: data[name].active_streak || 'red'
            });
        }

        usersArray.sort((a, b) => b.total_cas - a.total_cas);

        list.innerHTML = '';
        usersArray.slice(0, 10).forEach((user, index) => {
            const getImageFromName = (itemName, isSkin = false) => {
                if (!itemName) return isSkin ? 'assets/skin_default.png' : '';
                const foundItem = ITEMS.find(i => i.nazev === itemName);
                return foundItem ? foundItem.image : (isSkin ? 'assets/skin_default.png' : '');
            };

            const skinSrc = getImageFromName(user.equipped.skin, true);
            const trikoSrc = getImageFromName(user.equipped.triko);
            const maskaSrc = getImageFromName(user.equipped.maska);
            const obojekSrc = getImageFromName(user.equipped.obojek);
            const cepiceSrc = getImageFromName(user.equipped.cepice);

            // --- TADY JE TEN NOVÝ KÓD PRO STREAK V ŽEBŘÍČKU ---
            const activeStreak = user.active_streak;
            const streakCount = user.streaks[activeStreak] || 0;
            const icons = { red: '🔥', gold: '⭐', diamond: '💎' };
            const streakHtml = `<span class="player-streak">${icons[activeStreak]} ${streakCount}</span>`;
            // --------------------------------------------------

            const item = document.createElement('div');
            let rankClass = '';
            if (index === 0) rankClass = 'rank-gold';
            else if (index === 1) rankClass = 'rank-silver';
            else if (index === 2) rankClass = 'rank-bronze';
            
            item.className = `leaderboard-item ${rankClass}`;
            
            // --- NOVÉ: Kliknutí na celý obdélník ---
            item.onclick = () => showFeed('profile', user.name);
            // ---------------------------------------
            
            // Smazali jsme onclick ze spanu p-name, protože se teď kliká na celý obdélník
            item.innerHTML = `
                <div class="lb-rank">${index + 1}.</div>
                <div class="mini-cici-lb">
                    <img src="${skinSrc}" alt="Skin" style="z-index: 1;">
                    ${trikoSrc ? `<img src="${trikoSrc}" style="z-index: 2;">` : ''}
                    ${maskaSrc ? `<img src="${maskaSrc}" style="z-index: 3;">` : ''}
                    ${obojekSrc ? `<img src="${obojekSrc}" style="z-index: 4;">` : ''}
                    ${cepiceSrc ? `<img src="${cepiceSrc}" style="z-index: 5;">` : ''}
                </div>
                <div class="lb-info">
                    <span class="p-name clickable-name">${user.name}</span>
                    ${streakHtml}
                    <span class="p-time">⏱ ${formatTime(user.total_cas)}</span>
                </div>
            `;
            list.appendChild(item);
        });
    });
}

// --- LOGIKA OBCHODU ---
function renderShop(category) {
    const grid = document.getElementById('shop-items-grid');
    grid.innerHTML = ''; 

    const filteredItems = ITEMS.filter(item => item.typ === category);
    
    const equippedItems = state.equipped_items || {};
    const currentSkinItem = ITEMS.find(i => i.nazev === equippedItems.skin);
    const skinImageSrc = currentSkinItem ? currentSkinItem.image : 'assets/skin_default.png';

    filteredItems.forEach(item => {
        const isOwned = state.owned_items.includes(item.nazev);
        const isEquipped = equippedItems[item.typ] === item.nazev;

        const div = document.createElement('div');
        div.className = `shop-item ${isEquipped ? 'equipped' : ''} ${isOwned && !isEquipped ? 'owned' : ''}`;
        
        let statusText = item.cena + ' 💰';
        if (isEquipped) statusText = 'Nasazeno';
        else if (isOwned) statusText = 'Vlastněno';

        let imageHtml = '';
        if (category === 'skin') {
            imageHtml = `<img src="${item.image}" class="item-main-img" alt="${item.nazev}">`;
        } else {
            imageHtml = `
                <img src="${skinImageSrc}" class="item-base-skin" alt="Skin podklad">
                <img src="${item.image}" class="item-main-img" alt="${item.nazev}">
            `;
        }

        div.innerHTML = `
            <div class="shop-image-container">
                ${imageHtml}
            </div>
            <div class="item-name">${item.nazev}</div>
            <div class="item-price">${statusText}</div>
        `;

        div.onclick = () => handleItemClick(item);
        grid.appendChild(div);
    });
}

function handleItemClick(item) {
    if (!state.equipped_items) state.equipped_items = {};
    
    const isOwned = state.owned_items.includes(item.nazev);
    const isEquipped = state.equipped_items[item.typ] === item.nazev;

    if (!isOwned) {
        if (state.coins >= item.cena) {
            state.coins -= item.cena;
            state.owned_items.push(item.nazev);
            saveData();
            updateHUD();
            renderShop(currentShopCategory);
        } else {
            alert('Nedostatek coinů!'); 
        }
    } else {
        if (isEquipped) {
            if (item.typ !== 'skin') {
                state.equipped_items[item.typ] = null;
            } else {
                state.equipped_items.skin = 'Cici default';
            }
        } else {
            state.equipped_items[item.typ] = item.nazev;
        }
        
        saveData();
        updateCharacter();
        renderShop(currentShopCategory);
    }
}

// --- LOGIKA UČENÍ (TIMER) ---
function formatTime(totalSeconds) {
    const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const s = String(totalSeconds % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
}

// --- ZÁMEK OBRAZOVKY (WAKE LOCK) ---
async function zapniWakeLock() {
    try {
        if ('wakeLock' in navigator) {
            wakeLock = await navigator.wakeLock.request('screen');
            console.log('Obrazovka se teď nevypne!');
            
            // Když systém zámek zruší (např. slabá baterka), vynulujeme proměnnou
            wakeLock.addEventListener('release', () => {
                console.log('Zámek obrazovky byl uvolněn.');
            });
        }
    } catch (err) {
        console.error(`Chyba Wake Locku: ${err.name}, ${err.message}`);
    }
}

function vypniWakeLock() {
    if (wakeLock !== null) {
        wakeLock.release()
            .then(() => {
                wakeLock = null;
                console.log('Obrazovka se zase může vypínat.');
            });
    }
}

function startStudy(resumeSession = null) {
    if (studyInterval) clearInterval(studyInterval);

    let studyMode;

    // --- A) ROZHODNUTÍ: JEDEME ZE ZÁLOHY, NEBO OD ZNOVA? ---
    if (resumeSession) {
        // OBNOVENÍ Z PAMĚTI
        studyMode = resumeSession.studyMode;
        studySeconds = resumeSession.studySeconds;
        isPaused = resumeSession.isPaused;
        lastTickTime = resumeSession.lastTickTime;
        currentPhase = resumeSession.currentPhase;
        phaseTimeLeft = resumeSession.phaseTimeLeft;
        learnDuration = resumeSession.learnDuration;
        breakDuration = resumeSession.breakDuration;
        
        document.getElementById('study-mode').value = studyMode;
    } else {
        // NOVÉ UČENÍ
        studyMode = document.getElementById('study-mode').value;
        studySeconds = 0;
        isPaused = false;
        lastTickTime = Date.now();
        
        if (studyMode === 'pomodoro') {
            const lInput = parseInt(document.getElementById('learn-time-input').value) || 25;
            const bInput = parseInt(document.getElementById('break-time-input').value) || 5;
            learnDuration = lInput * 60;
            breakDuration = bInput * 60;
            currentPhase = 'learn';
            phaseTimeLeft = learnDuration;
        }
        
        // Trik na odemčení zvuku pro mobily (pouze při novém startu ručním klikem)
        if (typeof bellSound !== 'undefined') {
            bellSound.volume = 0;
            bellSound.play().then(() => {
                bellSound.pause();
                bellSound.currentTime = 0;
                bellSound.volume = 1;
            }).catch(err => console.log("Odemčení zvuku selhalo:", err));
        }
    }

    // --- B) ZAMKNUTÍ A PŘÍPRAVA UI ---
    document.getElementById('study-mode').disabled = true;
    document.getElementById('learn-time-input').disabled = true;
    document.getElementById('break-time-input').disabled = true;

    const pauseBtn = document.getElementById('pause-study-btn');
    if (isPaused) {
        pauseBtn.innerText = "▶ Pokračovat";
        pauseBtn.style.backgroundColor = "#4CAF50";
    } else {
        pauseBtn.innerText = "⏸ Pauza";
        pauseBtn.style.backgroundColor = "#f0ad4e";
    }

    if (studyMode === 'pomodoro') {
        document.getElementById('current-phase-text').innerText = currentPhase === 'learn' ? "📚 Čas se učit!" : "☕ Přestávka!";
        let displayTime = phaseTimeLeft > 0 ? phaseTimeLeft : 0;
        document.getElementById('phase-timer').innerText = formatTime(displayTime);
        document.getElementById('total-session-time').classList.remove('hidden');
        document.getElementById('total-session-time').innerText = `Učíš se už: ${formatTime(studySeconds)}`;
    } else {
        document.getElementById('current-phase-text').innerText = "⏱️ Klasické učení";
        document.getElementById('phase-timer').innerText = formatTime(studySeconds);
        document.getElementById('total-session-time').classList.add('hidden');
    }

    document.getElementById('study-modal').classList.remove('hidden');

    // --- C) START NEPRŮSTŘELNÉHO INTERVALU S UKLÁDÁNÍM ---
    studyInterval = setInterval(() => {
        if (isPaused) {
            lastTickTime = Date.now();
            return;
        }

        let now = Date.now();
        let deltaSeconds = Math.floor((now - lastTickTime) / 1000); 

        if (deltaSeconds >= 1) {
            lastTickTime += deltaSeconds * 1000; 
            studySeconds += deltaSeconds; 

            if (studyMode === 'pomodoro') {
                phaseTimeLeft -= deltaSeconds; 
                
                // WHILE MÍSTO IF: Kdyby byl mobil vypnutý moc dlouho a čas by přeskočil několik fází najednou
                while (phaseTimeLeft <= 0) {
                    if (typeof bellSound !== 'undefined' && deltaSeconds < 10) {
                        bellSound.currentTime = 0;
                        bellSound.play().catch(err => console.log("Zvuk nešel přehrát:", err));
                    }

                    if (currentPhase === 'learn') {
                        currentPhase = 'break';
                        phaseTimeLeft += breakDuration; 
                        document.getElementById('current-phase-text').innerText = "☕ Přestávka!";
                    } else {
                        currentPhase = 'learn';
                        phaseTimeLeft += learnDuration;
                        document.getElementById('current-phase-text').innerText = "📚 Čas se učit!";
                    }
                }
                
                let displayTime = phaseTimeLeft > 0 ? phaseTimeLeft : 0;
                document.getElementById('phase-timer').innerText = formatTime(displayTime);
                document.getElementById('total-session-time').innerText = `Učíš se už: ${formatTime(studySeconds)}`;
            } else {
                document.getElementById('phase-timer').innerText = formatTime(studySeconds);
            }

            // TADY JE TA MAGIE: Ukládáme to tvrdě do telefonu každou vteřinu!
            localStorage.setItem('studywithcici_activesession', JSON.stringify({
                studyMode, studySeconds, currentPhase, phaseTimeLeft,
                learnDuration, breakDuration, lastTickTime, isPaused
            }));
        }
    }, 500); 

    zapniWakeLock();
}

function togglePause() {
    isPaused = !isPaused;
    const btn = document.getElementById('pause-study-btn');
    
    if (isPaused) {
        btn.innerText = "▶ Pokračovat";
        btn.style.backgroundColor = "#4CAF50"; // Zelená pro play
    } else {
        btn.innerText = "⏸ Pauza";
        btn.style.backgroundColor = "#f0ad4e"; // Oranžová zpět
    }
}

function stopStudy() {
    // Smazali jsme odsud počítání mincí! Zjišťujeme ho až při potvrzení.
    
    confirmAction('Opravdu chceš tohle sezení ukončit?', (agreed) => {
        if (agreed) {
            // Zastavíme časovač a usínání HNED TEĎ
            clearInterval(studyInterval);
            vypniWakeLock();
            
            // NOVÉ: Vymažeme záchrannou relaci z paměti mobilu
            localStorage.removeItem('studywithcici_activesession');
            
            
            // OPRAVA 3: Počítáme mince z fixního času přesně ve chvíli ukončení
            const earnedCoins = Math.floor(studySeconds / 180); 
            
            document.getElementById('study-modal').classList.add('hidden');
            
            document.getElementById('study-mode').disabled = false;
            document.getElementById('learn-time-input').disabled = false;
            document.getElementById('break-time-input').disabled = false;
            
            // Logika streaků
            checkDateReset(); 
            state.daily_time += studySeconds;
            
            if (state.daily_time >= 180 && !state.awarded_today.red) { state.streaks.red++; state.awarded_today.red = true; }
            if (state.daily_time >= 3600 && !state.awarded_today.gold) { state.streaks.gold++; state.awarded_today.gold = true; }
            if (state.daily_time >= 7200 && !state.awarded_today.diamond) { state.streaks.diamond++; state.awarded_today.diamond = true; }

            // Příprava dat pro post
            const mode = document.getElementById('study-mode').value;
            const lTime = document.getElementById('learn-time-input').value;
            const bTime = document.getElementById('break-time-input').value;
            
            pendingPostData = {
                timestamp: Date.now(),
                totalSeconds: studySeconds,
                method: mode,
                learnInput: mode === 'pomodoro' ? lTime : null,
                breakInput: mode === 'pomodoro' ? bTime : null,
                earnedCoins: earnedCoins // Odměna zafixována
            };

            document.getElementById('post-title').value = '';
            document.getElementById('post-desc').value = '';
            document.getElementById('post-create-modal').classList.remove('hidden');
        }
    });
}

// --- CUSTOM POTVRZOVACÍ DIALOG ---
let confirmCallback = null;

function confirmAction(text, callback) {
    document.getElementById('confirm-text').innerText = text;
    document.getElementById('confirm-modal').classList.remove('hidden');
    confirmCallback = callback;
}

// --- PŘÁTELÉ ---
function addFriend() {
    const friendName = document.getElementById('friend-input').value.trim();
    if (!friendName || friendName === currentUser) return;

    db.ref('users/' + friendName).once('value').then((snapshot) => {
        if (snapshot.exists()) {
            if (!state.friends) state.friends = {};
            state.friends[friendName] = true;
            
            saveData();
            document.getElementById('friend-input').value = '';
            renderFriends();
        } else {
            alert("Tenhle uživatel neexistuje! Pozvi ho, ať začne studovat.");
        }
    });
}

function renderFriends() {
    const list = document.getElementById('friends-list');
    list.innerHTML = '<p style="text-align:center;">Načítám parťáky...</p>'; 

    if (!state.friends || Object.keys(state.friends).length === 0) {
        list.innerHTML = '<p style="text-align:center; margin-top: 20px;">Zatím nikoho nesleduješ.</p>';
        return;
    }

    const friendNames = Object.keys(state.friends);
    
    const fetchPromises = friendNames.map(name => {
        return db.ref('users/' + name).once('value').then(snapshot => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                data.name = name; 
                return data;
            }
            return null;
        });
    });

    Promise.all(fetchPromises).then(friendsData => {
        let validFriends = friendsData.filter(f => f !== null);
        validFriends.sort((a, b) => (b.total_cas || 0) - (a.total_cas || 0));

        list.innerHTML = '';
        validFriends.forEach(data => {
            const friendName = data.name;
            const equipped = data.equipped_items || {};

            const getImageFromName = (itemName, isSkin = false) => {
                if (!itemName) return isSkin ? 'assets/skin_default.png' : '';
                const foundItem = ITEMS.find(i => i.nazev === itemName);
                return foundItem ? foundItem.image : (isSkin ? 'assets/skin_default.png' : '');
            };

            const skinSrc = getImageFromName(equipped.skin, true);
            const trikoSrc = getImageFromName(equipped.triko);
            const maskaSrc = getImageFromName(equipped.maska);
            const obojekSrc = getImageFromName(equipped.obojek);
            const cepiceSrc = getImageFromName(equipped.cepice);

            // --- TADY JSOU STREAKY PŘÁTEL ---
            const activeStreak = data.active_streak || 'red';
            const streakCount = data.streaks ? data.streaks[activeStreak] || 0 : 0;
            const icons = { red: '🔥', gold: '⭐', diamond: '💎' };
            
            // TADY JE ZMĚNA: Použijeme tu novou CSS třídu .friend-streak
            const streakHtml = `<div class="friend-streak">${icons[activeStreak]} ${streakCount}</div>`;

            const item = document.createElement('div');
            item.className = 'friend-card';
            
            // --- NOVÉ: Kliknutí na celou kartičku ---
            item.onclick = () => showFeed('profile', friendName);
            // ----------------------------------------
            
            // Všimni si "event.stopPropagation();" u tlačítka remove-friend-btn! 
            // To zabrání otevření profilu při mazání kamaráda.
            item.innerHTML = `
                ${streakHtml}
                
                <div class="mini-cici">
                    <img src="${skinSrc}" alt="Skin" style="z-index: 1;">
                    ${trikoSrc ? `<img src="${trikoSrc}" style="z-index: 2;">` : ''}
                    ${maskaSrc ? `<img src="${maskaSrc}" style="z-index: 3;">` : ''}
                    ${obojekSrc ? `<img src="${obojekSrc}" style="z-index: 4;">` : ''}
                    ${cepiceSrc ? `<img src="${cepiceSrc}" style="z-index: 5;">` : ''}
                </div>
                
                <div class="friend-info">
                    <span class="friend-name clickable-name">${friendName}</span>
                    <span class="friend-time">⏱ ${formatTime(data.total_cas || 0)}</span>
                </div>
                
                <button class="remove-friend-btn" onclick="event.stopPropagation(); removeFriend('${friendName}')" title="Odebrat">❌</button>
            `;
            
            list.appendChild(item);
        });
    });
}

function removeFriend(name) {
    if (state.friends && state.friends[name]) {
        delete state.friends[name];
        saveData();
        renderFriends();
    }
}

// --- LOGIKA POSTŮ A PROFILU ---
function savePost() {
    const title = document.getElementById('post-title').value.trim() || "Učeníčko";
    const desc = document.getElementById('post-desc').value.trim();
    
    const newPost = {
        ...pendingPostData,
        title: title,
        description: desc,
        dateString: new Date().toLocaleString('cs-CZ'),
        likes: {},
        comments: []
    };

    if (!state.posts) state.posts = {};
    state.posts[newPost.timestamp] = newPost;
    
    // Nyní přidělíme odložené coiny a čas
    state.total_cas += pendingPostData.totalSeconds;
    state.coins += pendingPostData.earnedCoins;
    
    saveData();
    updateHUD();
    
    document.getElementById('post-create-modal').classList.add('hidden');
    
    // Nakonec ukážeme tu odměnu
    if (pendingPostData.earnedCoins > 0) {
        setTimeout(() => alert(`Vydělal sis ${pendingPostData.earnedCoins} grošů a tvůj post byl uložen!`), 100);
    } else {
        setTimeout(() => alert('Učil ses moc krátkou dobu, ale post jsme ti uložili.'), 100);
    }
    pendingPostData = null;
}

function showFeed(type, username = null) {
    currentFeedContext.type = type;
    currentFeedContext.username = username;

    const list = document.getElementById('feed-list');
    const title = document.getElementById('feed-title');
    list.innerHTML = '<p style="text-align:center">Načítám...</p>';
    document.getElementById('feed-modal').classList.remove('hidden');

    if (type === 'profile') {
        title.innerText = `Studijní deník: ${username}`;
        db.ref('users/' + username).once('value').then(snapshot => {
            const data = snapshot.val();
            if (data && data.posts) {
                renderPosts(Object.values(data.posts), list, username);
            } else {
                list.innerHTML = '<p style="text-align:center; margin-top:20px;">Zatím žádné záznamy o učení.</p>';
            }
        });
    } else if (type === 'friends') {
        title.innerText = "Novinky parťáků";
        if (!state.friends || Object.keys(state.friends).length === 0) {
            list.innerHTML = '<p style="text-align:center; margin-top:20px;">Zatím nikoho nesleduješ.</p>';
            return;
        }

        const fetchPromises = Object.keys(state.friends).map(name => {
            return db.ref('users/' + name + '/posts').once('value').then(snap => {
                if (snap.exists()) {
                    const posts = Object.values(snap.val());
                    posts.forEach(p => p.author = name); // Přidáme k postu jméno kámoše
                    return posts;
                }
                return [];
            });
        });

        Promise.all(fetchPromises).then(results => {
            let allPosts = [];
            results.forEach(arr => allPosts = allPosts.concat(arr));
            allPosts.sort((a, b) => b.timestamp - a.timestamp); // Nejnovější nahoře
            const top10 = allPosts.slice(0, 10);
            renderPosts(top10, list, null);
        });
    }
}

function showNotifications() {
    // Zajistíme, že máme notifikace v místním stavu
    if (!state.notifications) state.notifications = [];

    const adminArea = document.getElementById('admin-notification-area');
    const notificationsList = document.getElementById('notifications-list');

    if (adminArea && notificationsList) {
        const isAdminUser = currentUser === 'admin' || currentUser === 'developer' || currentUser === 'Dan real';
        adminArea.style.display = isAdminUser ? 'flex' : 'none';

        // Ujistíme se, že admin panel je vždy nad seznamem notifikací
        if (isAdminUser && adminArea.parentNode === notificationsList.parentNode) {
            notificationsList.parentNode.insertBefore(adminArea, notificationsList);
        }
    }

    const globalNotifTextarea = document.getElementById('global-notif-text');
    if (globalNotifTextarea) {
        globalNotifTextarea.value = '';
        globalNotifTextarea.style.height = 'auto';
    }

    renderNotifications();

    document.getElementById('notifications-modal').classList.remove('hidden');
}

function broadcastGlobalNotification(text) {
    if (!text || !text.trim()) {
        alert('Zadej text oznámení.');
        return;
    }

    const payload = {
        text: text.trim(),
        date: new Date().toLocaleString('cs-CZ'),
        id: Date.now(),
        isGlobal: true
    };

    db.ref('users').once('value').then(snapshot => {
        const users = snapshot.val();
        if (!users) return;
        const updates = {};

        Object.keys(users).forEach(username => {
            const userNotifications = users[username].notifications || [];
            userNotifications.unshift({ ...payload, read: false });
            updates[`users/${username}/notifications`] = userNotifications;
        });

        db.ref().update(updates).then(() => {
            if (currentUser === 'admin' || currentUser === 'Dan real') {
                addLocalNotification('Odesláno všem: ' + payload.text);
            }
            alert('Oznámení odesláno všem uživatelům.');
            renderNotifications();
        });
    });
}

function renderPosts(postsArray, container, defaultAuthor) {
    if (postsArray.length === 0) {
        container.innerHTML = '<p style="text-align:center; margin-top:20px;">Zatím žádné záznamy o učení.</p>';
        return;
    }
    
    if (defaultAuthor) {
        postsArray.sort((a, b) => b.timestamp - a.timestamp);
    }

    container.innerHTML = '';
    postsArray.forEach(post => {
        const author = post.author || defaultAuthor;
        const methodText = post.method === 'pomodoro' 
            ? `🍅 Pomodoro (${post.learnInput}m / ${post.breakInput}m)` 
            : `⏱️ Klasika`;

        const likesCount = post.likes ? Object.keys(post.likes).length : 0;
        const isLiked = currentUser && post.likes && post.likes[currentUser];
        const commentsCount = post.comments ? post.comments.length : 0;

        const likeIconSrc = isLiked ? 'assets/like_full.png' : 'assets/like_blank.png';

        const div = document.createElement('div');
        div.className = 'post-card';
        div.innerHTML = `
            <div class="post-header">
                <span class="post-author">${author}</span>
                <span class="post-date">${post.dateString}</span>
            </div>
            <h3 class="post-title">${post.title}</h3>
            ${post.description ? `<p class="post-desc">${post.description}</p>` : ''}
            <div class="post-footer">
                <span>${methodText}</span>
                <span>Čas: ${formatTime(post.totalSeconds)}</span>
            </div>
            <div class="post-actions" style="display: flex; gap: 8px; margin-top: 10px;">
                <button class="like-btn action-button" style="padding: 6px 8px; font-size:14px; display: flex; align-items: center; gap: 4px;">
                    <img class="like-icon" src="${likeIconSrc}" alt="like" width="18" height="18">
                    <span class="count">${likesCount}</span>
                </button>
                <button class="comment-btn action-button" style="padding: 6px 8px; font-size:14px; display: flex; align-items: center; gap: 4px;">
                    <span class="emoji">💬</span>
                    <span class="count">${commentsCount}</span>
                </button>
            </div>
            <div class="post-comments" style="margin-top: 8px; padding-left: 8px; border-left: 2px solid #ddd;">
                ${post.comments && post.comments.length ? post.comments.map(c => `<div style="margin-bottom:4px;"><strong>${c.author}:</strong> ${c.text}</div>`).join('') : '<p style="opacity:0.7;">Žádné komentáře.</p>'}
            </div>
        `;

        const likeBtn = div.querySelector('.like-btn');
        const commentBtn = div.querySelector('.comment-btn');

        likeBtn.addEventListener('click', e => {
            e.stopPropagation();
            toggleLike(author, post.timestamp);
        });

        commentBtn.addEventListener('click', e => {
            e.stopPropagation();
            addComment(author, post.timestamp);
        });

        container.appendChild(div);
    });

    if (preservedFeedScroll && container) {
        container.scrollTop = preservedFeedScroll;
        preservedFeedScroll = 0;
    }
}

function saveFeedScroll() {
    const feedList = document.getElementById('feed-list');
    return feedList ? feedList.scrollTop : 0;
}

function restoreFeedScroll(scrollPos) {
    const feedList = document.getElementById('feed-list');
    if (feedList) {
        feedList.scrollTop = scrollPos;
    }
}

function toggleLike(author, timestamp) {
    if (!currentUser) {
        alert('Přihlas se, aby ses mohl/a lajkovat příspěvky.');
        return;
    }

    preservedFeedScroll = saveFeedScroll();

    if (author === currentUser) {
        if (!state.posts || !state.posts[timestamp]) return;
        const post = state.posts[timestamp];
        post.likes = post.likes || {};

        if (post.likes[currentUser]) {
            delete post.likes[currentUser];
        } else {
            post.likes[currentUser] = true;
            if (author !== currentUser) {
                sendNotificationToUser(author, `${currentUser} ti dal/la lajk na příspěvek: "${post.title || 'tvůj příspěvek'}"`);
            }
        }

        saveData();
        updateHUD();
        showFeed(currentFeedContext.type, currentFeedContext.username);
        return;
    }

    const likeRef = db.ref('users/' + author + '/posts/' + timestamp + '/likes');
    likeRef.once('value').then(snapshot => {
        const likes = snapshot.val() || {};

        if (likes[currentUser]) {
            delete likes[currentUser];
        } else {
            likes[currentUser] = true;
        }

        likeRef.set(likes).then(() => {
            if (likes[currentUser]) {
                sendNotificationToUser(author, `${currentUser} ti dal/la lajk na příspěvek.`);
            }
            showFeed(currentFeedContext.type, currentFeedContext.username);
        });
    });
}

function addComment(author, timestamp) {
    if (!currentUser) {
        alert('Přihlas se, aby ses mohl/a komentovat příspěvky.');
        return;
    }
    const text = prompt('Napiš komentář:', '');
    if (!text || !text.trim()) return;

    const comment = {
        author: currentUser,
        text: text.trim(),
        date: new Date().toLocaleString('cs-CZ')
    };

    if (author === currentUser) {
        if (!state.posts || !state.posts[timestamp]) return;
        const post = state.posts[timestamp];
        post.comments = post.comments || [];
        post.comments.push(comment);

        saveData();
        updateHUD();
        showFeed(currentFeedContext.type, currentFeedContext.username);
        return;
    }

    sendNotificationToUser(author, `${currentUser} ti napsal/a komentář na tvůj příspěvek: "${comment.text}"`);

    const commentsRef = db.ref('users/' + author + '/posts/' + timestamp + '/comments');
    commentsRef.once('value').then(snapshot => {
        const comments = snapshot.val() || [];
        comments.push(comment);
        commentsRef.set(comments).then(() => {
            showFeed(currentFeedContext.type, currentFeedContext.username);
        });
    });
}

// --- EVENT LISTENERY ---
function setupEventListeners() {

    document.getElementById('login-btn').addEventListener('click', loginUser);
    document.getElementById('register-link').addEventListener('click', registerUser);

    const loginFields = ['username-input', 'password-input'];
    loginFields.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    loginUser();
                }
            });
        }
    });

    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('studywithcici_remembered_user');
        localStorage.removeItem('studywithcici_remembered_pass');
        
        saveData(); 
        location.reload(); 
    });

    document.getElementById('start-study-btn').addEventListener('click', () => startStudy());
    document.getElementById('stop-study-btn').addEventListener('click', stopStudy);
    document.getElementById('pause-study-btn').addEventListener('click', togglePause);

    // Skrývání a ukazování nastavení Pomodora
    document.getElementById('study-mode').addEventListener('change', (e) => {
        const pomodoroSettings = document.getElementById('pomodoro-settings');
        if (e.target.value === 'pomodoro') {
            pomodoroSettings.classList.remove('hidden');
        } else {
            pomodoroSettings.classList.add('hidden');
        }
    });

    document.getElementById('open-shop-btn').addEventListener('click', () => {
        renderShop(currentShopCategory);
        document.getElementById('shop-modal').classList.remove('hidden');
    });

    document.getElementById('close-shop-btn').addEventListener('click', () => {
        document.getElementById('shop-modal').classList.add('hidden');
    });

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            currentShopCategory = e.target.getAttribute('data-category');
            renderShop(currentShopCategory);
        });
    });

    document.getElementById('confirm-yes').addEventListener('click', () => {
        document.getElementById('confirm-modal').classList.add('hidden');
        if (confirmCallback) confirmCallback(true);
    });

    document.getElementById('confirm-no').addEventListener('click', () => {
        document.getElementById('confirm-modal').classList.add('hidden');
        if (confirmCallback) confirmCallback(false);
    });
    
    document.getElementById('open-leaderboard-btn').addEventListener('click', showLeaderboard);
    document.getElementById('close-leaderboard-btn').addEventListener('click', () => {
        document.getElementById('leaderboard-modal').classList.add('hidden');
    });

    document.getElementById('open-friends-btn').addEventListener('click', () => {
        renderFriends();
        document.getElementById('friends-modal').classList.remove('hidden');
    });

    document.getElementById('close-friends-btn').addEventListener('click', () => {
        document.getElementById('friends-modal').classList.add('hidden');
    });

    document.getElementById('add-friend-btn').addEventListener('click', addFriend);
    
    document.getElementById('streak-selector').addEventListener('change', (e) => {
        state.active_streak = e.target.value;
        saveData(); // Uloží to hned do Firebase
        updateHUD(); // Hned to překreslí nápis
    });

    document.getElementById('save-post-btn').addEventListener('click', savePost);
    
    document.getElementById('open-feed-btn').addEventListener('click', () => {
        showFeed('friends');
    });

    document.getElementById('open-notifications-btn').addEventListener('click', () => {
        showNotifications();
    });

    document.getElementById('close-feed-btn').addEventListener('click', () => {
        document.getElementById('feed-modal').classList.add('hidden');
    });

    document.getElementById('close-notifications-btn').addEventListener('click', () => {
        markAllNotificationsRead();
        document.getElementById('notifications-modal').classList.add('hidden');
    });

    document.getElementById('send-global-notif-btn').addEventListener('click', () => {
        const textEl = document.getElementById('global-notif-text');
        const text = textEl.value;
        broadcastGlobalNotification(text);
        textEl.value = '';
        textEl.style.height = 'auto';
    });

    const globalNotifTextarea = document.getElementById('global-notif-text');
    if (globalNotifTextarea) {
        globalNotifTextarea.addEventListener('input', () => {
            globalNotifTextarea.style.height = 'auto';
            globalNotifTextarea.style.height = `${globalNotifTextarea.scrollHeight}px`;
        });
    }
    
    // Obnova Wake Locku, pokud se hráč přepne do jiné záložky a vrátí se
    document.addEventListener('visibilitychange', async () => {
        if (wakeLock !== null && document.visibilityState === 'visible') {
            // Pokud měl zapnutý zámek a vrátil se na stránku, nahodíme ho znovu
            zapniWakeLock();
        }
    });
}


// Spuštění po načtení stránky
window.onload = init;


// --- REGISTRACE SERVICE WORKERA A AUTOMATICKÝ UPDATE ---
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(registration => {
                console.log('PWA zaregistrováno.');
                
                // NOVÉ: Okamžitá a agresivní kontrola updatu při každém zapnutí
                registration.update(); 
                
                // Můžeš přidat i pravidelnou kontrolu (např. každou hodinu, pokud má hráč hru zapnutou dlouho)
                setInterval(() => {
                    registration.update();
                }, 1000 * 60 * 60);
            })
            .catch(error => {
                console.error('Chyba registrace PWA:', error);
            });

        // TOTO ZAŘÍDÍ AUTOMATICKÝ REFRESH PŘI UPDATU (Ale bezpečně!)
        let refreshing = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (!refreshing) {
                // Zkontrolujeme, jestli běží časovač NEBO jestli hráč zrovna píše post
                const isStudying = !document.getElementById('study-modal').classList.contains('hidden');
                const isPosting = !document.getElementById('post-create-modal').classList.contains('hidden');
                
                if (isStudying || isPosting) {
                    // Hráč se učí nebo zrovna píše deník! Necháme ho v klidu dokončit práci.
                    console.log("Nová verze stažena, ale hráč je zaneprázdněn. Čekám na manuální refresh.");
                } else {
                    // Hráč je v menu, v obchodě nebo u přátel, můžeme bezpečně refreshnout
                    window.location.reload();
                    refreshing = true;
                }
            }
        });
    });
}
