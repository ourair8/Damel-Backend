import mongoose from "mongoose";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export { prisma, mongoose };