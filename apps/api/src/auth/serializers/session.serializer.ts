import { Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../../users/user.entity";

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) {
    super();
  }

  serializeUser(user: User, done: (err: Error | null, id?: string) => void) {
    done(null, user.id);
  }

  async deserializeUser(
    id: string,
    done: (err: Error | null, user?: User | null) => void
  ) {
    try {
      const user = await this.usersRepository.findOne({ where: { id } });
      done(null, user ?? null);
    } catch (err) {
      done(err as Error);
    }
  }
}
