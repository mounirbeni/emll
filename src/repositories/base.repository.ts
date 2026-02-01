/**
 * Base Repository Interface
 * Defines common CRUD operations for all repositories
 */

export interface BaseRepository<T, TCreateInput, TUpdateInput, TWhereInput> {
    create(data: TCreateInput): Promise<T>;
    findById(id: string): Promise<T | null>;
    findMany(options?: FindManyOptions<TWhereInput>): Promise<T[]>;
    update(id: string, data: TUpdateInput): Promise<T>;
    delete(id: string): Promise<void>;
    count(where?: TWhereInput): Promise<number>;
}

export interface FindManyOptions<TWhereInput> {
    where?: TWhereInput;
    skip?: number;
    take?: number;
    orderBy?: Record<string, unknown> | Record<string, unknown>[];
    include?: Record<string, boolean | object>;
    select?: Record<string, boolean>;
}

export interface PaginationOptions {
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
