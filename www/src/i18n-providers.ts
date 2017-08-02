import { TRANSLATIONS, TRANSLATIONS_FORMAT, LOCALE_ID } from '@angular/core';
import { TRANSLATION_DE } from './locale/messages.de';

export function getTranslationProviders(): Promise<any[]> {
    // Get the locale id from the global
    const locale = document['locale'] as string;
    let translations = '';

    // return no providers if fail to get translation file for locale
    const noProviders: any[] = [];

    // No locale or U.S. English: no translation providers
    if (!locale || locale === 'en-US') {
        return Promise.resolve(noProviders);
    } else if (locale === 'de') {
        translations = TRANSLATION_DE;
    }

    return Promise.resolve([
        { provide: TRANSLATIONS, useValue: translations },
        { provide: TRANSLATIONS_FORMAT, useValue: 'xlf' },
        { provide: LOCALE_ID, useValue: locale }
    ]);
}
