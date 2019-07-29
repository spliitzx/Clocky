import { Injectable } from '@angular/core';
import { existsSync, writeFileSync, fstat } from 'fs';

@Injectable()
export class FileService {
    constructor() {}

    public async write(path: string, content: string) {
        try {
            await writeFileSync(path, content);
            console.log('%c [FileService]', 'color: orange; font-weight: bold;', `Successfully written to file at ${Date.now()}`);
        } catch (e) {
            console.log('An error occurred. Maybe check permissions?');
            console.error(e);
        }
    }
}
