import prisma from "../../../core/db/prismaInstance.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

const createEmployee = async (req, res) => {
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
    faculty_id,
    position,
    job_title,
    salary,
    sub_district,
    district,
    province,
    postal_code,
  } = req.body;

  const image = req.file;
  console.log("Request body:", req.body);

  try {
    const generatedCampusEmail = `${firstname.toLowerCase()}.${lastname.toLowerCase()}@campus.edu`;
    const campusEmailToUse = campus_email || generatedCampusEmail;

    const generatedPersonalEmail = `${firstname.toLowerCase()}.${lastname.toLowerCase()}@personal.com`;
    const personalEmailToUse = personal_email || generatedPersonalEmail;

    const generatedPassword = crypto.randomBytes(8).toString("hex");
    const passwordToUse = password || generatedPassword;

    const hashedPassword = await bcrypt.hash(passwordToUse, 10);

    const salaryToUse = salary ? parseInt(salary, 10) : null;

    if (salary && isNaN(salaryToUse)) {
      return res
        .status(400)
        .json({ error: "Invalid salary format. Expected a number or null." });
    }

    const result = await prisma.$transaction(async (prisma) => {
      const newAddress = await prisma.address.create({
        data: {
          address: address,
          sub_district: sub_district,
          district: district,
          province: province,
          postal_code: postal_code,
        },
      });

      const newUser = await prisma.user.create({
        data: {
          campus_email: campusEmailToUse,
          personal_email: personalEmailToUse,
          password: hashedPassword,
          role: job_title,
          is_activated: false,
        },
      });

      const newEmployee = await prisma.employee.create({
        data: {
          firstname,
          midname,
          lastname,
          phone,
          address_id: newAddress.id,
          date_of_birth: new Date(date_of_birth),
          gender,
          identification_no,
          user_id: newUser.id,
          faculty_id: parseInt(faculty_id, 10),
          position,
          job_title,
          salary: salaryToUse,
          image: image.objName,
        },
      });

      return { newEmployee, newUser, newAddress };
    });

    res.json({
      message: "Employee created successfully",
      employee: result.newEmployee,
      user: result.newUser,
      address: result.newAddress,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default createEmployee;
