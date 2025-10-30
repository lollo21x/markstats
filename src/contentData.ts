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
        context: `Le filosofie ellenistiche rappresentano un momento di profonda trasformazione del pensiero antico, in cui la filosofia assume una funzione pratica e terapeutica, orientata alla serenità dell’anima. In un’epoca segnata dall’incertezza, le dottrine di Stoicismo, Epicureismo e Scetticismo propongono tre vie distinte verso la felicità: la virtù e la ragione, il piacere stabile e il dubbio liberatore.

Lo Stoicismo nasce ad Atene intorno al 300 a.C. con Zenone di Cizio e pone come fine dell’esistenza il vivere secondo ragione e natura. La logica stoica si basa sul criterio della rappresentazione catalettica, cioè l’impressione evidente che si impone come vera. La fisica concepisce il cosmo come un tutto ordinato, razionale e divino, governato da un principio attivo (Dio o lógos) e uno passivo (materia). Tutto ciò che accade segue un destino provvidenziale e necessario. Nell’etica, la virtù è l’unico bene e coincide con la conformità alla ragione universale. Le emozioni sono malattie dell’anima e il saggio raggiunge l’apatia, uno stato di serenità e imperturbabilità. La politica stoica si fonda sulla legge naturale e sul cosmopolitismo: tutti gli esseri umani partecipano della stessa ragione e appartengono a una comunità universale.

L’Epicureismo, fondato da Epicuro nel suo "Giardino", propone invece la ricerca del piacere come fine della vita, inteso non come edonismo sfrenato ma come piacere stabile, ossia assenza di dolore (aponia) e turbamento (atarassia). La logica, detta canonica, stabilisce l’evidenza come criterio di verità, fondata su sensazione, anticipazione ed emozione. La fisica è atomistica e meccanicistica: tutto è composto da atomi e vuoto, e l’universo è privo di finalità divine. L’introduzione del clinámen, la deviazione spontanea degli atomi, rompe il determinismo e fonda la libertà. Gli dèi esistono, ma non si interessano del mondo. Nell’etica, la felicità deriva dal calcolo razionale dei piaceri e dalla distinzione dei bisogni: naturali e necessari (da soddisfare), naturali ma non necessari (da moderare), non naturali e non necessari (da eliminare). L’amicizia è un bene essenziale, mentre la politica è fonte di turbamento, da evitare.

Lo Scetticismo, infine, rifiuta ogni dogmatismo e sostiene che la verità ultima delle cose è inconoscibile. Il suo scopo non è la conoscenza, ma la pace interiore, ottenuta attraverso la sospensione del giudizio (epoché). Gli scettici non negano i fenomeni, ma mettono in dubbio le spiegazioni dogmatiche del loro significato. L’atteggiamento prudente conduce all’afasia, cioè al non pronunciarsi, e infine all’atarassia, la serenità dell’anima. Pirrone di Elide, Timone di Fliunte e Sesto Empirico sono i principali esponenti. Quest’ultimo sistematizza il pensiero scettico e ne definisce le quattro guide pratiche per la vita: i sensi, i bisogni del corpo, le leggi e i costumi, e le regole delle arti. Lo scettico vive dunque seguendo criteri pragmatici, senza pretese di verità assoluta.

Pur divergendo profondamente, queste tre filosofie condividono lo stesso obiettivo: la conquista della felicità e della libertà interiore. Lo Stoico la raggiunge accettando razionalmente l’ordine del cosmo, l’Epicureo eliminando il dolore e la paura attraverso la misura, lo Scettico sospendendo ogni giudizio per vivere senza turbamenti.

Tema fondamentale | Stoicismo | Epicureismo | Scetticismo
Obiettivo della vita | Vivere secondo natura e ragione (virtù) in armonia con il lógos | Raggiungere il piacere stabile, assenza di dolore (aponia) e turbamento (atarassia) | Raggiungere l’imperturbabilità (atarassia) tramite la sospensione del giudizio (epoché)
Criterio di verità | Rappresentazione catalettica, evidenza dell’impressione approvata dalla ragione | Evidenza sensibile, anticipazione ed emozione | Nessun criterio assoluto, solo fenomeni e guide pratiche
Natura del cosmo | Universo ordinato, razionale e provvidenziale | Universo meccanicistico, atomico e privo di finalità | Natura inconoscibile e inaccessibile
Atteggiamento verso le emozioni | Eliminarle: apatia come libertà dal turbamento | Guidarle: piacere e dolore come criteri morali | Liberarsene: serenità attraverso il dubbio
Ruolo nella società | Impegno cosmopolita fondato sulla legge naturale | Ritiro dalla vita politica e valorizzazione dell’amicizia | Conformità pragmatica alle leggi e consuetudini per vivere serenamente`
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