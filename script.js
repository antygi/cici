// --- FIREBASE INICIALIZACE ---
const firebaseConfig = {
    apiKey: "AIzaSyDO8ufRx3EwctJ6RjngvMzMlDpLfUjsuTg",
    authDomain: "study-with-cici-43671.firebaseapp.com",
    projectId: "study-with-cici-43671",
    // TADY JE TA OPRAVA: Přidáme přesnou adresu tvé databáze
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
let currentUser = null; // Kdo je zrovna přihlášený
let allUsers = {};      // Naše lokální "databáze" všech hráčů

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

// Aktuální stav (bude se přepisovat při přihlášení)
let state = JSON.parse(JSON.stringify(DEFAULT_STATE)); 

let studyInterval = null;
let studySeconds = 0;
let currentShopCategory = 'skin';

// --- INICIALIZACE ---
function init() {
    // Při spuštění nenačítáme HUD, protože ještě nevíme, kdo hraje!
    setupEventListeners();
}


// --- UKLÁDÁNÍ A NAČÍTÁNÍ (localStorage) ---
// --- DATABÁZE A PŘIHLAŠOVÁNÍ ---


// --- DATABÁZE A PŘIHLAŠOVÁNÍ (FIREBASE CLOUD) ---

function saveData() {
    if (!currentUser) return; 
    
    // Uloží aktuální state rovnou do cloudu pod jméno uživatele
    db.ref('users/' + currentUser).set(state);
}

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
                    return; // Zastavíme přihlášení
                }
            } else {
                // NOVÝ HRÁČ - Registrace
                state = JSON.parse(JSON.stringify(DEFAULT_STATE));
                state.password = password; // Uložíme heslo do jeho nového profilu
                saveData();
            }

            // Pokud vše sedí, pustíme ho dál
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
    // Vypíše jméno aktuálního hráče
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
        const equippedName = state.equipped_items[typ];
        
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

    // Stáhneme celou větev "users"
    db.ref('users').once('value').then((snapshot) => {
        const data = snapshot.val();
        if (!data) return;

        // Převedeme objekt na pole, abychom ho mohli seřadit
        let usersArray = [];
        for (let name in data) {
            usersArray.push({
                name: name,
                total_cas: data[name].total_cas || 0
            });
        }

        // Seřadíme od největšího času po nejmenší
        usersArray.sort((a, b) => b.total_cas - a.total_cas);

        // Vykreslíme TOP 10
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
    grid.innerHTML = ''; // Vyčištění

    const filteredItems = ITEMS.filter(item => item.typ === category);

    // Najdeme aktuálně vybavený skin pro podklad (bude se hodit u triček, čepic atd.)
    const currentSkinItem = ITEMS.find(i => i.nazev === state.equipped_items.skin);
    const skinImageSrc = currentSkinItem ? currentSkinItem.image : 'assets/skin_default.png';

    filteredItems.forEach(item => {
        const isOwned = state.owned_items.includes(item.nazev);
        const isEquipped = state.equipped_items[item.typ] === item.nazev;

        const div = document.createElement('div');
        div.className = `shop-item ${isEquipped ? 'equipped' : ''} ${isOwned && !isEquipped ? 'owned' : ''}`;
        
        let statusText = item.cena + ' 💰';
        if (isEquipped) statusText = 'Nasazeno';
        else if (isOwned) statusText = 'Vlastněno';

        // Tady se rozhodneme, jestli pod item vykreslíme i skin
        let imageHtml = '';
        if (category === 'skin') {
            // Pokud jsme ve skinech, ukážeme jen ten daný skin
            imageHtml = `<img src="${item.image}" class="item-main-img" alt="${item.nazev}">`;
        } else {
            // Jinak vykreslíme základní skin jako podklad a přes něj teprve ten předmět
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
    const isOwned = state.owned_items.includes(item.nazev);
    const isEquipped = state.equipped_items[item.typ] === item.nazev;

    if (!isOwned) {
        // Nákup
        if (state.coins >= item.cena) {
            state.coins -= item.cena;
            state.owned_items.push(item.nazev);
            saveData();
            updateHUD();
            renderShop(currentShopCategory);
        } else {
            alert('Nedostatek coinů!'); // Můžeš nahradit vlastním modálem
        }
    } else {
        // Nasazování / Sundávání
        if (isEquipped) {
            // Sundat (pokud to není skin, skin musí být vždy)
            if (item.typ !== 'skin') {
                state.equipped_items[item.typ] = null;
            } else {
                state.equipped_items.skin = 'Cici default';
            }
        } else {
            // Nasadit
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
    // 1 coin za 180 sekund (3 minuty) jako v Pythonu
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

// --- EVENT LISTENERY ---
function setupEventListeners() {

    // Přihlášení - kliknutí na tlačítko
    document.getElementById('login-btn').addEventListener('click', loginUser);
    
    // Přihlášení - zmáčknutí Enteru (v obou políčkách)
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

    // Odhlášení
    document.getElementById('logout-btn').addEventListener('click', () => {
        saveData(); // Pro jistotu před odhlášením vše uložíme
        location.reload(); // F5 v kódu: Nejčistší způsob, jak apku zresetovat na přihlašovací obrazovku
    });
    
    // Aby to fungovalo i na zmáčknutí Enteru v textovém poli
    document.getElementById('username-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            loginUser();
        }
    });

    // Start studia
    document.getElementById('start-study-btn').addEventListener('click', startStudy);
    document.getElementById('stop-study-btn').addEventListener('click', stopStudy);

    // Obchod
    document.getElementById('open-shop-btn').addEventListener('click', () => {
        renderShop(currentShopCategory);
        document.getElementById('shop-modal').classList.remove('hidden');
    });

    document.getElementById('close-shop-btn').addEventListener('click', () => {
        document.getElementById('shop-modal').classList.add('hidden');
    });

    // Záložky v obchodě
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Odeber active třídu všem
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            // Přidej kliknutému
            e.target.classList.add('active');
            
            currentShopCategory = e.target.getAttribute('data-category');
            renderShop(currentShopCategory);
        });
    });

    // Potvrzovací dialog (Ano / Ne)
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

