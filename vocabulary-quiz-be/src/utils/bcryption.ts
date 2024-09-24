import * as bcrypt from 'bcrypt';

const saltOrRounds = 10;

export const bcryption = {
  encrypte: async (text: string):Promise<string> => {
    return await bcrypt.hash(text, saltOrRounds);
  },
  isMatch: async (text: string, hash: string): Promise<boolean> => {
    return await bcrypt.compare(text, hash);
  },
}