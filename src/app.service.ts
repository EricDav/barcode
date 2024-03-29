import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { handleErrorCatch, sendEmail } from './helper';
import { Product } from './models/product.model';
import { User } from './models/user.model';
import * as crypto from 'crypto';
import * as bcrypt from "bcrypt";

@Injectable()
export class AppService {
  private productRepo: Repository<Product>;
  private userRepo: Repository<User>;

  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {
    this.productRepo = this.entityManager.getRepository(Product);
    this.userRepo = this.entityManager.getRepository(User);
  }

  async createProduct(data: any) {
    try {
      const user = await this.userRepo.findOne({
        where: {
          token: data.token
        }
      });

      if (!user) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: `User with email: ${data.email} not found`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const product = await this.productRepo.save({
        ...data,
        user: user
      });
      return {
        product
      }
    } catch(err) {
      handleErrorCatch(err);
    }
  }

  async fetchProduct(data: any) {
    try {
      const product = await this.productRepo.findOne({
        where: {
          tagId: data.tagId
        },
        relations: ['user']
      });

      if (!product) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: `Product with the tag number: ${data.serialNumber} not found`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const scannedBy = product.user;
      delete product.user;

      return {
        ...product,
        scannedBy
      };
    } catch(err) {
      handleErrorCatch(err);
    }
  }

  async fetchProducts(data: any) {
    try {
      const pageSize = data.pageSize || 10;
      const currentPage = data.currentPage || 1;
      const offset = (currentPage - 1) * pageSize;
      let productQuery = this.productRepo
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.user', 'user')
        .take(pageSize)
        .skip(offset);

      if (data.userId) {
        productQuery.andWhere(`product.userId = :userId`, { userId: data.userId})
      }

      const [products, total] = await productQuery.getManyAndCount();
      const productData  = products.map((product) => {
        delete product.user.token;
        delete product.user.code;
        const scannedBy = product.user
        delete product.user;
        return {
          ...product,
          scannedBy
        }
      });

      return {
        products: productData,
        pagination: {
          currentPage,
          pageSize: products.length,
          total
        }
      };
    } catch(err) {
      handleErrorCatch(err);
    }
  }

  async sendCode(data) {
    try {
      const user = await this.userRepo.findOne({
        where: {
          email: data.email
        }
      });

      if (!user) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: `User with email: ${data.email} not found`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const code = Math.floor(Math.random() * 1000000).toString();
      await this.userRepo.save({
        ...user,
        code
      });
      sendEmail(user.email, code);

      return {
        success: true,
        message: 'Check your email a token has been sent'
      }
    } catch(err) {
      handleErrorCatch(err);
    }
  }

  async login(data) {
    try {
      let user = await this.userRepo.findOne({
        where: {
          email: data.email
        }
      });

      if (!user) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: `User with email: ${data.email} not found`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      if (user.code === data.code) {
        user =  await this.userRepo.save({
          ...user,
          token: crypto.createHash('md5').update(`${data.code}:${user.email}:${user.id}`).digest('hex')
        })
        return {
          success: true,
          data: user
        }
      }

      return {
        success: false
      }
    } catch(err) {
      handleErrorCatch(err);
    }
  }
}
