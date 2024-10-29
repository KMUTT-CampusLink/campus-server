import prisma from "../../../core/db/prismaInstance.js";

const editDepartmentDetail = async (req, res) => {
  const { id, name, building_img, phone, fax, location } = req.body;

  try {
    const updateData = {};

    if (name !== undefined) updateData.name = name;
    if (building_img !== undefined) updateData.building_img = building_img;
    if (phone !== undefined) updateData.phone = phone;
    if (fax !== undefined) updateData.fax = fax;
    if (location !== undefined) updateData.location = location;

    const updatedDepartment = await prisma.building.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    res.json(updatedDepartment);
  } catch (error) {
    res.status(500).json({ error: 'Error updating department details' });
  }
};

export { editDepartmentDetail };
