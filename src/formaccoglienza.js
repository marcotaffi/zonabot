//import  DialogoForm  from '../utils/bot/dialogoform.js';


/*
La classe FormAccoglienza estende DialogoForm e specifica un particolare flusso di domande per l'accoglienza.
Inizializza un array di domande specifiche e uno stato associato a ciascuna domanda. 
Definisce le condizioni che determinano le transizioni tra le domande in base alle risposte dell'utente. 
FormAccoglienza ha un array di domande da passare a DialogoForm.

I principali metodi includono:
    constructor: Inizializza l'istanza di FormAccoglienza.
    initializeDomande: Inizializza l'array di domande specifiche per il form di accoglienza e chiama initializeStati per impostare gli stati del dialogo.
*/



const domande = [
  {
    nome: "Inizio", //0
    domandatesto: "Ecco il questionario per l'accoglienza.",
    opzioni: ["INIZIA"],
    condizioni: null,
  },

  {
    nome: "Affidatari", //1
    domandatesto: "Sei attualmente famiglia affidataria o casa famiglia?",
    opzioni: ["SI", "NO"],
    condizioni: null,
  },
 {
    nome: "Corso", //2
    domandatesto: "Hai già frequentato un corso affido?",
    opzioni: ["SI", "NO"],
    condizioni: 
      {
        numeroStato: 1,
        valore: 2
      }
    
  },
  {
    nome: "Servizi", //3
    domandatesto: "hai già effettuato il percorso di conoscenza presso un CASF (Centro affido e solidarietà familiare)?",
    opzioni: ["SI", "NO"],
    condizioni: 
      {
        numeroStato: 2,
        valore: 1
      }
    
  },
  {
    nome: "Minori", //4
    domandatesto: "In questo momento saresti disponibile all’ accoglienza di un minore?",
    opzioni: ["SI", "NO"],
    condizioni: null
  },
  {
    nome: "Residenziale", //5
    domandatesto: "Saresti dunque disponibile per un affido di tipo residenziale?",
    opzioni: ["SI", "NO"],
    condizioni: 
      {
        numeroStato: 4,
        valore: 1
      }
    
  },
  {
    nome: "Diurno", //6
    domandatesto: "Saresti disponibile per un affido diurno?",
    opzioni: ["SI", "NO"],
    condizioni: 
      {
        numeroStato: 4,
        valore: 1
      }
    
  },
  {
    nome: "Età", //7
    domandatesto: "Quale fascia di età potresti accogliere? (ad esempio: neonati, bambini, preadolescenti, adolescenti, tutti",
    opzioni: [],
     /*[
      "Prima infanzia 0-36 mesi",
      "Seconda infanzia 3-6 anni",
      "Terza infanzia 6-9 anni",
      "Pre-adolescenza 9-12 anni",
      "Adolescenza 12-17 anni"
    ],*/
    condizioni: 
      {
        numeroStato: 4,
        valore: 1
      }
    
  },
  {
    nome: "Sinedie", //8 TOGLIERE
    domandatesto: "Puoi dare disponibilità per l’accoglienza di un minore sine die, ossia senza limiti di tempo?",
    opzioni: ["SI", "NO"],
    condizioni: 
      {
        numeroStato: 4,
        valore: 1
      }
    
  },
  {
    nome: "Disabilità", //9
    domandatesto: "Puoi dare disponibilità per l’accoglienza di un minore con disabilità?",
    opzioni: ["SI", "NO"],
    condizioni: 
      {
        numeroStato: 4,
        valore: 1
      }
    
  },
  {
    nome: "Livello", //10
    domandatesto: "Che livello di disabilità ti senti di affrontare?",
    opzioni: [
      "Disabilità lieve",
      "Disabilità media",
      "Disabilità grave"
    ],
    condizioni: 
      {
        numeroStato: 9,
        valore: 1
      }
    
  },
  {
    nome: "Deficit", //11
    domandatesto: "Quali tipi di deficit ti senti di affrontare? (Ad esempio: fisici, cognitivi, comportamentali, tutti",
    opzioni: [],
    /* [
      "Deficit fisici",
      "Deficit cognitivi",
      "Deficit comportamentali"
      "Tutto"
    ],*/
    condizioni: 
      {
        numeroStato: 9,
        valore: 1
      }
    
  },
  { 
    nome: "Straniero", //12
    domandatesto: "Puoi dare disponibilità per l’accoglienza di un minore straniero non accompagnato?",
    opzioni: ["SI", "NO"],
    condizioni: 
      {
        numeroStato: 4,
        valore: 1
      }  
  },
  {
    nome: "Mamma", //13
    domandatesto: "Puoi dare disponibilità per l’accoglienza di una mamma sola con un minore?",
    opzioni: ["SI", "NO"],
    condizioni: 
    {
      numeroStato: 4,
      valore: 1
    }  
  },

  {
    nome: "Fratelli", //14
    domandatesto: "Puoi dare disponibilità per l’accoglienza di sorelle e fratelli?",
    opzioni: ["SI", "NO"],
    condizioni: 
    {
      numeroStato: 4,
      valore: 1
    }  
  },
  

  {
    nome: "SOS", //15
    domandatesto: "Puoi dare disponibilità per una pronta accoglienza, ossia in emergenza e per breve tempo?",
    opzioni: ["SI", "NO"],
    condizioni: null,
  },
  {
    nome: "Sostegno", //16
    domandatesto: "Sei disponibile a sostenere una famiglia affidataria o naturale, offrendo del tempo da trascorrere con il/i minore/i accolto/i, per esempio nei weekend?",
    opzioni: ["SI", "NO"],
    condizioni: null,
  },
  { 
    nome: "Assistenza", //17
    domandatesto: "Sei disponibile a donare del tempo per la gestione di aspetti sanitari (trasferimenti in ospedale, assistenza in ospedale o a domicilio, accompagnamento a visite mediche ecc) di un minore accolto presso un’altra famiglia o struttura?",
    opzioni: ["SI", "NO"],
    condizioni: null
  },
  {
    nome: "Fine", //18
    domandatesto: "Il questionario è concluso! Invia le mie risposte.",
    opzioni: ["INVIA"],      
  },
  {   
     nome: "Salvato", //19
     domandatesto: "Questionario inviato, grazie!\n\n",        
     condizioni: null,
  },

];


export default domande;



/**
 * Classe FormAccoglienza che estende DialogoForm.
 */
//export default class FormAccoglienza extends DialogoForm {
  /**
   * Crea un'istanza di FormAccoglienza.
   */
//  constructor() {
//    super(domande);
 
 // }

//}
