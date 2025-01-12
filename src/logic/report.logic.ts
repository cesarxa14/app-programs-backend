import { Between, DataSource } from "typeorm";
import { AppDataSource } from "../ddbb/data-source";
import { User } from "../entities/User";


export class ReportLogic {

  private dataSource;
  constructor(dataSource: DataSource){
    dataSource = AppDataSource;
    this.dataSource = dataSource;
  }

  async getQuantityStudent(startDate:any, endDate:any){
    try{
        console.log('getQuantityStudent: ', {startDate, endDate})
        // const [users, count] = await this.dataSource.getRepository(User).findAndCount({
        //     where: {
        //       role: 3,
        //       deleted: 0,
        //       createdAt: Between('2024-12-26', '2024-12-26')
        //     },
        // });

        let sql = `
          SELECT count(*) AS students 
          FROM users
          WHERE role = 3
          AND deleted = 0
          AND created_at BETWEEN $1 and $2
        `
        const results = await AppDataSource.query(sql, [startDate, endDate]);

        console.log('results: ', results[0])

        return results;
      // return {students: count};
    } catch(err) {
      console.log('err: ', err)
      throw err;
    }
  }

  async getStudentsByPrograms(startDate:any, endDate:any ){
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
        AND s.created_at BETWEEN $1 AND $2
        GROUP BY pr.id
      `

      const results = await AppDataSource.query(sql, [startDate, endDate]);

      return results;

    } catch(err) {
      console.log('err: ', err)
      throw err;
    }
  }

  async getStudentsByPackages(startDate:any, endDate:any){
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
        AND s.created_at BETWEEN $1 AND $2
        GROUP BY pa.id
      `

      const results = await AppDataSource.query(sql, [startDate, endDate]);

      return results;

    } catch(err) {
      console.log('err: ', err)
      throw err;
    }
  } 



  async getEarningsByPackages(startDate:any, endDate:any){
    try{

      let sql = `
        SELECT  pa.name AS package_name, ROUND(SUM(sa.amount + sa.igv)::numeric, 2) AS earning
        FROM sales sa
        INNER JOIN packages pa ON pa.id = sa."itemId" AND sa.category = 'servicio'
        WHERE sa.created_at BETWEEN $1 and $2
        GROUP BY pa.id
      `

      const results = await AppDataSource.query(sql, [startDate, endDate]);

      return results;

    } catch(err) {
      console.log('err: ', err)
      throw err;
    }
  } 

  async getEarningsByPrograms(startDate:any, endDate:any){
    try{

      let sql = `
        SELECT pr.id, pr.name AS program_name, ROUND(SUM(sa.amount + sa.igv)::numeric, 2) AS earning
        FROM sales sa
        INNER JOIN packages pa ON pa.id = sa."itemId" AND sa.category = 'servicio'
        INNER JOIN programs pr ON pr.id = pa.program_id
        WHERE sa.created_at BETWEEN $1 and $2
        GROUP BY pr.id
      `

      const results = await AppDataSource.query(sql, [startDate, endDate]);

      return results;

    } catch(err) {
      console.log('err: ', err)
      throw err;
    }
  }

  async getUsersByGender(startDate:any, endDate:any){
    try{

      let sql = `
        SELECT  u.gender, COUNT(*) 
        FROM users u
        WHERE gender IS NOT NULL
        AND role = 3
        AND created_at BETWEEN $1 AND $2
        GROUP BY u.gender
      `

      const results = await AppDataSource.query(sql, [startDate, endDate]);

      return results;

    } catch(err) {
      console.log('err: ', err)
      throw err;
    }
  }

  async getSalesLineTime(startDate:any, endDate:any){
    try{

      let sql = `
        WITH months AS (
            SELECT generate_series(
                $1::date,
                $2::date,
                '1 month'::interval
            )::date AS mes
        ),
        monthly_sales AS (
            SELECT
                p.id AS package_id,
                TO_CHAR(m.mes, 'FMMon YYYY') AS mes_nombre,
                EXTRACT(YEAR FROM m.mes) AS anio,
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
                ORDER BY ms.anio, ms.mes_numero -- Ordenar por año y luego por mes
            ) AS month_sales
        FROM packages pa
        LEFT JOIN monthly_sales ms ON ms.package_id = pa.id
        GROUP BY pa.id, pa.name
        ORDER BY pa.name;

      `

      const results = await AppDataSource.query(sql, [startDate, endDate]);

      return results;

    } catch(err) {
      console.log('err: ', err)
      throw err;
    }
  }

  
  async getUsersInfoDemographics(startDate:any, endDate:any){
    try{

      let sqlDeparments = `
        SELECT department, COUNT(*) AS students
        FROM users
        WHERE (department IS NOT NULL
        OR department <> '')
        AND created_at BETWEEN $1 AND $2
        GROUP BY department;

      `

      const resultDepartments = await AppDataSource.query(sqlDeparments, [startDate, endDate]);

      let sqlProvinces = `
        SELECT province, COUNT(*) AS students
        FROM users
        WHERE (province IS NOT NULL
        OR province <> '')
        AND created_at BETWEEN $1 AND $2
        GROUP BY province;

      `

      const resultProvinces = await AppDataSource.query(sqlProvinces, [startDate, endDate]);

      let sqlDistricts = `
        SELECT district, COUNT(*) AS students
        FROM users
        WHERE (district IS NOT NULL
        OR district <> '')
        AND created_at BETWEEN $1 AND $2
        GROUP BY district;

      `

      const resultDistricts = await AppDataSource.query(sqlDistricts, [startDate, endDate]);

      return {resultDepartments, resultProvinces, resultDistricts};

    } catch(err) {
      console.log('err: ', err)
      throw err;
    }
  }

  async getTotalEarningSales(startDate:any, endDate:any){
    try{

      let sql = `
        SELECT sum(+amount + igv) AS total
        FROM sales 
        WHERE created_at BETWEEN $1 AND $2
      `

      const results = await AppDataSource.query(sql, [startDate, endDate]);

      return results;

    } catch(err) {
      console.log('err: ', err)
      throw err;
    }
  }

  async getSalesByTypeVoucher(startDate:any, endDate:any){
    try{

      let sql = `
        SELECT 
            CASE 
                WHEN type_voucher = 'nota_venta' THEN 'Nota venta'
                WHEN type_voucher = 'boleta' THEN 'Boleta'
                WHEN type_voucher = 'factura' THEN 'Factura'
                ELSE 'OTRO'
            END AS voucher_type,
            COUNT(*) AS total
        FROM sales
        WHERE created_at BETWEEN $1 AND $2
        GROUP BY type_voucher;
      `

      const results = await AppDataSource.query(sql, [startDate, endDate]);

      return results;

    } catch(err) {
      console.log('err: ', err)
      throw err;
    }
  }

  async getSalesByPaymentMethod(startDate:any, endDate:any){
    try{

      let sql = `
        SELECT CASE 
              WHEN payment_method = 'efectivo' THEN 'Efectivo'
              WHEN payment_method = 'tarjeta' THEN 'Tarjeta'
              WHEN payment_method = 'yape' THEN 'Yape'
              WHEN payment_method = 'plin' THEN 'Plin'
              WHEN payment_method = 'transferencia' THEN 'Transferencia'
              ELSE 'OTRO'
            END AS payment_method,
          COUNT(*) as total
        FROM sales
        WHERE created_at BETWEEN $1 AND $2
        GROUP BY payment_method;
      `

      const results = await AppDataSource.query(sql, [startDate, endDate]);

      return results;

    } catch(err) {
      console.log('err: ', err)
      throw err;
    }
  }


  

}