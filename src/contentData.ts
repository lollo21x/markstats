import { Subject } from './types';

export interface Topic {
  id: string;
  title: string;
  videoUrl?: string;
  files: { name: string; url: string }[];
  testDate: string; // ISO date string
  initialMessage?: string;
  context?: string;
}

export interface SubjectContent {
  subject: Subject;
  topics: Topic[];
}

export const contentData: SubjectContent[] = [
  {
    subject: 'Storia',
    topics: [
      {
        id: 'storia-assolutismo-rivoluzioni',
        title: 'Assolutismo, Rivoluzioni e Nuove Potenze Europee',
        videoUrl: 'https://res.cloudinary.com/dpijllwgu/video/upload/v1762799433/L_Europa_Rifatta_ufkzqd.mp4',
        files: [
          { name: 'mappamentale.png', url: 'https://res.cloudinary.com/dpijllwgu/image/upload/v1762799843/NotebookLM_Mind_Map_4_sfb1g1.png' }
        ],
        testDate: '2025-11-13', // 13/11/25
        initialMessage: "Ciao! Sono Will, il tuo assistente di studio. Posso aiutarti a capire meglio l'Assolutismo, le Rivoluzioni e le Nuove Potenze Europee. Da cosa iniziamo? Vuoi saperne di più sulla Guerra dei Trent'anni?",
        context: `#### 1. Guerra dei Trent'anni (1618-1648)

* [cite_start]**Fasi del conflitto**[cite: 1]:

* [cite_start]1ª FASE BOEMA (1618-1625) [cite: 1]

* [cite_start]2ª FASE DANESE (1625-1629) [cite: 1]

* [cite_start]3ª FASE SUEDESE (1630-1635) [cite: 1]

* [cite_start]4ª FASE FRANCESE (1635-1648) [cite: 1]

* [cite_start]**Conclusione:** 1648 PACE DI VESTFALIA[cite: 4].

* **Conseguenze:**

* [cite_start]**Impero Tedesco** [cite: 6][cite_start]: Ottiene libertà religiosa per tutti [cite: 5][cite_start], ma esce con instabilità politica[cite: 7].

* [cite_start]**Francia:** Esce rafforzata [cite: 10] [cite_start]e ottiene l'Alsazia e la Lorena[cite: 22].

* [cite_start]**Spagna:** Esce indebolita[cite: 14, 16].

* [cite_start]**Olanda:** Le Fiandre ottengono l'indipendenza dalla Spagna[cite: 23].

#### 2. Assolutismo Francese (Richelieu, Mazzarino, Luigi XIV)

* [cite_start]**Cardinale Richelieu** (con Luigi XIII [cite: 296]):

* [cite_start]Affidamento del potere da parte di Maria de' Medici[cite: 299, 301].

* [cite_start]**Politica interna:** Combatte la resistenza dei nobili [cite: 305] [cite_start]e dei protestanti[cite: 302, 312]. [cite_start]Avviene l'assedio de La Rochelle[cite: 309].

* [cite_start]**Amministrazione:** Crea un apparato statale centralizzato [cite: 313] [cite_start]e introduce gli "intendenti" [cite: 316][cite_start], funzionari di origine borghese [cite: 315] [cite_start]nelle province[cite: 318].

* [cite_start]**Politica estera:** Persegue una politica anti-asburgica [cite: 322] [cite_start](contro la Spagna [cite: 323][cite_start]) intervenendo nella Guerra dei Trent'anni[cite: 323].

* [cite_start]**Cardinale Mazzarino** (Reggenza di Luigi XIV [cite: 324]):

* [cite_start]Nel 1643 sale al trono il giovanissimo Luigi XIV[cite: 324].

* [cite_start]**La Fronda (1648)** [cite: 327][cite_start]: Rivolta del Parlamento [cite: 329] [cite_start]contro l'accentramento del potere [cite: 330] [cite_start]e l'aumento della pressione fiscale[cite: 326].

* [cite_start]**Fronda dei Principi (1650)**[cite: 333, 335].

* [cite_start]Mazzarino torna trionfante a Parigi[cite: 153, 154].

* [cite_start]**Guerra con la Spagna**[cite: 159, 340]:

* [cite_start]**Pace dei Pirenei (1659)** [cite: 164, 342][cite_start]: Sancisce l'affermazione della Francia [cite: 163] [cite_start]come potenza egemone in Europa[cite: 165].

* [cite_start]Viene organizzato il matrimonio tra Luigi XIV e Maria Teresa d'Austria [cite: 168][cite_start], figlia del re di Spagna[cite: 171].

* [cite_start]**Luigi XIV (Il Re Sole)**[cite: 177]:

* [cite_start]Alla morte di Mazzarino (1661) [cite: 173, 182, 346][cite_start], il re assume la direzione personale dello Stato[cite: 183]. [cite_start]È l'apogeo dell'assolutismo francese[cite: 175, 179].

* [cite_start]**Accentramento del Potere** [cite: 182, 354][cite_start]: Si avvale di collaboratori di origine borghese [cite: 183][cite_start], tra cui spicca Jean Baptiste Colbert, controllore delle finanze[cite: 186].

* [cite_start]**Gli Intendenti:** Funzionari scelti dal re [cite: 188] [cite_start]sostituiscono le autorità provinciali [cite: 188][cite_start], permettendo al sovrano un controllo capillare[cite: 190].

* [cite_start]**La Reggia di Versailles** [cite: 192, 193][cite_start]: Diventa il simbolo del potere monarchico[cite: 196]. [cite_start]La nobiltà ha l'obbligo di risiedervi [cite: 200][cite_start], permettendo al Re Sole [cite: 205] [cite_start]di essere il dominatore assoluto [cite: 203] [cite_start]e di controllarla[cite: 201].

* [cite_start]**Economia (Mercantilismo)** [cite: 390][cite_start]: Colbert [cite: 186] [cite_start]attua una politica economica protezionistica[cite: 392]. [cite_start]Si mira ad aumentare la ricchezza interna [cite: 393] [cite_start]imponendo tariffe doganali [cite: 395][cite_start], favorendo le manifatture interne [cite: 395] [cite_start]e creando compagnie commerciali [cite: 401] [cite_start]e colonie (Africa e America) [cite: 398] [cite_start]per reperire materie prime[cite: 400].

* [cite_start]**Esercito:** Luigi XIV rafforza l'esercito[cite: 404]. [cite_start]Louvois [cite: 407] [cite_start]lo riorganizza come un moderno esercito permanente[cite: 406].

* [cite_start]**Politica religiosa:** Viene revocato l'Editto di Nantes[cite: 366, 379]. [cite_start]Questo causa la fuga di molti ugonotti (protestanti) [cite: 369] [cite_start]verso Svizzera, Germania [cite: 368] [cite_start]e Inghilterra[cite: 370].

* [cite_start]**Politica estera:** Attua una politica espansionistica[cite: 410]. [cite_start]Con la Pace di Nimega (1678) [cite: 410] [cite_start]ottiene territori dai Paesi Bassi Spagnoli e dal Sacro Romano Impero[cite: 411].

#### 3. Russia di Pietro il Grande

* [cite_start]**Contesto:** Dinastia dei Romanov[cite: 46]. [cite_start]Fine '600 - inizio '700 il paese è attraversato da sommosse [cite: 52][cite_start], come quella di contadini e cosacchi[cite: 53].

* [cite_start]**Chiesa Russa:** Vive momenti di crisi [cite: 56] [cite_start]a causa della riforma del Patriarca Nikon[cite: 55].

* [cite_start]**Pietro il Grande**[cite: 43, 60]:

* [cite_start]**Riforme Militari e Amministrative** [cite: 64][cite_start]: Avvia una riforma dell'esercito [cite: 67][cite_start], migliorando l'armamento [cite: 67] [cite_start]e fondando scuole militari[cite: 68].

* [cite_start]Nel 1722 introduce la **Tavola dei Ranghi** [cite: 74][cite_start], basata sul merito[cite: 77].

* [cite_start]Pone la Chiesa sotto il controllo dello Stato attraverso il Santo Sinodo[cite: 79].

* [cite_start]**Riforme Culturali e Modernizzazione** [cite: 92][cite_start]: Promuove l'istituzione di scuole militari e di navigazione [cite: 93][cite_start], fonda l'Accademia delle Scienze [cite: 93] [cite_start]e avvia l'europeizzazione delle élite russe[cite: 93].

* **Espansione:**

* [cite_start]**Guerra del Nord** [cite: 80][cite_start]: Contro la Svezia [cite: 81] [cite_start]per assicurarsi un accesso sul Baltico[cite: 80].

* [cite_start]Si conclude con la Pace di Stoccolma (1719/20) [cite: 82] [cite_start]e la Pace di Nystad[cite: 83].

* [cite_start]La Svezia cede Livonia, Estonia, Ingria e parte della Finlandia[cite: 82, 86]. [cite_start]Inizia l'egemonia russa sul Baltico[cite: 88].

* [cite_start]**Capitale:** Nel 1703 fonda San Pietroburgo [cite: 90][cite_start], la nuova capitale, ispirata ai modelli occidentali[cite: 90, 91].

* [cite_start]**Espansione verso SUD** [cite: 144][cite_start]: Ricerca di nuovi sbocchi sul mare[cite: 148]. [cite_start]Tra il 1783 e il 1792 [cite: 148] [cite_start]ottiene la conquista della Crimea [cite: 142] [cite_start]e l'accesso al Mar Nero[cite: 151].

* [cite_start]**Sistema successorio:** Pietro si riserva il diritto di scegliere il successore[cite: 139, 140, 141].

#### 4. L'Illuminismo

* [cite_start]**Definizione:** Movimento filosofico [cite: 94] [cite_start]che si diffonde in Europa, in particolare in Francia, dagli anni '30 del '700[cite: 94]. [cite_start]Il termine è legato alla parola "luce"[cite: 97].

* **Concetti chiave:**

* [cite_start]**RAGIONE** [cite: 101, 283][cite_start]: È lo strumento principale per la conoscenza della realtà[cite: 101].

* [cite_start]**RELIGIONE** [cite: 107][cite_start]: Viene criticata[cite: 106]. [cite_start]Si afferma il "Deismo"[cite: 103, 285].

* [cite_start]**PROGRESSO**[cite: 112].

* [cite_start]**Illuministi Francesi**[cite: 123]:

* [cite_start]**Voltaire**[cite: 124].

* [cite_start]**Montesquieu** [cite: 126][cite_start]: Elabora una teoria politica per uno Stato giusto[cite: 131]. [cite_start]Sostiene la necessità di **separare i 3 poteri** [cite: 132][cite_start]: legislativo (Parlamento), esecutivo (Governo) e giudiziario (Magistratura)[cite: 133]. [cite_start]Il modello migliore è la monarchia costituzionale inglese[cite: 133].

* [cite_start]**Rousseau** [cite: 113, 126][cite_start]: Scrive "Il Contratto Sociale"[cite: 135]. [cite_start]Ritiene che l'assetto politico migliore sia la repubblica democratica[cite: 135].

#### 5. Economia (Nuove Teorie)

* [cite_start]Tra le nuove discipline figurano Chimica, Fisica [cite: 26][cite_start], Matematica [cite: 27] [cite_start]ed Economia[cite: 28, 31].

* **Economisti:**

* [cite_start]**Quesnay** [cite: 33][cite_start]: L'attività produttiva garantisce benessere[cite: 36].

* [cite_start]**Adam Smith** [cite: 37][cite_start]: La ricchezza deriva dal settore industriale[cite: 39]. [cite_start]Introduce la "MANO INVISIBILE", che permette un equilibrio negli scambi di mercato[cite: 40, 41].

* [cite_start]**David Ricardo**[cite: 42].

#### 6. Situazione in Italia e Guerra di Successione Spagnola

* [cite_start]**Situazione in Italia (Fine '500-'600)**[cite: 208, 209]:

* [cite_start]**Presenza Spagnola** [cite: 238][cite_start]: Domina su Napoli e Sicilia [cite: 240] [cite_start]tramite viceregni dipendenti dalla Corona spagnola[cite: 240, 241].

* [cite_start]**Rivolta a Napoli (1647)** [cite: 247][cite_start]: La Spagna, impegnata nella Guerra dei Trent'anni [cite: 243, 244][cite_start], aumenta le tasse[cite: 249, 250]. [cite_start]La rivoluzione è guidata da Masaniello[cite: 251, 253].

* [cite_start]**Nord-Occidentale:** Ducato di Savoia [cite: 221] [cite_start](con Emanuele Filiberto [cite: 222]).

* [cite_start]**Nord-Orientale:** Repubblica di Venezia[cite: 229, 235].

* [cite_start]**Repubblica di Genova:** Controlla Liguria e Corsica[cite: 226].

* [cite_start]**Guerra di Successione Spagnola (1702-1713)**[cite: 272]:

* [cite_start]**Causa:** Morte del re di Spagna [cite: 266][cite_start], che designa come erede Filippo d'Angiò (nipote di Luigi XIV)[cite: 268].

* [cite_start]**Esito:** Vittoria dei Franco-Spagnoli[cite: 275].

* **Conseguenze per l'Italia:**

* [cite_start]Finisce la presenza spagnola (1713)[cite: 217, 218]. [cite_start]Gran parte dei territori passa agli Asburgo d'Austria[cite: 219, 264].

* [cite_start]Napoli, Sardegna, Presidi e Milano passano all'Austria[cite: 276].

* [cite_start]La Sicilia diventa un regno e passa ai Savoia[cite: 277]. [cite_start]Vittorio Amedeo II è il primo re[cite: 278].`
      }
    ]
  },
  {
    subject: 'Filosofia',
    topics: [
      {
        id: 'filosofia-ellenistica',
        title: 'Filosofia ellenistica: epicureismo, stoicismo, scetticismo',
        videoUrl: 'https://res.cloudinary.com/dpijllwgu/video/upload/v1761844423/Filosofia_ellenistica_nc7pru.mp4',
        files: [
          { name: 'mappamentale.png', url: 'https://res.cloudinary.com/dpijllwgu/image/upload/v1761844524/Filosofia_ellenistica_-_mind_map_igoi5i.png' }
        ],
        testDate: '2025-10-30', // 30/10/25
        initialMessage: "Ciao! Sono Will, il tuo assistente di studio. Posso aiutarti a capire meglio le filosofie ellenistiche. Da cosa iniziamo? Vuoi saperne di più su Epicuro?",
        context: `Le filosofie ellenistiche rappresentano un momento di profonda trasformazione del pensiero antico, in cui la filosofia assume una funzione pratica e terapeutica, orientata alla serenità dell'anima. In un'epoca segnata dall'incertezza, le dottrine di Stoicismo, Epicureismo e Scetticismo propongono tre vie distinte verso la felicità: la virtù e la ragione, il piacere stabile e il dubbio liberatore.

Lo Stoicismo nasce ad Atene intorno al 300 a.C. con Zenone di Cizio e pone come fine dell'esistenza il vivere secondo ragione e natura. La logica stoica si basa sul criterio della rappresentazione catalettica, cioè l'impressione evidente che si impone come vera. La fisica concepisce il cosmo come un tutto ordinato, razionale e divino, governato da un principio attivo (Dio o lógos) e uno passivo (materia). Tutto ciò che accade segue un destino provvidenziale e necessario. Nell'etica, la virtù è l'unico bene e coincide con la conformità alla ragione universale. Le emozioni sono malattie dell'anima e il saggio raggiunge l'apatia, uno stato di serenità e imperturbabilità. La politica stoica si fonda sulla legge naturale e sul cosmopolitismo: tutti gli esseri umani partecipano della stessa ragione e appartengono a una comunità universale.

L'Epicureismo, fondato da Epicuro nel suo "Giardino", propone invece la ricerca del piacere come fine della vita, inteso non come edonismo sfrenato ma come piacere stabile, ossia assenza di dolore (aponia) e turbamento (atarassia). La logica, detta canonica, stabilisce l'evidenza come criterio di verità, fondata su sensazione, anticipazione ed emozione. La fisica è atomistica e meccanicistica: tutto è composto da atomi e vuoto, e l'universo è privo di finalità divine. L'introduzione del clinámen, la deviazione spontanea degli atomi, rompe il determinismo e fonda la libertà. Gli dèi esistono, ma non si interessano del mondo. Nell'etica, la felicità deriva dal calcolo razionale dei piaceri e dalla distinzione dei bisogni: naturali e necessari (da soddisfare), naturali ma non necessari (da moderare), non naturali e non necessari (da eliminare). L'amicizia è un bene essenziale, mentre la politica è fonte di turbamento, da evitare.

Lo Scetticismo, infine, rifiuta ogni dogmatismo e sostiene che la verità ultima delle cose è inconoscibile. Il suo scopo non è la conoscenza, ma la pace interiore, ottenuta attraverso la sospensione del giudizio (epoché). Gli scettici non negano i fenomeni, ma mettono in dubbio le spiegazioni dogmatiche del loro significato. L'atteggiamento prudente conduce all'afasia, cioè al non pronunciarsi, e infine all'atarassia, la serenità dell'anima. Pirrone di Elide, Timone di Fliunte e Sesto Empirico sono i principali esponenti. Quest'ultimo sistematizza il pensiero scettico e ne definisce le quattro guide pratiche per la vita: i sensi, i bisogni del corpo, le leggi e i costumi, e le regole delle arti. Lo scettico vive dunque seguendo criteri pragmatici, senza pretese di verità assoluta.

Pur divergendo profondamente, queste tre filosofie condividono lo stesso obiettivo: la conquista della felicità e della libertà interiore. Lo Stoico la raggiunge accettando razionalmente l'ordine del cosmo, l'Epicureo eliminando il dolore e la paura attraverso la misura, lo Scettico sospendendo ogni giudizio per vivere senza turbamenti.

Tema fondamentale | Stoicismo | Epicureismo | Scetticismo
Obiettivo della vita | Vivere secondo natura e ragione (virtù) in armonia con il lógos | Raggiungere il piacere stabile, assenza di dolore (aponia) e turbamento (atarassia) | Raggiungere l'imperturbabilità (atarassia) tramite la sospensione del giudizio (epoché)
Criterio di verità | Rappresentazione catalettica, evidenza dell'impressione approvata dalla ragione | Evidenza sensibile, anticipazione ed emozione | Nessun criterio assoluto, solo fenomeni e guide pratiche
Natura del cosmo | Universo ordinato, razionale e provvidenziale | Universo meccanicistico, atomico e privo di finalità | Natura inconoscibile e inaccessibile
Atteggiamento verso le emozioni | Eliminarle: apatia come libertà dal turbamento | Guidarle: piacere e dolore come criteri morali | Liberarsene: serenità attraverso il dubbio
Ruolo nella società | Impegno cosmopolita fondato sulla legge naturale | Ritiro dalla vita politica e valorizzazione dell'amicizia | Conformità pragmatica alle leggi e consuetudini per vivere serenamente`
      }
      // Add more topics as needed
    ]
  }
  // Add other subjects as needed
];

export const getRelativeDate = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  const diffTime = date.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Oggi';
  if (diffDays === 1) return 'Domani';
  if (diffDays === -1) return 'Ieri';

  // If within same week (7 days range)
  if (Math.abs(diffDays) <= 6) {
    const days = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
    return days[date.getDay()];
  }

  // Otherwise, return formatted date
  return date.toLocaleDateString('it-IT');
};
