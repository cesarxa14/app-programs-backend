import { DataSource } from "typeorm";
import { AppDataSource } from "../ddbb/data-source";
import { Assist } from "../entities/Assists";

export class AssistLogic {

    private dataSource;
    constructor(dataSource: DataSource){
      dataSource = AppDataSource;
      this.dataSource = dataSource;
    }

    async getAssistsByUserPackages(query: any){

        try{
          
            const {userId} = query;
            let sql = `
                    SELECT 
                        assist.created_at AS assistDate, 
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

            // const results = await AppDataSource.getRepository(Assist)
            // .createQueryBuilder('assist')
            // // Relación con el asistente
            // .innerJoinAndSelect('assist.assistant', 'assistant')
            // // Relación con el estudiante
            // .innerJoinAndSelect('assist.student', 'student')
            // // Relación con el programa
            // .innerJoinAndSelect('assist.program', 'program')
            // // Relación con el paquete
            // .innerJoinAndSelect('assist.package', 'package')
            // // Opcional: Filtrado (por ejemplo, solo los activos)
            // .where('student.id = :studentId', { userId })
            // .andWhere('assist.deleted = :deleted', { deleted: 0 }) // Opcional: filtro adicional
            // .getMany();
    
            return results;
        } catch(err) {
          console.log('error: ', err)
        }
      }

    async createBook(body: any){

        try {
          const { program, assistant, student, pack, classHour, additional_notes } = body;
    

    
          // const userWithPackage = await logi
          console.log('body:', body)
            let newAssist = new Assist();
            newAssist.program = program;
            newAssist.assistant = assistant;
            newAssist.student = student;
            newAssist.package = pack;
            newAssist.package = classHour;
            newAssist.package = additional_notes;

    
            const savedAssist = await AppDataSource.getRepository(Assist).save(newAssist);
    
            const fullAssit = await AppDataSource.getRepository(Assist).findOne({
                where: { id: savedAssist.id },
              });
    
            return fullAssit;
        } catch(err) {
          console.log('err: ', err)
        }
    
      }

}