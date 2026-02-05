import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthModule } from './auth/auth-module';
import { UserModule } from './user/user-module';
import { AdminModule } from './admin/admin-module';
import { ArticlesModule } from './articles/articles-module';
import { HomeModule } from './home/home-module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AuthModule,
    UserModule,
    AdminModule,
    ArticlesModule,
    HomeModule
  ]
})
export class FeaturesModule { }
