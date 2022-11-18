import { Controller, Get, Post, Req } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}


  @Post('/login')
  logn(@Req() data: any): any {
    return this.appService.login(data.body);
  }

  @Post('/code')
  sendCode(@Req() data: any): any {
    return this.appService.sendCode(data.body);
  }

  @Post('/products')
  createProduct(@Req() data: any): any {
    return this.appService.createProduct(data.body);
  }

  @Get('/products/:tagId')
  getProduct(@Req() data: any): any {
    return this.appService.fetchProduct({ ...data.params });
  }

  @Get('/products')
  getProducts(@Req() data: any): any {
    return this.appService.fetchProducts({ ...data.params });
  }
}
