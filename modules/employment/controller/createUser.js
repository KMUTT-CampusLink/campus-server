import prisma from "../../../core/db/prismaInstance.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

const createUser = async (req, res) => {
  const {
    campus_email,
    personal_email,
    password,
    firstname,
    midname,
    lastname,
    phone,
    address,
    date_of_birth,
    gender,
    identification_no,
    degree_id,
    uni_batch_id,
    program_batch_id,
    semester_id,
  } = req.body;

  try {
    const generatedCampusEmail = `${firstname.toLowerCase()}.${lastname.toLowerCase()}@campus.edu`;
    const campusEmailToUse = campus_email || generatedCampusEmail;
    const generatedPersonalEmail = `${firstname.toLowerCase()}.${lastname.toLowerCase()}@personal.com`;
    const personalEmailToUse = personal_email || generatedPersonalEmail;
    const generatedPassword = crypto.randomBytes(8).toString("hex"); // 16-character random password
    const passwordToUse = password || generatedPassword;
    const hashedPassword = await bcrypt.hash(passwordToUse, 10); // Hash password with salt rounds


    const newUser = await prisma.user.create({
      data: {
        campus_email: campusEmailToUse, // Use the provided or generated campus email
        personal_email: personalEmailToUse, // Use the provided or generated personal email
        password: hashedPassword, // Use the hashed password
        role: "Student",
        is_activated: true,
      },
    });

    const newStudent = await prisma.student.create({
      data: {
        firstname,
        midname,
        lastname,
        phone,
        address,
        date_of_birth: new Date(date_of_birth),
        gender,
        identification_no,
        user_id: newUser.id,
        degree_id,
        uni_batch_id,
        program_batch_id,
        semester_id,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default createUser;
