import nodemailer, { Transporter } from 'nodemailer';

// Configurar el transportador

let transportOptions = {
    service: 'gmail',
    auth: {
        user: 'cetolara06@gmail.com',
        pass: 'ogarnrmfpnujkgsa' // TODO: pasarlo a una variable de entorno
    }
}
const transporter: Transporter = nodemailer.createTransport(transportOptions);

// Función para enviar correos
export const sendMail = async (to: string, subject: string, text: string, html?: string) => {
  try {
    const info = await transporter.sendMail({
      from: '"cesar torres" <cetolara06@gmail.com>', // Remitente
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

// export const bodyVerify = ()
