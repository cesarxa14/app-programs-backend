import nodemailer, { Transporter } from 'nodemailer';
// Configurar el transportador

let transportOptions1 = {
    service: 'gmail',
    auth: {
        user: 'cetolara06@gmail.com',
        pass: 'ogarnrmfpnujkgsa' // TODO: pasarlo a una variable de entorno
    }
}

const transportOptions2 = {
    host: 'mail.nadaresvidaperu.pe',  // Asegúrate de usar el host SMTP correcto de tu proveedor de correo
    port: 465,  // El puerto puede variar, usualmente es 587 para conexiones TLS
    secure: true, // true for 465, false for other ports
    auth: {
        user: 'info@nadaresvidaperu.com',
        pass: 'r4CeHv1j{2z7'
    }
};

const transportOptions = {
  host: process.env.SMTP_HOST, 
  port: parseInt(process.env.SMTP_PORT || "587"), 
  secure: process.env.SMTP_SECURE === "true", 
  auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
  }
};


const transporter: Transporter = nodemailer.createTransport(transportOptions,{
  logger: true, // Log detail during connection
  debug: true   // Log SMTP traffic
});

transporter.verify(function (error, success) {
  if (error) {
      console.error("SMTP Connection Error: ", error);
  } else {
      console.log("SMTP Server is ready to send emails");
  }
});

// Función para enviar correos
export const sendMail = async (from:string,to: string, subject: string, text: string, html?: string) => {
  try {
    const info = await transporter.sendMail({
      from: from, // Remitente
      to,                                         // Destinatario
      subject,                                    // Asunto
      text,                                       // Texto plano
      html,                                       // HTML opcional
    });

    console.log("Correo enviado: ", info.messageId);
  } catch (error) {
    console.error("Error enviando correo: ", error);
    throw error;
  }
};