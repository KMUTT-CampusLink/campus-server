import prisma from '../../../core/db/prismaInstance.js';
import bcrypt from 'bcrypt'; // Import bcrypt for password hashing
import crypto from 'crypto'; // Import crypto for generating random passwords

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
    const generatedCampusEmail = `${firstname.toLowerCase()}.${lastname.toLowerCase()}@campus.com`;
    const campusEmailToUse = campus_email || generatedCampusEmail;

    // Generate a default personal email if not provided
    const generatedPersonalEmail = `${firstname.toLowerCase()}.${lastname.toLowerCase()}@defaultemail.com`;
    const personalEmailToUse = personal_email || generatedPersonalEmail;

    // Generate a random password if not provided
    const generatedPassword = crypto.randomBytes(8).toString('hex'); // 16-character random password
    const passwordToUse = password || generatedPassword;

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(passwordToUse, 10); // Hash password with salt rounds

    // Convert salary to an integer, if it's a string, and handle null/undefined
    const salaryToUse = salary ? parseInt(salary, 10) : null;

    // Validate salary is a valid number or null
    if (salary && isNaN(salaryToUse)) {
      return res.status(400).json({ error: 'Invalid salary format. Expected a number or null.' });
    }

    // Create the user record first
    const newUser = await prisma.user.create({
      data: {
        campus_email: campusEmailToUse, // Use the provided or generated campus email
        personal_email: personalEmailToUse, // Use the provided or generated personal email
        password: hashedPassword, // Use the hashed password
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
        salary: salaryToUse,
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
