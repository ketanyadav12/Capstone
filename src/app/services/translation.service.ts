import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

type TranslationMap = Record<string, unknown>;

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private readonly STORAGE_KEY = 'svd_language';
  private readonly FALLBACK_LANGUAGE = 'en';
  private readonly LANGUAGES = ['en', 'hi', 'bn', 'kn', 'ml', 'mr', 'or', 'pa', 'te'];

  private readonly languageSubject = new BehaviorSubject<string>(this.FALLBACK_LANGUAGE);
  private readonly dictionarySubject = new BehaviorSubject<TranslationMap>({});

  readonly language$ = this.languageSubject.asObservable();
  readonly dictionary$ = this.dictionarySubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  initializeLanguage(): void {
    const savedLanguage = localStorage.getItem(this.STORAGE_KEY);
    const language = savedLanguage && this.LANGUAGES.includes(savedLanguage)
      ? savedLanguage
      : this.FALLBACK_LANGUAGE;
    this.useLanguage(language);
  }

  getCurrentLanguage(): string {
    return this.languageSubject.getValue();
  }

  getAvailableLanguages(): string[] {
    return [...this.LANGUAGES];
  }

  useLanguage(language: string): void {
    const normalizedLanguage = this.LANGUAGES.includes(language) ? language : this.FALLBACK_LANGUAGE;
    this.loadDictionary(normalizedLanguage).subscribe((dictionary) => {
      this.dictionarySubject.next(dictionary);
      this.languageSubject.next(normalizedLanguage);
      localStorage.setItem(this.STORAGE_KEY, normalizedLanguage);
      document.documentElement.lang = normalizedLanguage;
    });
  }

  translate(key: string): string {
    const dictionary = this.dictionarySubject.getValue();
    const resolved = this.resolveKey(dictionary, key);
    if (typeof resolved === 'string') {
      return resolved;
    }
    return key;
  }

  private loadDictionary(language: string): Observable<TranslationMap> {
    return this.http.get<TranslationMap>(`/assets/i18n/${language}.json`).pipe(
      map((dictionary) => dictionary ?? {}),
      catchError(() => {
        if (language === this.FALLBACK_LANGUAGE) {
          return of({});
        }
        return this.http.get<TranslationMap>(`/assets/i18n/${this.FALLBACK_LANGUAGE}.json`).pipe(
          map((dictionary) => dictionary ?? {}),
          catchError(() => of({}))
        );
      }),
      tap(() => undefined)
    );
  }

  private resolveKey(dictionary: TranslationMap, key: string): unknown {
    return key.split('.').reduce<unknown>((acc, segment) => {
      if (typeof acc === 'object' && acc !== null && segment in acc) {
        return (acc as Record<string, unknown>)[segment];
      }
      return undefined;
    }, dictionary);
  }
}