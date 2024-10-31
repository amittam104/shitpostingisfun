import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import bcsrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();
  const { username, email, passsword } = await request.json();
  try {
  } catch (error) {
    console.error("Error while signing up the user", error);
    return Response.json(
      {
        success: false,
        message: "Error signing up the user",
      },
      {
        status: 500,
      }
    );
  }
}
