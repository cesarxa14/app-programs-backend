import { DataSource } from "typeorm";
import { AppDataSource } from "../ddbb/data-source";
import { Assist } from "../entities/Assists";
import { PackageLogic } from "./package.logic";
import { Subscription } from "../entities/Subscription";
import { sendMail } from "./logic_mailer";
import { UserLogic } from "./user.logic";
import config  from '../config/mail.config';

const packageLogic = new PackageLogic(AppDataSource);
const userLogic = new UserLogic(AppDataSource);
export class AssistLogic {

  private dataSource;
  constructor(dataSource: DataSource) {
    dataSource = AppDataSource;
    this.dataSource = dataSource;
  }

  async getAssistByAdmin(query: any) {
    try {
      const { userId } = query;
      let sql = `
               SELECT a.*, pr.name AS program_name, pa.name AS package_name
                FROM assists a
                INNER JOIN programs pr ON a.program_id = pr.id
                INNER JOIN packages pa ON a.package_id = pa.id
                WHERE a.assistant_id = $1
                AND a.deleted = 0
                ORDER BY a.id DESC;       
                       
        `

      const results = await AppDataSource.query(sql, [userId])

      return results;
    } catch (err) {
      console.log('err: ', err)
      throw err;
    }
  }

  async getAssistByCustomer(query: any) {
    try {
      const { userId } = query;
      let sql = `
               SELECT a.*, pr.name AS program_name, pa.name AS package_name
                FROM assists a
                INNER JOIN programs pr ON a.program_id = pr.id
                INNER JOIN packages pa ON a.package_id = pa.id
                WHERE a.student_id = $1
                AND a.deleted = 0
                ORDER BY a.id DESC;    
                       
        `

      const results = await AppDataSource.query(sql, [userId])

      return results;
    } catch (err) {
      console.log('err: ', err)
      throw err;
    }
  }

  async getAssistsByUserPackages(query: any) {

    try {

      const { userId } = query;
      let sql = `
                    SELECT 
                        assist.created_at AS assistDate,
                        assist."classHour" AS classHour, 
                        CONCAT(assistant.name, ' ', assistant.lastname) AS instructor,
                        CONCAT(student.name, ' ', student.lastname) AS student, 
                        program.name AS program_name
						
                    FROM 
                        assists assist
                    INNER JOIN 
                        users assistant ON assist.assistant_id = assistant.id
                    INNER JOIN 
                        users student ON assist.student_id = student.id
                    INNER JOIN 
                        programs program ON assist.program_id = program.id
                    INNER JOIN 
                        packages package ON assist.package_id = package.id
                    INNER JOIN
                      subscriptions sub ON sub.id = assist.subscription_id 
                              WHERE 
                                  student.id = $1
                                  AND assist.deleted = 0
                                  AND sub."isActive" = true
                      
                              ORDER BY assist.id DESC
                       
            `

      const results = await AppDataSource.query(sql, [userId])

      return results;
    } catch (err) {
      console.log('error: ', err)
    }
  }

  async getLastAssistsByUserPackages(assistId: any) {

    try {

      let sql = `
                   SELECT 
                        assist.created_at AS assistDate,
                        assist."classHour" AS classHour, 
                        CONCAT(assistant.name, ' ', assistant.lastname) AS instructor,
                        CONCAT(student.name, ' ', student.lastname) AS student, 
                        program.name AS program_name
						
                    FROM 
                        assists assist
                    INNER JOIN 
                        users assistant ON assist.assistant_id = assistant.id
                    INNER JOIN 
                        users student ON assist.student_id = student.id
                    INNER JOIN 
                        programs program ON assist.program_id = program.id
                    INNER JOIN 
                        packages package ON assist.package_id = package.id
                    INNER JOIN
                      subscriptions sub ON sub.id = assist.subscription_id 
                              WHERE 
                                 
                                   assist.deleted = 0
                                  
                      			AND assist.id = $1
                              ORDER BY assist.id DESC
                       
            `

      const results = await AppDataSource.query(sql, [assistId])

      return results;
    } catch (err) {
      console.log('error: ', err)
    }
  }

  async validateAssistLimitDate(package_id: number){
    try{
      let sql = `
            SELECT 
                  sa."startDate" + INTERVAL '1 day' * pa.expiration::INTEGER AS limit_date
            FROM subscriptions su
            JOIN sales sa ON sa.id = su.sale_id
            JOIN packages pa ON pa.id = su.package_id
            WHERE pa.id = $1
            AND su."isActive" = true;
                       
        `;

      const results = await AppDataSource.query(sql, [package_id])

      return results;

    } catch(err){
      console.log('error: ', err)
    }
  }

