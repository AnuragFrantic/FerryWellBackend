const Lead = require("../models/Lead");
const nodemailer = require("nodemailer");

// transporter
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // IMPORTANT for 587
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});

exports.createLead = async (req, res) => {
    try {
        const { name, email, type, message } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Name is required",
            });
        }

        // ✅ 1) Save lead (fast)
        const newLead = await Lead.create({ name, email, type, message });

        // ✅ 2) Send response immediately (FAST)
        res.status(201).json({
            success: true,
            message: "Lead submitted successfully!",
            data: newLead,
        });

        // ✅ 3) Send Email in background (NO WAIT)
        const mailOptions = {
            from: `"Ferrywell Website" <${process.env.GMAIL_USER}>`,
            to: process.env.ADMIN_EMAILS.split(","),
            subject: `📩 New Contact Lead from ${name}`,
            html: `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <style>
        @media only screen and (max-width: 600px) {
          .container { padding: 12px !important; }
          .card { border-radius: 10px !important; }
          .header { font-size: 18px !important; padding: 14px 16px !important; }
          .content { padding: 16px !important; }
          .table td { padding: 8px !important; font-size: 13px !important; }
          .small { font-size: 11px !important; }
        }
      </style>
    </head>

    <body style="margin:0; padding:0; background-color:#f6f6f6;">
      <div class="container" style="padding:25px;">
        <div class="card"
          style="max-width:650px; margin:auto; background:#ffffff; border-radius:10px;
                 box-shadow:0 3px 12px rgba(0,0,0,0.10); overflow:hidden; width:100%;">
          
          <h2 class="header"
            style="background-color:#F3673A; color:white; padding:18px 25px; margin:0; font-size:22px;">
            New Contact Lead – FERRYWELL BRANDS
          </h2>

          <div class="content" style="padding:25px;">
            <p style="font-size:15px; margin:0 0 10px;">Hello Admin,</p>
            <p style="font-size:14px; color:#555; margin:0 0 15px;">
              A new inquiry has been submitted from the website contact form.
            </p>

            <table class="table" style="width:100%; border-collapse:collapse; margin-top:15px; font-size:14px;">
              <tr>
                <td style="padding:10px; border:1px solid #ddd; font-weight:bold; background-color:#f9fafb; width:35%;">
                  Name
                </td>
                <td style="padding:10px; border:1px solid #ddd;">
                  ${name || "-"}
                </td>
              </tr>

              <tr>
                <td style="padding:10px; border:1px solid #ddd; font-weight:bold; background-color:#f9fafb;">
                  Email
                </td>
                <td style="padding:10px; border:1px solid #ddd;">
                  ${email || "-"}
                </td>
              </tr>

              <tr>
                <td style="padding:10px; border:1px solid #ddd; font-weight:bold; background-color:#f9fafb;">
                  Inquiry Type
                </td>
                <td style="padding:10px; border:1px solid #ddd;">
                  ${type || "-"}
                </td>
              </tr>

              <tr>
                <td style="padding:10px; border:1px solid #ddd; font-weight:bold; background-color:#f9fafb;">
                  Message
                </td>
                <td style="padding:10px; border:1px solid #ddd; word-break:break-word;">
                  ${message || "-"}
                </td>
              </tr>
            </table>

            <p class="small" style="font-size:12px; color:#888; margin-top:20px;">
              Lead ID: ${newLead._id}
            </p>
          </div>
        </div>
      </div>
    </body>
  </html>
  `,
        };


        transporter.sendMail(mailOptions).catch((err) => {
            console.error("Email send failed:", err);
        });

    } catch (error) {
        console.error("Lead creation error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to submit inquiry.",
        });
    }
};
