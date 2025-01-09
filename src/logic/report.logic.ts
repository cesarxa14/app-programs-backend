import { DataSource } from "typeorm";
import { AppDataSource } from "../ddbb/data-source";
import { User } from "../entities/User";



export class ReportLogic {

  private dataSource;
  constructor(dataSource: DataSource){
    dataSource = AppDataSource;
    this.dataSource = dataSource;
  }

  async getQuantityStudent(){
    try{

        const [users, count] = await this.dataSource.getRepository(User).findAndCount({
            where: {
              role: 3,
              deleted: 0,
            },
          });

      return {students: count};
    } catch(err) {
      console.log('err: ', err)
      throw err;
    }
  }

  async getStudentsByPrograms(){
    try{

      let sql = `
        SELECT  pr.name AS program_name, 
                count(u.*) AS quantity_student
        FROM subscriptions s
        INNER JOIN packages pa ON pa.id = s.package_id
        INNER JOIN programs pr ON pr.id = pa.program_id
        INNER JOIN users u ON u.id = s.user_id
        WHERE s."isActive" = true
        AND u.deleted = 0
        GROUP BY pr.id
      `

      const results = await AppDataSource.query(sql);

      return results;

    } catch(err) {
      console.log('err: ', err)
      throw err;
    }
  }

  async getStudentsByPackages(){
    try{

      let sql = `
        SELECT pa.name AS package_name, 
            count(u.*) AS quantity_student
        FROM subscriptions s
        INNER JOIN packages pa ON pa.id = s.package_id
        INNER JOIN users u ON u.id = s.user_id
        WHERE s."isActive" = true
        AND u.deleted = 0
        AND pa.deleted = 0
        GROUP BY pa.id
      `

      const results = await AppDataSource.query(sql);

      return results;

    } catch(err) {
      console.log('err: ', err)
      throw err;
    }
  } 

  async getEarningsByPackages(){
    try{

      let sql = `
        SELECT  pa.name AS package_name, sum(sa.amount + sa.igv) AS earning
        FROM sales sa
        INNER JOIN packages pa ON pa.id = sa."itemId" AND sa.category = 'servicio'
        GROUP BY pa.id
      `

      const results = await AppDataSource.query(sql);

      return results;

    } catch(err) {
      console.log('err: ', err)
      throw err;
    }
  } 

  async getEarningsByPrograms(){
    try{

      let sql = `
        SELECT pr.id, pr.name AS program_name, sum(sa.amount + sa.igv) AS earning
        FROM sales sa
        INNER JOIN packages pa ON pa.id = sa."itemId" AND sa.category = 'servicio'
        INNER JOIN programs pr ON pr.id = pa.program_id
        GROUP BY pr.id
      `

      const results = await AppDataSource.query(sql);

      return results;

    } catch(err) {
      console.log('err: ', err)
      throw err;
    }
  }

  async getUsersByGender(){
    try{

      let sql = `
        SELECT  u.gender, COUNT(*) 
        FROM users u
        WHERE gender IS NOT NULL
        AND role = 3
        GROUP BY u.gender
      `

      const results = await AppDataSource.query(sql);

      return results;

    } catch(err) {
      console.log('err: ', err)
      throw err;
    }
  }

  async getSalesLineTime(){
    try{

      let sql = `
        WITH months AS (
            SELECT generate_series(
                '2025-01-01'::date,
                '2025-12-01'::date,
                '1 month'::interval
            )::date AS mes
        ),
        monthly_sales AS (
            SELECT
                p.id AS package_id,
                TO_CHAR(m.mes, 'FMMon') AS mes_nombre,
                EXTRACT(MONTH FROM m.mes) AS mes_numero,
                COALESCE(COUNT(s.id), 0) AS total_ventas
            FROM packages p
            CROSS JOIN months m
            LEFT JOIN sales s
                ON s."itemId" = p.id
                AND EXTRACT(YEAR FROM s."saleDate") = EXTRACT(YEAR FROM m.mes)
                AND EXTRACT(MONTH FROM s."saleDate") = EXTRACT(MONTH FROM m.mes)
            GROUP BY p.id, m.mes
        )
        SELECT
            pa.name AS package_name,
            ARRAY_AGG(
                JSON_BUILD_OBJECT(
                    'month', ms.mes_nombre,
                    'sales', ms.total_ventas
                )
                ORDER BY ms.mes_numero
            ) AS month_sales
        FROM packages pa
        LEFT JOIN monthly_sales ms ON ms.package_id = pa.id
        GROUP BY pa.id, pa.name
        ORDER BY pa.name;
      `

      const results = await AppDataSource.query(sql);

      return results;

    } catch(err) {
      console.log('err: ', err)
      throw err;
    }
  }

  
  async getUsersInfoDemographics(){
    try{

      let sqlDeparments = `
        SELECT department, COUNT(*) AS students
        FROM users
        WHERE department IS NOT NULL
        OR department <> ''
        GROUP BY department;

      `

      const resultDepartments = await AppDataSource.query(sqlDeparments);

      let sqlProvinces = `
        SELECT province, COUNT(*) AS students
        FROM users
        WHERE province IS NOT NULL
        OR province <> ''
        GROUP BY province;

      `

      const resultProvinces = await AppDataSource.query(sqlProvinces);

      let sqlDistricts = `
        SELECT district, COUNT(*) AS students
        FROM users
        WHERE district IS NOT NULL
        OR district <> ''
        GROUP BY district;

      `

      const resultDistricts = await AppDataSource.query(sqlDistricts);

      return {resultDepartments, resultProvinces, resultDistricts};

    } catch(err) {
      console.log('err: ', err)
      throw err;
    }
  }

  

}