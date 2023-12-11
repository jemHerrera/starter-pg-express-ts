import * as argon2 from "argon2";

export const hashPassword = async (password: string): Promise<string> => {
  const hash = await argon2.hash(password);

  return hash;
};

export const verifyPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  try {
    const isMatch = await argon2.verify(hashedPassword, password);
    return isMatch;
  } catch (error) {
    return false;
  }
};
