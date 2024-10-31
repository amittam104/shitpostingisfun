import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import CreditsModel from "@/models/credits.model";

export async function POST(request: Request) {
  await dbConnect();
  const { username, email, password } = await request.json();

  try {
    // Check is the user with same username exists and is verified
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "User with same username already exists",
        },
        { status: 400 }
      );
    }

    // check if user with email exists
    const existingUserByEmail = await UserModel.findOne({ email });

    const verifyCode = Math.floor(1000000 + Math.random() * 900000).toString();

    // If yes then update user
    if (existingUserByEmail) {
      // user with email exists and is verified

      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User with same email already exists",
          },
          { status: 400 }
        );
      } else {
        // user with email exists but is not verified
        const hashedPassword = await bcrypt.hash(password, 10);

        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);

        await existingUserByEmail.save();
      }
    } else {
      // else create register new user

      const hashedPassword = await bcrypt.hash(password, 10);

      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      // Create user model
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        isVerified: false,
        verifyCode,
        verifyCodeExpiry: expiryDate,
      });

      // Save user model and get it's id
      const newRegisteredUser = await newUser.save();
      console.log(newRegisteredUser);

      // Create and save credits model
      const newUserCredits = new CreditsModel({
        credits: 5,
        isPaid: false,
        planName: "free",
        planId: 0,
      });

      const newRegisteredUserCredits = await newUserCredits.save();
      console.log(newRegisteredUserCredits);

      // Update user model and link the credits model ❗️🙂‍↔️
    }

    // send email of verification in both of these cases where user is not verified
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );

    console.log(emailResponse);

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User registered successfully. ",
      },
      { status: 201 }
    );
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
