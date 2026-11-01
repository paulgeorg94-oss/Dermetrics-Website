// Every string here is taken from the text already on dermetrics.ch
// (index.html / en/index.html) or is a plain UI label for it.
export type Lang = 'de' | 'en'

export const T = {
  de: {
    overview: 'Übersicht',
    skinScore: 'Haut-Score',
    since: '+4 seit Mai',
    uvToday: 'UV-Index heute',
    uvValue: '3 · moderat',
    nextAppt: 'Nächster Termin',
    nextApptValue: 'PDT · Mi 12. Aug, 10:30',
    reminder: 'Erinnerung an Ihre Kontrolle: nächste Messung Feb 2027',
  },
  en: {
    overview: 'Overview',
    skinScore: 'Skin Score',
    since: '+4 since May',
    uvToday: 'UV index today',
    uvValue: '3 · moderate',
    nextAppt: 'Next appointment',
    nextApptValue: 'PDT · Wed 12 Aug, 10:30',
    reminder: 'Check-up reminder: next measurement Feb 2027',
  },
} as const

export type Strings = (typeof T)[Lang]
