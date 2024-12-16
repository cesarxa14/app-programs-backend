import { DataSource } from "typeorm";
import { AppDataSource } from "../ddbb/data-source";
import { Assist } from "../entities/Assists";
import { PackageLogic } from "./package.logic";

const packageLogic = new PackageLogic(AppDataSource);
export class AssistLogic {

    private dataSource;
    constructor(dataSource: DataSource){
      dataSource = AppDataSource;
      this.dataSource = dataSource;
    }

    async getAssistByAdmin(query: any) {
      try{
        const {userId} = query;
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
      } catch(err) {
        console.log('err: ', err)
        throw err;
      }
    }

    async getAssistByCustomer(query: any) {
      try{
        const {userId} = query;
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
      } catch(err) {
        console.log('err: ', err)
        throw err;
      }
    }

    async getAssistsByUserPackages(query: any){

        try{
          
            const {userId} = query;
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
                    WHERE 
                        student.id = $1
                        AND assist.deleted = 0
                       
            `
                
            const results = await AppDataSource.query(sql, [userId])
    
            return results;
        } catch(err) {
          console.log('error: ', err)
        }
      }

    async createAssist(body: any){

        try {
          const { program, assistant, student, pack, classHour, additional_notes } = body;
          

          const resultAssist = await this.getAssistsByUserPackages({userId: student});

          const numberAssist = resultAssist.length;
          const numClasesResult = await packageLogic.getNumClassesByUser({userId: student});

          const numClases = numClasesResult[0].num_clases;

          if(numberAssist >= numClases){
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

    
            const savedAssist = await AppDataSource.getRepository(Assist).save(newAssist);
    
            const fullAssist = await AppDataSource.getRepository(Assist).findOne({
                where: { id: savedAssist.id },
              });
    
            return fullAssist;
        } catch(err) {
          console.log('err: ', err)
          throw err;
        }
    
      }

}