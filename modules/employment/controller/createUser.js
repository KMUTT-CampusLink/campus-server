import prisma from '../../../core/db/prismaInstance.js';

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
    passport_no,
    faculty_id,
    position,
    job_title,
    salary,
  } = req.body; // Assume these are provided in the request body.

  try {
    // Create the user record first
    const newUser = await prisma.user.create({
      data: {
        campus_email,
        personal_email,
        password, // Hash the password if needed
        role: 'Staff', // Set the role as 'Employee'
        is_activated: true,
      },
    });

    // Create the employee record with reference to the new user
    const newEmployee = await prisma.employee.create({
      data: {
        firstname,
        midname,
        lastname,
        phone,
        address,
        date_of_birth: new Date(date_of_birth), // Ensure date format is correct
        gender,
        identification_no,
        passport_no,
        user_id: newUser.id, // Link with the user record
        faculty_id, // Optional
        position,
        job_title,
        salary,
      },
    });

    // Respond with the newly created employee
    res.json({
      message: 'Employee created successfully',
      employee: newEmployee,
      user: newUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default createEmployee;
