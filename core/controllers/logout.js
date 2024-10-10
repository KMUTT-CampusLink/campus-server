export default async function logout(req, res) {
  res.clearCookie("token");
  res.json({ msg: "Logged out successfully" });
}
