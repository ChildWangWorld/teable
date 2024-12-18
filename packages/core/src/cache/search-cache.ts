import { LRUCache } from 'lru-cache';
import type { ISearchResult, ISearchMetadata } from '../types/search';

export interface ISearchCache {
  key: string;
  results: ISearchResult[];
  timestamp: number;
  metadata: ISearchMetadata;
}

const defaultCacheOptions = {
  max: 500, // Maximum number of items
  ttl: 1000 * 60 * 5, // Time to live: 5 minutes
  updateAgeOnGet: true,
};

export class SearchCacheManager {
  private cache: LRUCache<string, ISearchCache>;

  constructor(options = defaultCacheOptions) {
    this.cache = new LRUCache(options);
  }

  public set(key: string, results: ISearchResult[], metadata: ISearchMetadata): void {
    this.cache.set(key, {
      key,
      results,
      timestamp: Date.now(),
      metadata,
    });
  }

  public get(key: string): ISearchCache | undefined {
    return this.cache.get(key);
  }

  public delete(key: string): void {
    this.cache.delete(key);
  }

  public clear(): void {
    this.cache.clear();
  }

  public getStats(): { size: number } {
    return {
      size: this.cache.size,
    };
  }
}
