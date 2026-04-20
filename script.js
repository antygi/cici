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
const storage = firebase.storage();


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
    { nazev: 'Yuumi', typ: 'skin', cena: 1000, image: 'assets/skin_yuumi.png' },

    // Trika
    { nazev: 'Doktor outfit', typ: 'triko', cena: 800, image: 'assets/triko_doktor.png' },
    { nazev: 'Triko růžové', typ: 'triko', cena: 60, image: 'assets/triko_ruzove.png' },
    { nazev: 'Batman oblek', typ: 'triko', cena: 500, image: 'assets/triko_batman.png' },
    { nazev: 'Právník outfit', typ: 'triko', cena: 600, image: 'assets/triko_pravnik.png' },
    { nazev: 'Status studenta', typ: 'triko', cena: 15, image: 'assets/triko_ujep.png' },
    { nazev: 'Brnění', typ: 'triko', cena: 300, image: 'assets/triko_rytir.png' },
    { nazev: 'Baletka', typ: 'triko', cena: 100, image: 'assets/triko_baletka.png' },
    { nazev: 'Superman z wishe oblek', typ: 'triko', cena: 15, image: 'assets/triko_wishsuperman.png' },
    { nazev: 'Jinx triko', typ: 'triko', cena: 50, image: 'assets/triko_jinx.png' },
    { nazev: 'Spider triko', typ: 'triko', cena: 300, image: 'assets/triko_spider.png' },

    
    // Masky
    { nazev: 'Gangster kukla', typ: 'maska', cena: 60, image: 'assets/maska_gangster.png' },
    { nazev: 'Batman maska', typ: 'maska', cena: 300, image: 'assets/maska_batman.png' },
    { nazev: 'Retard', typ: 'maska', cena: 10, image: 'assets/maska_retard.png' },
    { nazev: 'Rouška', typ: 'maska', cena: 50, image: 'assets/maska_rouska.png' },
    { nazev: 'Dudlík', typ: 'maska', cena: 20, image: 'assets/maska_dudlik.png' },
    { nazev: 'Superman z wishe maska', typ: 'maska', cena: 5, image: 'assets/maska_wishsuperman.png' },
    { nazev: 'Spiderčiči maska', typ: 'maska', cena: 200, image: 'assets/maska_spider.png' },
    { nazev: 'Jinx oči', typ: 'maska', cena: 20, image: 'assets/maska_jinx.png' },

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
    { nazev: 'Králičí uši', typ: 'cepice', cena: 25, image: 'assets/cepice_kralici_usi.png'},
    { nazev: 'Jinx čepice', typ: 'cepice', cena: 150, image: 'assets/cepice_jinx.png'}
];

// --- STAV APLIKACE (STATE) ---
let currentUser = null; 
let allUsers = {};      
let preservedFeedScroll = 0;
// --- OCHRANA PROTI POSUNU ČASU ---
let serverTimeOffset = 0;

// Firebase nám sem neustále posílá odchylku mezi časem na mobilu a časem na serveru
db.ref('.info/serverTimeOffset').on('value', function(snapshot) {
    serverTimeOffset = snapshot.val() || 0;
});

// Získání přesného serverového času v milisekundách
function getTrueTime() {
    return Date.now() + serverTimeOffset;
}

// Získání přesného serverového data
function getTrueDate() {
    return new Date(getTrueTime());
}


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
    weekly_time: 0,
    trophies: 0,
    current_week: getCurrentWeekString(),
    last_date: new Date().toDateString(),
    streaks: { red: 0, gold: 0, diamond: 0 },
    awarded_today: { red: false, gold: false, diamond: false },
    active_streak: 'red'
};

let state = JSON.parse(JSON.stringify(DEFAULT_STATE)); 

// --- POMOCNÁ FUNKCE PRO ZJIŠTĚNÍ AKTUÁLNÍHO TÝDNE ---
// Nyní jako výchozí bere skutečný serverový čas
function getCurrentWeekString(dateInput = getTrueDate()) { 
    const d = new Date(dateInput);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
    const week1 = new Date(d.getFullYear(), 0, 4);
    const weekNumber = 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
    return `${d.getFullYear()}-W${weekNumber}`;
}

