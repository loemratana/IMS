const validateEmail = (email) => {
  if (!email || typeof email !== "string") return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return re.test(email.toLowerCase().trim());
};

const validatePassword = (password) => {
  if (!password || typeof password !== "string") return false;
  return /^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(password);
};

const validateRequired = (value) => {
  return value !== undefined && value !== null && value.toString().trim() !== "";
};

module.exports = {
  validateEmail,
  validatePassword,
  validateRequired,
};