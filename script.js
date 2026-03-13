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
    
    // Trika
    { nazev: 'Doktor outfit', typ: 'triko', cena: 800, image: 'assets/triko_doktor.png' },
    { nazev: 'Triko růžové', typ: 'triko', cena: 60, image: 'assets/triko_ruzove.png' },
    
    // Masky
    { nazev: 'Gangster kukla', typ: 'maska', cena: 60, image: 'assets/maska_gangster.png' },
    
    // Obojky
    { nazev: 'Mašlička růžová', typ: 'obojek', cena: 40, image: 'assets/obojek_masle.png' },
    { nazev: 'Perličky', typ: 'obojek', cena: 100, image: 'assets/obojek_perlicky.png' },
    
    // Čepice
    { nazev: 'Hello kitty mašle', typ: 'cepice', cena: 200, image: 'assets/cepice_hello-kitty.png' },
    { nazev: 'Jindřich ze Skalice', typ: 'cepice', cena: 200, image: 'assets/cepice_jindra.png' },
    { nazev: 'Královská koruna', typ: 'cepice', cena: 500, image: 'assets/cepice_koruna.png' }
];

// --- STAV APLIKACE (STATE) ---
let currentUser = null; 
let allUsers = {};      

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
    }
};

let state = JSON.parse(JSON.stringify(DEFAULT_STATE)); 

let studyInterval = null;
let studySeconds = 0;
let currentShopCategory = 'skin';

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

function loginUser() {
    const usernameInput = document.getElementById('username-input');
    const passwordInput = document.getElementById('password-input');
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    localStorage.setItem('studywithcici_remembered_user', username);
    localStorage.setItem('studywithcici_remembered_pass', password);

    if (username === "" || password === "") {
        alert("Musíš zadat jméno i heslo!");
        return;
    }

    const loginBtn = document.getElementById('login-btn');
    loginBtn.innerText = "Ověřuji...";
    loginBtn.disabled = true;

    currentUser = username;

    db.ref('users/' + currentUser).once('value')
        .then((snapshot) => {
            if (snapshot.exists()) {
                const userData = snapshot.val();
                
                // KONTROLA HESLA
                if (userData.password === password) {
                    state = userData;
                } else {
                    alert("Špatné heslo pro tohoto uživatele!");
                    loginBtn.innerText = "Vstoupit";
                    loginBtn.disabled = false;
                    return; 
                }
            } else {
                // NOVÝ HRÁČ - Registrace
                state = JSON.parse(JSON.stringify(DEFAULT_STATE));
                state.password = password; 
                saveData();
            }

            document.getElementById('login-modal').classList.add('hidden');
            loginBtn.innerText = "Vstoupit";
            loginBtn.disabled = false;
            
            updateHUD();
            updateCharacter();
        })
        .catch((error) => {
            alert("Chyba: " + error.message);
            loginBtn.disabled = false;
        });
}

// --- VYKRESLOVÁNÍ (UI) ---
function updateHUD() {
    document.getElementById('player-name-display').innerText = currentUser;
    document.getElementById('coin-count').innerText = state.coins;
    
    const hours = Math.floor(state.total_cas / 3600);
    const minutes = Math.floor((state.total_cas % 3600) / 60);
    const seconds = state.total_cas % 60;
    document.getElementById('total-time-display').innerText = `${hours} hodin ${minutes} minut a ${seconds} sekund`;
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
                total_cas: data[name].total_cas || 0
            });
        }

        usersArray.sort((a, b) => b.total_cas - a.total_cas);

        list.innerHTML = '';
        usersArray.slice(0, 10).forEach((user, index) => {
            const item = document.createElement('div');
            item.className = 'leaderboard-item';
            item.innerHTML = `
                <span class="rank">${index + 1}.</span>
                <span class="p-name">${user.name}</span>
                <span class="p-time">${formatTime(user.total_cas)}</span>
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

function startStudy() {
    studySeconds = 0;
    document.getElementById('current-study-timer').innerText = "00:00:00";
    document.getElementById('study-modal').classList.remove('hidden');

    studyInterval = setInterval(() => {
        studySeconds++;
        document.getElementById('current-study-timer').innerText = formatTime(studySeconds);
    }, 1000);
}

function stopStudy() {
    const earnedCoins = Math.floor(studySeconds / 180); 
    
    confirmAction('Opravdu se chceš přestat učit?', (agreed) => {
        if (agreed) {
            clearInterval(studyInterval);
            document.getElementById('study-modal').classList.add('hidden');
            
            state.total_cas += studySeconds;
            state.coins += earnedCoins;
            saveData();
            updateHUD();

            if (earnedCoins > 0) {
                setTimeout(() => alert(`Vydělal sis ${earnedCoins} grošů, krásná práce!`), 100);
            } else {
                setTimeout(() => alert('Učil ses bohužel moc krátkou dobu :('), 100);
            }
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
            const equipped = data.equipped_items || {}; // Změněno na equipped_items

            // TADY JE TA MAGIE: Hledáme cestu k obrázku v ITEMS podle názvu z databáze
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

            const item = document.createElement('div');
            item.className = 'friend-card';
            
            item.innerHTML = `
                <div class="mini-cici">
                    <img src="${skinSrc}" alt="Skin" style="z-index: 1;">
                    ${trikoSrc ? `<img src="${trikoSrc}" style="z-index: 2;">` : ''}
                    ${maskaSrc ? `<img src="${maskaSrc}" style="z-index: 3;">` : ''}
                    ${obojekSrc ? `<img src="${obojekSrc}" style="z-index: 4;">` : ''}
                    ${cepiceSrc ? `<img src="${cepiceSrc}" style="z-index: 5;">` : ''}
                </div>
                
                <div class="friend-info">
                    <span class="friend-name">${friendName}</span>
                    <span class="friend-time">⏱ ${formatTime(data.total_cas || 0)}</span>
                </div>
                
                <button class="remove-friend-btn" onclick="removeFriend('${friendName}')" title="Odebrat">❌</button>
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

// --- EVENT LISTENERY ---
function setupEventListeners() {

    document.getElementById('login-btn').addEventListener('click', loginUser);
    
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

    document.getElementById('start-study-btn').addEventListener('click', startStudy);
    document.getElementById('stop-study-btn').addEventListener('click', stopStudy);

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
}

// Spuštění po načtení stránky
window.onload = init;


// --- REGISTRACE SERVICE WORKERA (PWA) ---
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(registration => {
                console.log('PWA Service Worker úspěšně zaregistrován s rozsahem:', registration.scope);
            })
            .catch(error => {
                console.error('Registrace Service Workera selhala:', error);
            });
    });
}