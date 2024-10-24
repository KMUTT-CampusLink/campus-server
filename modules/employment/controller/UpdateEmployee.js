import prisma from '../../../core/db/prismaInstance.js';

const updateEmployee = async (req, res) => {
  const { id } = req.params; // Employee ID from the request parameters
  const {
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

  // Log the request body for debugging
  console.log("Request body:", req.body);

  try {
    // Validate that 'id' is provided
    if (!id) {
      return res.status(400).json({ error: 'Employee ID is required.' });
    }

    // Check if the employee exists
    const existingEmployee = await prisma.employee.findUnique({
      where: { id },
    });

    if (!existingEmployee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Prepare the data to update, only include fields that are provided
    const updatedEmployeeData = {};

    // Conditionally add fields to the update object
    if (firstname) updatedEmployeeData.firstname = firstname;
    if (midname) updatedEmployeeData.midname = midname;
    if (lastname) updatedEmployeeData.lastname = lastname;
    if (phone) updatedEmployeeData.phone = phone;
    if (address) updatedEmployeeData.address = address;
    if (gender) updatedEmployeeData.gender = gender;
    if (identification_no) updatedEmployeeData.identification_no = identification_no;
    if (passport_no) updatedEmployeeData.passport_no = passport_no;
    if (faculty_id) updatedEmployeeData.faculty_id = faculty_id;
    if (position) updatedEmployeeData.position = position;
    if (job_title) updatedEmployeeData.job_title = job_title;
    
    // Handle date_of_birth field
    if (date_of_birth) {
      updatedEmployeeData.date_of_birth = new Date(date_of_birth); // Ensure date format is correct
    }

    // Handle salary field
    if (salary !== undefined) { // Explicitly check for undefined to allow 0 as a valid value
      const salaryToUse = parseInt(salary, 10);
      if (isNaN(salaryToUse)) {
        return res.status(400).json({ error: 'Invalid salary format. Expected a number.' });
      }
      updatedEmployeeData.salary = salaryToUse;
    }

    // Update the employee record
    const updatedEmployee = await prisma.employee.update({
      where: { id },
      data: updatedEmployeeData,
    });

    // Respond with the updated employee
    res.json({
      message: 'Employee updated successfully',
      employee: updatedEmployee,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default updateEmployee;
