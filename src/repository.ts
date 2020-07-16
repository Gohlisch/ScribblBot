import {Client} from "pg";

interface TableValues {
    schema: string;
    table: string;
    wordColumn: string;
}

const dbValues: object = {
    user: 'timgohlisch',
    host: '127.0.0.1',
    database: 'scribbl',
    password: 'admin',
    port: 5432,
};

const tableValues: TableValues = {
    schema: "public",
    table: "words",
    wordColumn: "word"
};

export class Repository {
    client;

    constructor() {
        this.client = new Client(dbValues);
    }

    public add(words: string[]): boolean {
        console.log(words);
        if(words.length == 0) return;
        let query: string = `
        INSERT into ${tableValues.schema}.${tableValues.table} (${tableValues.wordColumn}) VALUES 
        `;

        for(const word of words) {
            query = query.concat(`('${word}'),`);
        }
        query = query.slice(0, query.length-1).concat(';');

        return this.makeQuery(query);
    }

    private makeQuery(query: string): boolean {
        this.client.connect();
        let querySuccessfull;

        return this.client
            .query(query)
            .then(res => {
                console.log('Ran query successfully');
                querySuccessfull = true;
            })
            .catch(err => {
                console.error(err);
                querySuccessfull = false
            })
            .finally(() => {
                this.client.end();
                return querySuccessfull;
            });
    }
}

export const repository: Repository = new Repository();
