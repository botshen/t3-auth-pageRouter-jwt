import { hash } from "bcrypt";
import { db } from "~/server/db";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { name, password } = req.body;
    const user = await db.user.findUnique({
      where: {
        name,
      },
    });
    if (user) {
      return res.status(400).json({
        error: "User already exists",
      });
    }
    console.log("name", name);
    console.log("password", password);
    const hashedPassword = await hash(password, 10);
    await db.user
      .create({
        data: {
          name,
          password: hashedPassword,
        },
      })
      .catch((err) => {
        console.error(err);
      });
    console.log({ name, password });
    return res.status(200).json({ name });
  } catch (e) {
    console.error({ e });
    return;
  }
}