// --- FUNKCE PRO HLÍDÁNÍ PADÁNÍ STREAKŮ ---
function checkDateReset() {
    // Bezpečnostní pojistka pro staré účty, aby jim to nespadlo
    if (!state.streaks) state.streaks = { red: 0, gold: 0, diamond: 0 };
    if (!state.awarded_today) state.awarded_today = { red: false, gold: false, diamond: false };
    if (!state.last_date) state.last_date = getTrueDate().toDateString();
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
let currentLeaderboardType = 'weekly'; // Globální proměnná pro pamatování záložky

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

async function premenovatHrace(stareJmeno, noveJmeno) {
    if (!stareJmeno || !noveJmeno || noveJmeno.includes(' ')) {
        console.error("Špatně zadaná jména! Nové jméno nesmí mít mezeru."); 
        return;
    }
    
    // 1. Zkopírujeme data starého hráče
    const snap = await db.ref('users/' + stareJmeno).once('value');
    if (!snap.exists()) {
        console.error("Hráč '" + stareJmeno + "' v databázi neexistuje!"); 
        return;
    }
    const data = snap.val();
    
    // 2. Připravíme obří update
    let updates = {};
    updates['users/' + noveJmeno] = data; // Vytvoříme nového
    updates['users/' + stareJmeno] = null; // Smažeme starého
    
    // 3. Projdeme všechny ostatní hráče a opravíme jim seznam přátel
    const allUsersSnap = await db.ref('users').once('value');
    const allUsers = allUsersSnap.val();
    
    for (let user in allUsers) {
        if (allUsers[user].friends && allUsers[user].friends[stareJmeno]) {
            updates['users/' + user + '/friends/' + stareJmeno] = null; // Odstraníme staré jméno z přátel
            updates['users/' + user + '/friends/' + noveJmeno] = true;  // Přidáme nové jméno
        }
    }
    
    // 4. Odešleme to do Firebase naráz
    await db.ref().update(updates);
    console.log(`✅ HOTOVO: Hráč "${stareJmeno}" byl úspěšně přejmenován na "${noveJmeno}". Všichni jeho přátelé byli aktualizováni.`);
}

// --- DATABÁZE A PŘIHLAŠOVÁNÍ (FIREBASE CLOUD) ---
function saveData(keysToSave = null) {
    if (!currentUser) return; 

    // A) POKUD JSME POSLALI KONKRÉTNÍ ARGUMENTY (např. saveData(['coins', 'total_cas']))
    if (keysToSave && Array.isArray(keysToSave)) {
        let updates = {};
        keysToSave.forEach(key => {
            if (state[key] !== undefined) {
                updates[key] = state[key]; // Vezmeme jen ty konkrétní věci ze state
            }
        });
        // .update() zapíše jen tyhle klíče a zbytek databáze nechá na pokoji!
        db.ref('users/' + currentUser).update(updates);
    } 
    // B) POKUD JSME ZAVOLALI JEN saveData() BEZ ARGUMENTŮ
    else {
        // Uděláme si dočasnou kopii celého našeho stavu
        let stateCopy = JSON.parse(JSON.stringify(state));
        
        // ULTIMÁTNÍ OCHRANA: Smažeme z kopie notifikace! 
        // Tím pádem je funkce .update() vůbec nepošle do Firebase a nepřepíše je.
        delete stateCopy.notifications; 
        
        // Zápis do databáze (zase přes bezpečnější .update)
        db.ref('users/' + currentUser).update(stateCopy);
    }
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

    // --- NOVÁ OCHRANA PROTI MEZERÁM A DÉLCE JMÉNA ---
    if (username.includes(' ')) {
        alert("Uživatelské jméno nesmí obsahovat mezery! Použij například podtržítko (např. Jan_Novak).");
        return;
    }

    if (username.length > 20) {
        alert("Uživatelské jméno je příliš dlouhé! Maximální povolená délka je 20 znaků.");
        return;
    }
    // -----------------------------------------------

    const loginBtn = document.getElementById('login-btn');
    loginBtn.innerText = "Zakládám účet...";
    loginBtn.disabled = true;

    db.ref('users/' + username).once('value')
        .then((snapshot) => {
            if (snapshot.exists()) {
                // Jméno už někdo má
                alert("Toto jméno už je zabrané, vyber si prosím jiné!");
                resetLoginBtn();
            } else {
                // ZAKLÁDÁME NOVÝ ÚČET
                currentUser = username;
                state = JSON.parse(JSON.stringify(DEFAULT_STATE));
                state.password = password; 
                saveData(Object.keys(state));
                
                alert("Účet úspěšně vytvořen! Vítej ve hře.");
                finishLogin(username, password);
            }
        })
        .catch((error) => {
            alert("Chyba při registraci: " + error.message);
            resetLoginBtn();
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
    
    // Spustíme tajného rozhodčího, jestli náhodou nezačal nový týden
    processWeeklyLeaderboard();

    // NOVÉ: Kontrola, jestli se aplikace neukončila (nezabila) během učení
    const savedSession = localStorage.getItem('studywithcici_activesession');
    if (savedSession) {
        const parsedSession = JSON.parse(savedSession);
        startStudy(parsedSession); 
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

    // --- Vykreslení počtu trofejí ---
    if (document.getElementById('trophy-display')) {
        const t = state.trophies || 0;
        document.getElementById('trophy-display').innerHTML = `
            <img src="assets/trophy_button.png" style="width: 14px; height: 14px; object-fit: contain; vertical-align: middle; margin-bottom: 2px;"> ${t}
        `;
    }

    updateNotificationBadge();
    // -----------------------------------------------------------------------------
}

function updateNotificationBadge() {
    if (!state.notifications) state.notifications = [];
    
    // --- LÉČIVÁ NÁPLAST ---
    // Pokud Firebase vrátil objekt místo pole, převedeme ho zpátky
    if (!Array.isArray(state.notifications)) {
        state.notifications = Object.values(state.notifications);
    }
    
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
    saveData(['notifications']);
    updateNotificationBadge();
}

function sendNotificationToUser(username, message) {
    if (!username || !message) return;

    db.ref('users/' + username + '/notifications').once('value').then(snapshot => {
        let notifications = snapshot.val() || [];
        
        // --- LÉČIVÁ NÁPLAST ---
        if (!Array.isArray(notifications)) {
            notifications = Object.values(notifications);
        }

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
    
    if (!state.notifications) state.notifications = [];
    
    // --- LÉČIVÁ NÁPLAST ---
    if (!Array.isArray(state.notifications)) {
        state.notifications = Object.values(state.notifications);
    }

    if (state.notifications.length === 0) {
        list.innerHTML = '<p style="text-align:center; opacity: 0.8;">Žádná oznámení.</p>';
        return;
    }

    state.notifications
        .sort((a, b) => b.id - a.id)
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
            saveData(['notifications']);
            renderNotifications();
            updateNotificationBadge();
        });

        list.appendChild(item);
    });
}

function markAllNotificationsRead() {
    if (!state.notifications) return;
    state.notifications = state.notifications.map(notif => ({ ...notif, read: true }));
    saveData(['notifications']);
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


function showLeaderboard(type = 'weekly') {
    currentLeaderboardType = type;
    const list = document.getElementById('leaderboard-list');
    list.innerHTML = '<p style="text-align:center">Načítám legendy...</p>';
    document.getElementById('leaderboard-modal').classList.remove('hidden');

    // Aktualizace vizuálu tlačítek přepínače
    const btnWeekly = document.getElementById('btn-lb-weekly');
    const btnAlltime = document.getElementById('btn-lb-alltime');
    if (btnWeekly && btnAlltime) {
        btnWeekly.classList.toggle('active', type === 'weekly');
        btnAlltime.classList.toggle('active', type === 'alltime');
    }

    db.ref('users').once('value').then((snapshot) => {
        const data = snapshot.val();
        if (!data) return;

        let usersArray = [];
        const thisWeekStr = getCurrentWeekString();

        // 1. Shromáždíme data o všech uživatelích
        for (let name in data) {
            let uData = data[name];
            
            // Pojistka pro týdenní čas
            let weeklyCas = uData.weekly_time || 0;
            if (uData.current_week !== thisWeekStr) {
                weeklyCas = 0; 
            }

            usersArray.push({
                name: name,
                total_cas: uData.total_cas || 0,
                weekly_time: weeklyCas,
                equipped: uData.equipped_items || {},
                streaks: uData.streaks || {},
                active_streak: uData.active_streak || 'red',
                trophies: uData.trophies || 0
            });
        }

        // 2. Třídění a filtrování podle typu žebříčku
        let displayedUsers = [];

        if (type === 'weekly') {
            // Týdenní: Všichni, co se učili aspoň minutu (60s)
            displayedUsers = usersArray.filter(u => u.weekly_time >= 60);
            displayedUsers.sort((a, b) => b.weekly_time - a.weekly_time);
        } else {
            // Celkový: Pouze TOP 10 nejlepších
            usersArray.sort((a, b) => b.total_cas - a.total_cas);
            displayedUsers = usersArray.slice(0, 10);
        }

        list.innerHTML = '';

        // Ošetření prázdného žebříčku na začátku týdne
        if (displayedUsers.length === 0 && type === 'weekly') {
            list.innerHTML = '<p style="text-align:center; padding: 20px; color: #555;">Tento týden se ještě nikdo neučil aspoň minutu. Běž do toho a urvi první místo!</p>';
            return;
        }

        // 3. Vykreslení řádků
        displayedUsers.forEach((user, index) => {
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

            const activeStreak = user.active_streak;
            const streakCount = user.streaks[activeStreak] || 0;
            const icons = { red: '🔥', gold: '⭐', diamond: '💎' };
            const streakHtml = `<span class="player-streak">${icons[activeStreak]} ${streakCount}</span>`;
            const trophyHtml = `<span class="player-streak" style="background: #fff3cd; border-color: #ffeeba;"><img src="assets/trophy_button.png" style="width: 12px; height: 12px; vertical-align: middle; margin-bottom: 2px;"> ${user.trophies}</span>`;

            const displayedTime = type === 'weekly' ? user.weekly_time : user.total_cas;

            // --- TADY SE DĚJE TO ZVÝRAZNĚNÍ TEBE ---
            const isMeClass = (user.name === currentUser) ? 'is-me' : '';
            
            const item = document.createElement('div');
            let rankClass = '';
            if (index === 0) rankClass = 'rank-gold';
            else if (index === 1) rankClass = 'rank-silver';
            else if (index === 2) rankClass = 'rank-bronze';
            
            item.className = `leaderboard-item ${rankClass} ${isMeClass}`;
            item.onclick = () => showFeed('profile', user.name);
            
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
                    <div style="display: flex; gap: 5px; margin-top: 2px;">
                        ${streakHtml}
                        ${trophyHtml}
                    </div>
                    <span class="p-time">⏱ ${formatTime(displayedTime)}</span>
                </div>
            `;
            list.appendChild(item);
        });
    });
}

// --- GLOBÁLNÍ VYHODNOCENÍ TÝDNE (Pouze pro prvního hráče v novém týdnu) ---
// --- GLOBÁLNÍ VYHODNOCENÍ TÝDNE (Pouze pro prvního hráče v novém týdnu) ---
function processWeeklyLeaderboard() {
    const thisWeek = getCurrentWeekString();

    // 1. Podíváme se do globální statistiky, jestli už tento týden nebyl vyhodnocen
    db.ref('global_stats/last_evaluated_week').once('value').then(snapshot => {
        const lastWeek = snapshot.val();

        if (lastWeek !== thisWeek) {
            console.log("Jsem první v tomto týdnu! Vyhodnocuji žebříček pro všechny...");
            
            // 2. Stáhneme všechny uživatele
            db.ref('users').once('value').then(usersSnap => {
                const users = usersSnap.val();
                if (!users) return;

                let winner = null;
                let maxTime = 0;

                // 3. Najdeme absolutního vítěze
                for (let username in users) {
                    let wt = users[username].weekly_time || 0;
                    if (wt > maxTime) {
                        maxTime = wt;
                        winner = username;
                    }
                }

                // 4. Připravíme obří update pro databázi
                let updates = {};

                // A) Pokud MÁME vítěze (někdo se fakt učil)
                if (winner && maxTime > 0) {
                    // Přidáme trofej a 100 catcoinů
                    let currentTrophies = users[winner].trophies || 0;
                    let currentCoins = users[winner].coins || 0;
                    
                    updates[`users/${winner}/trophies`] = currentTrophies + 1;
                    updates[`users/${winner}/coins`] = currentCoins + 100;
                    
                    console.log(`Vítězem se stává: ${winner} s časem ${maxTime} sekund!`);

                    const notifObj = {
                        text: `${winner} vyhrál minulý týdenní turnaj, minulý týden se učil ${formatTimeText(maxTime)}, dostal 100 catcoinů a trofej, gratulujeme!`,
                        time: Date.now(),
                        read: false,
                        type: 'system'
                    };

                    // Projedeme VŠECHNY hráče: vynulujeme jim čas a pošleme notifikaci
                    for (let username in users) {
                        updates[`users/${username}/weekly_time`] = 0;
                        updates[`users/${username}/current_week`] = thisWeek;
                        
                        // --- OPRAVA: Místo vytváření nového ID přidáme notifikaci lokálně do pole ---
                        let userNotifs = users[username].notifications || [];
                        if (!Array.isArray(userNotifs)) {
                            userNotifs = Object.values(userNotifs);
                        }
                        userNotifs.unshift(notifObj);
                        updates[`users/${username}/notifications`] = userNotifs;
                    }
                } else {
                    // B) Pokud nebyl žádný vítěz (všichni na to celý týden kašlali)
                    for (let username in users) {
                        updates[`users/${username}/weekly_time`] = 0;
                        updates[`users/${username}/current_week`] = thisWeek;
                    }
                }

                // C) Zaregistrujeme, že tento týden je hotový
                updates['global_stats/last_evaluated_week'] = thisWeek;

                // 5. Pošleme to všechno do Firebase najednou
                db.ref().update(updates).then(() => {
                    // Pokud jsi vítěz zrovna ty, musíme ti aktualizovat tvoji obrazovku
                    if (winner === currentUser) {
                        state.trophies = (state.trophies || 0) + 1;
                        state.coins = (state.coins || 0) + 100;
                        state.weekly_time = 0;
                        updateHUD(); // Překreslí počítadlo mincí na obrazovce
                        alert(`🏆 Gratulujeme! Stal ses králem minulého týdne, získáváš trofej a 100 catcoinů!`);
                    } else {
                        // Pokud jsi nevyhrál, jen si vynulujeme lokální čas
                        state.weekly_time = 0;
                    }
                });
            });
        }
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
            saveData(['coins', 'owned_items']);
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
        
        saveData(['equipped_items']);
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

// --- NOVÁ FUNKCE: Přirozený český formát času (např. pro notifikace) ---
function formatTimeText(totalSeconds) {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    let textParts = [];
    if (h > 0) textParts.push(`${h}h`);
    if (m > 0) textParts.push(`${m}m`);
    // Sekundy ukážeme jen tehdy, když se učil méně než minutu, nebo chceme být přesní
    if (s > 0 || textParts.length === 0) textParts.push(`${s}s`);

    return textParts.join(' '); // Vrátí např. "1h 30m" nebo "45s"
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
        lastTickTime = getTrueTime();
        
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
            lastTickTime = getTrueTime();
            return;
        }

        let now = getTrueTime();
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
        
        // Zabráníme "skoku" v čase, když se hráč po pauze vrátí
        lastTickTime = getTrueTime(); 
    }

    // --- NOVÉ: Okamžitý zápis stavu pauzy do paměti mobilu ---
    const savedSession = localStorage.getItem('studywithcici_activesession');
    if (savedSession) {
        const parsedSession = JSON.parse(savedSession);
        parsedSession.isPaused = isPaused;
        parsedSession.lastTickTime = lastTickTime;
        localStorage.setItem('studywithcici_activesession', JSON.stringify(parsedSession));
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
                timestamp: getTrueTime(),
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
    
    // Zabráníme přidání sebe sama nebo prázdného jména
    if (!friendName || friendName === currentUser) return;

    // --- NOVÁ POJISTKA PROTI SPAMU ---
    // Zkontrolujeme, jestli už ho náhodou nemáme v přátelích
    if (state.friends && state.friends[friendName]) {
        alert("Tohoto parťáka už přece sleduješ!");
        document.getElementById('friend-input').value = '';
        return;
    }

    // Zeptáme se databáze, jestli ten člověk vůbec existuje
    db.ref('users/' + friendName).once('value').then((snapshot) => {
        if (snapshot.exists()) {
            if (!state.friends) state.friends = {};
            
            // Přidáme si ho do lokálního stavu
            state.friends[friendName] = true;
            
            // --- NOVÉ: ODESLÁNÍ NOTIFIKACE ---
            // Využijeme tvou už existující funkci
            sendNotificationToUser(friendName, `Hráč ${currentUser} si tě právě přidal/a do přátel! Běž mu ukázat, jak se to dělá!`);
            
            saveData(['friends']);
            document.getElementById('friend-input').value = '';
            renderFriends();
            
            // Dáme hráči vědět, že se to povedlo
            alert(`Úspěšně jsi přidal/a hráče ${friendName} do přátel!`);
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
        
        // Přátele řadíme standardně podle celkového času
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

            // --- STREAKY (Zůstávají v levém horním rohu přes CSS třídu) ---
            const activeStreak = data.active_streak || 'red';
            const streakCount = data.streaks ? data.streaks[activeStreak] || 0 : 0;
            const icons = { red: '🔥', gold: '⭐', diamond: '💎' };
            const streakHtml = `<div class="friend-streak">${icons[activeStreak]} ${streakCount}</div>`;

            // --- TROFEJE (Předěláno na malý odznáček bez absolutní pozice) ---
            const trophiesCount = data.trophies || 0;
            const trophyHtml = `<span style="background: #fff3cd; border: 1px solid #ffeeba; border-radius: 4px; padding: 1px 4px; font-size: 10px; font-weight: bold; color: #333; display: flex; align-items: center; gap: 2px; text-shadow: none; box-shadow: 0 1px 0px #000;">
                <img src="assets/trophy_button.png" style="width: 10px; height: 10px; object-fit: contain;"> ${trophiesCount}
            </span>`;

            const item = document.createElement('div');
            item.className = 'friend-card';
            
            item.onclick = () => showFeed('profile', friendName);
            
            // --- ÚPRAVA HTML: Vložení do flexboxu vedle jména ---
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
                    <div style="display: flex; align-items: center; justify-content: center; gap: 4px;">
                        ${trophyHtml}
                        <span class="friend-name clickable-name">${friendName}</span>
                    </div>
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
        saveData(['friends']);
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
        dateString: getTrueDate().toLocaleString('cs-CZ'),
        likes: {},
        comments: []
    };

    if (!state.posts) state.posts = {};
    state.posts[newPost.timestamp] = newPost;
    
    const actualWeek = getCurrentWeekString();
    if (state.current_week !== actualWeek) {
        state.weekly_time = 0;
        state.current_week = actualWeek;
    }

    state.total_cas += pendingPostData.totalSeconds;
    state.coins += pendingPostData.earnedCoins;
    state.weekly_time += pendingPostData.totalSeconds;
    
    db.ref('users/' + currentUser + '/posts/' + newPost.timestamp).set(newPost).then(() => {
        saveData(['total_cas', 'coins', 'weekly_time', 'current_week', 'daily_time', 'streaks', 'awarded_today', 'last_date']);
        updateHUD();
        document.getElementById('post-create-modal').classList.add('hidden');
        
        if (pendingPostData.earnedCoins > 0) {
            setTimeout(() => alert(`Vydělal sis ${pendingPostData.earnedCoins} grošů a tvůj post byl uložen!`), 100);
        } else {
            setTimeout(() => alert('Učil ses moc krátkou dobu, ale post jsme ti uložili.'), 100);
        }
        pendingPostData = null;
    });
}

function showFeed(type, username = null) {
    currentFeedContext.type = type;
    currentFeedContext.username = username;

    const list = document.getElementById('feed-list');
    const title = document.getElementById('feed-title');
    list.innerHTML = '<p style="text-align:center">Načítám...</p>';
    document.getElementById('feed-modal').classList.remove('hidden');

    if (type === 'profile') {
        db.ref('users/' + username).once('value').then(snapshot => {
            const data = snapshot.val();
            if (!data) return;

            const equipped = data.equipped_items || {};
            const getImage = (itemName, isSkin = false) => {
                if (!itemName) return isSkin ? 'assets/skin_default.png' : '';
                const foundItem = ITEMS.find(i => i.nazev === itemName);
                return foundItem ? foundItem.image : (isSkin ? 'assets/skin_default.png' : '');
            };

            const activeStreak = data.active_streak || 'red';
            const streakCount = data.streaks ? data.streaks[activeStreak] || 0 : 0;
            const icons = { red: '🔥', gold: '⭐', diamond: '💎' };

            title.innerHTML = `
                <div class="profile-header-container">
                    <div class="profile-avatar-big">
                        <img src="${getImage(equipped.skin, true)}" class="p-layer" style="z-index:1;">
                        ${equipped.triko ? `<img src="${getImage(equipped.triko)}" class="p-layer" style="z-index:2;">` : ''}
                        ${equipped.maska ? `<img src="${getImage(equipped.maska)}" class="p-layer" style="z-index:3;">` : ''}
                        ${equipped.obojek ? `<img src="${getImage(equipped.obojek)}" class="p-layer" style="z-index:4;">` : ''}
                        ${equipped.cepice ? `<img src="${getImage(equipped.cepice)}" class="p-layer" style="z-index:5;">` : ''}
                    </div>
                    <div class="profile-stats-info">
                        <h2 style="margin-bottom: 5px; font-size: 28px;">${username}</h2>
                        <p>🏆 Trofeje: <b>${data.trophies || 0}</b></p>
                        <p>Streak: <b>${icons[activeStreak]} ${streakCount}</b></p> 
                        <p>⏱ Odstudováno: <b>${formatTime(data.total_cas || 0)}</b></p>
                    </div>
                </div>
                <div class="profile-tabs">
                    <button id="tab-posts" class="tab-btn active" onclick="switchProfileTab('posts', '${username}')">Příspěvky</button>
                    <button id="tab-market" class="tab-btn" onclick="switchProfileTab('market', '${username}')">Burza</button>
                </div>
            `;
            
            list.innerHTML = '<div id="profile-dynamic-content"></div>';
            switchProfileTab('posts', username);
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
                    posts.forEach(p => p.author = name); 
                    return posts;
                }
                return [];
            });
        });

        Promise.all(fetchPromises).then(results => {
            let allPosts = [];
            results.forEach(arr => allPosts = allPosts.concat(arr));
            allPosts.sort((a, b) => b.timestamp - a.timestamp); 
            const top10 = allPosts.slice(0, 10);
            renderPosts(top10, list, null);
        });
    }
}

function switchProfileTab(tab, username) {
    document.getElementById('tab-posts').classList.toggle('active', tab === 'posts');
    document.getElementById('tab-market').classList.toggle('active', tab === 'market');
    
    const libTab = document.getElementById('tab-library');
    if (libTab) libTab.classList.toggle('active', tab === 'library');
    
    const contentDiv = document.getElementById('profile-dynamic-content');
    contentDiv.innerHTML = '<p style="text-align:center;">Načítám...</p>';

    if (tab === 'posts') {
        db.ref('users/' + username + '/posts').once('value').then(snap => {
            if (snap.exists()) {
                renderPosts(Object.values(snap.val()), contentDiv, username);
            } else {
                contentDiv.innerHTML = '<p style="text-align:center;">Zatím žádné záznamy o učení.</p>';
            }
        });
    } else if (tab === 'market') {
        renderProfileMarket(username, contentDiv);
    } else if (tab === 'library') {
        renderLibrary(contentDiv);
    }
}

function renderProfileMarket(username, container) {
    db.ref('users/' + username + '/market').once('value').then(snap => {
        const items = snap.val() || {};
        const isMyProfile = username === currentUser;
        let html = '';
        
        if (isMyProfile) {
            const count = Object.keys(items).length;
            if (count < 5) html += `<button onclick="openUploadModal()" class="action-button" style="width:100%; margin-bottom: 15px; font-size: 16px; padding: 10px;">+ Přidat nový materiál (Máš ${count}/5)</button>`;
            else html += `<p style="text-align:center; color:red; font-weight:bold;">Dosáhl jsi limitu 5 materiálů.</p>`;
        }

        if (Object.keys(items).length === 0) {
            html += '<p style="text-align:center;">Uživatel zatím nic neprodává.</p>';
        } else {
            html += '<div class="market-grid">';
            for (let id in items) {
                const item = items[id];
                html += `
                    <div class="market-item" onclick="openMaterialDetail('${username}', '${id}')" style="cursor: pointer;">
                        <div class="market-icon">📄</div>
                        <h4 style="margin:5px 0;">${item.name}</h4>
                        <p style="color:#666; font-size: 12px; margin-bottom:10px;">Cena: <b>${item.price} 💰</b></p>
                        <button class="buy-btn">Zobrazit detail</button>
                    </div>
                `;
            }
            html += '</div>';
        }
        container.innerHTML = html;
    });
}

function renderLibrary(container) {
    const boughtFiles = state.boughtItems || {};
    
    db.ref('users/' + currentUser + '/market').once('value').then(snap => {
        const myUploads = snap.val() || {};
        const allMyFiles = { ...boughtFiles, ...myUploads };

        if (Object.keys(allMyFiles).length === 0) {
            container.innerHTML = '<p style="text-align:center;">Zatím nemáš v knihovně žádné materiály.</p>';
            return;
        }

        let html = '<div class="market-grid">';
        for (let id in allMyFiles) {
            const item = allMyFiles[id];
            const seller = item.seller || currentUser; 
            html += `
                <div class="market-item" onclick="openMaterialDetail('${seller}', '${id}')" style="cursor: pointer;">
                    <div class="market-icon">📚</div>
                    <h4 style="margin:5px 0;">${item.name}</h4>
                    <p style="color:#666; font-size: 11px; margin-bottom:10px;">Vlastněno</p>
                    <button class="buy-btn" style="background:#2196F3; color:white;">Rozkliknout</button>
                </div>
            `;
        }
        html += '</div>';
        container.innerHTML = html;
    });
}

function buyMaterial(sellerName, itemId, price, fileUrl, fileName) {
    if (state.boughtItems && state.boughtItems[itemId]) {
        return window.open(fileUrl, '_blank');
    }

    if (state.coins < price) {
        return alert("Nemáš dostatek Catcoinů!");
    }

    confirmAction(`Chceš si koupit '${fileName}' za ${price} 💰?`, async (agreed) => {
        if (agreed) {
            state.coins -= price;
            
            if (!state.boughtItems) state.boughtItems = {};
            state.boughtItems[itemId] = {
                name: fileName,
                url: fileUrl,
                boughtAt: Date.now(),
                seller: sellerName
            };

            saveData(['coins', 'boughtItems']);
            updateHUD();

            db.ref(`users/${sellerName}/coins`).transaction(currentCoins => (currentCoins || 0) + price);
            sendNotificationToUser(sellerName, `Hráč ${currentUser} si koupil tvůj materiál '${fileName}'! Získáváš ${price} 💰.`);

            alert("Nákup úspěšný! Materiál byl přidán do tvé knihovny.");
            window.open(fileUrl, '_blank');
            
            // --- TENTO ŘÁDEK CHYBĚL (Zavře okno s detailem) ---
            document.getElementById('material-detail-modal').classList.add('hidden');
            
            switchProfileTab('market', sellerName);
        }
    });
}

function deleteMaterial(itemId) {
    confirmAction("Opravdu chceš tento materiál z burzy smazat?", (agreed) => {
        if (agreed) {
            db.ref(`users/${currentUser}/market/${itemId}`).remove().then(() => {
                switchProfileTab('market', currentUser);
            });
        }
    });
}

function openUploadModal() {
    document.getElementById('upload-modal').classList.remove('hidden');
    document.getElementById('material-name').value = '';
    document.getElementById('material-desc').value = ''; 
    document.getElementById('material-price').value = '';
    document.getElementById('material-file').value = '';
}

async function submitUpload() {
    const name = document.getElementById('material-name').value.trim();
    const desc = document.getElementById('material-desc').value.trim(); 
    const price = parseInt(document.getElementById('material-price').value);
    const fileInput = document.getElementById('material-file');
    const file = fileInput.files[0];

    if (!name || isNaN(price) || !file) return alert("Vyplň název, cenu i soubor!");
    if (price < 0) return alert("Cena nesmí být záporná!");

    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) return alert("Soubor je moc velký! Maximální velikost je 5 MB.");

    const btn = document.getElementById('submit-upload-btn');
    btn.innerText = "Nahrávám...";
    btn.disabled = true;

    try {
        const fileId = Date.now();
        const storageRef = storage.ref(`market/${currentUser}/${fileId}_${file.name}`);
        
        await storageRef.put(file);
        const downloadUrl = await storageRef.getDownloadURL();

        await db.ref(`users/${currentUser}/market/${fileId}`).set({
            name: name,
            description: desc,
            price: price,
            url: downloadUrl,
            uploadedAt: fileId,
            reviews: {} 
        });

        alert("Materiál byl úspěšně přidán na burzu!");
        document.getElementById('upload-modal').classList.add('hidden');
        switchProfileTab('market', currentUser);
    } catch (error) {
        console.error(error);
        alert("Chyba při nahrávání: " + error.message);
    } finally {
        btn.innerText = "Nahrát";
        btn.disabled = false;
    }
}

// ==========================================
// --- DETAIL MATERIÁLU A RECENZE ---
// ==========================================
let currentReviewVote = null;
let currentReviewSeller = null;
let currentReviewItemId = null;

function openMaterialDetail(sellerName, itemId) {
    db.ref(`users/${sellerName}/market/${itemId}`).once('value').then(snap => {
        let item = snap.val();
        const isBought = state.boughtItems && state.boughtItems[itemId];
        const isMyProfile = sellerName === currentUser;

        // POJISTKA: Pokud materiál v marketu neexistuje (autor ho smazal),
        // ale my ho máme v knihovně, použijeme naše lokální data.
        if (!item && isBought) {
            item = {
                ...state.boughtItems[itemId],
                description: "⚠️ Tento materiál byl autorem smazán z burzy, ale v tvé knihovně stále zůstává, dokud ho neodstraníš.",
                price: state.boughtItems[itemId].price || 0,
                isDeletedByAuthor: true
            };
        }

        if (!item) return alert("Tento materiál už neexistuje ani v tvé knihovně.");

        document.getElementById('material-detail-modal').classList.remove('hidden');
        document.getElementById('md-title').innerText = item.name;
        document.getElementById('md-author').innerText = `Autor: ${sellerName}`;
        document.getElementById('md-desc').innerText = item.description || "Autor k tomuto materiálu nenapsal žádný bližší popis.";

        // Vykreslení hlasů a recenzí (pouze pokud materiál reálně existuje u autora)
        const reviewsContainer = document.getElementById('md-reviews');
        const addReviewBtn = document.getElementById('md-add-review-btn');
        
        if (item.isDeletedByAuthor) {
            document.getElementById('md-up-count').innerText = "-";
            document.getElementById('md-down-count').innerText = "-";
            reviewsContainer.innerHTML = '<p style="color:red; text-align:center; font-style: italic;">Recenze a hodnocení nejsou u smazaného materiálu dostupné.</p>';
            if(addReviewBtn) addReviewBtn.classList.add('hidden');
        } else {
            if(addReviewBtn) addReviewBtn.classList.remove('hidden');
            let upvotesCount = 0;
            let downvotesCount = 0;
            let reviewsHtml = '';
            const reviews = item.reviews || {};

            if (Object.keys(reviews).length > 0) {
                for (let authorName in reviews) {
                    const r = reviews[authorName];
                    if (r.vote === 'up') upvotesCount++;
                    if (r.vote === 'down') downvotesCount++;
                    const voteIcon = r.vote === 'up' ? '👍' : '👎';
                    reviewsHtml += `
                        <div class="md-review-item">
                            <div><span class="md-review-author">${voteIcon} ${authorName}</span> <span class="md-review-date">${r.date}</span></div>
                            ${r.text ? `<div class="md-review-text" style="margin-top:5px; border-left: 2px solid #ccc; padding-left: 8px;">${r.text}</div>` : ''}
                        </div>
                    `;
                }
            } else {
                reviewsHtml = '<p style="color:#888; text-align:center; font-style: italic; padding: 15px 0;">Zatím nikdo materiál nehodnotil.</p>';
            }
            document.getElementById('md-up-count').innerText = upvotesCount;
            document.getElementById('md-down-count').innerText = downvotesCount;
            reviewsContainer.innerHTML = reviewsHtml;
            if(addReviewBtn) addReviewBtn.onclick = () => openReviewModal(sellerName, itemId);
        }

        // Tlačítka akcí
        const actionContainer = document.getElementById('md-action-container');
        if (isMyProfile && !item.isDeletedByAuthor) {
            actionContainer.innerHTML = `
                <div style="display:flex; gap:10px; justify-content:center;">
                    <button onclick="openEditMaterialModal('${itemId}', '${item.name.replace(/'/g, "\\'")}', '${(item.description || '').replace(/'/g, "\\'").replace(/\n/g, '\\n')}', ${item.price});" class="action-button" style="background:#f0ad4e; color:white; width: 50%; padding: 10px;">✏️ Upravit</button>
                    <button onclick="deleteMaterial('${itemId}'); document.getElementById('material-detail-modal').classList.add('hidden');" class="action-button" style="background:#ff4d4d; color:white; width: 50%; padding: 10px;">🗑️ Smazat</button>
                </div>
            `;
        } else if (isBought) {
            actionContainer.innerHTML = `
                <div style="display:flex; gap:10px; justify-content:center;">
                    <button onclick="window.open('${item.url}', '_blank')" class="action-button" style="background:#4CAF50; color:white; width: 60%; padding: 10px;">📂 Otevřít</button>
                    <button onclick="removeBoughtMaterial('${itemId}'); document.getElementById('material-detail-modal').classList.add('hidden');" class="action-button" style="background:#ff4d4d; color:white; width: 40%; padding: 10px;">🗑️ Odebrat</button>
                </div>
            `;
        } else {
            actionContainer.innerHTML = `<button onclick="buyMaterial('${sellerName}', '${itemId}', ${item.price}, '${item.url}', '${item.name}')" class="action-button" style="background:#f7ff6a; width: 100%;">Koupit za ${item.price} 💰</button>`;
        }
    });
}

// --- ODEBRÁNÍ ZAKOUPENÉHO MATERIÁLU Z KNIHOVNY ---
function removeBoughtMaterial(itemId) {
    confirmAction("Opravdu chceš tento materiál zahodit? Pokud ho budeš chtít zpět, budeš ho muset znovu koupit!", (agreed) => {
        if (agreed) {
            if (state.boughtItems && state.boughtItems[itemId]) {
                // Odstraníme z lokálního stavu
                delete state.boughtItems[itemId];
                
                // Uložíme do databáze (přepíše uzel boughtItems bez tohoto ID)
                saveData(['boughtItems']);
                
                alert("Materiál byl odstraněn z tvé knihovny.");
                
                // Refresh zobrazení knihovny, pokud je otevřená
                if (!document.getElementById('player-shop-modal').classList.contains('hidden')) {
                    renderGlobalLibrary();
                }
            }
        }
    });
}

function openReviewModal(sellerName, itemId) {
    if (!currentUser) return alert("Musíš být přihlášený!");
    
    const isBought = state.boughtItems && state.boughtItems[itemId];
    const isMyProfile = sellerName === currentUser;
    if (!isBought && !isMyProfile) {
        return alert("Hodnotit můžeš až po zakoupení materiálu!");
    }

    currentReviewSeller = sellerName;
    currentReviewItemId = itemId;
    currentReviewVote = null;

    // Reset vizuálu okna
    document.getElementById('rev-btn-up').style.background = '#fff';
    document.getElementById('rev-btn-down').style.background = '#fff';
    document.getElementById('rev-text').value = '';

    // Zkusíme načíst, jestli už hráč nehodnotil dříve (aby mohl recenzi upravit)
    db.ref(`users/${sellerName}/market/${itemId}/reviews/${currentUser}`).once('value').then(snap => {
        if (snap.exists()) {
            const existing = snap.val();
            setReviewVote(existing.vote);
            document.getElementById('rev-text').value = existing.text || '';
        }
    });

    document.getElementById('material-detail-modal').classList.add('hidden');
    document.getElementById('review-modal').classList.remove('hidden');
}

function setReviewVote(vote) {
    currentReviewVote = vote;
    document.getElementById('rev-btn-up').style.background = vote === 'up' ? '#e6ffe6' : '#fff';
    document.getElementById('rev-btn-up').style.borderColor = vote === 'up' ? '#4CAF50' : '#000';
    
    document.getElementById('rev-btn-down').style.background = vote === 'down' ? '#ffe6e6' : '#fff';
    document.getElementById('rev-btn-down').style.borderColor = vote === 'down' ? '#ff4d4d' : '#000';
}

function submitReview() {
    if (!currentReviewVote) return alert("Musíš vybrat palec nahoru 👍 nebo dolů 👎!");

    const text = document.getElementById('rev-text').value.trim();
    const review = {
        vote: currentReviewVote,
        text: text,
        date: new Date().toLocaleDateString('cs-CZ')
    };

    const btn = document.getElementById('submit-review-btn');
    btn.disabled = true;
    btn.innerText = "Ukládám...";

    // Uložíme recenzi přímo pod jméno aktuálního hráče
    db.ref(`users/${currentReviewSeller}/market/${currentReviewItemId}/reviews/${currentUser}`).set(review).then(() => {
        alert("Hodnocení úspěšně uloženo!");
        document.getElementById('review-modal').classList.add('hidden');
        openMaterialDetail(currentReviewSeller, currentReviewItemId); // Návrat na detail
        
        if (currentReviewSeller !== currentUser) {
            sendNotificationToUser(currentReviewSeller, `Hráč ${currentUser} ohodnotil tvůj materiál na burze!`);
        }
    }).finally(() => {
        btn.disabled = false;
        btn.innerText = "Uložit";
    });
}

// ==========================================
// --- GLOBÁLNÍ HRÁČSKÁ BURZA A KNIHOVNA ---
// ==========================================
async function renderGlobalMarket() {
    const container = document.getElementById('player-shop-grid');
    container.innerHTML = '<p style="text-align:center; width:100%;">Načítám všechny nabídky na trhu...</p>';
    
    // Zvýraznění záložek
    document.getElementById('btn-ps-latest').classList.add('active');
    document.getElementById('btn-ps-library').classList.remove('active');

    try {
        const snap = await db.ref('users').once('value');
        const users = snap.val() || {};
        let allItems = [];

        // Projdeme všechny uživatele a vysajeme z nich materiály
        for (let uname in users) {
            if (users[uname].market) {
                for (let itemId in users[uname].market) {
                    let item = users[uname].market[itemId];
                    item.id = itemId;
                    item.seller = uname;
                    allItems.push(item);
                }
            }
        }

        // Seřadíme od nejnovějšího
        allItems.sort((a, b) => b.uploadedAt - a.uploadedAt);

        if (allItems.length === 0) {
            container.innerHTML = '<p style="text-align:center; width:100%;">Zatím nikdo do burzy nic nepřidal.</p>';
            return;
        }

        let html = '';
        allItems.forEach(item => {
            html += `
                <div class="market-item" onclick="openMaterialDetail('${item.seller}', '${item.id}')" style="cursor: pointer;">
                    <div class="market-icon">📄</div>
                    <h4 style="margin:5px 0;">${item.name}</h4>
                    <p style="color:#666; font-size: 11px; margin-bottom:5px;">Od: <b>${item.seller}</b></p>
                    <p style="color:#666; font-size: 12px; margin-bottom:10px;">Cena: <b>${item.price} 💰</b></p>
                    <button class="buy-btn">Zobrazit detail</button>
                </div>
            `;
        });
        container.innerHTML = html;
        
    } catch (error) {
        container.innerHTML = '<p style="text-align:center; color:red;">Chyba při načítání burzy.</p>';
    }
}

function renderGlobalLibrary() {
    const container = document.getElementById('player-shop-grid');
    container.innerHTML = '<p style="text-align:center; width:100%;">Načítám tvou knihovnu...</p>';
    
    // Zvýraznění záložek
    document.getElementById('btn-ps-latest').classList.remove('active');
    document.getElementById('btn-ps-library').classList.add('active');

    const boughtFiles = state.boughtItems || {};
    
    db.ref('users/' + currentUser + '/market').once('value').then(snap => {
        const myUploads = snap.val() || {};
        const allMyFiles = { ...boughtFiles, ...myUploads };

        if (Object.keys(allMyFiles).length === 0) {
            container.innerHTML = '<p style="text-align:center; width:100%;">Zatím nemáš v knihovně žádné materiály. Běž si nějaké koupit na burzu!</p>';
            return;
        }

        let html = '';
        for (let id in allMyFiles) {
            const item = allMyFiles[id];
            const seller = item.seller || currentUser; 
            html += `
                <div class="market-item" onclick="openMaterialDetail('${seller}', '${id}')" style="cursor: pointer;">
                    <div class="market-icon">📚</div>
                    <h4 style="margin:5px 0;">${item.name}</h4>
                    <p style="color:#666; font-size: 11px; margin-bottom:10px;">Vlastněno</p>
                    <button class="buy-btn" style="background:#2196F3; color:white;">Rozkliknout</button>
                </div>
            `;
        }
        container.innerHTML = html;
    });
}

// ==========================================
// --- ÚPRAVA MATERIÁLU ---
// ==========================================
function openEditMaterialModal(itemId, currentName, currentDesc, currentPrice) {
    document.getElementById('edit-material-id').value = itemId;
    document.getElementById('edit-material-name').value = currentName;
    document.getElementById('edit-material-desc').value = currentDesc;
    document.getElementById('edit-material-price').value = currentPrice;
    
    document.getElementById('material-detail-modal').classList.add('hidden');
    document.getElementById('edit-material-modal').classList.remove('hidden');
}

async function submitEditMaterial() {
    const itemId = document.getElementById('edit-material-id').value;
    const name = document.getElementById('edit-material-name').value.trim();
    const desc = document.getElementById('edit-material-desc').value.trim();
    const price = parseInt(document.getElementById('edit-material-price').value);

    if (!name || isNaN(price) || price < 0) return alert("Vyplň správně název a cenu!");

    const btn = document.getElementById('submit-edit-btn');
    btn.innerText = "Ukládám...";
    btn.disabled = true;

    try {
        await db.ref(`users/${currentUser}/market/${itemId}`).update({
            name: name,
            description: desc,
            price: price
        });

        alert("Materiál úspěšně upraven!");
        document.getElementById('edit-material-modal').classList.add('hidden');
        
        // Otevřeme znovu ten samý detail, aby se projevily změny
        openMaterialDetail(currentUser, itemId);
        
        // Pokud jsme měli otevřený vlastní profil, tak ho obnovíme
        if (!document.getElementById('feed-modal').classList.contains('hidden') && currentFeedContext.type === 'profile') {
             switchProfileTab('market', currentUser);
        }
    } catch (e) {
        console.error(e);
        alert("Nastala chyba při úpravě.");
    } finally {
        btn.innerText = "Uložit změny";
        btn.disabled = false;
    }
}

function voteMaterial(sellerName, itemId, type) {
    if (!currentUser) return alert("Pro hodnocení musíš být přihlášený!");
    
    const itemRef = db.ref(`users/${sellerName}/market/${itemId}`);
    itemRef.once('value').then(snap => {
        const item = snap.val();
        if (!item) return;

        let upvotes = item.upvotes || {};
        let downvotes = item.downvotes || {};

        if (type === 'up') {
            if (upvotes[currentUser]) { delete upvotes[currentUser]; } 
            else { upvotes[currentUser] = true; delete downvotes[currentUser]; }
        } else {
            if (downvotes[currentUser]) { delete downvotes[currentUser]; } 
            else { downvotes[currentUser] = true; delete upvotes[currentUser]; }
        }

        itemRef.update({ upvotes, downvotes }).then(() => {
            openMaterialDetail(sellerName, itemId); 
        });
    });
}

function addMaterialReview(sellerName, itemId) {
    if (!currentUser) return alert("Musíš být přihlášený!");
    
    const isBought = state.boughtItems && state.boughtItems[itemId];
    const isMyProfile = sellerName === currentUser;
    if (!isBought && !isMyProfile) {
        return alert("Recenzi můžeš napsat až po zakoupení materiálu! (Abychom předešli spamu.)");
    }

    const text = prompt("Napiš svou recenzi na tento materiál:");
    if (!text || !text.trim()) return;

    const review = {
        author: currentUser,
        text: text.trim(),
        date: new Date().toLocaleDateString('cs-CZ')
    };

    const reviewsRef = db.ref(`users/${sellerName}/market/${itemId}/reviews`);
    reviewsRef.once('value').then(snap => {
        const reviews = snap.val() || [];
        reviews.push(review);
        reviewsRef.set(reviews).then(() => {
            openMaterialDetail(sellerName, itemId);
            if (!isMyProfile) {
                sendNotificationToUser(sellerName, `Hráč ${currentUser} napsal novou recenzi k tvému materiálu!`);
            }
        });
    });
}

function showNotifications() {
    if (!state.notifications) state.notifications = [];

    const adminArea = document.getElementById('admin-notification-area');
    const notificationsList = document.getElementById('notifications-list');

    if (adminArea && notificationsList) {
        const isAdminUser = currentUser === 'admin' || currentUser === 'developer' || currentUser === 'Dan real';
        adminArea.style.display = isAdminUser ? 'flex' : 'none';

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
        date: getTrueDate().toLocaleString('cs-CZ'), 
        id: getTrueTime(),                           
        isGlobal: true
    };

    db.ref('users').once('value').then(snapshot => {
        const users = snapshot.val();
        if (!users) return;
        const updates = {};

        Object.keys(users).forEach(username => {
            let userNotifications = users[username].notifications || [];
            if (!Array.isArray(userNotifications)) {
                userNotifications = Object.values(userNotifications);
            }
            userNotifications.unshift({ ...payload, read: false });
            updates[`users/${username}/notifications`] = userNotifications;
        });

        db.ref().update(updates).then(() => {
            if (currentUser === 'admin' || currentUser === 'Dan_admin' || currentUser === 'developer') {
                addLocalNotification('Odesláno všem: ' + payload.text);
            }
            alert('Oznámení odesláno všem uživatelům.');
            renderNotifications();
        }).catch(error => {
            console.error("Chyba při odesílání hromadné zprávy:", error);
            alert("Něco se pokazilo, zkontroluj konzoli.");
        });
    });
}

function editPostTime(timestamp) {
    if (!state.posts || !state.posts[timestamp]) return;
    const post = state.posts[timestamp];

    const oldMinutes = Math.floor(post.totalSeconds / 60);
    const input = prompt(`Tento záznam má aktuálně ${oldMinutes} minut.\nZadej NOVÝ (menší) čas v celých minutách:`);
    if (!input) return; 

    const newMinutes = parseInt(input);
    if (isNaN(newMinutes) || newMinutes < 0) {
        alert("Musíš zadat platné číslo!");
        return;
    }
    if (newMinutes >= oldMinutes) {
        alert("Čas můžeš pouze snížit, abys opravil chybu. Zvyšovat čas nelze!");
        return;
    }

    const oldSeconds = post.totalSeconds;
    const newSeconds = newMinutes * 60;
    const diffSeconds = oldSeconds - newSeconds;

    const oldCoins = post.earnedCoins !== undefined ? post.earnedCoins : Math.floor(oldSeconds / 180);
    const newCoins = Math.floor(newSeconds / 180);
    const diffCoins = oldCoins - newCoins;

    post.totalSeconds = newSeconds;
    post.earnedCoins = newCoins;
    post.description = (post.description || "") + `\n(Upraveno: sníženo z ${oldMinutes} min)`;

    state.total_cas = Math.max(0, (state.total_cas || 0) - diffSeconds);
    state.coins = Math.max(0, (state.coins || 0) - diffCoins);

    const postWeek = getCurrentWeekString(parseInt(timestamp));
    const thisWeek = getCurrentWeekString();
    if (postWeek === thisWeek) {
        state.weekly_time = Math.max(0, (state.weekly_time || 0) - diffSeconds);
    }

    const today = new Date().toDateString();
    const postDate = new Date(parseInt(timestamp)).toDateString();
    if (today === postDate) {
        state.daily_time = Math.max(0, (state.daily_time || 0) - diffSeconds);
    }

    saveData(['posts', 'total_cas', 'weekly_time', 'daily_time', 'coins']);
    updateHUD();
    showFeed(currentFeedContext.type, currentFeedContext.username);
    alert(`Úspěšně opraveno! Čas byl snížen o ${Math.floor(diffSeconds / 60)} minut a bylo ti odečteno ${diffCoins} catcoinů.`);
}

function formatCommentText(text, validTags) {
    let safeText = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    if (!validTags || validTags.length === 0) return safeText;

    validTags.forEach(tag => {
        const regex = new RegExp(`@${tag}(?=\\s|$)`, 'g');
        safeText = safeText.replace(regex, `<span class="tagged-user clickable-name" onclick="event.stopPropagation(); showFeed('profile', '${tag}')">@${tag}</span>`);
    });
    
    return safeText;
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
        
        const isAuthor = (author === currentUser);

        const div = document.createElement('div');
        div.className = 'post-card';
        div.innerHTML = `
            <div class="post-header">
                <span class="post-author clickable-name" onclick="showFeed('profile', '${author}')">${author}</span>
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
                    <img class="comment-icon" src="assets/comment.png" alt="comment" width="18" height="18">
                    <span class="count">${commentsCount}</span>
                </button>
                
                ${isAuthor ? `<button class="edit-btn action-button" style="padding: 6px 8px; font-size:14px; background-color: #f0ad4e;">✏️ Snížit čas</button>` : ''}
            </div>
            <div class="post-comments" style="margin-top: 8px; padding-left: 8px; border-left: 2px solid #ddd;">
                ${post.comments && post.comments.length ? post.comments.map(c => `<div style="margin-bottom:4px;"><strong class="clickable-name" onclick="showFeed('profile', '${c.author}')">${c.author}:</strong> ${c.text}</div>`).join('') : '<p style="opacity:0.7;">Žádné komentáře.</p>'}
            </div>
        `;

        const likeBtn = div.querySelector('.like-btn');
        const commentBtn = div.querySelector('.comment-btn');
        const editBtn = div.querySelector('.edit-btn');

        likeBtn.addEventListener('click', e => {
            e.stopPropagation();
            toggleLike(author, post.timestamp);
        });

        commentBtn.addEventListener('click', e => {
            e.stopPropagation();
            addComment(author, post.timestamp);
        });

        if (editBtn) {
            editBtn.addEventListener('click', e => {
                e.stopPropagation();
                editPostTime(post.timestamp);
            });
        }

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
    const likeRef = db.ref('users/' + author + '/posts/' + timestamp + '/likes');
    
    likeRef.once('value').then(snapshot => {
        const likes = snapshot.val() || {};

        if (likes[currentUser]) {
            delete likes[currentUser];
        } else {
            likes[currentUser] = true;
        }

        likeRef.set(likes).then(() => {
            if (author === currentUser && state.posts && state.posts[timestamp]) {
                state.posts[timestamp].likes = likes;
            }
            if (likes[currentUser] && author !== currentUser) {
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
    const text = prompt('Napiš komentář (můžeš použít @jmeno pro označení parťáka):', '');
    if (!text || !text.trim()) return;

    const commentText = text.trim();
    const mentions = commentText.match(/@([^\s]+)/g) || [];
    const potentialTags = mentions.map(m => m.substring(1));

    const tagPromises = potentialTags.map(tag => {
        return db.ref('users/' + tag).once('value').then(snap => snap.exists() ? tag : null);
    });

    Promise.all(tagPromises).then(results => {
        const validTags = results.filter(tag => tag !== null);

        const comment = {
            author: currentUser,
            text: commentText,
            date: new Date().toLocaleString('cs-CZ'), 
            validTags: validTags
        };

        const commentsRef = db.ref('users/' + author + '/posts/' + timestamp + '/comments');
        commentsRef.once('value').then(snapshot => {
            const comments = snapshot.val() || [];
            comments.push(comment);

            commentsRef.set(comments).then(() => {
                if (author === currentUser && state.posts && state.posts[timestamp]) {
                    state.posts[timestamp].comments = comments;
                }
                validTags.forEach(taggedUser => {
                    if (taggedUser !== currentUser) {
                        sendNotificationToUser(taggedUser, `${currentUser} tě označil/a v komentáři: "${commentText}"`);
                    }
                });
                const authorMentioned = validTags.includes(author);
                if (author !== currentUser && !authorMentioned) {
                    sendNotificationToUser(author, `${currentUser} ti napsal/a komentář: "${commentText}"`);
                }
                showFeed(currentFeedContext.type, currentFeedContext.username);
            });
        });
    });
}

function setupEventListeners() {
    document.getElementById('login-btn').addEventListener('click', loginUser);
    document.getElementById('register-link').addEventListener('click', registerUser);

    const loginFields = ['username-input', 'password-input'];
    loginFields.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') loginUser();
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

    document.getElementById('study-mode').addEventListener('change', (e) => {
        const pomodoroSettings = document.getElementById('pomodoro-settings');
        if (e.target.value === 'pomodoro') pomodoroSettings.classList.remove('hidden');
        else pomodoroSettings.classList.add('hidden');
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
            if (e.target.hasAttribute('data-category')) {
                currentShopCategory = e.target.getAttribute('data-category');
                renderShop(currentShopCategory);
            }
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
    
    document.getElementById('open-leaderboard-btn').addEventListener('click', () => showLeaderboard('weekly'));
    document.getElementById('btn-lb-weekly').addEventListener('click', () => showLeaderboard('weekly'));
    document.getElementById('btn-lb-alltime').addEventListener('click', () => showLeaderboard('alltime'));
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
        saveData(['active_streak']); 
        updateHUD(); 
    });

    document.getElementById('save-post-btn').addEventListener('click', savePost);
    document.getElementById('open-feed-btn').addEventListener('click', () => showFeed('friends'));
    document.getElementById('open-notifications-btn').addEventListener('click', () => showNotifications());
    document.getElementById('close-feed-btn').addEventListener('click', () => document.getElementById('feed-modal').classList.add('hidden'));
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

    const cancelUploadBtn = document.getElementById('cancel-upload-btn');
    if (cancelUploadBtn) {
        cancelUploadBtn.addEventListener('click', () => document.getElementById('upload-modal').classList.add('hidden'));
    }

    const submitUploadBtn = document.getElementById('submit-upload-btn');
    if (submitUploadBtn) {
        submitUploadBtn.addEventListener('click', submitUpload);
    }

    const closeMaterialBtn = document.getElementById('close-material-btn');
    if (closeMaterialBtn) {
        closeMaterialBtn.addEventListener('click', () => document.getElementById('material-detail-modal').classList.add('hidden'));
    }

    const globalNotifTextarea = document.getElementById('global-notif-text');
    if (globalNotifTextarea) {
        globalNotifTextarea.addEventListener('input', () => {
            globalNotifTextarea.style.height = 'auto';
            globalNotifTextarea.style.height = `${globalNotifTextarea.scrollHeight}px`;
        });
    }
    
    document.addEventListener('visibilitychange', async () => {
        if (wakeLock !== null && document.visibilityState === 'visible') zapniWakeLock();
    });
    // --- HRÁČSKÁ BURZA A ÚPRAVY ---
    document.getElementById('open-player-shop-btn').addEventListener('click', () => {
        document.getElementById('player-shop-modal').classList.remove('hidden');
        renderGlobalMarket();
    });

    document.getElementById('close-player-shop-btn').addEventListener('click', () => {
        document.getElementById('player-shop-modal').classList.add('hidden');
    });

    document.getElementById('btn-ps-latest').addEventListener('click', renderGlobalMarket);
    document.getElementById('btn-ps-library').addEventListener('click', renderGlobalLibrary);

    document.getElementById('cancel-edit-btn').addEventListener('click', () => {
        document.getElementById('edit-material-modal').classList.add('hidden');
    });
    
    document.getElementById('submit-edit-btn').addEventListener('click', submitEditMaterial);

    // --- RECENZE MATERIÁLŮ ---
    const cancelReviewBtn = document.getElementById('cancel-review-btn');
    if (cancelReviewBtn) {
        cancelReviewBtn.addEventListener('click', () => {
            document.getElementById('review-modal').classList.add('hidden');
            // Vrátíme se zpět na detail materiálu
            openMaterialDetail(currentReviewSeller, currentReviewItemId);
        });
    }

    const submitReviewBtn = document.getElementById('submit-review-btn');
    if (submitReviewBtn) {
        submitReviewBtn.addEventListener('click', submitReview);
    }

    const revBtnUp = document.getElementById('rev-btn-up');
    if (revBtnUp) {
        revBtnUp.addEventListener('click', () => setReviewVote('up'));
    }

    const revBtnDown = document.getElementById('rev-btn-down');
    if (revBtnDown) {
        revBtnDown.addEventListener('click', () => setReviewVote('down'));
    }
}

window.onload = init;

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(registration => {
                console.log('PWA zaregistrováno.');
                registration.update(); 
                setInterval(() => { registration.update(); }, 1000 * 60 * 60);
            })
            .catch(error => console.error('Chyba registrace PWA:', error));

        let refreshing = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (!refreshing) {
                const isStudying = !document.getElementById('study-modal').classList.contains('hidden');
                const isPosting = !document.getElementById('post-create-modal').classList.contains('hidden');
                
                if (!isStudying && !isPosting) {
                    window.location.reload();
                    refreshing = true;
                }
            }
        });
    });
}

let deferredPrompt;
const pwaInstallOverlay = document.getElementById('pwa-install-overlay');
const btnInstallPwa = document.getElementById('btn-install-pwa');
const btnSkipInstall = document.getElementById('btn-skip-install');

function isIos() { return /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase()); }
function isStandalone() {
    return (window.matchMedia('(display-mode: standalone)').matches) || 
           (window.matchMedia('(display-mode: fullscreen)').matches) || 
           (window.navigator.standalone === true);
}

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    pwaInstallOverlay.classList.remove('hidden');
});

window.addEventListener('load', () => {
    if (isIos() && !isStandalone()) pwaInstallOverlay.classList.remove('hidden');
});

if (btnInstallPwa) {
    btnInstallPwa.addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            await deferredPrompt.userChoice;
            deferredPrompt = null;
            pwaInstallOverlay.classList.add('hidden');
        } else if (isIos()) {
            alert("Pro instalaci na iPhone/iPad:\n\n1. Klikni dole (nebo nahoře) v Safari na ikonu sdílení (čtvereček se šipkou).\n2. Vyber možnost 'Přidat na plochu'.");
        }
    });
}

if (btnSkipInstall) {
    btnSkipInstall.addEventListener('click', () => pwaInstallOverlay.classList.add('hidden'));
}

window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    if(pwaInstallOverlay) pwaInstallOverlay.classList.add('hidden');
});