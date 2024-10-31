import { resend } from "@/lib/resend";
import VerificationEmail from "@/emails/verificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Shitpostingisfun - Verification code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });

    if (error) throw new Error("Something went wrong while sending the email");

    return {
      success: true,
      message: "Verification email sent successfully",
    };
  } catch (emailError) {
    console.log("Error sending verification email", emailError);
    return {
      success: false,
      message: "Failed to send verification email",
    };
  }
}
