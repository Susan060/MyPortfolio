const nodemailer = require("nodemailer");

// ✅ Create reusable transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// ✅ Send reply email to the contact
const sendReplyEmail = async ({ name, email, topic, reply, replyImageUrl }) => {
    const mailOptions = {
        from: `"Admin" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Re: ${topic}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #f9f9f9; border-radius: 10px;">
                
                <h2 style="color: #e53e3e; margin-bottom: 4px;">We've replied to your message</h2>
                <p style="color: #555; margin-top: 0;">Hi <strong>${name}</strong>, here is our response to your inquiry about <strong>${topic}</strong>.</p>

                <hr style="border: none; border-top: 1px solid #e2e2e2; margin: 20px 0;" />

                <div style="background: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #e2e2e2;">
                    <h4 style="margin-top: 0; color: #333;">Our Reply:</h4>
                    <div style="color: #444; line-height: 1.7;">
                        ${reply}
                    </div>

                    ${replyImageUrl ? `
                    <div style="margin-top: 16px;">
                        <img 
                            src="${replyImageUrl}" 
                            alt="Reply attachment" 
                            style="max-width: 100%; border-radius: 8px; border: 1px solid #e2e2e2;" 
                        />
                    </div>` : ""}
                </div>

                <hr style="border: none; border-top: 1px solid #e2e2e2; margin: 20px 0;" />

                <p style="color: #999; font-size: 12px; text-align: center;">
                    This email was sent in response to your contact form submission. Please do not reply directly to this email.
                </p>
            </div>
        `,
    };

    await transporter.sendMail(mailOptions);
};

// utils/sendEmail.js — add this alongside your existing sendReplyEmail
// const sendAuditReplyEmail = async ({ firstName, lastName, email, formType, reply, replyImageUrl }) => {
//   const formLabels = {
//     "technical-audit":   "Technical Audit",
//     "content-strategy":  "Content Strategy",
//     "link-authority":    "Link & Authority",
//     "international-seo": "International SEO",
//     "analytics-cro":     "Analytics & CRO",
//   };

//   await transporter.sendMail({
//     from:    `"Prabesh Ghimire" <${process.env.EMAIL_USER}>`,
//     to:      email,
//     subject: `Your ${formLabels[formType] || "Audit"} Request — Response`,
//     html: `
//       <p>Hi ${firstName},</p>
//       <p>Thank you for submitting your <strong>${formLabels[formType]}</strong> request. Here is my response:</p>
//       <div style="background:#f9f9f9; padding:16px; border-radius:8px; margin:16px 0;">
//         ${reply}
//       </div>
//       ${replyImageUrl ? `<img src="${replyImageUrl}" alt="Attachment" style="max-width:100%; border-radius:8px; margin-top:12px;" />` : ""}
//       <p>Feel free to reply to this email if you have any follow-up questions.</p>
//       <p>— Prabesh</p>
//     `,
//   });
// };

// module.exports = { sendReplyEmail, sendAuditReplyEmail };
 module.exports = { sendReplyEmail};