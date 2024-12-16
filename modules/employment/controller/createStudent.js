import prisma from "../../../core/db/prismaInstance.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

const createStudent = async (req, res) => {
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
    semester_id,
    sub_district,
    district,
    province,
    postal_code,
  } = req.body.data;

  const image = req.file;

  console.log("Request body:", req.body);

  const degree_Id = parseInt(degree_id, 10);

  try {
    const semester = await prisma.semester.findUnique({
      where: { id: parseInt(semester_id) },
    });

    if (!semester) {
      return res.status(400).json({ error: "Semester not found." });
    }

    const uniBatch = await prisma.uni_batch.findFirst({
      where: {
        academic_year: semester.academic_year,
      },
      select: { id: true },
    });

    if (!uniBatch) {
      return res.status(400).json({ error: "University batch not found." });
    }

    console.log("unibatch: ", uniBatch);

    const programBatch = await prisma.program_batch.findFirst({
      where: {
        degree_id: degree_Id,
        uni_batch_id: uniBatch.id,
      },
      select: { id: true },
    });
    console.log("programbatch : ", programBatch);
    console.log("degreeId : ", degree_Id);

    if (!programBatch) {
      return res.status(400).json({
        error:
          "Program batch not found for the specified degree and university batch.",
      });
    }

    const generatedCampusEmail = `${firstname.toLowerCase()}.${lastname.toLowerCase()}@campus.edu`;
    const campusEmailToUse = campus_email || generatedCampusEmail;

    const generatedPersonalEmail = `${firstname.toLowerCase()}.${lastname.toLowerCase()}@personal.com`;
    const personalEmailToUse = personal_email || generatedPersonalEmail;

    const generatedPassword = crypto.randomBytes(8).toString("hex");
    const passwordToUse = password || generatedPassword;

    const hashedPassword = await bcrypt.hash(passwordToUse, 10);

    const result = await prisma.$transaction(async (prisma) => {
      const newAddress = await prisma.address.create({
        data: {
          address,
          sub_district,
          district,
          province,
          postal_code,
        },
      });

      const newUser = await prisma.user.create({
        data: {
          campus_email: campusEmailToUse,
          personal_email: personalEmailToUse,
          password: hashedPassword,
          role: "Student",
          is_activated: false,
        },
      });

      const newStudent = await prisma.student.create({
        data: {
          firstname,
          midname,
          lastname,
          phone,
          image: image.objName,
          address: {
            connect: {
              id: newAddress.id,
            },
          },
          date_of_birth: new Date(date_of_birth),
          gender,
          identification_no,
          user: {
            connect: {
              id: newUser.id,
            },
          },
          degree: {
            connect: {
              id: degree_Id,
            },
          },
          semester: {
            connect: {
              id: parseInt(semester_id, 10),
            },
          },
          uni_batch: {
            connect: {
              id: uniBatch.id,
            },
          },
          program_batch: {
            connect: {
              id: programBatch.id,
            },
          },
        },
      });

      return { newStudent, newUser, newAddress };
    });
    console.log(result.newUser);
    res.json({
      message: "Student created successfully",
      student: result.newStudent,
      user: result.newUser,
      address: result.newAddress,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default createStudent;
