import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { configValidationSchema } from './config.schema';
import { LoggerModule } from '@app/common';
import { EmployeesModule } from './employees/employees.module';
import { AuthModule } from './auth/auth.module';
import { LeavesModule } from './leaves/leaves.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      validationSchema: configValidationSchema,
    }),
    UsersModule,
    LoggerModule,
    EmployeesModule,
    AuthModule,
    LeavesModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
