import { Logger, NotFoundException } from '@nestjs/common';
import {
  EntityManager,
  FindManyOptions,
  FindOneOptions,
  FindOptionsOrder,
  FindOptionsRelationByString,
  FindOptionsRelations,
  FindOptionsWhere,
  Like,
  Repository,
  SaveOptions,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { PaginationDto } from '../dto';
import { paginate } from '../interfaces';

export type DynamicObject = {
  [key: string]: any;
};

export abstract class AbstractRepository<T> {
  protected abstract readonly logger: Logger;
  protected abstract readonly entityName: string;

  constructor(
    private readonly entityRepository: Repository<T>,
    private readonly entityManager: EntityManager,
  ) {}

  public async query(query: string, parameters?: any[]) {
    return this.entityRepository.query(query, parameters);
  }

  public getRepositoryBaseQuery(alias?: string) {
    return this.entityRepository.createQueryBuilder(alias);
  }

  async create<E extends T | T[]>(
    entity: E,
    options?: SaveOptions,
  ): Promise<E> {
    return this.entityManager.save(entity, options);
  }

  async findOne(options: FindOneOptions<T>, isSkipNotFound: boolean = false) {
    const entity = await this.entityRepository.findOne(options);

    if (!entity) {
      this.logger.warn(
        `${this.entityName} not found with options: ${JSON.stringify(options)}`,
      );

      if (!isSkipNotFound) {
        throw new NotFoundException(`${this.entityName} not found`);
      }
    }

    return entity;
  }

  async findOneRaw(
    where?: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    isSkipNotFound: boolean = false,
  ) {
    const entity = this.getRepositoryBaseQuery('entity').andWhere(where);

    if (!(await entity.getOne())) {
      this.logger.warn(
        `${this.entityName} not found with where: ${JSON.stringify(where)}`,
      );

      if (!isSkipNotFound) {
        throw new NotFoundException(`${this.entityName} not found`);
      }
    }

    return entity;
  }

  async findOneAndUpdate(
    where: FindOptionsWhere<T>,
    partialEntity: QueryDeepPartialEntity<T>,
  ): Promise<T> {
    const updateResult = await this.entityRepository.update(
      where,
      partialEntity,
    );

    if (!updateResult.affected) {
      this.logger.warn(
        `${this.entityName} not found with where: ${JSON.stringify(where)}`,
      );

      throw new NotFoundException(`${this.entityName} not found`);
    }

    return await this.findOne({ where });
  }

  async findAll(options?: FindManyOptions<T>) {
    return this.entityRepository.find(options);
  }

  async findAndCount(options?: FindManyOptions<T>) {
    return this.entityRepository.findAndCount(options);
  }

  async count(options?: FindManyOptions<T>) {
    return this.entityRepository.count(options);
  }

  async findOneAndDelete(
    where: FindOptionsWhere<T>,
    isSkipNotFound: boolean = false,
  ) {
    if (!isSkipNotFound) {
      await this.findOne({ where });
    }

    return this.entityRepository.delete(where);
  }

  async pagination({
    filter,
    initialCondition,
    keySearch,
    initialKeySort = 'id',
    relations,
  }: {
    filter: PaginationDto;
    initialCondition?: FindOptionsWhere<T> | FindOptionsWhere<T>[];
    keySearch: string | string[];
    initialKeySort?: string;
    relations?: FindOptionsRelationByString | FindOptionsRelations<T>;
  }) {
    let condition: FindOptionsWhere<T> | FindOptionsWhere<T>[] =
      initialCondition || []; // Initialize as an empty array if no initialCondition
    const direction = filter.orderBy?.direction || 'ASC';
    const fieldSort = filter.orderBy?.name || initialKeySort;

    // Check if there's a search value and add it to the condition array
    if (filter.search?.trim()) {
      const searchTerm = `%${filter.search}%`;

      // Create an array of conditions for each keySearch
      const orConditions = Array.isArray(keySearch)
        ? keySearch.map((key) => ({
            [key]: Like(searchTerm),
          }))
        : [{ [keySearch]: Like(searchTerm) }];

      // Combine the search conditions with OR
      condition = orConditions as FindOptionsWhere<T> | FindOptionsWhere<T>[];
    }

    const sort: FindOptionsOrder<T> = {
      [fieldSort]: direction,
    } as FindOptionsOrder<T>;

    // Ensure condition is an array before passing it to `findAndCount`
    const [data, count] = await this.findAndCount({
      relations,
      where: condition,
      order: sort,
      skip: (filter.page - 1) * filter.limit, // Mengatur offset berdasarkan halaman
      take: filter.limit, // Mengambil data sesuai jumlah per halaman
    });

    return paginate(data, count, filter);
  }

  async truncate() {
    return this.entityRepository.delete({});
  }
}
