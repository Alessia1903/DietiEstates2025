const notifications = [
    { icon: 'fa-home', text: 'Nuovo annuncio in linea con le tue preferenze', subtext: 'In Vendita in Via Francesco Cilea 83, Napoli, Napoli' },
    { icon: 'fa-calendar-check', text: 'La tua richiesta di visita è stata accettata', subtext: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { icon: 'fa-times-circle', text: 'La tua richiesta di visita non è stata accettata', subtext: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { icon: 'fa-home', text: 'Nuovo annuncio in linea con le tue preferenze', subtext: 'In Vendita in Via Francesco Cilea 83, Napoli, Napoli' },
    { icon: 'fa-calendar-check', text: 'La tua richiesta di visita è stata accettata', subtext: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { icon: 'fa-times-circle', text: 'La tua richiesta di visita non è stata accettata', subtext: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' }
];

let currentPage = 0;
const itemsPerPage = 3;

function renderNotifications() {
    const container = document.getElementById('notifications');
    container.innerHTML = '';
    const start = currentPage * itemsPerPage;
    const end = start + itemsPerPage;
    notifications.slice(start, end).forEach(notif => {
        const div = document.createElement('div');
        div.className = 'notification';
        div.innerHTML = `<i class="fas ${notif.icon}"></i><div><strong>${notif.text}</strong><br>${notif.subtext}</div>`;
        container.appendChild(div);
    });
}

function prevPage() {
    if (currentPage > 0) {
        currentPage--;
        renderNotifications();
    }
}

function nextPage() {
    if ((currentPage + 1) * itemsPerPage < notifications.length) {
        currentPage++;
        renderNotifications();
    }
}

document.addEventListener('DOMContentLoaded', renderNotifications);
