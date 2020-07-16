import {Client} from "pg";
import {QueryAnswer} from "./model/query_answer";
import {DB_VALUES, TABLE_VALUES} from "./consts";

export class Repository {
    client;

    constructor() {
        this.client = new Client(DB_VALUES);
        this.client.connect();
    }

    public add(words: string[], callback: ((bool)=>void)): void {
        return this.client.query(Repository.createInsertQuery(words))
            .then(()=>callback(true))
            .catch((err: Error)=>{console.error(err); callback(false);});
    }

    public remove(words: string[], callback: ((bool)=>void)): void {
        return this.client.query(Repository.createDropQuery(words))
            .then(()=>callback(true))
            .catch((err: Error)=>{console.error(err); callback(false);});
    }

    public select(words: string[], callback: (found:string[])=>void): void {
        let foundWords: string[] = [];

        this.client.query(Repository.createSelectQuery(words))
            .then((res: QueryAnswer) => {
                res.rows.forEach(row => foundWords.push(row.word));
                callback(foundWords);
            })
            .catch(err => {
                console.error(err);
                callback(foundWords);
            });
    }

    public selectAll(callback: (found:string[])=>void) {
        let foundWords: string[] = [];

        this.client.query(`SELECT * FROM ${TABLE_VALUES.schema}.${TABLE_VALUES.table};`)
            .then((res: QueryAnswer) => {
                res.rows.forEach(row => foundWords.push(row.word));
                callback(foundWords);
            })
            .catch(err => {
                console.error(err);
                callback(foundWords);
            });
    }

    static createInsertQuery(words: string[]): string {
        let query: string = `INSERT into ${TABLE_VALUES.schema}.${TABLE_VALUES.table} (${TABLE_VALUES.wordColumn}) VALUES`;

        for(let word of words) {
            word = Repository.toLowerCaseAndDuplicatedQuotes(word);
            query = query.concat(` ('${word}'),`);
        }

        return query.slice(0, query.length-1).concat(';');
    }

    static createDropQuery(words: string[]): string {
        let query: string = `DELETE FROM ${TABLE_VALUES.schema}.${TABLE_VALUES.table} WHERE`;

        for(let word of words) {
            word = Repository.toLowerCaseAndDuplicatedQuotes(word);
            query = query.concat(` ${TABLE_VALUES.wordColumn} = '${word}' OR`);
        }

        return query.slice(0, query.length-2).concat(';');
    }

    static createSelectQuery(words: string[]): string {
        let query: string = `SELECT ${TABLE_VALUES.wordColumn} FROM ${TABLE_VALUES.schema}.${TABLE_VALUES.table} WHERE`;

        for(let word of words) {
            word = Repository.toLowerCaseAndDuplicatedQuotes(word);
            query = query.concat(` ${TABLE_VALUES.wordColumn} = '${word}' OR`);
        }

        return query.slice(0, query.length-2).concat(';');
    }

    static toLowerCaseAndDuplicatedQuotes(word: string): string {
        return word.replace("'", "''").toLowerCase().trim();
    }
}

export const repository: Repository = new Repository();
