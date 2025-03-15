# Thrive X Production Wizard

Un sistema completo per la gestione integrata dei processi produttivi, organizzativi, amministrativi e contabili conforme ai requisiti della Transizione 4.0.

## Caratteristiche principali

- **Dashboard produzione** - Panoramica visiva dello stato della produzione
- **Gestione ordini** - Creazione, tracking e gestione dello stato degli ordini
- **Sistema di listino e preventivi** - Gestione dei prezzi e creazione preventivi
- **Gestione risorse e operatori** - Assegnazione incarichi e monitoraggio attività
- **Pianificazione consegne** - Calcolo e gestione dei tempi di consegna

## Requisiti di sistema

- [Node.js](https://nodejs.org/) (versione 14.x o superiore)
- [MongoDB](https://www.mongodb.com/) (versione 4.x o superiore)
- NPM (versione 6.x o superiore, incluso con Node.js)

## Guida rapida all'installazione

### 1. Clona il repository

```bash
git clone https://github.com/tuorepository/thrive-x-production-wizard.git
cd thrive-x-production-wizard
```

### 2. Installazione dipendenze

Installa le dipendenze per il backend:

```bash
cd server
npm install
```

Installa le dipendenze per il frontend:

```bash
cd ../client
npm install
```

### 3. Configurazione

Crea un file `.env` nella cartella `server` con il seguente contenuto:

```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/thrive-x-wizard
JWT_SECRET=il_tuo_secret_jwt_sicuro
```

Assicurati di sostituire `il_tuo_secret_jwt_sicuro` con una stringa casuale sicura.

### 4. Inizializzazione del database

Prima di avviare l'applicazione, puoi inizializzare il database con dati di esempio:

```bash
cd server
node config/seedData.js
```

Lo script creerà un utente amministratore, alcuni prodotti, operatori, un ordine di esempio e relative attività.

### 5. Avvio dell'applicazione

#### Modalità sviluppo

Avvia il server backend:

```bash
cd server
npm run dev
```

In un nuovo terminale, avvia il client React:

```bash
cd client
npm start
```

L'applicazione sarà disponibile all'indirizzo [http://localhost:3000](http://localhost:3000).

Puoi accedere con le credenziali create dallo script di seed:

- Email: admin@thrivex.com
- Password: password123

#### Modalità produzione

Per la modalità produzione, devi prima compilare il frontend:

```bash
cd client
npm run build
```

Poi avviare il server:

```bash
cd ../server
npm start
```

## Struttura del progetto

```
thrive-x-production-wizard/
├── client/                  # Frontend React
│   ├── public/              # File statici
│   └── src/
│       ├── components/      # Componenti UI riutilizzabili
│       ├── pages/           # Pagine dell'applicazione
│       ├── context/         # Context API per stato globale
│       ├── services/        # Chiamate API
│       └── utils/           # Funzioni di utilità
├── server/                  # Backend Node.js/Express
│   ├── config/              # Configurazioni
│   ├── controllers/         # Logica di business
│   ├── middleware/          # Middleware Express
│   ├── models/              # Modelli MongoDB
│   └── routes/              # Routing API
└── README.md                # Documentazione
```

## Funzionalità dettagliate

### Gestione Ordini
- Creazione e monitoraggio degli ordini dei clienti
- Tracking dello stato degli ordini
- Calcolo automatico dei prezzi e delle tempistiche
- Assegnazione priorità e gestione delle scadenze

### Gestione Prodotti
- Catalogo prodotti con dettagli completi
- Previsione dei tempi di produzione
- Gestione dei materiali necessari

### Gestione Operatori
- Assegnazione degli incarichi agli operatori
- Monitoraggio del carico di lavoro
- Tracciamento delle competenze e disponibilità

### Gestione Attività
- Creazione automatica di attività basate sugli ordini
- Tracciamento dello stato di avanzamento
- Registrazione delle ore lavorate
- Monitoraggio dei tempi effettivi vs stimati

## Sviluppato per Thrive X SRL

Questo software è stato sviluppato specificamente per supportare i processi produttivi di Thrive X SRL in conformità ai requisiti del Piano Nazionale Transizione 4.0.