  async createAssist(body: any) {

    try {

      const { program, assistant, student, pack, subscription,  classHour, additional_notes } = body;
      console.log('body: ', body)

      // VALIDAMOS QUE LA FECHA DE EXPIRACION SEA MAYOR AL DIA ACTUAL
      const resultLimitDate = await this.validateAssistLimitDate(pack);
      const limitDate = resultLimitDate[0].limit_date;
      const today = new Date();
      if (new Date(limitDate) < today) {
        throw new Error("El paquete ya venció")
      }

      
      const resultAssist = await this.getAssistsByUserPackages({ userId: student });
      const numberAssist = resultAssist.length;
      const numClasesResult = await packageLogic.getNumClassesByUser({ userId: student });
      const numClases = numClasesResult[0].num_clases;
      if (numberAssist >= numClases) {
        throw new Error("Usuario ya no tiene clases disponibles")
      }
      console.log('resultAssist: ', resultAssist);
      console.log('numClases', numClases)

      // const userWithPackage = await logi
      console.log('body:', body)
      let newAssist = new Assist();
      newAssist.program = program;
      newAssist.assistant = assistant;
      newAssist.student = student;
      newAssist.package = pack;
      newAssist.classHour = classHour
      newAssist.additional_notes = additional_notes;
      newAssist.subscription = subscription;

      const savedAssist = await AppDataSource.getRepository(Assist).save(newAssist);

      const fullAssist = await AppDataSource.getRepository(Assist).findOne({
        where: { id: savedAssist.id },
      });

      // SI YA ES LA ULTIMA ASISTENCIA DISPONIBLE REGISTRADA, LO INACTIVAMOS
      if (numberAssist == numClases - 1) {

        const subscriptionFound = await AppDataSource.getRepository(Subscription).findOne({
          where: {
            id: subscription,
            service: fullAssist.package,
            user: fullAssist.student
          }
        })
        subscriptionFound.isActive = false;
        await AppDataSource.getRepository(Subscription).save(subscriptionFound)
        console.log('Subscription updated successfully')

        console.log('id', savedAssist.id)
        const assistData = await this.getLastAssistsByUserPackages(savedAssist.id)
        console.log('assistData: ', assistData)
        return {isLast: true, fullAssist: assistData}

      }else {
        return {isLast: false, fullAssist};
      }

      
    } catch (err) {
      console.log('err: ', err)
      throw err;
    }

  }

  async sendReminder(body: any) {
    try {

      const { studentId } = body;

      const studentFound = await userLogic.getUserById(studentId);

      if (!studentFound) throw new Error('Student not found')

      const bodyHTML1 = `
            <div>
                <h1>Subscripcion a punto de vencer!</h1>
                <p>
                    Hola ${studentFound.name}, tienes una clase pendiente, comentanos si deseas renovar.
                </p>
            </div>
        `;

      const bodyHTML = `
<div style="font-family: Arial, sans-serif; color: #000000; padding: 20px; max-width: 600px; margin: auto;">
    <div style="text-align: center;">
        <img src="https://copiloto.sigties.com/files/project_files/21/_file67605e200f519-logook.png" alt="Nadar es Vida" style="max-width: 200px;"/>
    </div>
    <h1 style="color: #2fa3ce; text-align: center;">Subscripción a punto de vencer!</h1>
    <p style="font-size: 16px; line-height: 1.5;">
        Hola ${studentFound.name}, tienes una clase pendiente, coméntanos si deseas renovar.
    </p>
<div style="text-align: center; margin-top: 20px;">
    <a href="https://wa.link/bbv21m" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: white; background-color: #4CAF50; text-decoration: none; border: none; border-radius: 5px; cursor: pointer; transition: background-color 0.3s ease;"
       onmouseover="this.style.backgroundColor='#45a049';" 
       onmouseout="this.style.backgroundColor='#4CAF50';" 
       onmousedown="this.style.backgroundColor='#3e8e41';" 
       onmouseup="this.style.backgroundColor='#45a049';">
       Renovar Subscripción
    </a>
</div>
    <p style="text-align: center; font-size: 14px; color: #555555; margin-top: 20px;">Gracias por elegir Nadar es Vida. ¡Nos vemos en el mar!</p>
</div>
`;


      await sendMail(config.email,studentFound.email, config.subjects.reminder, 'Por vencer', bodyHTML)
      return true;
    } catch (err) {
      console.log('err: ', err)
      throw err;
    }
  }

}