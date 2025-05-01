export const confirmAccountContent = (userName: string, confirmUrl: string) => {
    const content = `
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 8px;">
        <tr>
            <td style="text-align: center;">
                <h2 style="color: #333333;">Confirm your account</h2>
                <p style="color: #555555;">Hello <span style="font-weight:bold">${userName}</span>,</p>
                <p style="color: #555555;">Thank you for registering an account with us. Please click the button below to verify your email and complete your registration:</p>
                <a href="${confirmUrl}" 
                   style="display: inline-block; padding: 12px 24px; margin-top: 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 6px; font-size: 16px;">
                   Email Verification
                </a>
                <p style="color: #999999; margin-top: 30px; font-size: 12px;">
                    If you do not fulfill this request, please ignore this email.<br>
                    The verification link will expire after 24 hours.
                </p>
            </td>
        </tr>
    </table>
    `

    return content
}