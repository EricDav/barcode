import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { handleErrorCatch, sendEmail } from './helper';
import { Product } from './models/product.model';
import { User } from './models/user.model';

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

      await this.productRepo.save({
        ...data,
        userId: user.id
      });
      return {
        success: true
      }
    } catch(err) {
      handleErrorCatch(err);
    }
  }

  async fetchProduct(data: any) {
    try {
      const product = this.productRepo.findOne({
        where: {
          serialNumber: data.serialNumber
        }
      });

      if (!product) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: `Product with the serial number: ${data.serialNumber} not found`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        product
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

      if (user.code === data.code) {
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
