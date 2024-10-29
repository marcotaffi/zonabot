import BotForm from 'TaffiTools//bot/botform.js';
import IFTTT from 'TaffiTools/salvataggio.js';
import { ProcessManager } from 'TaffiTools/system/ProcessManager.js';
import domande from './src/formaccoglienza.js';
import DialogoForm from 'TaffiTools/bot/dialogoform.js';
import { debug } from 'TaffiTools/utils/debug.js';
import cron from "node-cron";
import dotenv from 'dotenv';
dotenv.config();
//------------------------------------

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
    
    super(telegramToken, domande, salvataggio);
  }


//------------------------------------

/* funzione che filtra le azioni del bot sulla base di alcune condizioni */

filtra(ctx) {
  if (ctx?.chat?.type === "supergroup") return false;
   else return true;
}

//------------------------------------

  /**
   * Invia un messaggio periodico ogni mese
   */
  inviaMessaggioPeriodico() {
   const chatId = -1001811745329; // Inserisci l'ID della chat a cui vuoi inviare il messaggio
 //    const chatId = 1075207685; //Marco per test
//    const messaggio = "Ciao! Stiamo raccogliendo le <b>disponibilità all'accoglienza</b> dei fratelli di zona, in modo da poter <b>dare risposte più tempestive</b>. \nSe ti è possibile dedica un paio di minuti al questionario https://t.me/apg23pdud_bot?start=start \n\nSegnalaci eventuali errori nel form, grazie!\n<i>Servizio accoglienza e condivisione di zona</i>";

const messaggio = 
"Ciao! \nL'Ambito Minori e il Servizio Accoglienza e Condivisione di zona chiedono l'aiuto di tutti i fratelli, sorelle e Pvv. Vi chiediamo due minuti di tempo per <b>aprire questo link e compilare un breve sondaggio.</b> https://t.me/apg23pdud_bot?start=start \n\nÈ per noi indispensabile per poter rispondere al meglio alle numerose richieste di accoglienza che ci arrivano quotidianamente.\n\nSpecifichiamo che questo sondaggio è la fotografia ATTUALE delle vostre possibilità di accoglienza, ma in futuro potrete accedere nuovamente e in qualsiasi momento al medesimo link <b>per aggiornare</b> le vostre possibilità di accoglienza.\n\n Preghiamo di compilare 1 SOLO SONDAGGIO per coppia/famiglia. Potete aprirlo installando l'app TELEGRAM sia telefonino che sul pc! <i>Per difficoltà tecniche vi preghiamo di contattare Marco Tassinari o Diego Soffia. </i> \n\n Grazie!";

//------------------------------------

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
    const DEBUG_LEVEL = process.env.DEBUG_LEVEL;
    ProcessManager.getInstance().setup(this, DEBUG_LEVEL);
   


    debug(0,"Avvio il server...")
    debug(0, "debug level:", DEBUG_LEVEL);

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
//------------------------------------
