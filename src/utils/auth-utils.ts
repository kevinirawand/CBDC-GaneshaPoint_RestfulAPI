import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

class AuthUtils {
   public static hash = async (password: string): Promise<string> => {
      return await bcrypt.hash(password, 10);
   };

   public static passwordCompare = async (
      passCredentials: string,
      passResource: string,
   ): Promise<boolean> => {
      return await bcrypt.compare(passCredentials, passResource);
   };

   public static generateToken = (id: number, username: string): string => {
      const accessToken: string = jwt.sign(
         {
            userId: id,
            username: username,
         },
         process.env.ACCESS_TOKEN_SECRET_KEY || '',
         {
            expiresIn: '7d',
         },
      );

      return accessToken;
   };
}

export default AuthUtils;
