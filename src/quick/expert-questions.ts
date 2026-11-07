import type { QuickQuestion } from "./model.js";

export const EXPERT_QUESTIONS: QuickQuestion[] = [
  {
    id: "Q1",
    group: "value",
    text: "Wie viel des angenommenen Kundenbedarfs haben Sie bisher noch nicht beobachtet?",
    low: "Kunden lösen die Aufgabe regelmäßig",
    high: "Bisher nur eine Vermutung",
    help: "Denken Sie an ein konkretes Angebot für eine bestimmte Kundengruppe. Woran sehen Sie, dass diese Menschen das Problem tatsächlich lösen wollen?",
    example:
      "Wiederholte Anfragen, heutiger Zeitaufwand oder bestehende Ausgaben zeigen Bedarf. Eine positive Reaktion auf Ihre Idee allein sagt darüber noch wenig aus.",
    action: "Den Kundenbedarf an einer realen Aufgabe prüfen",
    actionDetail:
      "Beobachten Sie, wie konkrete Käufer die Aufgabe heute lösen, was sie dafür aufwenden und welche Folgen ein ungelöstes Problem hat.",
  },
  {
    id: "Q2",
    group: "value",
    text: "Wie viel Ihrer erwarteten Nachfrage ist bisher ohne bezahlten Auftrag geblieben?",
    low: "Käufe, bezahlte Piloten oder Verlängerungen",
    high: "Bisher nur unverbindliches Interesse",
    help: "Welche Kaufentscheidung ist schon tatsächlich gefallen? Für eine neue Idee kann ein kleiner bezahlter Pilot der erste Nachweis sein.",
    example:
      "Zehn Interessenten finden das Angebot gut. Erst wenn jemand den vereinbarten Preis bezahlt, ist mehr als Interesse belegt.",
    action: "Einen bezahlten Pilot vereinbaren",
    actionDetail:
      "Bieten Sie eine abgegrenzte Leistung zu einem konkreten Preis an und dokumentieren Sie, ob der Kunde tatsächlich kauft.",
  },
  {
    id: "Q3",
    group: "value",
    text: "Wie viel Ihrer vollständigen Kosten ist durch reale Erlöse noch nicht abgesichert?",
    low: "Verkaufspreise decken die geprüften Kosten",
    high: "Kosten oder erzielbare Preise weitgehend offen",
    help: "Was bleibt pro Auftrag übrig, wenn auch Vertrieb, Einführung, Betreuung, Prüfung und Nacharbeit bezahlt sind?",
    example:
      "Ein Auftrag bringt 1.000 Euro. Neben der Herstellung kosten Kundengewinnung, Abstimmung und Korrekturen ebenfalls Zeit und Geld.",
    action: "Einen Auftrag vollständig durchrechnen",
    actionDetail:
      "Stellen Sie einem tatsächlich erzielbaren Preis sämtliche Kosten einschließlich Vertrieb, Betreuung, Prüfung und Nacharbeit gegenüber.",
  },
  {
    id: "Q4",
    group: "competition",
    text: "Wie viel Ihrer Kernleistung könnte das Expertenteam in sechs Monaten nachbauen?",
    low: "Nur kleine Teile des bezahlten Ergebnisses",
    high: "Fast das gesamte bezahlte Ergebnis",
    help: "Denken Sie an zehn Weltklasseexperten, die ununterbrochen recherchieren, entwickeln und testen. Wie viel könnten sie mit verfügbarem Fachwissen, üblichen Werkzeugen und zulässigen Kundenunterlagen herstellen?",
    example:
      "Bei einer Präsentationsagentur gehören Recherche, Folien und Prüfung zum Ergebnis. Entscheidend ist, was das Team davon liefern könnte und wofür es zusätzliche Zugänge oder körperliche Ausführung bräuchte.",
    action: "Die erste nachbaubare Kundenaufgabe erproben",
    actionDetail:
      "Wählen Sie eine repräsentative Kundenaufgabe. Prüfen Sie praktisch, welche Teile mit zugänglichem Wissen und Werkzeugen reproduzierbar sind und welche Hürden bleiben. Das Gedankenexperiment ersetzt diesen Nachweis nicht.",
  },
  {
    id: "Q5",
    group: "competition",
    text: "Wie viel Ihres Angebots könnte das Team in ein bereits gekauftes Produkt einbauen?",
    low: "Wenig davon passt in bestehende Produkte",
    high: "Fast alles wäre dort direkt mitgeliefert",
    help: "Stellen Sie sich vor, das Team arbeitet für einen Anbieter, den Ihre Kunden schon bezahlen. Welche Ihrer Leistungen könnte dieser zusätzlich in sein Produkt aufnehmen?",
    example:
      "Ein Kunde bezahlt bereits seine Bürosoftware. Würde diese ihm künftig brauchbare Präsentationen samt Prüfung liefern, müsste er Ihre Leistung womöglich nicht mehr separat einkaufen.",
    action: "Den Nutzen neben einem gebündelten Angebot testen",
    actionDetail:
      "Zeigen Sie Kunden ein konkretes Bild der mitgelieferten Alternative und prüfen Sie, welchen zusätzlichen Nutzen sie weiterhin bei Ihnen kaufen würden.",
  },
  {
    id: "Q6",
    group: "competition",
    text: "Wie wenig müsste ein Kunde ändern, um zu einer vergleichbaren Alternative für ein Zehntel des Preises zu wechseln?",
    low: "Erhebliche praktische Hürden blieben",
    high: "Fast ohne Umstellung nutzbar",
    help: "Nehmen Sie für diese Frage ein vergleichbar brauchbares Ergebnis an. Welche Daten, Abläufe, Verträge, Schulungen oder Freigaben müsste der Kunde wirklich umstellen?",
    example:
      "Eine günstigere Software ist schnell bestellt. Wenn jedoch Daten migriert, Schnittstellen gebaut und Mitarbeitende geschult werden müssen, ist der tatsächliche Wechsel aufwendiger.",
    action: "Einen konkreten Kundenwechsel durchspielen",
    actionDetail:
      "Listen Sie mit einem Kunden die Schritte, Kosten und Freigaben für den Wechsel auf. Prüfen Sie, welche Hürden das Expertenteam tatsächlich beseitigen könnte.",
  },
  {
    id: "Q7",
    group: "advantage",
    text: "Wie leicht käme das Team an die besonderen Daten und Zugänge, die Ihr Ergebnis besser machen?",
    low: "Wichtige Zugänge sind schwer ersetzbar",
    high: "Alles Wesentliche zugänglich oder ersetzbar",
    help: "Was müsste das Team erst beschaffen, erwerben oder vertraglich sichern? Ein eigener Datensatz schützt nur, wenn er das bezahlte Ergebnis tatsächlich verbessert.",
    example:
      "Öffentliche Brancheninformationen sind leicht beschaffbar. Langjährige, rechtmäßig nutzbare Messdaten könnten schwerer zu ersetzen sein – sofern sie nachweislich bessere Ergebnisse ermöglichen.",
    action: "Den entscheidenden Zugang und seine Wirkung belegen",
    actionDetail:
      "Vergleichen Sie das Kundenergebnis mit und ohne die besonderen Daten oder Zugänge. Prüfen Sie, ob ein Wettbewerber brauchbare Ersatzquellen beschaffen könnte.",
  },
  {
    id: "Q8",
    group: "advantage",
    text: "Wie wenig zusätzlichen Nutzen erkennen Kunden gegenüber ihrer besten Alternative?",
    low: "Kunden erkennen einen belegten Mehrwert",
    high: "Für Kunden kaum ein Unterschied",
    help: "Welche Verbesserung erlebt der Kunde tatsächlich bei Zeit, Qualität, Kosten oder Ergebnis? Auch Eigenleistung und das Beibehalten des bisherigen Vorgehens zählen als Alternativen.",
    example:
      "Ein schönerer Bericht allein muss keinen Mehrwert schaffen. Schnellere Entscheidungen oder weniger teure Fehler wären konkrete Unterschiede, die sich mit Kunden prüfen lassen.",
    action: "Den Zusatznutzen mit Kunden vergleichen",
    actionDetail:
      "Lassen Sie Kunden Ihr Ergebnis und die beste zugängliche Alternative an derselben Aufgabe vergleichen. Halten Sie fest, welcher Unterschied die Kaufentscheidung beeinflusst.",
  },
  {
    id: "Q9",
    group: "advantage",
    text: "Wie leicht käme das Team auf die Auswahlliste Ihrer Kunden?",
    low: "Vertrauen und Zugang müssten lange wachsen",
    high: "Gleiche Käufer wären direkt erreichbar",
    help: "Könnte ein neuer Anbieter Ihre Käufer ansprechen und bei einer Ausschreibung oder Vorauswahl berücksichtigt werden? Denken Sie an Beziehungen, Vertriebskanäle und notwendige Qualifikationen.",
    example:
      "Eine gute Leistung allein bringt noch keine Einladung zur Ausschreibung. Referenzen, bestehende Verträge oder der Zugang zu einem Händlernetz könnten dem neuen Team zunächst fehlen.",
    action: "Den Weg zum Käufer konkret prüfen",
    actionDetail:
      "Spielen Sie nach, wie ein neuer Anbieter Ihre Käufer erreicht und in die Auswahl kommt. Prüfen Sie, welche Beziehungen oder Qualifikationen sich nicht kurzfristig aufbauen lassen.",
  },
  {
    id: "Q10",
    group: "control",
    text: "Wie viel Ihrer Leistung würde stillstehen, wenn Ihr wichtigster Technikdienst morgen ausfällt?",
    low: "Erprobte Alternative hält den Betrieb aufrecht",
    high: "Kernleistung ohne brauchbaren Ersatz blockiert",
    help: "Denken Sie an den externen Dienst, auf den Ihr Angebot am stärksten angewiesen ist. Funktioniert ein Wechsel wirklich – mit Ihren Daten, Qualitätsanforderungen und Kosten?",
    example:
      "Ein zweiter Dienst ist zwar gebucht. Wenn er Ihre Daten nicht lesen kann oder andere Ergebnisse liefert, ist er noch keine praktisch erprobte Ausweichmöglichkeit.",
    action: "Den Ausfall einmal praktisch durchspielen",
    actionDetail:
      "Erbringen Sie eine relevante Kundenaufgabe mit Ihrer Ausweichlösung. Dokumentieren Sie Ergebnisqualität, Datenübernahme, Kosten und Zeit bis zum Mindestbetrieb.",
  },
  {
    id: "Q11",
    group: "control",
    text: "Wie leicht könnten falsche Ergebnisse unbemerkt beim Kunden landen?",
    low: "Relevante Fehler werden systematisch abgefangen",
    high: "Für relevante Fehler fehlen belastbare Prüfungen",
    help: "Auch ein sehr leistungsfähiges Team kann Fehler machen. Woran würden Sie erkennen, dass ein Ergebnis fachlich falsch, unvollständig oder für den Kunden unbrauchbar ist?",
    example:
      "Eine überzeugende Analyse enthält eine falsche Zahl. Gibt es vor der Nutzung eine Prüfung, die diesen Fehler zuverlässig entdecken könnte?",
    action: "Eine wiederholbare Ergebnisprüfung aufbauen",
    actionDetail:
      "Definieren Sie repräsentative Aufgaben, bekannte Fehlerarten und Akzeptanzgrenzen. Prüfen Sie neue Werkzeuge und geänderte Abläufe erneut an denselben Fällen.",
  },
  {
    id: "Q12",
    group: "control",
    text: "Wie viel fehlt Ihnen, um Ihr Angebot innerhalb von sechs Monaten zu verändern?",
    low: "Verantwortung, Ressourcen und Umsetzung klar",
    high: "Wesentliche Voraussetzungen fehlen",
    help: "Angenommen, das Expertenteam wird in sechs Monaten zum ernsthaften Wettbewerber: Wer könnte Ihr Angebot, Ihre Abläufe oder Ihre Preise bis dahin verändern?",
    example:
      "Die Idee steht fest. Wenn Budget, Zuständigkeit oder die Zustimmung wichtiger Kunden fehlen, könnte die tatsächliche Umstellung trotzdem zu spät kommen.",
    action: "Eine Anpassung innerhalb des Zeitfensters erproben",
    actionDetail:
      "Legen Sie eine konkrete Veränderung, eine verantwortliche Person, das nötige Budget und ein überprüfbares Ergebnis innerhalb von sechs Monaten fest.",
  },
];
