export default async function logout(req, res) {
  // Clear the JWT token cookie
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "Strict",
  });

  res.json({ msg: "Logged out successfully" });
}
