import { Entity, JoinColumn, OneToMany } from "typeorm";
import { Employee } from "./employee.entity";
import { Media } from "src/entities/media.entity";

@Entity({name: "media"})
export class Avatar extends Media {
  @OneToMany(() => Employee, employee => employee.avatar)
  @JoinColumn({ name: 'id' })
  public employees: Promise<Employee[]>
}