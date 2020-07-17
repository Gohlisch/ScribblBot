import {TableValues} from "./model/table_values";

export const HELP_MESSAGE: string = `
    Verwende als erstes Zeichen deiner Nachricht +, - oder ? um Wörter hinzuzufügen, zu löschen oder abzufragen. Trenne Wörter durch Absätze.
        Wörter hinzufügen:\t\t+[Hier deine Wörter] Die Wörter dürfen nicht schon existieren. Sie dürfen max 50 Zeichen haben.
        Wörter löschen:\t\t-[Hier deine Wörter] Wenn die Wörter existieren, werden sie gelöscht.
        Wörter abfragen:\t\t?[Hier deine Wörter] Schaue, welche der Wörter bereits eingetragen sind.
        
    Verwende ! um Befehle auszuführen:
        !show\t\tzeigt alle eingetragenen Wörter in einer Liste
`;

export const DB_VALUES: object = {
    user: 'username',
    host: '127.0.0.1',
    database: 'skribbl',
    password: 'admin',
    port: 5432,
};

export const TABLE_VALUES: TableValues = {
    schema: "public",
    table: "words",
    wordColumn: "word"
};
