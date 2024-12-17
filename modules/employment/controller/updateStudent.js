import prisma from "../../../core/db/prismaInstance.js";

const updateStudent = async (req, res) => {
  const { id } = req.params;
  const { data } = req.body;
  const parsedData = JSON.parse(data);
  const {
    firstname,
    midname,
    lastname,
    degree_id,
    semester_id,
    gender,
    date_of_birth,
    identification_no,
    phone,
    address,
    sub_district,
    district,
    province,
    postal_code,
  } = parsedData;
  console.log("Request body:", parsedData);
  const image = req.file;

  try {
    if (!id) {
      return res.status(400).json({ error: "Student ID is required." });
    }
    const existingStudent = await prisma.student.findUnique({
      where: { id },
    });

    if (!existingStudent) {
      return res.status(404).json({ error: "Student not found" });
    }
    const updateStudentData = {};
    if (firstname) updateStudentData.firstname = firstname;
    if (midname) updateStudentData.midname = midname;
    if (lastname) updateStudentData.lastname = lastname;
    if (phone) updateStudentData.phone = phone;
    if (gender) updateStudentData.gender = gender;
    if (identification_no)
      updateStudentData.identification_no = identification_no;
    if (degree_id) updateStudentData.degree_id = parseInt(degree_id);
    if (semester_id) updateStudentData.semester_id = semester_id;
    if (date_of_birth) {
      updateStudentData.date_of_birth = new Date(date_of_birth);
    }
    if (image) updateStudentData.image = image.objName;

    const updateAddressId = await prisma.student.findUnique({
      where: {
        id: id,
      },
      select: {
        address_id: true,
        address: {
          select: {
            id: true,
            address: true,
            sub_district: true,
            district: true,
            province: true,
            postal_code: true,
          },
        },
      },
    });

    //console.log("update"updateAddressId, typeof updateAddressId);

    const newAddress = await prisma.address.update({
      where: { id: updateAddressId.address.id },
      data: {
        address: address,
        sub_district: sub_district,
        district: district,
        province: province,
        postal_code: postal_code,
      },
    });

    const updateStu = await prisma.student.update({
      where: { id },
      data: updateStudentData,
    });

    console.log("Updated Student:", updateStudentData);

    res.json({
      message: "Student updated successfully",
      student: updateStu,
      address: newAddress,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default updateStudent;
