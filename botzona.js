import BotForm from 'TaffiTools//bot/botform.js';
import IFTTT from 'TaffiTools/salvataggio.js';
import domande from './src/formaccoglienza.js';
import DialogoForm from 'TaffiTools/bot/dialogoform.js';
import { debug } from 'TaffiTools/utils.js';
import cron from "node-cron";
import dotenv from 'dotenv';

dotenv.config();

/**
 * La classe ZonaBot estende la classe BotForm e rappresenta un bot specifico per la zona
 * Inizializza il bot con il token e il form di accoglienza specifico.
 */
class BotZona extends BotForm {
  /**
   * Crea un'istanza di ZonaBot.
   */
  constructor() {
    const telegramToken = process.env.TELEGRAM_ZONABOT_TOKEN;
    const salvataggio = new IFTTT(                        
      'telegram_bot_form_complete', 
      process.env.IFTTT_WEBHOOKKEY
    ); 

    const dialogo = new DialogoForm(domande, salvataggio);
    super(telegramToken, dialogo);
  }



/* funzione che filtra le azioni del bot sulla base di alcune condizioni */

filtra(ctx) {
  if (ctx?.chat?.type === "supergroup") return false;
   else return true;
}

  /**
   * Funzione per generare le domande in base al comando ricevuto
   */
  async generaDomanda(ctx, comando) {

    debug(3,"botzona.generaDomanda");
  
    const userId = ctx.from.id;

    if (!this.dialogo.utenteEsiste(userId)) {
      comando = "primotesto"; 
    } 
    
    if (comando) {
      debug(3,"comando:", comando);

      this.dialogo.init(userId);
      let msg = "";

      switch (comando) {
        case 'start':
          msg = "Benvenuto! Stiamo creando un indirizzario per poter dare risposte più tempestive alle richieste di accoglienza. Se ti è possibile, *dedica qualche minuto a compilare questo questionario* proposto dal Servizio Accoglienza e Condivisione di zona. Per ogni risposta potrai scegliere le opzioni predefinite o scrivere un messaggio personalizzato. \n\nGrazie! \n\n_Per informazioni tecniche puoi contattare Marco Tassinari o Diego Soffia._";
          this.dialogo.reset(userId);
          break;
        case 'primotesto':
          msg = "Benvenuto, iniziamo!";
          this.dialogo.reset(userId);
          debug(ctx, "ctx from:", ctx.from);
          debug(ctx, "ctx.chat:", ctx.chat);

          break;
        case 'ricomincia':
          msg = "Ricominciamo!";
          this.dialogo.reset(userId);
          break;
        case 'indietro':
          this.dialogo.azzeraRisultato(userId);
          this.dialogo.statoPrecedente(userId);
          if (!this.dialogo.ritornaIndice(userId)) {
            msg = "Inizio del questionario raggiunto. Ricominciamo!";
          }
          break;
      }

      if (msg) {
        await this.mostraDomanda(ctx, { domanda: msg });
      }

      return this.dialogo.ritornaDomanda(userId); 
    } else { //se nessun comando
      
      let indice = this.dialogo.ritornaIndice(userId);

      if ( indice === 0 ) {
     
      debug(4, "indice:", indice);

      let testo = ctx?.message?.text?.trim().toLowerCase();
      let tasto = ctx?.callbackQuery?.data;
      let etichetta = "";
      let sessione = 0;
 
      if (tasto) { 
        debug(4, "tasto:", tasto);
        [sessione, etichetta] = tasto.split(":").map(part => part.toLowerCase()); etichetta = etichetta.toLowerCase();         
        debug(4, "etichetta:", etichetta);
      }

      debug(4, "testo:", testo);
      
        if ( etichetta !== "inizia" && testo !== "inizia") {
        await this.mostraDomanda(ctx, { domanda: "Questa opzione non è valida." });
      }
    }
  }
    return this.dialogo.run(ctx, comando);
  
  }

  /**
   * Funzione per mostrare la domanda. Se isWarning è true mostra solo un avviso effimero.
   * Mostro il testo solo se non sono in un supergruppo come quello di zona. 
   * 
   * IN REALTA' QUESTO CONTROLLO È QUASI SEMPRE RIDONDANTE PERCHE' GUARDO GIA' LA FILTRA QUANDO RICEVO UN TESTO
   */
  async mostraDomanda(ctx, testo, isWarning) {
    debug(3,"botzona.mostraDomanda");
    if (this.filtra(ctx)) { //filtro non rispondendo ai messaggi dei supergruppi come quello di zona.
      try {
         if (isWarning) ctx.answerCallbackQuery(testo);
          else await super.mostraDomanda(ctx, testo);
      }
      catch(error) { debug(1, error); }  
    }
   }
  

  /**
   * Invia un messaggio periodico ogni mese
   */
  inviaMessaggioPeriodico() {
   const chatId = -1001811745329; // Inserisci l'ID della chat a cui vuoi inviare il messaggio
 //    const chatId = 1075207685; //Marco per test
//    const messaggio = "Ciao! Stiamo raccogliendo le <b>disponibilità all'accoglienza</b> dei fratelli di zona, in modo da poter <b>dare risposte più tempestive</b>. \nSe ti è possibile dedica un paio di minuti al questionario https://t.me/apg23pdud_bot?start=start \n\nSegnalaci eventuali errori nel form, grazie!\n<i>Servizio accoglienza e condivisione di zona</i>";

const messaggio = 
"Ciao! \nL'Ambito Minori e il Servizio Accoglienza e Condivisione di zona chiedono l'aiuto di tutti i fratelli, sorelle e Pvv. Vi chiediamo due minuti di tempo per <b>aprire questo link e compilare un breve sondaggio.</b> https://t.me/apg23pdud_bot?start=start \n\nÈ per noi indispensabile per poter rispondere al meglio alle numerose richieste di accoglienza che ci arrivano quotidianamente.\n\nSpecifichiamo che questo sondaggio è la fotografia ATTUALE delle vostre possibilità di accoglienza, ma in futuro potrete accedere nuovamente e in qualsiasi momento al medesimo link <b>per aggiornare</b> le vostre possibilità di accoglienza.\n\n Preghiamo di compilare 1 SOLO SONDAGGIO per coppia/famiglia. Potete aprirlo installando l'app TELEGRAM sia telefonino che sul pc! <i>Per difficoltà tecniche vi preghiamo di contattare Marco Tassinari o Diego Soffia. </i> \n\n Grazie!"






// Invia il messaggio alla chat
    this.bot.api.sendMessage(chatId, messaggio, {
      parse_mode: 'HTML',
    }).then(() => debug(0,"Messaggio di invito mostrato con successo"))
      .catch((err) => debug(1,"Errore nell'invio del messaggio di invito:", err));
  }
}

// ******************************** main **************************************

/**
 * Avvia il bot ZonaBot.
 */
(async () => {
  try {
    debug(0,"Avvio il server...")
    const botZona = new BotZona();
    botZona.start();
   // botZona.inviaMessaggioPeriodico(); //invio all'inizio COMMENTARE SE NON SERVE


    // Pianifica l'invio del messaggio ogni mese
    cron.schedule("0 0 1 * *", () => {
      debug(0,"Invio messaggio mensile");
      botZona.inviaMessaggioPeriodico();
    });

  } catch (error) {
    console.error('Errore nell\'avvio del bot ZonaBot:', error);
  }
})();
