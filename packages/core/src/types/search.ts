export interface ISearchResult {
  id: string;
  fieldId: string;
  value: unknown;
  score?: number;
}

export interface ISearchMetadata {
  query: string;
  timestamp: number;
  executionTime: number;
  totalResults: number;
  indexUsed?: string;
}

export interface ISearchOptions {
  limit?: number;
  offset?: number;
  minScore?: number;
  useCache?: boolean;
  indexHint?: string;
}

export type ISearchAggregateFunction = 'count' | 'sum' | 'avg' | 'min' | 'max';

export interface ISearchAggregation {
  function: ISearchAggregateFunction;
  field: string;
  alias?: string;
}
