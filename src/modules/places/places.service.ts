/*
https://docs.nestjs.com/providers#services
*/

import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { UpsertPlaceDto } from './dto';
import { Response } from 'express';
import { isNumberString } from 'class-validator';
import { PaginationMetaParams } from 'src/dto/paginationMeta.dto';
import { FetchDto } from 'src/dto/fetch.dto';

@Injectable()
export class PlacesService {
  constructor(private prisma: PrismaService) {}

  createQuery(fetchDto: FetchDto) {
    const { search } = fetchDto;

    return {
      ...(search && {
        OR: [
          isNumberString(search)
            ? {
                phoneNumber: { contains: search },
              }
            : {
                displayName: {
                  contains: search,
                  mode: 'insensitive' as any,
                },
              },
        ],
      }),
    };
  }

  async paginate(fetchDto: FetchDto, response: Response): Promise<any[]> {
    try {
      const { limit, page, sortBy, sortDirection } = fetchDto;
      const where = this.createQuery(fetchDto);
      const result = await this.prisma.place.findMany({
        where,
        take: +limit,
        skip: (+page - 1) * +limit,
        orderBy: { [sortBy]: sortDirection },
      });

      const totalDocs = await this.prisma.place.count({ where });

      if (response.set) {
        response.set(
          'meta',
          JSON.stringify({
            totalDocs,
            totalPages: Math.ceil(totalDocs / (+limit || 10)),
          } as PaginationMetaParams),
        );
      }

      return result;
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }

  async findMany() {
    try {
      const result = await this.prisma.place.findMany();
      return result;
    } catch (e) {
      throw new UnprocessableEntityException(e?.message);
    }
  }

  async findByGoogleId(id: string) {
    try {
      const result = await this.prisma.place.findUnique({
        where: { googleMapLink: id },
      });
      return result;
    } catch (e) {
      throw new UnprocessableEntityException(e?.message);
    }
  }

  async create(createPlace) {
    try {
      const result = await this.prisma.place.create({ data: createPlace });
      return result;
    } catch (e) {
      throw new UnprocessableEntityException(e?.message);
    }
  }

  async upsert(upsertPlace: UpsertPlaceDto) {
    try {
      const { googleMapLink } = upsertPlace;
      const result = await this.prisma.place.upsert({
        where: { googleMapLink },
        create: upsertPlace,
        update: upsertPlace,
      });
      return result;
    } catch (e) {
      throw new UnprocessableEntityException(e?.message);
    }
  }
}
